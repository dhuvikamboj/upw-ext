# Job Radar for Upwork - Chrome Extension

> Instant alerts for new Upwork jobs that match your skills, so you can send proposals in the first minutes, before a job gets crowded.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

**Monitoring**
- Scans your saved Upwork searches every 1-10 minutes (with optional ±jitter) using your own logged-in browser session.
- Multiple saved searches: a primary search (skills picker or pasted URL) plus extra searches, each with its own hourly and fixed-price budget floors and an alert on/off toggle.
- Pauses when your computer is locked or idle.

**Filtering and alert control**
- Separate minimum hourly rate and minimum fixed-price budget. Jobs with no stated budget always pass.
- Excluded keywords (title, description, skills) and excluded client countries.
- Quiet hours (can wrap past midnight), a daily alert cap and a minimum fit score. These only silence alerts; jobs still appear in the popup.

**Alerts and controls**
- Discord or Slack webhook alerts in addition to desktop notifications (same quiet hours, snooze and daily cap).
- Snooze from the popup: 1 hour, 4 hours or until tomorrow 7am. Jobs still appear in the feed.
- Per-search colour on popup cards and the toolbar badge, and the search name in notifications.
- Block a client with one click (matched by spend + rating + country, since Upwork hides client names).
- Shortcuts: `Alt+Shift+S` scan now, `Alt+Shift+J` open the latest job (rebind at `chrome://extensions/shortcuts`). Both are also in the toolbar icon's right-click menu.

**Job intelligence**
- **Fit score (0-100):** skills match (40), budget (20), competition from proposal count (20) and how recently it was posted (20). Shown on every popup card and in notifications.
- **Connects:** cost shown per job (exact once you open the job page, otherwise your default estimate), plus a monthly Connects spend tracker with an optional budget.
- **Client risk score** on job pages: suspended clients, rating, payment verification and spend.
- **AI proposal prompt:** a copy-paste prompt for ChatGPT, Claude or Gemini, tailored to the job and your profile.

**Tracking**
- Popup feed of detected jobs with one-click "Mark Applied".
- Saved proposal snippets, copied from the AI Bid Prompt window.
- Export and import settings as JSON (the webhook URL is left out of exports).
- Analytics dashboard (scanned vs. applied, average rate, verified clients) with PDF export.

**Planned:** Telegram mobile alerts (the settings fields exist but delivery is not built yet).

## Install (developer mode)

1. Clone or download this repository.
2. Open `chrome://extensions/` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repository folder.
4. Pin **Job Radar** to your toolbar.

## Setup

1. Open the extension **Settings** (gear icon in the popup).
2. Pick your skills, or paste an Upwork search URL (apply Upwork's own filters first, then copy the URL).
3. Set budget floors, scan frequency and any exclusions, quiet hours or alert limits.
4. Click **Save All Settings**, then **Send Test Desktop Notification** and **Scan Now** in the popup.

## Project structure

```text
manifest.json        Manifest V3 config
background.js        Service worker: alarms, multi-search scanning, filtering, notifications
filters.js           Pure helpers: budget/keyword/country/client filters, quiet hours, fit score, Connects spend, webhook payloads
filters.test.js      Self-check for filters.js (node filters.test.js)
content.js           Upwork page script: job extraction, on-page risk card, Connects capture
ai_analyzer.js       Client trust scoring and AI proposal prompt builder
popup/               Toolbar popup (feed, fit score, Connects tracker)
settings/            Options page
dashboard/           Analytics and PDF export
icons/, chrome-store-assets/   Icons and Web Store listing assets
```

## Development

```bash
node filters.test.js   # runs the filter, scoring and spend checks
```

Upwork's page markup changes often. If posted time, proposal count, Connects or country stop being detected, update the selectors and regexes in `content.js` (and the matching extractor in `popup/popup.js`).

## Permissions

`storage`, `alarms`, `notifications`, `idle`, `tabs`, `scripting`, `activeTab`, `contextMenus`, plus host access to `upwork.com` and the Discord/Slack webhook endpoints (used only if you set a webhook URL).

## Privacy and safety

- Never reads or sends your Upwork password or financial details.
- All settings and job history stay in your browser's local storage.
- Alert-only: it never submits bids, clicks Apply or automates actions on Upwork.
- See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) and [CHROMEWEBSTORE.md](CHROMEWEBSTORE.md) for store listing details.

## License

[MIT](LICENSE) © 2026 Davinder Singh
