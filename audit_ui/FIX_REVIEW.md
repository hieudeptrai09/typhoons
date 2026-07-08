# Fix Review — commit `aa12635` ("edit the app to fix the ui audit")

Reviewed against the audit by rebuilding the app (production build) and rendering the affected screens. Backend + build are healthy: `next build` compiles and typechecks, all routes return 200, and the new `/active-on-this-day` API route works (proper `break`, no fall-through). Per-finding status tags are also inline in `findings/*.md`.

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
