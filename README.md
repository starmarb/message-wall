# Message Wall (Demo Version)

This version of the app has been made so it can be hosted for demo purposes.

- `/` — the main experience: a phone mockup on the left with a fully working
  drawing canvas, and a message-wall display on the right. Draw and submit,
  and the drawing animates onto the wall in the same browser tab.
- `/canvas` and `/success` — the same drawing flow as standalone pages, if
  you want to link directly to just the phone experience.

Nothing is uploaded or saved anywhere else. Drawings only ever live in this
browser tab's memory/`sessionStorage`, just long enough to render them, and
disappear the moment the tab is closed or the person navigates away.
