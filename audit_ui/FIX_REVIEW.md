# Fix Review

Reviewed by rebuilding the app (production build) with the DB up and rendering the affected screens. Per-finding status tags are inline in `findings/*.md`; the gallery's filter bar lets you view them by status. **No regressions** — both build rounds compile + typecheck and all routes return 200.

---

## Round 3 — commits `b0a20fd…bdf8aa0` (3 commits)

**Newly ✅ fixed (verified in the rebuilt app):**
- ✅ **Filter badge "1"** — `activeFilterCount` now counts `selectedStatus` only when `showHistory` is true; the phantom badge is gone.
- ✅ **Intensity legend** — a persistent **`IntensityFooter`** (badge swatch + label + rank for TD/TS/STS/Cat 1–5) is mounted on the Storms dashboard.
- ✅ **Average modal unified + correct copy** — all Average cells (position included) now open the single in-place `AverageModal`, parameterised by a `criteria` prop, so the heading is context-correct ("Storms in position #1 by intensity"). The old two-mechanism split + "at this position" bug are gone.
- ✅ **Info-modal retired parity** — the info modal now shows "Replaced by: Tomo" + a "Contributed by" flag/country (retired conveyed by red skull + red title). *(A literal "Retired" text pill would remove the last bit of colour/shape-only reliance.)*
- ✅ **Position intercept modal removed** — positions are now always the full page; the earlier no-origin "omits Storms" fallback concern is moot.

**🟡 Improved:** the Storms `PositionGrid` gained a mobile **"Swipe right to see full table"** hint (edge fade / sticky first column / header still worth adding). The **Names** `PositionNameGrid` grid is unchanged, so that Names grid finding stays open.

**⚠️ New issues:** none. *(Build compiles + typechecks; all routes 200.)*

---

## Round 2 — commits `54b5adb…df03f19` (5 commits)

**Newly ✅ fixed (verified in the rebuilt app):**
- 🔴→✅ **Retired tab opens empty (Critical)** — `RetiredView` defaults to `getFirstAvailableLetter(...)` and the toggle drops `?letter=A`; the tab now opens on "B" with real names.
- ✅ **Grid cells & search rows keyboard-operable** — new `lib/utils/a11y.ts` (`onEnterKeyDown` / `clickableRowProps`) wired into `GridCell` and the search table. *(Enter only; Space would be a nice follow-up for `role="button"`.)*
- ✅ **`arid-hidden` typo → `aria-hidden`** (the new issue from Round 1).
- ✅ **Distance norm grey** — `#9ca3af` → `#6b7280` (readable + recedes); closes the Round-1 sub-issue.
- ✅ **Broken-image placeholder** — `ImageWithLoader` now shows a gray `ImageOff` glyph instead of "No image" text. *(role/aria + descriptive alt still open.)*
- ✅ **`FrownNotFound` → `FrownError`** with flexible `description` + `onRetry` retry button; error-vs-empty split reinforced.
- ✅ **Unified SearchBar** — home + navbar now share `lib/components/SearchBar` (`variant`), removing the two divergent search components.
- ✅ **Clear page titles** (from the prior title work) confirmed live.

**🟡 Improved but not complete:**
- **`EmptyResults`** now takes an `icon` prop, but not-found callers still don't pass a neutral icon (funnel still shows).
- **Invalid position** — `FrownError` has a Retry now, but `positions/[position]/page.tsx` still routes bad ids to it with "Something went wrong" copy.

**❌ Still open:** filter badge "1"; info-modal retired badge/replacement; no-origin `PositionModal` fallback still omits Storms; letter-nav colour contrast; intensity contrast still ~3.0 (below the ~3.5 target); view-switcher pill state; settings "Reset to defaults".

**⚠️ New issues:** none introduced this round. *(An earlier render showing "Something went wrong" on `/info/yagi` was a stale Next server from a DB-down build, not a code regression — confirmed fine after a clean rebuild.)*

---

## Round 1 — commit `aa12635` ("edit the app to fix the ui audit")

Reviewed against the audit by rebuilding the app (production build) and rendering the affected screens. The new `/active-on-this-day` API route works (proper `break`, no fall-through).

## ✅ Fixed
| Finding | What landed |
|---|---|
| Names all-names↔retired **toggle** (High) | Red `Skull` on all-names + blue `List` on retired, each with a coloured **hint chip**; `aria-label` → "all names"; `Flame` freed for status only. Matches the agreed design. |
| Search **error vs empty** conflation (Medium) | `search/page.tsx` now derives `isError = q && result===null` and passes it separately → `FrownNotFound` (error) vs `EmptyResults` (empty) are correctly split. |
| Search empty **microcopy** "filters" (Medium) | Now query-specific: `No typhoon names match "X". Check the spelling or try a shorter name.` |
| Home **"On this day"/"Useless Facts"** hierarchy/contrast (Medium) | Moved off the hero into a `QuickActionsMenu` (hamburger), per plan; footer gained nav links + a labelled Facebook icon. The old search-box spinner glitch is gone. |

## 🟡 Partial / improved but not complete
| Finding | Progress / what's left |
|---|---|
| Storms **view-switcher** discoverability (Critical) | Pill darkened + hint chip "Click the button above to change view". Discoverability up, but the pill still doesn't show the current view/state or that it holds every mode. |
| **Intensity contrast** on white (High ×2, Storms + Detail) | Ramp darkened (orange `#FF9900`→`#C98600`, 2.1→**3.05:1** on white). Now clears AA-large (3:1) on white but is **~2.8:1 on the real `stone-100` cells** and below the ~3.5 target. Badge-chip route (no-tradeoff) not taken. |
| **Name-text contrast** (High, Names) | active `emerald-600` (**3.45:1**, meets ~3.5), misspelling `amber-600` (~3.2), external `slate-600` (7.6) ✅ — but the **letter-nav palette** (`#22c55e` 2.28:1 etc.) is still low; only annotated in code comments. |
| **Invalid position** error screen (High) | `FrownNotFound` now has a **Retry** button (no longer a dead end), but invalid positions still route to it with the "Something went wrong" copy — wrong "server error" framing for a bad URL remains. |
| **`EmptyResults` flexibility** (Medium) | Search copy fixed; the `FilterX` icon is still hard-coded (no `icon` prop), so the funnel glyph still shows on non-filter empties. |
| **`FrownNotFound`** component | Retry button added; not renamed, message still hard-coded (not a prop). |
| Home **logo** easter egg (Low) | Footer FB icon + nav links added ✅; logo `<a>` still lacks `aria-label`/`rel`. |

## ❌ Not fixed (still open)
| Finding | Note |
|---|---|
| 🔴 **Retired tab opens empty** (Critical) | `RetiredView` still defaults `currentLetter` to `"A"` and the toggle lands on `?letter=A`; "A" has no retired names, so the tab still shows the empty state. **Verified in the rebuilt app** — top priority still open. |
| **Filter badge "1"** (High) | `activeFilterCount` still counts the implicit `selectedStatus="current"`; badge still reads "1" on load. |
| **Grid cells not keyboard-operable** (High) | `GridCell` still `role="button"`+`onClick` with no `onKeyDown`. |
| **Search rows not keyboard-operable** (High) | `onRow` still has no `onKeyDown`. |
| **Retired badge dropped in info modal** (High) | `InfoModal` unchanged (annotated with comments only); no `StatusBadge`/"Replaced by". Owner noted the modal redesign is future work. |
| **Letter-nav colour contrast** (Medium) | Documented in comments, colours unchanged. |

## ⚠️ New issues introduced by the commit
1. **`arid-hidden` typo (GridCell).** The Ctrl+F div switched to `text-transparent` ✅ but the aria attribute is misspelled **`arid-hidden`** instead of `aria-hidden`, so it has no effect — the hidden storm-name string is now exposed to screen readers on *every* grid cell (the exact AT noise the change meant to remove). One-char fix. (Compiles because React just emits it as an inert attribute.)
2. **Distance-norm grey too light.** The `=6` norm is now `#9ca3af` (~**2.3:1** on the cells). Since ~60% of cells show the `6.00y` norm, most numbers are now faint. The "recede" goal is right; use `gray-500`/`gray-600` so it recedes *and* stays readable.
3. **(Not a bug — note)** The commit adds several large explanatory comments documenting duplication (4 different "reds", a header style copy-pasted in 9 modals, 3 copies of status→colour logic) and WCAG ratios. Useful documentation, but the items they describe are annotated, not yet fixed.

## Suggested next batch (highest value, lowest effort)
- Fix the **`arid-hidden` typo** (1 char) and the **retired default letter** (the Critical) — both tiny, high impact.
- Drop `selectedStatus="current"` from the **filter-badge** count.
- Add the shared **`onKeyDown`** helper to `GridCell` and the search `onRow`.
- Bump the distance-norm grey to `gray-600`.
