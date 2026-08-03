# UI/UX Audit — Cá Tra's Typhoons App

This folder contains a full UI/UX design audit of **https://typhoons.vercel.app/**, including screenshots of every screen and modal plus a written findings report.

> **Note on the save location.** You asked for this to be saved to `D:\xampp\htdocs\typhoon\audit_ui`. This audit was produced in a **remote Linux container** (Claude Code on the web), which has no access to your local Windows `D:` drive. Everything is therefore committed into the repository under `audit_ui/` on branch `claude/typhoons-ui-ux-audit-ibtq9q`. To get it onto your machine at `D:\xampp\htdocs\typhoon\audit_ui`, pull the branch (or download the folder) and copy it there.

## Contents

- `audit.html` — **the main deliverable**: a single self-contained web page combining the full written audit with the screenshots inlined per section (click any thumbnail to enlarge). Open it in any browser.
- `AUDIT_REPORT.md` — the same findings in Markdown: every finding with severity, rationale, and a concrete fix.
- `index.html` — a plain visual gallery of every screenshot.
- `screenshots/`
  - `desktop/` — 31 full-page screenshots at 1440×900
  - `mobile/` — 15 full-page screenshots at 390×844 (iPhone-class)
  - `modals/` — 11 modal/overlay states

## How the site was audited

The public site (`typhoons.vercel.app`) is unreachable from this container's network policy, so — using the SQL dump you provided — the app was rebuilt and run locally:

1. Started a local PostgreSQL 16 cluster and loaded the provided dump into a `catfisha_typhoons` schema (221 names, 658 storms, 143 positions, 163 suggested names).
2. Added one column the current codebase expects but the dump was missing (`typhoonnames.retirementreason`) so the production build could render.
3. Ran a Next.js **production build** (`next build` + `next start`) — a production build was required because dev-mode hydration did not reliably attach the click handlers needed to open modals.
4. Drove the pre-installed **Chromium** via Playwright to visit every route from the app's own `sitemap.xml`, capture full-page screenshots at desktop and mobile widths, and open every interactive modal by clicking real cells/rows/controls.

Screens covered: home, about, search (empty / results / no-results), 404, all Names scopes (current grid/list/tag, history, retired) and name/position detail pages, all 5 Storms dashboard tabs (Storms, Highlights, Average, Gap, Avg. Date) in their grid/list variants, and every data modal.

## Methodology

Four independent "UI/UX designer" reviewers analyzed the screenshots in parallel, each owning one area (Landing & Global, Names, Storms Dashboard, Modals). Their findings were consolidated, de-duplicated, and prioritized in `AUDIT_REPORT.md`.
