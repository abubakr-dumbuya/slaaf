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

Put images in `public/` and reference them as `/my-image.jpg`. Please resize
photographs to no more than 2000px on the long edge before adding them, so pages
stay fast for people on mobile data.
