import type { APIRoute } from 'astro';
import { fetchUpcoming, toIcs, slugify } from '../../lib/calendar';

export const prerender = false;

const DEFAULT_CALENDAR_ID =
  'd70c6bb1623ca7cce65ebaa41ac643e3ebed78265bae6e9a7618684894aa6e86@group.calendar.google.com';

export const GET: APIRoute = async ({ params }) => {
  const uid = decodeURIComponent(params.uid ?? '');
  if (!uid) return new Response('Not found', { status: 404 });

  const calendarId = import.meta.env.GOOGLE_CALENDAR_ID || DEFAULT_CALENDAR_ID;
  const events = await fetchUpcoming(calendarId, import.meta.env.CALENDAR_ICS_URL);
  if (!events) return new Response('The calendar could not be read.', { status: 502 });

  const event = events.find((e) => e.uid === uid);
  if (!event) return new Response('Not found', { status: 404 });

  // Avoid "slaaf-slaaf-..." when the event title already names the federation.
  const slug = slugify(event.summary);
  const filename = `${slug.startsWith('slaaf') ? '' : 'slaaf-'}${slug}.ics`;

  return new Response(toIcs(event), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
      'cache-control': 'public, max-age=300',
    },
  });
};
