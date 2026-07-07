# Names Section — UI/UX Findings

The Names section is feature-rich (grid/list/retired views, letter navigation, three modals). Its compact icon-button controls are an intentional, space-efficient design — the filter (funnel) and settings (gear) icons are conventional and fine — so the discoverability concern narrows to the single all-names↔retired **view toggle**, whose action isn't legible. The single most damaging issue is that the Retired tab opens to an empty "no results" state on first load; below that, the biggest themes are that view toggle, misleading filter state (plus undocumented color coding), mobile grid overflow, and WCAG-failing name-text contrast.

---

### [Critical] Retired Names tab opens to an empty "no results" state
- **Screens:** 32_names_retired__desktop.png, 32_names_retired__mobile.png
- **Category:** Empty/default state, first impression, logic bug
- **Problem:** Opening the Retired view shows the `EmptyResults` "No typhoon names match your current filters" panel even though ~50 retired names exist. Root cause: `NamesPageContent.tsx` `toggleView()` pushes `/names/retired/?letter=A`, and `RetiredView.tsx` defaults `currentLetter = searchParams.get("letter") || "A"`. No retired name starts with "A" (letter A is rendered disabled/gray in the nav), so `displayedNames` filters to zero and the table renders `EmptyResults`. The `FilterX` empty icon further implies the user applied a filter they never touched. This is the worst possible first impression for the tab.
- **Fix:** In `RetiredView.tsx`, derive the default letter from real data instead of hard-coding "A": compute the first available letter from `availableLettersMap` (e.g. `const firstLetter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").find((l) => availableLettersMap[l])`) and use it when no `letter` param is present. Also change `NamesPageContent.tsx` `toggleView()` to push `/names/retired/` (or `?letter=<firstAvailable>`) rather than the literal `?letter=A`. As a safety net, when the current-letter filter yields zero rows and no user filters are active, auto-fall-back to the first non-empty letter rather than showing `EmptyResults`.

---

### [High] The all-names ↔ retired view toggle is a lone icon whose action isn't legible
- **Screens:** 30_names_current__desktop.png, 32_names_retired__desktop.png, 34_names_current_tab (both), mobile variants
- **Category:** Discoverability, navigation, information architecture
- **Problem:** The compact-icon control scheme on this page is a deliberate, space-efficient choice, and the **filter (funnel) and settings (gear) icons are conventional and fine** — this finding is *only* about the view toggle. Switching between the two primary views is done by one icon button: a `Flame` on the main page (`aria-label="Viewing active names, click to switch to retired"`) and a `Skull` on the retired page. Two issues: (1) the icon's *action* isn't legible — a flame doesn't say "go to the retired list," and the skull sits on the page you're already on, so it reads as a status glyph rather than a "switch view" control; the meaning lives only in `title`/`aria-label`. (2) The label is semantically off: the main view is intended to show **all names (active + retired)**, but its `aria-label` says "active names" and the code filters it to `status="current"` (`selectedStatus`, which hides retired-and-replaced names) — so intent, label, and behavior disagree (see the filter-badge finding).
- **Fix (agreed — keep 3 icon buttons, unlabeled & synchronized):** Two parts. **(1) Destination-semantic icons** so each toggle hints where it goes: on the all-names page swap the `Flame` for a red **`Skull`** ("view retired names"); on the retired page swap the `Skull` for a **`LayoutGrid`/`List`** (or `Undo2` "back") in a neutral/blue tone ("view all names"). This makes "skull = retired" consistent everywhere (it matches `NameStatusIcon` and the retired page) and **frees `Flame` to mean only "active name"** in `NameStatusIcon` — which also resolves the icon-overload finding below. **(2) One small colored hint chip** in the header control row, with small text naming the action — e.g. on the all-names page "Tap the skull to see retired names," on the retired page "Tap to see all names." Show it contextually (e.g. only while no filters are active) so it teaches first-timers without permanently costing space. The funnel (filter) and gear (settings) icons are conventional and stay unlabeled, so **all three buttons remain icon-only and consistent** — satisfying the "synchronize" rule (no button carries a persistent text label; the chip is a separate hint, not a button label). Keep each `title`/`aria-label` in sync, and relabel the main view's `aria-label` from "active names" to "all names" to match intent.

---

### [High] Filter badge shows "1" on the default view when no filter is applied
- **Screens:** 30_names_current__desktop.png (green "1" badge on funnel), 34_names_current_tab, 62_modal_names_settings
- **Category:** Feedback, misleading state
- **Problem:** In `NamesView.tsx`, `selectedStatus` defaults to `"current"` on the Current view and `activeFilterCount` includes `selectedStatus` in its `.filter(Boolean)` count. So the `Badge count={activeFilterCount}` on the filter funnel always reads "1" on first load even though the user has applied nothing. This trains users to distrust the badge and hides when a real filter is actually active. The filter modal compounds it by showing Status pre-set to "Current".
- **Fix:** Exclude the implicit default status from the count. In `activeFilterCount`, only count `selectedStatus` when `showHistory` is true and the value is a non-default explicit choice (i.e. drop `selectedStatus` from the array on the Current view, or count it only when `selectedStatus && selectedStatus !== "current"`).

---

### [High] Grid mode overflows and is unusable on mobile (14 columns, no letter nav by default)
- **Screens:** 30_names_current__mobile.png, 33_names_history__mobile.png, 34_names_current_tab__mobile.png
- **Category:** Responsive, readability
- **Problem:** `PositionNameGrid` renders a 14-column country grid. On mobile only ~4.5 columns fit; the rest is clipped ("Koi…", "Ton…", "He…" cut off at the right edge) with no visible scroll affordance or edge fade. `NamesView` defaults `settings.showLetterNav = false`, so in grid mode the whole 140-name matrix loads at once with no chunking. There is no responsive fallback (e.g. per-letter paging) for small screens.
- **Fix:** On small breakpoints, either default `showLetterNav` to true (so the grid shows one letter at a time) or add a visible horizontal-scroll indicator / gradient fade on the grid container in `PositionNameGrid`. Consider a `md:` breakpoint that switches the grid to the list layout automatically. Add `aria`/visual scroll hints so the clipped columns are discoverable.

---

### [High] Name-text colors fail WCAG AA contrast (amber and green on white)
- **Screens:** 30_names_current, 31_names_list, 33_names_history, 64_modal_retired_details (all)
- **Category:** Contrast / accessibility (WCAG 1.4.3)
- **Problem:** Grid/list name labels use `getNameStatusColorClass`: `text-amber-500` (#f59e0b) for misspelling names and `text-green-600` (#16a34a) for active names, on a white/very-light background, at 12–14px semibold. Amber-500 on white is ~1.9:1 and green-600 is ~3.9:1 — both fail the 4.5:1 AA threshold for normal text (amber fails even large-text 3:1). The amber "misspelling" names are effectively unreadable. Retired letter-nav red `#ef4444` on the light page background is also ~3.3:1 (fails AA for the small letters).
- **Fix:** Darken the palette in `lib/utils/colors.ts`: use `text-amber-600`/`amber-700` (#d97706/#b45309) and `text-green-700` (#15803d) for name text; use `text-red-600`/`red-700` for retired letters in `RetiredView.getLetterConfig`. Verify each against 4.5:1 for the actual font sizes used in `PositionNameGrid` (12px history cells especially).

---

### [Medium] Letter-nav status is conveyed by color alone with no legend
- **Screens:** 30/33 (grid nav), 32_names_retired (both)
- **Category:** Accessibility (WCAG 1.4.1 use of color), learnability
- **Problem:** In `NamesView.getLetterConfig`, letters are colored blue (`#3b82f6`, has both active+retired), red (`#ef4444`, retired only), or green (`#22c55e`, active only). This meaningful color coding is never explained anywhere on the page, and it is the only channel carrying the information — color-blind users get nothing, and sighted users can't decode it. Disabled letters use `#d1d5db` (gray-300), which is very low contrast against the light page (intentional, but combined with no legend it's ambiguous whether a letter is disabled or just a color).
- **Fix:** Add a small legend near `LetterNavigation` (blue = active + retired, red = retired only, green = active only), and pair color with a non-color cue (weight, underline, or a tiny dot). Ensure disabled vs. available is distinguishable by more than lightness.

---

### [Medium] Filter modal Status section is fully disabled with no explanation
- **Screens:** 61_modal_names_filter__desktop.png, 61_modal_names_filter__mobile.png
- **Category:** Feedback, modal clarity
- **Problem:** In `ListFilterModal.tsx` the Status `Radio.Group` is `disabled={!showHistory}`. On the default Current view a full "Status: All / Active / Retired / Current" row appears grayed-out with "Current" pre-selected. Users see a control they can't operate and no reason why. It looks broken.
- **Fix:** Either hide the Status field entirely when `!showHistory` (conditionally omit the `Form.Item`), or render an inline helper text explaining it's only adjustable in History mode. Don't show a dead, pre-checked control.

---

### [Medium] Display Settings switches grey out based on hidden mode dependencies
- **Screens:** 62_modal_names_settings__desktop.png, 62_modal_names_settings__mobile.png
- **Category:** Modal clarity, learnability
- **Problem:** `NamesSettingsModal.tsx` mixes grid-only and list-only options in one flat list. Selecting "List" greys out Letter Navigation, Show Name, Show History, and Colorful; selecting "Grid" greys out "Show Images & Descriptions"; "Colorful" additionally depends on "Show History". None of these dependencies are explained — toggling the Display Mode radio makes half the panel go gray with no cause shown. "Colorful" also has no description of what it colors.
- **Fix:** Group the switches under headings ("Grid options" / "List options") that appear only for the active mode, or add short helper text on disabled rows (e.g. "Available in Grid mode"). Add a one-line description under "Colorful" ("Color grid cells by how many times a position has been used").

---

### [Medium] Retired details modal has a fixed 70vh body producing large empty whitespace
- **Screens:** 64_modal_retired_details__desktop.png, 64_modal_retired_details__mobile.png
- **Category:** Layout, visual balance
- **Problem:** `RetiredNameDetailsModal.tsx` sets `body: { height: "70vh", overflowY: "auto" }`. For a short record like "Haiyan" (meaning, origin, language, replaced-by) the content fills only the top third and the modal shows a tall empty void below. The reserved "No image" placeholder box adds to the imbalance.
- **Fix:** Use `maxHeight: "70vh"` instead of a fixed `height` so the modal sizes to content and only scrolls when needed. Consider not reserving the image column (or shrinking the "No image" placeholder) when there is no image.

---

### [Medium] Inconsistent color and icon semantics between views
- **Screens:** 30/33 grid, 31_names_list, 32_names_retired, 64_modal
- **Category:** Consistency
- **Problem:** Green means two different things: in the grid/list (`getNameStatusColorClass`) green = "active name", but in the Retired table (`getRetiredReasonColorClass`) green = retirement reason "Language Problem" (`isLanguageProblem === 1`). Likewise the `Flame` icon means "switch to the retired view" as the header toggle but "this name is active" in the list's Retired column (`NameStatusIcon`). The same visual token carries opposite meanings depending on context.
- **Fix:** Reassign the retired-reason palette so green isn't reused for a retirement reason (e.g. use blue/teal for "Language Problem"), and stop using `Flame` as the view toggle — the toggle finding above adopts a `Skull` (all-names → retired) / grid icon (retired → all names), which frees `Flame` to denote only "active" in `NameStatusIcon`. Document the status/reason color system in one shared legend.

---

### [Medium] List view renders all ~140 rows with no pagination, and retirement reason isn't shown
- **Screens:** 31_names_list__desktop.png (very long page), 31_names_list__mobile.png
- **Category:** Density, scannability
- **Problem:** `FilteredNamesTable` and `RetiredNamesTable` both set `pagination={false}`, so the list mode is one continuous ~140-row scroll — the desktop screenshot is nearly 9000px tall. There's no page size control, sticky filters bar, or "jump to letter" while scrolling (letter nav scrolls away at the top). Separately, the Retired filter modal lets users filter by "Retirement Reason", but `RetiredNamesTable` has no reason column — the reason is only encoded as the name's text color, so a user who filters by reason can't see the reason in the results.
- **Fix:** Add optional antd pagination (or virtualized scroll) and/or keep the letter navigation sticky in list mode. Add a "Reason" column (or a labeled tag) to `RetiredNamesTable` so the filterable attribute is visible in results.

---

### [Low] Cryptic parenthetical titles and no "reset to defaults"
- **Screens:** 30/33/34 titles ("All Typhoon Names (Name, Current)" / "(Name, History)" / "(List)"), 62_modal_names_settings
- **Category:** Copy, learnability
- **Problem:** The page title exposes internal mode tuples like "(Name, Current)" and "(Name, History)" (from `getNamesTitle`), which are developer shorthand meaningless to end users. The Display Settings modal also has no "Reset to defaults" affordance, so after experimenting a user must remember the original toggle states.
- **Fix:** Rewrite titles in plain language (e.g. "Typhoon Names — Current Rotation", "Typhoon Names — Full History"), and add a "Reset" button to `NamesSettingsModal` footer alongside Cancel/Apply.
```
