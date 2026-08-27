# Updating the site

Most of what changes on this site is not edited here at all.

## Upcoming events

`/events` reads the federation's public Google Calendar. Add, edit or remove an
event in Google Calendar and the site follows on the next page load — no
rebuild, no code change.

For an event to appear with its title, location and description, the calendar's
**Access permissions for events** must be set to *See all event details*, not
*See only free/busy*. With free/busy sharing, Google sends the word "Busy" and
nothing else.

The description is worth filling in: it renders under the event, links inside it
become clickable, and it is what tells someone whether to turn up with boots.

## Apparel

`/apparel` reads the FAMBUL x SLAAF collection from Shopify. Add a product to the
collection, change a price, or sell out a size, and the site reflects it on the
next page load.

Product titles are tidied automatically — "*PRESALE*" and a leading "SLAAF
American Football" are stripped, since the page already says both.

## Registrations

Submissions from `/get-involved` are emailed to info@slaaf.org. Nothing is
stored on the website.

## Everything else

Page copy — About, Get involved, the homepage — lives in the code. Ask a
developer, or open an issue describing the change you want.

## Images

**Colour.** Headshots of board and advisory members are greyscale. Action and
football photography is left in its original colour — the pitch, the kit and the
flag are the point of those pictures, and draining them would throw that away.
The two treatments sit apart on purpose: a portrait is a cut-out of a person, an
action shot is a scene.

**Where they go.** On-page photographs belong in `src/assets/`, imported and
rendered through Astro's `<Image>` component. Astro then resizes them, converts
them to WebP and serves a sharper file to retina screens, all at build time. An
image dropped in `public/` skips every one of those steps and is sent to phones
at full weight.

`public/` is right for one thing only: `og-default.jpg`, the preview image social
networks show when the site is shared. That needs a stable, unhashed URL, which
is exactly what `public/` gives it.

**Size.** Supply photographs at around 2400px on the long edge for anything
full-width and 1200px for anything in a card. Astro scales down from there, so
larger sources are fine and cost nothing at run time — but it cannot invent
detail that is not in the file, and an undersized photo looks soft on a modern
screen.
