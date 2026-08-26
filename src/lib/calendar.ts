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

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'", '#x27': "'",
};

/**
 * Google Calendar descriptions are often HTML — <p>, <br>, <a href>, entities.
 * Rendering that raw would both look wrong and inject markup from a feed, so it
 * is flattened to text with paragraph breaks preserved. Links survive as their
 * URLs, which linkify() turns back into anchors at render time.
 */
export function normaliseDescription(raw: string): string {
  if (!raw) return '';
  let text = raw;

  // Keep an <a>'s href when its label is just the same URL or generic text.
  const bareUrl = (v: string) => v.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '').toLowerCase();
  text = text.replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_m, href, label) => {
    const clean = String(label).replace(/<[^>]+>/g, '').trim();
    // "www.fambul.com" linking to "http://www.fambul.com" is one thing, not two.
    if (!clean || bareUrl(clean) === bareUrl(href)) return href;
    return `${clean} (${href})`;
  });

  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '');

  text = text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, ref: string) => {
    const key = ref.toLowerCase();
    if (key in ENTITIES) return ENTITIES[key];
    if (key.startsWith('#x')) return String.fromCodePoint(parseInt(key.slice(2), 16));
    if (key.startsWith('#')) return String.fromCodePoint(parseInt(key.slice(1), 10));
    return m;
  });

  // Collapse the runs of blank lines that stripping tags tends to leave.
  return text.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

/** Splits text into plain runs and URLs, so a template can render anchors. */
export function linkify(text: string): Array<{ text: string; href?: string }> {
  const out: Array<{ text: string; href?: string }> = [];
  const pattern = /https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ text: text.slice(last, index) });
    out.push({ text: match[0], href: match[0] });
    last = index + match[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** The calendar's default zone, declared once at the top of the feed. */
export function calendarTimeZone(raw: string): string | null {
  const match = /^X-WR-TIMEZONE:(.+)$/im.exec(raw.replace(/\r\n/g, '\n'));
  return match ? match[1].trim() : null;
}

export function parseIcs(raw: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const defaultTz = calendarTimeZone(raw);
  let current: Record<string, string> | null = null;

  for (const line of unfold(raw)) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) {
        const tz = current.DTSTART_TZID ?? defaultTz;
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
            description: normaliseDescription(unescapeText(current.DESCRIPTION ?? '')),
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
