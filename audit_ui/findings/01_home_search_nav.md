# Home, Search & Navigation — UI/UX Findings

Heuristic audit of the JEBI.SE Malakas home page, the `/search` results/empty states, and the global navbar (desktop 1440 / mobile 390). Overall the visual language is clean and consistent. The home page intentionally uses a minimal game/launcher-style layout (logo + primary buttons + search, **no navbar**) — a coherent, deliberate choice (confirmed with the owner), where the buttons and search bar act as the navigation — so the remaining home findings focus on the two divergent search experiences and several text/link colors that fail WCAG AA contrast on the app's light backgrounds.

---

### [Low] Home logo is an unlabeled external link (easter egg) — a footer social icon is more conventional
- **Status:** 🟡 **Partial (aa12635):** a labeled Facebook icon + nav links (Storms/Names/Search/Info/Positions) were added to the footer ✅; the logo `<a>` still lacks `aria-label`/`rel` (unchanged easter egg).
- **Screens:** 01_home__desktop.png, 01_home__mobile.png
- **Category:** Affordance / Accessibility (minor)
- **Problem:** The minimal game/launcher home layout (logo + primary buttons + search, **no navbar**) is an intentional, coherent pattern — the buttons and search bar serve as the navigation, so the earlier "no navbar / navigationally isolated" concern is withdrawn. The one small caveat is the logo itself: it is wrapped in `<a href="https://www.facebook.com/..." target="_blank">` (`page.tsx` lines 14–22), so activating the brand mark ejects the user to an external Facebook page in a new tab with no visual or `aria` cue that it leaves the site. As a hidden easter egg for mouse users this is low-harm (the new tab preserves their place), but a keyboard/screen-reader user hears only a generic "link" and the external jump is a surprise.
- **Fix:** Keep the easter egg if you like it — it is harmless in a new tab. For a discoverable, conventional social link, add a labeled Facebook icon to the footer (the design already has one). If you keep the logo link, add `aria-label="JEBI.SE Malakas — our Facebook (opens in a new tab)"` and `rel="noopener noreferrer"` so the destination isn't a silent surprise for assistive tech.

### [Medium] "On this day" / "Useless Facts" amber links fail WCAG AA contrast (2.78:1)
- **Status:** ✅ **Addressed (aa12635):** "On this day"/"Useless Facts" were moved off the hero into a `QuickActionsMenu` (hamburger), per plan; verify the menu items themselves meet the ~3.5 floor.
- **Screens:** 01_home__desktop.png, 01_home__mobile.png
- **Category:** Contrast / Accessibility
- **Problem:** Both buttons use `text-amber-600!` (#d97706) small semibold text sitting on the `bg-sky-100` (#e0f2fe) home background (`OnThisDay.tsx` / `FunFacts.tsx` line ~52). Measured contrast is **2.78:1**, well below the 4.5:1 AA minimum for normal text.
- **Planned change (agreed with owner):** These two entries will be removed from the hero and relocated into a hamburger / overflow menu on the home page (leaving room for future items). That resolves their cramped placement between the search field and the CTA buttons — the earlier separate "weak visual hierarchy" finding is therefore withdrawn. However, the color token still fails AA on any light menu background, so the contrast fix is still required in the new location.
- **Fix:** Darken to `text-amber-700` (#b45309 ≈ 3.9:1) or `text-amber-800` (passes AA), or use white text on a colored chip, in `OnThisDay.tsx`/`FunFacts.tsx` — wherever the items ultimately render. Usability caveat: a hamburger hides these engagement hooks, so give the menu trigger a clear, high-contrast affordance so the features are still discoverable.

### [High] Search-result table rows are not keyboard-operable
- **Status:** ✅ **Fixed (df03f19):** rows now use `clickableRowProps` (adds `onKeyDown` + role + tabindex + aria-label). Enter works; Space is a minor follow-up.
- **Screens:** 02_search_results__desktop.png, 02_search_results__mobile.png
- **Category:** Accessibility
- **Problem:** In `SearchPageContent.tsx` (`onRow`, lines 131–139) each row is given `role="button"`, `tabIndex: 0`, and an `onClick` that navigates to the storm detail — but there is **no `onKeyDown` handler**. A keyboard/screen-reader user can focus the row (it announces as a button) but pressing Enter/Space does nothing; the only keyboard-reachable target is the inner Name `<Link>`. This is a broken interactive affordance and an AA (2.1.1 Keyboard) failure.
- **Fix:** Add an `onKeyDown` that fires the same navigation on Enter/Space, or drop the row-level `role/tabIndex/onClick` entirely and rely on the Name link (simpler and avoids the nested-interactive pattern where the row and the Name link both navigate).

### [Medium] Two divergent search experiences; home search has no autocomplete and no visible submit
- **Status:** ✅ **Fixed (df03f19):** home and navbar now share one `lib/components/SearchBar` (`variant="home"|"navbar"`); the duplicate components and the autocomplete hook were removed.
- **Screens:** 01_home__desktop.png, 01_home__mobile.png vs 02/03/04 navbar search
- **Category:** Consistency / Affordance
- **Problem:** The home `SearchBar` (`app/(home)/_components/SearchBar.tsx`) and the navbar `SearchBar` (`lib/layout/NavBar/SearchBar.tsx`) are different components with different placeholders ("Search typhoon names..." vs "Search names...") and, more importantly, different behavior: the navbar version shows a live suggestion dropdown (`filtered.slice(0,5)`, "View all results"), while the home version has **no dropdown at all** and only navigates on `onPressEnter`. On the primary landing surface there is no suggestion feedback and no visible Search/submit button — a mobile user who taps the field and types has no on-screen affordance that Enter is required (they must know to press the keyboard "Go"). The weaker search is on the page most likely to be a user's first touch.
- **Fix:** Reuse one search component. At minimum give the home input the same live dropdown, and/or add a visible submit affordance (search-icon button) so the "press Enter" requirement is discoverable, especially on touch.

### [Medium] Empty-state microcopy references "filters" that don't exist on the search page
- **Status:** ✅ **Fixed (aa12635):** empty search now shows `No typhoon names match "X". Check the spelling or try a shorter name.`
- **Screens:** 03_search_no_results__desktop.png, 03_search_no_results__mobile.png
- **Category:** Empty state / Microcopy
- **Problem:** A zero-result search renders `EmptyResults` with its default text "No typhoon names match your current filters. Try adjusting your search criteria." (`SearchPageContent.tsx` line 118 → `EmptyResults/index.tsx`). The `/search` page has **no filter controls** — the user can only change the free-text query — so "filters" and "criteria" are borrowed from the Names page and are misleading here. The user is told to adjust something that isn't on screen.
- **Fix:** Pass a query-specific `description`, e.g. `No typhoon names match "{query}". Check the spelling or try a shorter name.` Echoing the actual query also confirms what was searched.

### [Medium] Error and no-data states are conflated behind a generic "Something went wrong"
- **Status:** ✅ **Fixed (aa12635):** `search/page.tsx` now derives `isError = q && result === null` and passes it separately; `FrownNotFound` (error, with Retry) vs `EmptyResults` (empty) are now correctly split.
- **Screens:** 02/03 search (state logic)
- **Category:** Error state / Feedback
- **Problem:** In `SearchPageContent.tsx` line 108, `query.trim() && results === null` renders `FrownNotFound` ("Something went wrong. Please try again later."). `results` is null both on a real fetch failure and whenever the API returns no `data` for a valid query (`page.tsx` line 21 passes `result?.data ?? null`). So a legitimately empty/edge query can surface a scary "something went wrong" error instead of the friendlier empty state, and true errors give no retry action.
- **Fix:** Distinguish transport errors from empty results (e.g. a discriminated fetch result). Route genuine emptiness to `EmptyResults` (with suitable, non-"filter" copy and icon), and reserve the error component for real failures — giving it an actionable Retry/reset button rather than a dead end. This is the same error-vs-empty component split called out in the Detail-pages findings (rename `FrownNotFound` → `ErrorState` with a `reset` button; make `EmptyResults` icon/text flexible).

### [Medium] Mobile results table hides Storms / Replacement / Note behind horizontal scroll with no affordance
- **Status:** ✅ **Fixed (keep-table affordance):** the results table keeps the list layout on mobile (better for comparing rows) and is now navigable — `sticky` header, `fixed:"left"` `#`/`Name` columns, sortable headers, and a mobile "Swipe right to see full table" hint so the off-screen Storms/Replacement/Note columns are discoverable.
- **Screens:** 02_search_results__mobile.png
- **Category:** Responsive
- **Problem:** The results table uses `scroll={{ x: "max-content" }}` with 7 columns. On 390px only #, Name, Country, Status fit; Storms ("x5"), Replacement ("Tomo") and Note are off-screen to the right (compare the desktop shot, which shows them). There is no scroll shadow, chevron, or hint that more columns exist, so mobile users will likely believe the row has only 4 fields. Sort arrows in the header are also tiny touch targets.
- **Fix (per owner — keep the table on mobile):** The owner keeps the list/table layout on both breakpoints (better for comparing rows), so on mobile keep the horizontally-scrolling table and make it navigable — it already has a `sticky` header, `fixed:"left"` `#`/`Name` columns, and a "Swipe right →" hint. Sorting stays global over the full result set (client-side) via the sortable column headers; a right-edge scroll fade would fully finish the affordance.

### [Low] The reported "white circle" over the search input is the low-contrast prefix icon, not a spinner
- **Screens:** 01_home__desktop.png (zoomed)
- **Category:** Contrast / Affordance
- **Problem:** Zooming into the home input shows no stray spinner — the faint circular shape at the input's left edge is the lucide `Search` magnifying-glass prefix rendered in `text-gray-400` (#9ca3af), which is **2.54:1** on white and reads as a washed-out ring. I confirmed the home `SearchBar.tsx` renders no `TyphoonSpinner` (only `FunFacts`/`OnThisDay` do, and only while their own buttons load), so there is no genuine overlapping-spinner bug — just a very faint, ambiguous search glyph.
- **Fix:** Darken the prefix icon to `text-gray-500`/`text-slate-500` so the search affordance reads clearly (icons need ≥3:1). No spinner code change needed.

### [Low] `/search` no-query state and its gray text are inconsistent and low-contrast
- **Screens:** 04_search_no_query__desktop.png, 04_search_no_query__mobile.png
- **Category:** Empty state / Contrast
- **Problem:** Reaching `/search` with no `q` shows a bare centered "Type a name to search" in `text-gray-400` (`SearchPageContent.tsx` line 116). On the stone-100 page this is **2.33:1** — fails AA — and the plain text is visually inconsistent with the richer antd `Empty` illustrations used for the no-results and error states on the very same page.
- **Fix:** Use the same `Empty` component (with a search icon) for parity, and darken the guidance text to at least `text-gray-500` (≈4.4:1) or `text-gray-600`.

### [Low] Redundant triple ARIA labeling on nav and menu links
- **Screens:** 02/30 navbar, 01 home CTAs
- **Category:** Accessibility
- **Problem:** `NavLink.tsx` applies `aria-label` on the `<Link>`, again on the inner antd `<Button>`, and also renders the visible text label; `Menu.tsx` repeats the pattern (Link `aria-label` + Button `aria-label` + text). Screen readers get the same label announced redundantly and the visible text is overridden by an identical `aria-label` for no benefit.
- **Fix:** Keep the visible text as the accessible name and drop the duplicate `aria-label`s (only add one where there is no visible text, e.g. the icon-only hamburger, which already does this correctly in `MenuToggle.tsx`).
