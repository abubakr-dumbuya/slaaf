/**
 * Reads a public Google Calendar through its iCalendar feed and renders the
 * events natively, rather than embedding Google's iframe. The embed cannot be
 * styled, ships several hundred KB, and handles narrow screens badly — all of
 * which matter more than the convenience it saves.
 */
export interface CalendarEvent {
  uid: string;
  summary: string;
  start: Date;
  end: Date | null;
  allDay: boolean;
  /** IANA zone the event was authored in, when the feed states one. */
  timeZone: string | null;
  location: string;
  description: string;
}

/** Offset, in ms, of `tz` from UTC at a given instant. */
function tzOffsetAt(utcMs: number, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const p: Record<string, string> = {};
  for (const part of parts) p[part.type] = part.value;
  const asIfUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
  return asIfUtc - utcMs;
}

/**
 * A DTSTART carrying a TZID is wall-clock time in that zone, not UTC. Convert
 * by guessing, measuring the zone's offset at that guess, and correcting —
 * twice, so instants near a DST boundary land on the right side of it.
 */
function zonedToUtc(fields: number[], tz: string): Date {
  const [y, mo, d, h, mi, sec] = fields;
  let ms = Date.UTC(y, mo - 1, d, h, mi, sec);
  for (let i = 0; i < 2; i++) ms = Date.UTC(y, mo - 1, d, h, mi, sec) - tzOffsetAt(ms, tz);
  return new Date(ms);
}

export function icsUrl(calendarId: string): string {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
}

/** RFC 5545 folds long lines with CRLF + a single space or tab. */
function unfold(raw: string): string[] {
  return raw.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
}

function unescapeText(v: string): string {
  return v.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\;/g, ';').replace(/\\\\/g, '\\');
}

/** DTSTART:20260904T183000Z, DTSTART;TZID=…:20260904T183000, DTSTART;VALUE=DATE:20260904 */
function parseDate(value: string, tzid: string | null): { date: Date; allDay: boolean } | null {
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return { date: new Date(Date.UTC(+y, +m - 1, +d)), allDay: true };
  }
  const dt = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (!dt) return null;
  const [, y, m, d, hh, mm, ss, z] = dt;
  const fields = [+y, +m, +d, +hh, +mm, +ss];
  if (!z && tzid) {
    try {
      return { date: zonedToUtc(fields, tzid), allDay: false };
    } catch {
      // Unknown zone — fall through and treat as UTC.
    }
  }
  return { date: new Date(Date.UTC(+y, +m - 1, +d, +hh, +mm, +ss)), allDay: false };
}

export function parseIcs(raw: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  let current: Record<string, string> | null = null;

  for (const line of unfold(raw)) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) {
        const tz = current.DTSTART_TZID ?? null;
        const start = current.DTSTART ? parseDate(current.DTSTART, tz) : null;
        if (start && current.SUMMARY) {
          const end = current.DTEND ? parseDate(current.DTEND, current.DTEND_TZID ?? tz) : null;
          events.push({
            uid: current.UID ?? `${current.SUMMARY}-${current.DTSTART}`,
            summary: unescapeText(current.SUMMARY),
            start: start.date,
            end: end?.date ?? null,
            allDay: start.allDay,
            timeZone: tz,
            location: unescapeText(current.LOCATION ?? ''),
            description: unescapeText(current.DESCRIPTION ?? ''),
          });
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const rawName = line.slice(0, colon);
    const name = rawName.split(';')[0].toUpperCase();
    current[name] = line.slice(colon + 1);
    const tzid = /;TZID=([^;:]+)/i.exec(rawName);
    if (tzid) current[`${name}_TZID`] = tzid[1];
  }
  return events;
}

/** Upcoming events only, soonest first. */
export function upcoming(events: CalendarEvent[], now = new Date()): CalendarEvent[] {
  return events
    .filter((e) => (e.end ?? e.start).valueOf() >= now.valueOf())
    .sort((a, b) => a.start.valueOf() - b.start.valueOf());
}

/**
 * @param feedUrl overrides the Google feed, for a calendar hosted elsewhere
 *                that publishes a standard iCalendar file.
 */
export async function fetchUpcoming(calendarId: string, feedUrl?: string): Promise<CalendarEvent[] | null> {
  try {
    const res = await fetch(feedUrl || icsUrl(calendarId), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`Calendar feed responded ${res.status}`);
      return null;
    }
    return upcoming(parseIcs(await res.text()));
  } catch (err) {
    console.error('Could not read the calendar feed:', err);
    return null;
  }
}
