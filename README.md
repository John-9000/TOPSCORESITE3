# TopScore Web

Responsive web version of the TopScore Android app. The current web experience is focused on World Cup match schedules, live scores, standings, and local match reminders.

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Fill the `VITE_FIREBASE_*` values from a Firebase Web App in the `topscore-e9ddf` project.
3. Run:

```bash
npm.cmd install
npm.cmd run dev -- --port 5173
```

The browser URL is:

```text
http://127.0.0.1:5173
```

## Firebase Safety

The website does not use Firebase Admin SDK credentials and does not deploy rules, functions, scheduled jobs, or seed data. It only uses the client SDK with anonymous auth so score documents can be read.

The active UI reads these score-related collections only:

- `matches`
- `matchDetails`

The active UI does not read or write user prediction collections. Profile settings and match reminders are stored in local browser storage.

## Ads

Rewarded ads are intentionally not implemented in v1. The premium button is presentational for now.
