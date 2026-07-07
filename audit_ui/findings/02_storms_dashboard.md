# Storms Dashboard — UI/UX Findings

The Storms dashboard packs an unusually large feature set — four views (Storms, Highlights, Average, Distance), five grouping filters, and two display modes — behind a single compact purple icon "pill," yet gives first-time users almost no on-screen explanation of what any view means or what its colors encode. The result is a data-dense, visually attractive surface whose *scent* (discoverability of controls) and *legibility* (color semantics, contrast, mobile density) are the weakest links. Findings below are ordered by severity.

---

### [Critical] The view switcher is a single unlabeled icon "pill" — the only way to change views, but it barely reads as a control
- **Screens:** 10_storms_grid (desktop+mobile), 12_storms_positions, 16_storms_avg_position, 60_modal_dashboard_settings, and every dashboard screen
- **Category:** Discoverability / Information scent / Affordance
- **Problem:** The purple pill (`DashboardViewButton.tsx`) is the *sole* entry point to switch between Storms/Highlights/Average/Distance, change grouping, and toggle table/list. It renders only 2–3 Lucide icons separated by literal "/" glyphs (e.g. cloud / tag / grid), with no text label, no caret, and no tooltips. Its icons also *change* per view, so there is no stable "settings" affordance to learn. A first-time user has no reason to believe the pill is clickable or that it holds every mode of the page; it looks like a decorative status badge. The `/` separators read as breadcrumb decoration, not interactivity.
- **Fix:** Add a persistent text label and a disclosure affordance, e.g. render the button as `Settings / <current view> ▾` with a `SlidersHorizontal` icon, keeping the state icons secondary. In `DashboardViewButton.tsx` add a visible caption and `title`/tooltip; consider surfacing the primary view choices as an always-visible antd `Segmented` bar on desktop and collapsing to the pill only on mobile.

### [High] Per-view explanations exist in code but are never shown — users can't tell what they're looking at
- **Screens:** all views, esp. 16_storms_avg_position, 21_storms_dist_position, 13_storms_hl_strongest
- **Category:** Information scent / Onboarding
- **Problem:** `getDashboardDescription()` (in `_utils/fns.ts`) returns a clear one-paragraph explanation for every view/filter combination (e.g. "Analyze average typhoon intensity by position in the naming list…"), but it is only consumed by `generateMetadata()` in `[[...slug]]/page.tsx` for the SEO `<meta description>`. `DashboardPageContent.tsx` passes *only* the title to `PageHeader`. So a grid of colored numbers 1–140 ("Average Intensity by Position") arrives with zero on-screen context about what "position" means, what the color scale is, or how to read it.
- **Fix:** Render the existing description under the title. In `DashboardPageContent.tsx` call `getDashboardDescription(view, mode, filter)` and pass it into `PageHeader` (add a `subtitle`/`description` slot) as muted body text below the H1. Zero new copy needed — the strings already exist.

### [High] Intensity color scale has no legend anywhere — colored numbers/names are undecipherable
- **Screens:** 16_storms_avg_position, 17_storms_avg_name, 18_storms_avg_country, 20_storms_avg_month, 67_modal_storm_detail, 68_modal_average
- **Category:** Data visualization / Legend / Learnability
- **Problem:** Across Average views, cell numbers and storm names are tinted via `TEXT_COLOR_WHITE_BACKGROUND` (TD=blue, TS=green, 1=gold, 2=orange, 3=deep-orange, 4=red, 5=magenta), and `StormDetailModal`/`AverageModal` show colored intensity badges ("5", "2", "TS"). Nowhere is there a legend mapping color → intensity category. A user sees "22" in green and "56" in dark red with no way to know green≈weaker, red≈stronger, or what "TS/TD" mean. The encoding is the entire point of the Average views and it is invisible.
- **Fix:** Add a compact horizontal legend chip row beneath the switcher for Average/Highlights/Distance views (reuse `BACKGROUND_BADGE`/`TEXT_COLOR_WHITE_BACKGROUND` and `INTENSITY_LABEL`): swatch + label for TD, TS, Cat 1–5. Render it from a shared `IntensityLegend` component so it stays in sync with `colors.ts`.

### [High] Intensity text colors fail WCAG AA contrast on the light grid background
- **Screens:** 16_storms_avg_position, 17_storms_avg_name, 18/20 average list views, 68_modal_average
- **Category:** Accessibility (contrast) / Color
- **Problem:** `TEXT_COLOR_WHITE_BACKGROUND` values are used as small text on white/`stone-100` cells. Several fall well below the 4.5:1 AA threshold for normal text: TS `#00BB00` (~2.3:1), Cat 1 `#CC9900` (~2.7:1), Cat 2 `#FF9900` (~2.1:1), Cat 3 `#FF5500` (~3.0:1), TD `#0099CC` (~3.3:1); Cat 4 `#DD0000` (~4.3:1) is borderline. In the Average-by-Name grid these are `text-xs` names, and in the Average-by-Month list the intensity values (e.g. orange "1.75") are the primary data — all hard to read for low-vision users and in bright light.
- **Fix:** Darken the on-white palette in `colors.ts` (a separate, higher-contrast set from the on-badge colors), or don't rely on hue alone — pair each value with a small filled badge/swatch (as `IntensityBadge` already does) so color is redundant with shape/position. Verify each entry hits ≥4.5:1 (or ≥3:1 with the badge treatment) against `#f5f5f4`.

### [High] Grid cells are declared as buttons but aren't keyboard-operable
- **Screens:** 10/12/16 grids, 67_modal_storm_detail (opened from a cell)
- **Category:** Accessibility (keyboard)
- **Problem:** `GridCell.tsx` renders a `<td>` with `role="button"` and `tabIndex={0}` but only an `onClick` handler — there is no `onKeyDown` for Enter/Space. Keyboard users can focus a cell but cannot activate it, so opening a position's storms (the core interaction of every grid view) is impossible without a mouse. The nested name buttons in the Names grid *are* real `<button>`s, but the position cells that open `/positions/[n]` are not.
- **Fix:** In `GridCell.tsx` add `onKeyDown={(e) => { if (isClickable && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } }}`. Better, render the cell content as a real `<button>` inside the `<td>` rather than putting the role on the table cell.

### [High] On mobile the position grids are half-hidden by horizontal scroll with no affordance or column headers
- **Screens:** 12_storms_positions__mobile, 16_storms_avg_position__mobile, 13_storms_hl_strongest__mobile
- **Category:** Responsive / Data density / Discoverability
- **Problem:** `PositionGrid` is a fixed 14-column table in an `overflow-x-auto` wrapper. At 390px the mobile shots show only columns 1–7 (numbers jump 1‑7, 15‑21, 29‑35…), meaning columns 8–14 for every row are clipped off-screen with no visible scrollbar, fade, or "swipe for more" hint. A user reasonably concludes the data ends at column 7. Compounding this, `showHeader={false}` is passed for all storms/average/highlight grids, so the country-flag header row is gone and there is nothing telling the user the columns correspond to contributing countries.
- **Fix:** Add a scroll affordance (right-edge gradient mask + a "scroll →" hint on first render) to the `overflow-x-auto` container in `PositionGrid`. On mobile, either reduce to a responsive column count or make the grid pinch/scrollable with a sticky first column. Re-enable a compact header (or a caption) so column meaning is recoverable.

### [Medium] The "Average Modal" always says "Storm names at this position" — even for country, year, and name groupings
- **Screens:** 68_modal_average (opened from position, but same modal serves country/year/name)
- **Category:** Copy / Consistency
- **Problem:** `AverageModal.tsx` hardcodes the label `Storm names at this position:` (line 57). `DashboardPageContent.handleCellClick` opens this same modal for Average-by-Country (title "Cambodia"), Average-by-Year (title "Year 2020"), and Average-by-Name. So a user clicking a country sees "#1 Cambodia … Storm names at this position", which is factually wrong — those are storms for that country/year, not a naming position.
- **Fix:** Pass a context-appropriate label into `AverageModal` (e.g. `subtitle` prop: "Storm names for this country/year/name") derived from the active `filter`, instead of the hardcoded string.

### [Medium] List view: no pagination for ~180 rows, and it's cramped/centered leaving huge dead space on desktop, tiny on mobile
- **Screens:** 11_storms_list (desktop+mobile), 22_storms_dist_name
- **Category:** Data table / Responsive / Layout
- **Problem:** `StormsView` (name+list) renders the full name table with `pagination={false}` inside `mx-auto max-w-2xl`. On desktop this squeezes all ~180 rows into a narrow center column, wasting ~40% of the viewport on each side; on mobile (`11_storms_list__mobile`) the same table with `scroll={{ x: "max-content" }}` becomes a hair-thin, near-illegible strip. There is no pagination, page-size control, or sticky header, so scanning 180 rows means one very long scroll with the column headers disappearing.
- **Fix:** Widen the container (`max-w-5xl` or full-width with padding) and enable `pagination` (or virtualization) plus `sticky` header on the antd `Table`. On mobile, switch to a stacked card list rather than a horizontally-scrolled 6-column table.

### [Medium] Distance ("gap") view color coding is arbitrary and unexplained
- **Screens:** 21_storms_dist_position, 22_storms_dist_name, SpecialButtons row
- **Category:** Data visualization / Legend
- **Problem:** `getDistanceColor()` colors values green when `< 6.0y`, blue when *exactly* `6.0y`, and red when `> 6.0y`. In `21_storms_dist_position` the grid is a near-uniform field of "5.75y" (green) / "6.00y" (blue) with no legend, so the color carries no learnable meaning — and an exact-equality bucket for 6.00 is a fragile, meaningless distinction that will read as noise. Users cannot tell whether green is "good" or "frequent."
- **Fix:** Replace the equality bucket with a continuous or clearly-labeled scale ("more frequent ↔ less frequent") and add a legend. Document thresholds and make green/red semantically consistent with a stated meaning (e.g. shorter gap = more frequent).

### [Medium] Highlights & sparse Average grids have empty white cells with no empty-state or color legend
- **Screens:** 13_storms_hl_strongest, 14/15 highlights, 19_storms_avg_year
- **Category:** Empty states / Legend
- **Problem:** In Highlights and Average-by-Year, most of the 140 cells are blank white with a few colored (pink/blue) filled cells scattered around. There's no legend telling the user pink = "strongest" (`bg-red-300`), blue = "first", orange = "last", and no explanation of why most cells are empty. It reads as a broken/partial grid rather than an intentional sparse highlight. Empty cells also give no hover/click feedback, so the interaction model is inconsistent with the other views where every cell is clickable.
- **Fix:** Add the per-view legend chip (see intensity-legend finding) stating what the highlight color means, and give empty cells a subtle "no highlight" treatment (very light hatch or muted dash) so the sparseness reads as designed. Consider a short caption: "Only positions with a recorded strongest storm are shown."

### [Medium] Grid name links and cell tap targets are far below the 44px minimum on mobile
- **Screens:** 10_storms_grid__mobile, 17_storms_avg_name, 13_storms_hl_strongest__mobile
- **Category:** Touch targets / Mobile
- **Problem:** In the Names grid, each cell can stack multiple `text-xs`, `leading-tight` name buttons (`StormGrid` "names" case), and `SpecialNamesListDiv` renders `!text-xs` text buttons at `!p-0`. On a 390px screen these are tiny, tightly-stacked hit areas well under the 44×44px guideline, and adjacent names risk mis-taps. Highlight cells with two stacked storms compound this.
- **Fix:** Increase min tap height (`min-h-11`, more vertical padding) for cell name buttons and special-region buttons on mobile; add spacing between stacked names. Where multiple names share a cell, consider a single tappable cell that opens a disambiguation list.

### [Medium] Country grouping shows flags with no country name (recognition + a11y gap)
- **Screens:** 18_storms_avg_country (list), 11_storms_list Country column
- **Category:** Recognition / Accessibility
- **Problem:** The Country column renders `<CountryFlag>` alone with no text label for the actual member countries (only CPHC/NHC/IMD get text). Users must recognize 14 flags (e.g. Micronesia, Laos, Cambodia) by sight, and screen-reader users depend entirely on the flag's alt text. Sorting by "Country" then produces a column the user can't read the values of. Note IMD shows an "Average Intensity" of `-1.00`, a confusing negative value surfaced with no explanation.
- **Fix:** Show the country name beside the flag (flag + label) in both the list Country column and the header. Format the `-1.00`/TD case as a labeled category ("TD") rather than a raw negative number, or suppress averages for single-storm regions like IMD (count 1).

### [Low] Inconsistent terminology: "Distance" (control) vs "Average Gap" (title); "All Storms" vs "All Typhoon Names"
- **Screens:** 60_modal_dashboard_settings, 21_storms_dist_position, 12_storms_positions, 10_storms_grid
- **Category:** Consistency / Copy
- **Problem:** The settings modal's View segmented control labels the fourth view "Distance," but its page title is "Average Gap Between Storms by Position" — two names for one feature. Similarly the position-grouped Storms view is titled "All Storms" while the name-grouped one is "All Typhoon Names (Grid)"; the switch from "Storms" to "Typhoon Names" for what is the same "Storms" view is easy to misread as a different section.
- **Fix:** Align labels: rename the modal option to "Gap" / "Frequency" to match the title, or retitle the view "Storm Distance." Standardize the Storms view titles around one noun.

### [Low] Invisible 7px near-white duplicate storm-name text baked into every grid cell
- **Screens:** 10/12/16 grids (not visibly rendered, but present in DOM)
- **Category:** Code hygiene / Accessibility (noise)
- **Problem:** `GridCell.tsx` renders `<div className="absolute top-0 text-[7px] text-stone-100 …">{stormNames.join(", ")}</div>` — a 7px, `stone-100`-on-white string that is effectively invisible and serves no clear purpose (the same names are already in the cell's `title` and `aria-label`). It adds visual grime on hover (`group-hover:text-stone-200`) and redundant noise for assistive tech.
- **Fix:** Remove the hidden `text-[7px]` div; the `title`/`aria-label` already convey the names. If a peek of names is intended, make it a real, legible tooltip.

### [Low] Modal disabled options give no reason; Reset silently jumps away from current view
- **Screens:** 60_modal_dashboard_settings (desktop+mobile)
- **Category:** Feedback / Modal clarity
- **Problem:** In `DashboardModal`, the "Display as" toggle disables Table or List depending on view/filter (`isListOnly`/`isListModeDisabled`) with no tooltip explaining why (e.g. "This view is list-only"). "Reset" hard-resets to Storms/Position/Table regardless of what the user was viewing, which can feel like it discarded their place with no confirmation or undo.
- **Fix:** Add a `title`/helper text on disabled segmented items ("Country grouping is available in list view only"). Relabel "Reset" to "Reset to defaults" so its scope is clear, or scope reset to only the fields the user changed.
