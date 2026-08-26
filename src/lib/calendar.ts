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
  location: string;
  description: string;
}

export function icsUrl(calendarId: string): string {
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
}

export function htmlUrl(calendarId: string): string {
  return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}`;
}

/** RFC 5545 folds long lines with CRLF + a single space or tab. */
function unfold(raw: string): string[] {
  return raw.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '').split('\n');
}

function unescapeText(v: string): string {
  return v.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\;/g, ';').replace(/\\\\/g, '\\');
}

/** DTSTART:20260904T183000Z, DTSTART;TZID=…:20260904T183000, DTSTART;VALUE=DATE:20260904 */
function parseDate(value: string): { date: Date; allDay: boolean } | null {
  const dateOnly = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return { date: new Date(Date.UTC(+y, +m - 1, +d)), allDay: true };
  }
  const dt = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/.exec(value);
  if (!dt) return null;
  const [, y, m, d, hh, mm, ss] = dt;
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
        const start = current.DTSTART ? parseDate(current.DTSTART) : null;
        if (start && current.SUMMARY) {
          const end = current.DTEND ? parseDate(current.DTEND) : null;
          events.push({
            uid: current.UID ?? `${current.SUMMARY}-${current.DTSTART}`,
            summary: unescapeText(current.SUMMARY),
            start: start.date,
            end: end?.date ?? null,
            allDay: start.allDay,
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
    // Strip any parameters: "DTSTART;TZID=Africa/Freetown" -> "DTSTART"
    const name = line.slice(0, colon).split(';')[0].toUpperCase();
    current[name] = line.slice(colon + 1);
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
