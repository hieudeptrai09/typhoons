# JEBI.SE Malakas (typhoons.vercel.app) — UI/UX Audit — Master Report

**Date:** 2026-07-07
**Scope:** Every page and every modal, audited at desktop (1440px) and mobile (390px).
**Method:** The live deployment is unreachable from the audit environment (egress policy blocks `typhoons.vercel.app` and its API), so the audit ran against a **faithful local reproduction of the exact same code** — the real PHP/MariaDB backend seeded from the full production database (143 positions, 656 storms, 221 names, 163 suggestions) and a **production Next.js build** (`next build && next start`). Findings therefore transfer directly to the live site. Four "UI/UX designer" reviewers audited in parallel, one per section.

> **Note on images:** Track-map and portrait images are served from `upload.wikimedia.org`, which is blocked in this environment, so image boxes render empty. Missing images are an *environment artifact* and are **not** counted as findings — but the placeholder / loading / broken-image *design* is critiqued where relevant.

---

## Severity roll-up

| Severity | Count | |
|---|---|---|
| 🔴 Critical | 2 | Ship-blockers / broken first impressions |
| 🟠 High | 14 | Serious usability or accessibility failures |
| 🟡 Medium | 21 | Notable friction, clarity, consistency |
| ⚪ Low | 11 | Polish, copy, code hygiene |
| **Total** | **48** | |

> **Owner review (2026-07-07):**
> - **Home:** the lack of a navbar is confirmed **intentional** (a minimal game/launcher layout — logo + primary buttons + search act as the navigation); that critique is withdrawn. "On this day"/"Useless Facts" will move into a home hamburger menu (the "weak hierarchy" finding is withdrawn; the amber-contrast fix still applies wherever they land). The logo→Facebook easter egg is kept and downgraded to a minor accessibility note.
> - **Storms → Highlights:** these grids are intentional sparse **charts** (strongest/first/last per position); the color→meaning mapping is arbitrary, so **no color legend is needed** — the finding is downgraded to a minor "make blank cells look intentional" note. The three highlight colors are already distinct, which is the only real requirement.
> - **Error vs empty states:** confirmed `FrownNotFound` is the intended **error** component (backs `error.tsx`) and `EmptyResults` the **empty-result** component. Agreed edits: rename `FrownNotFound` → `ErrorState`, make its message flexible and add a reset button; make `EmptyResults` icon + text flexible/suitable; route empty/not-found cases to `EmptyResults` rather than the error component.
> - **Names:** the compact icon-button design is intentional (clean, space-efficient), the filter/settings icons are fine, and all three buttons should stay icon-only/unlabeled ("synchronize" rule). Agreed resolution for the weak all-names↔retired **view toggle**: destination-semantic icons (`Skull` = view retired on the all-names page; `LayoutGrid`/`List` = view all on the retired page — which also frees `Flame` for "active" status only) **plus one small contextual hint chip** explaining the toggle. Also reconcile the main view's "active names" label with its intended "all names" scope.

Per-section detail lives in `findings/`:
- `findings/01_home_search_nav.md` — Home, Search, Navigation (10)
- `findings/02_storms_dashboard.md` — Storms dashboard, all views + modals (15)
- `findings/03_names.md` — Names section, all tabs + modals (11)
- `findings/04_detail_pages_modals.md` — Position/Info pages, not-found states, intercept modals (11)

Screenshots are in `screenshots/` (`<id>__desktop.png` / `<id>__mobile.png`). Open `index.html` for a browsable gallery that pairs each finding with its screenshots.

---

## The 2 Critical issues

1. **Retired Names tab opens to an empty "no results" screen.** `NamesPageContent.toggleView()` pushes `/names/retired/?letter=A` and `RetiredView` defaults the letter to `"A"` — but no retired name starts with A, so the tab's first impression is `EmptyResults` ("No typhoon names match your current filters") over ~50 real retired names. *Fix: default to the first available letter from `availableLettersMap`, and fall back to the first non-empty letter when a letter filter yields zero rows.* → `03_names.md #1`

2. **The Storms dashboard's only view switcher is an unlabeled icon "pill".** Four views × five groupings × two modes all hide behind 2–3 tooltip-less Lucide icons joined by "/" glyphs, with no text, no caret, and icons that change per view — it doesn't read as a control at all, so first-timers can't navigate the dashboard. *Fix: give it a persistent text label + disclosure caret (`Settings / <view> ▾`), and surface primary views as an always-visible `Segmented` bar on desktop.* → `02_storms_dashboard.md #1`

---

## Cross-cutting themes (fix these once, benefit everywhere)

These systemic patterns recur across all four sections. Addressing them at the source resolves many individual findings at once.

### A. Color-contrast failures against light backgrounds (WCAG 1.4.3) — the single most pervasive issue
The intensity color ramp (`TEXT_COLOR_WHITE_BACKGROUND` in `lib/utils/colors.ts`) is used as **foreground text on white/stone-100** across Storms averages, Position/Info "Overall Avg" figures, and modal storm names — with measured ratios as low as **~2.1:1** (orange `#FF9900`), far under the 4.5:1 minimum. The same failure recurs with name-status text (`text-amber-500` ~1.9:1, `text-green-600` ~3.9:1), home feature links (`text-amber-600` on sky-100, 2.78:1), retired letter-nav red (~3.3:1), and multiple `text-gray-400`/`text-slate-400` helper/counter strings (~2.3–2.5:1).
- **Fix once:** Add a dedicated darker "on-light" color ramp in `colors.ts` (separate from the on-badge palette) where every entry clears 4.5:1, **or** render these values as filled `IntensityBadge` chips (colored background + light text, which already pass). Darken name-status and helper-text classes. This single change touches Storms, Names, and Detail findings simultaneously.

### B. Color is the *only* channel of meaning, and there is no legend anywhere (WCAG 1.4.1)
Intensity categories (TD/TS/Cat 1–5), letter-nav status (blue/red/green), and distance buckets all encode critical meaning purely in hue, with **no legend on any screen**. Color-blind users get nothing; sighted first-timers can't decode "green 22" vs "red 56". *(Exception, per owner review: the Highlights charts' colors are decorative/arbitrary, not semantic — the page title carries the meaning — so those need no legend; they only need to stay visually distinct from each other, which they already are.)*
- **Fix once:** Build one shared `IntensityLegend` component (swatch + label, driven by `colors.ts`) and render it under the header on every data-viz view; add a small legend beside `LetterNavigation`; pair color with a non-color cue (badge shape, weight, dot).

### C. Icon-only *view switchers* where the action isn't legible
Two controls carry primary navigation with meaning living only in `title`/`aria-label`: the Storms dashboard view-switcher pill, and the Names all-names↔retired **view toggle** (a lone `Flame`/`Skull`). *(Per owner review, the compact-icon approach is intentional and the filter/funnel and settings/gear icons are conventional and fine — the issue is specifically these two view-switchers, whose icons don't communicate what they do or where they go.)*
- **Fix:** Keep the compact footprint but make the destination/state explicit — a small labeled toggle chip, or a two-option segmented control that doubles as a "you are here" indicator (`[ All names | Retired ]`, `Settings / <view> ▾`). Never let an icon be the *sole* signifier of a view switch.

### D. Interactive elements declared as buttons aren't keyboard-operable (WCAG 2.1.1)
Both the search-result rows (`SearchPageContent` `onRow`) and the storm grid cells (`GridCell`) set `role="button"` + `tabIndex={0}` + `onClick` **without `onKeyDown`** — focusable, announced as buttons, but Enter/Space do nothing.
- **Fix once:** Add an `onKeyDown` (Enter/Space) helper, or render real `<button>`s. Establish it as a lint rule / shared clickable-row utility.

### E. Empty & error states are misleading, dead-ended, and inconsistent
Beyond the Critical retired-tab issue: invalid/nonexistent positions (incl. `/positions/141`) show a transient **"Something went wrong. Please try again later."** server-error screen instead of a proper not-found; search's zero-result copy references **"filters"** that don't exist on that page; real fetch errors and legitimately-empty results are conflated; two different not-found designs (`FrownNotFound` frown vs `EmptyResults` filter-X icon) with broken grammar ("No typhoon named this was found.") and **no next-step CTA** anywhere.
- **Fix (component model — confirmed with owner):** Give the app three clear states. (1) **Error:** rename `FrownNotFound` → `ErrorState`/`ErrorFallback` (it backs `error.tsx` and is not a "not found" component), make its message a prop, and add a **retry/reset button** wired to the error boundary's `reset()`. (2) **Empty / not-found:** make `EmptyResults` flexible — an optional `icon` prop (neutral default, not `FilterX`) + a CTA slot + neutral default copy — and use it for every empty/invalid case with context-specific text. (3) Optionally `notFound()` for out-of-range IDs. Never show the error component (with its pointless "try again") for a bad URL or an empty result; echo the query where relevant.

### F. Modal ≠ page content parity
The intercept modals reorganize the same record into different tab sets and field lists than the full pages, and — most damagingly — the Info modal **drops the "Retired" badge and the "Replaced by" name**, leaving only an ambiguous skull. Both modals also force a fixed `height: 70vh` body, producing large empty voids for short records.
- **Fix:** Define one canonical field list/section order per entity; render the modal as a condensed-but-structurally-identical view sharing the page's `StatusBadge`; use `maxHeight: 70vh` (content-driven height) instead of fixed height.

### G. Mobile density & overflow
14-column grids (positions, names, average) are clipped at ~column 7 on 390px with **no scroll affordance**; centered `max-w-2xl` tables become illegible strips; stacked name buttons and special-region links fall well under the 44px touch-target minimum; multi-column tables hide columns behind unindicated horizontal scroll.
- **Fix:** Add scroll shadows/edge fades, switch to stacked cards below `md`, default the letter-nav on (one letter at a time) on small screens, and enforce ≥44px tap targets.

### H. Misleading / unexplained state indicators
The Names filter badge shows **"1" on first load** (it counts the implicit default `status="current"`); disabled controls (the Status radio in the filter modal, list/table toggles, greyed settings switches) appear with **no explanation** of why they're inert.
- **Fix:** Exclude implicit defaults from filter counts; hide or annotate disabled controls with a reason.

---

## Recommended priority order

**P0 — Critical (do first):**
1. Retired tab default-letter fix (`03_names #1`).
2. Dashboard view-switcher label + disclosure (`02_storms #1`).

**P1 — Highest-leverage systemic fixes:**
3. Darker "on-light" color ramp in `colors.ts` — clears the bulk of the AA contrast failures across Storms/Names/Detail (Theme A).
4. Shared `IntensityLegend` + letter-nav legend (Theme B). *(Bonus: the per-view explanatory copy already exists in `getDashboardDescription()` but is only wired to the SEO `<meta>` tag — render it under the title for near-zero effort.)*
5. `onKeyDown` on clickable rows/cells (Theme D).
6. Proper not-found handling + CTAs; fix conflated error/empty states and broken copy (Theme E).

**P2 — Consistency & mobile:**
7. Modal↔page parity incl. the retired badge/replacement in the Info modal (Theme F).
8. Mobile grid scroll affordances, tap targets, and table reflow (Theme G).
9. Active/retired labeled tabs; filter-badge count fix; annotate disabled controls (Themes C, H).

**P3 — Polish:** plain-language titles (drop "(Name, Current)" tuples), consistent placeholder/broken-image treatment, prev/next wrap-link styling, remove the invisible 7px cell text, redundant ARIA cleanup.

---

*Full per-finding detail (with the specific file, line, measured contrast, and concrete fix) is in the four section files under `findings/`. The `index.html` gallery lets you view every screen and modal alongside its findings.*
