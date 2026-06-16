# Typhoons Site — UX & Code Improvement Plan

Based on a full audit of the frontend (`fe/src`) and backend (`be`). Goal: same
feature set, but a more coherent, consistent, and maintainable experience.
Ordered roughly by impact-to-effort ratio within each phase.

## Phase 1 — Quick wins (low effort, high visible impact)

1. **Add a global search bar in the navbar.**
   Let users jump straight to a typhoon name or position from any page,
   instead of having to pick the right `/names/*` sub-page first.

2. **Persist view/filter state across reloads.**
   `/names/filter` list-vs-table toggle currently resets on reload. Move it
   into the existing URL-param mechanism (`useURLParams`) like the other
   filters already do.

3. **Add breadcrumbs to the `/names/*` and `/storms` sub-pages.**
   e.g. `Names > Retired > Filtered by Country`. Cheap to add, removes the
   "where am I" confusion from having four separate Names pages.

4. **Explain disabled options in `DashboardModal`.**
   When a View+Filter+Mode combination is disabled
   (`isTableModeDisabled` / `isListModeDisabled`), show a tooltip/caption
   instead of a silently greyed-out control.

5. **Replace bare "—" empty-state cells with a real empty state.**
   Grids in `TagIconGrid`, `StormGrid`, etc. show "—" for empty
   positions with no context. Add a tooltip or short label
   ("no name assigned yet").

6. **Fix navbar active-state path matching.**
   `NavLink`/`DesktopNav` compare `pathName` against routes inconsistently
   (some with trailing slash, some without). Normalize before comparing.

## Phase 2 — Consolidate duplicated components (medium effort, removes the biggest inconsistency)

7. **Merge the two `NameDetailsModal` implementations into one.**
   - `fe/src/components/ui/NameDetailsModal` (simple)
   - `fe/src/app/(navbar)/names/retired/_components/NameDetailsModal`
     (tabbed, with suggestions)
   Make the shared component accept an optional `suggestions` prop/tab so
   every "click a name" interaction across the site looks and behaves the
   same way.

8. **Merge the two `FilterModal` implementations into one configurable component.**
   - `fe/src/app/(navbar)/names/filter/_components/FilterModal.tsx`
     (Name, Country, Language, Tag, Position)
   - `fe/src/app/(navbar)/names/retired/_components/FilterModal/index.tsx`
     (Name, Year, Country, Position, Reason)
   Build one `FilterModal` that takes a config of which fields to render,
   so Current/Filter/Retired all share one filtering UX and one URL-param
   parsing utility (currently duplicated `toArr`/`toStr` logic).

9. **Decide whether `/names/current`, `/names/history`, and `/names` (the
   grid) need to be three separate pages.**
   They overlap heavily (same grid, same modals, slightly different
   default toggles). Likely fix: keep `/names` as the single entry point
   with "Show history" / "Show retired" toggles, and turn
   `current`/`history` into redirects or remove them. This is a product
   decision — flag it to the user before deleting routes.

10. **Pre-fetch instead of fetch-inside-modal.**
    `HistoryModal` fetches `/storms?position=X` only after it opens, and the
    retired-name `NameDetailsModal` fetches `/suggested-names?nameId=X` the
    same way. Kick off the fetch on hover/click of the trigger cell so the
    modal opens with data already loading, and add a timeout + retry/error
    state (none exists today).

## Phase 3 — Mobile & accessibility (medium effort)

11. **Make the 10×14 grids responsive.**
    On small screens, either let users switch to a paginated/list view, or
    collapse to fewer visible columns with a "more countries" expander,
    instead of pure horizontal scroll.

12. **Replace hover-only affordances with tap-friendly ones.**
    `StormMapPopup`/`StormNamePopup` tooltips, and "expand on image" rows in
    `HistoryModal`, currently rely on hover. Add explicit tap targets
    (e.g. an info icon) for touch devices.

13. **Add a legend for color-coded data.**
    Retired-name colors (red/green/amber/purple) and intensity-grid colors
    convey meaning only through color. Add a small legend or text label so
    it isn't color-only.

## Phase 4 — Backend & data layer (lower urgency, but worth scoping)

14. **Add pagination/limit support to `/typhoon-names` and `/storms`.**
    Fine at current data volume, but `be/controllers/*` return full result
    sets with no `LIMIT`/`OFFSET`. Cheap to add now before it becomes a
    real bottleneck.

15. **Return proper HTTP status codes from `be/api.php`.**
    Currently errors surface as generic messages; add 400 for bad params,
    404 for missing IDs, so the frontend's `useFetchData` can distinguish
    "not found" from "server error" instead of collapsing both into
    `FrownNotFound`.

16. **Add `AbortController` cleanup to `useFetchData`.**
    Prevents state updates after unmount when users navigate away mid-fetch
    (`fe/src/containers/hooks/useFetchData.ts`).

## Suggested sequencing

Phase 1 can be done in a single pass (mostly small, independent edits).
Phase 2 is the highest-leverage but touches shared components used across
many pages — do it as its own focused effort, one component at a time
(NameDetailsModal first, then FilterModal), with manual click-through
testing after each merge. Phases 3–4 can happen in parallel once Phase 2
lands, since they don't depend on it.

Not included here: any new features (voting, submissions, etc.) — this
plan only addresses making the existing functionality consistent and
usable. Let's discuss separately if you want to scope new features.
