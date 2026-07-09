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
> - **Modals & images:** the fixed `70vh` height on **tabbed** modals is intentional (prevents the dialog jumping when switching tabs of unequal length) — the "use maxHeight" suggestion is withdrawn; single-lens modals already use `maxHeight`. Agreed: replace the broken-image "No image" *text* (the load-error case, where a URL exists) with a gray placeholder graphic; the "no URL at all" case keeps its own layout.
> - **Intercept-modal model (endorsed):** coherent and kept — modal = the contextual slice you clicked from (info: storm-view→storms, name-view→name details, search→both; position: storms-grid→storms list, names/history-grid→names list); full page = everything. Three conditions to make it fully work: add a "View full details →" path in single-lens modals; keep per-slice field/status parity with the page (incl. the retired badge/replacement); and fix the no-origin `PositionModal` fallback so it shows both lists (it currently omits Storms). Info modal will be redesigned to match the page (2 tabs kept for brevity).
> - **Tables & mobile parity (sorting):** sorting must always be **global over the full dataset** (client-side, via the sortable column headers), independent of pagination. Owner prefers **scrolling over click-to-page**, so long list/table views keep the full list with a **sticky header** (no server pagination; virtualize only if needed) and any pagination must page the *pre-sorted* array. **Update (owner decision):** the owner keeps the **list/table and grid layouts on mobile as well as desktop** — a deliberate trade-off that sacrifices a mobile-optimised card layout for the ease of comparing two rows and reading counts/statistics across a shared row/column layout. So there is **no card transform** on mobile; instead every horizontally-scrolling list, table and spatial position/country grid gets a **scroll affordance** — `fixed:"left"` first columns (`#`/`Name`), a "Swipe right →" hint, and a right-edge gradient fade — so the off-screen columns are discoverable.
> - **Clearer page titles (done in code):** the `<h1>` titles were rewritten to be self-orienting without any description — Names: **"Current Typhoon Names" / "Typhoon Name History" / "Retired Typhoon Names"** (dropping the `(Name, Current)` tuples); Storms: **"All Storms by Name" / "All Storms by Position"** and dropped `(Grid)`/`(List View)` suffixes. `getNamesTitle` + `getDashboardTitle` updated.
> - **Title-only headers:** owner wants the `<h1>` to show **only the title, no description paragraph below it** (keeps pages from being character-heavy). The app already does this (`PageHeader` has no subtitle slot), so the "render `getDashboardDescription()` under the title" recommendation is **withdrawn**; the intensity-colour meaning is conveyed by the compact legend instead of prose.
> - **Colour contrast:** owner is targeting a **~3.5:1 working floor** (not strict 4.5:1) to preserve chromatic hues — reasonable, and it already meets AA for large/bold text (AA large = 3:1). The flagged colours (orange ~2.1, amber ~1.9, greens ~2.3–2.6, greys ~2.3) sit below even 3.5 and still need raising. Best path where hue matters: filled `IntensityBadge` chips (colour as background) — full hue *and* readable, no tradeoff.
> - **Storms → Distance (gap) view:** the `<6 / =6 / >6` colour split is intentional (~6y is the norm; colours flag faster/slower deviations) — "arbitrary/fragile-equality" withdrawn, downgraded to Low. Only refinement: make the norm (`=6`) a neutral grey so it recedes and the deviations pop, using a colour-blind-safe pair (not green+red).
> - **Grid Ctrl+F text:** the invisible 7px text in grid cells is intentional — it makes storm names findable via the browser's find-in-page; kept, and my "purposeless / grime on hover" note is retracted. Optional robustness tweak: `text-transparent` + `aria-hidden` (Ctrl+F ignores aria-hidden) instead of color-matching, so it never risks showing on a different background.
> - **Modal architecture (Average dashboard):** correction to my earlier take — the split *is* visible here: average-by-**position** opens the **intercept** `PositionModal` (URL changes) while average-by-country/year/name opens the **dedicated** `AverageModal` (no URL change), an inconsistency the user can see. Recommendation: **unify all Average cells on the in-place `AverageModal`** (parameterized by grouping for correct copy — the current "China … at this position" is wrong), keep the position intercept only for the Names/Storms grids, and add a "view full position →" link in the average modal. Still share presentational primitives (row/header/colors) so the modals read as one family, and this drops the `AverageModal`-vs-`PositionModal.AverageTab` redundancy.
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
The intensity color ramp (`TEXT_COLOR_WHITE_BACKGROUND` in `lib/utils/colors.ts`) is used as **foreground text on white/stone-100** across Storms averages, Position/Info "Overall Avg" figures, and modal storm names — with measured ratios as low as **~2.1:1** (orange `#FF9900`). The same recurs with name-status text (`text-amber-500` ~1.9:1, `text-green-600` ~3.9:1), home feature links (`text-amber-600` on sky-100, 2.78:1), retired letter-nav red (~3.3:1), and `text-gray-400`/`text-slate-400` helper strings (~2.3–2.5:1).
- **Owner policy (agreed):** targeting a **~3.5:1 working floor** rather than a strict 4.5:1, to keep hues chromatic (forcing every colour to 4.5:1 on white drags saturated colours toward near-black and "red stops looking red"). Reasonable — and note WCAG's bar is already **3:1 for large/bold text** (≥24px, or ≥18.66px bold), so for the big bold "Overall Avg" figures a ~3.5:1 colour **passes AA**. Treat the 4.5:1 references in the per-section findings as the AA bar for *small* text; read ~3.5:1 as the accepted minimum, 4.5:1 as ideal for small labels. **Either way the flagged colours sit below even 3.5:1**, so they still need raising.
- **Fix once:** (1) Where hue matters most, the no-tradeoff move is filled `IntensityBadge` **chips** (colour as the *background* + dark/white text): the hue stays fully vivid *and* the text is readable — no 3.5-vs-hue compromise. (2) For values kept as coloured text, add a dedicated darker "on-light" ramp in `colors.ts` that clears ≥3:1 (large/bold) or ~3.5–4.5 (small), measured against the actual `stone-100` cell background; darken the name-status and grey helper-text classes to the same floor. One change touches Storms, Names, and Detail together.

### B. Color is the *only* channel of meaning, and there is no legend anywhere (WCAG 1.4.1)
Intensity categories (TD/TS/Cat 1–5) and letter-nav status (blue/red/green) encode critical meaning purely in hue, with **no legend on any screen**. Color-blind users get nothing; sighted first-timers can't decode "green 22" vs "red 56". *(Exceptions, per owner review: the Highlights charts and the Distance "gap" view use colour as a secondary channel — the Highlights page title and the Distance view's printed gap numbers already carry the meaning — so those need no legend, only distinct, well-chosen, colour-blind-safe colours.)*
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
The intercept modal is intentionally a compact, contextual **peek** at the same record (tabbed, often a single origin-driven tab) rather than the page's long scroll — that pattern is fine and stays. What needs fixing is **field/status parity**: the Info modal **drops the "Retired" badge and "Replaced by" name** (leaving only an ambiguous skull) and shows a slightly different field set than the page, and the no-origin `PositionModal` fallback omits the Storms tab.
- **Fix:** Keep the contextual-peek structure; reconcile the modal's shown fields/labels/status with the page (one canonical field list/section order per entity, shared `StatusBadge`), cover the no-origin fallback so no facet disappears, and add a "view full details" path to the page. *(Note per owner review: the tabbed modals' fixed `70vh` body is **intentional** — it keeps the dialog from jumping when switching tabs of unequal length — so leave it; the only optional tweak is sizing that fixed height to the tallest tab's content to trim whitespace on short tabs.)*

### G. Mobile density & overflow
14-column grids (positions, names, average) are clipped at ~column 7 on 390px with **no scroll affordance**; centered `max-w-2xl` tables become illegible strips; stacked name buttons and special-region links fall well under the 44px touch-target minimum; multi-column tables hide columns behind unindicated horizontal scroll.
- **Fix (per owner — keep list/grid on mobile):** the owner keeps the list/table and grid layouts on mobile rather than switching to cards (a trade-off favouring row-to-row comparison and counting over a mobile-optimised layout), so the fix is a **scroll affordance instead of a card transform**: right-edge gradient fades + a "Swipe right →" hint on every overflow container (a shared `TableScrollHint` wrapper for the antd tables and the same treatment baked into `PositionGrid`), plus `fixed:"left"` `#`/`Name` columns. Container widths stay as the owner set them — the Storms name+list keeps `max-w-2xl` (concentrating the data centrally is intentional). Tap targets are raised to ≥44px on mobile (`min-h-11 md:min-h-0`) for the grid/list name buttons. Optionally default the letter-nav on (one letter at a time) on small screens.

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
4. Shared `IntensityLegend` + letter-nav legend (Theme B). *(Note: headers stay **title-only** per owner preference — no description paragraph under the `<h1>`; the intensity meaning is conveyed by the compact legend, not prose.)*
5. `onKeyDown` on clickable rows/cells (Theme D).
6. Proper not-found handling + CTAs; fix conflated error/empty states and broken copy (Theme E).

**P2 — Consistency & mobile:**
7. Modal↔page parity incl. the retired badge/replacement in the Info modal (Theme F).
8. Mobile grid scroll affordances, tap targets, and table reflow (Theme G).
9. Active/retired labeled tabs; filter-badge count fix; annotate disabled controls (Themes C, H).

**P3 — Polish:** plain-language titles (drop "(Name, Current)" tuples), consistent placeholder/broken-image treatment, prev/next wrap-link styling, remove the invisible 7px cell text, redundant ARIA cleanup.

---

*Full per-finding detail (with the specific file, line, measured contrast, and concrete fix) is in the four section files under `findings/`. The `index.html` gallery lets you view every screen and modal alongside its findings.*
