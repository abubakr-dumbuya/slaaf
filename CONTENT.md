# Updating the site

You do not need to write code to publish news or add a fixture. Both are plain
text files in this repository. Add a file, commit it, and the site rebuilds and
deploys automatically.

## Publishing a news post

Create a file in `src/content/news/` named after the article, ending in `.md`.
For example `src/content/news/first-national-training-camp.md`:

```markdown
---
title: "First national training camp held in Freetown"
date: 2026-09-14
summary: "Forty players attended the Authority's first open camp at the National Stadium."
author: "SLAAF Communications"
draft: false
---

Write the article here in normal paragraphs. Leave a blank line between them.

## Subheadings look like this

You can **bold** text, *italicise* it, or [add a link](https://www.slaaf.org).
```

Field notes:

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Shown as the headline and the browser tab title |
| `date` | yes | `YYYY-MM-DD`. Controls ordering — newest first |
| `summary` | yes | One or two sentences. Used on the news index and in link previews |
| `author` | no | Omit if the post is from the Authority generally |
| `draft` | no | Set `true` to keep a post out of the live site while you work on it |

The filename becomes the web address, so
`first-national-training-camp.md` publishes at
`slaaf.org/news/first-national-training-camp/`. Use lowercase words separated by
hyphens, and do not rename a file after publishing — that breaks any links
people have shared.

## Adding a fixture or result

Create a file in `src/content/fixtures/`, for example
`src/content/fixtures/2026-10-04-sierra-leone-v-ghana.md`:

```markdown
---
date: 2026-10-04
competition: "IFAF Africa Flag Championship"
code: flag
home: "Sierra Leone"
away: "Ghana"
venue: "Accra Sports Stadium, Accra"
---
```

Leave `homeScore` and `awayScore` out until the match has been played, then add
them to turn the fixture into a result:

```markdown
homeScore: 26
awayScore: 19
```

`code` must be either `flag` or `tackle`. As with news posts, adding
`draft: true` keeps a fixture off the live site while you prepare it.

Standings are calculated from these files automatically — there is no separate
table to maintain.

## Images

Put images in `public/` and reference them from a post as `/my-image.jpg`.
Please resize photographs to no more than 2000px on the long edge before adding
them, so pages stay fast for people on mobile data.

## If something goes wrong

If a file has a mistake in it — a missing `title`, a malformed date — the build
will fail and the live site will simply stay as it was. Nothing breaks publicly.
The build log will say which file and which field caused the problem.
