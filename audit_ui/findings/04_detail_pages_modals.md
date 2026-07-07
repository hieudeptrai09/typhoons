# Detail Pages & Modals — UI/UX Findings

The Position and Name/Info detail pages share a clean card-based layout, but the same data is presented in structurally different ways on the full page versus the intercepting modal, and several error/empty states are misleading or dead-ended. The most serious issues are a "server error" screen shown for perfectly ordinary not-found URLs, intensity-colored numbers that fail WCAG contrast on white, and retired-name status/replacement information silently dropped in the modal.

### [High] Invalid / nonexistent positions render a "server error" screen with no way forward
- **Screens:** 43_position_notfound (desktop+mobile), 42_position_141_cphc (desktop+mobile)
- **Category:** Error handling / Content / Recovery
- **Problem:** `page.tsx` returns `<FrownNotFound />` for an out-of-range position (`!isValidPosition`) *and* for a null fetch result, and `FrownNotFound` hard-codes "Something went wrong. Please try again later." So an invalid id like `/positions/999` and the special CPHC region `/positions/141` both show a transient-error message that invites a pointless retry, when the real situation is "this position doesn't exist / isn't in range 1–140." The two cases (bad input vs. actual server failure) are indistinguishable, and there is no link back to Storms/Names — the only escape is the navbar. For the CPHC/NHC/IMD "Other Regions" surfaced elsewhere in the app (see 66 modal "Other Regions: CPHC NHC IMD"), a numeric deep-link past 140 is effectively broken.
- **Fix:** In `positions/[position]/page.tsx`, call Next's `notFound()` for invalid ids and route them to a dedicated not-found component with correct copy ("Position #999 doesn't exist — positions run 1–140") plus a primary CTA button ("Browse all positions" / "Back to Storms"). Reserve `FrownNotFound`'s "Something went wrong" strictly for genuine fetch failures (null `result`). Decide whether special-region positions are real routes; if so, handle them instead of erroring.

### [High] Intensity-colored numbers/labels fail WCAG AA contrast on white
- **Screens:** 40_position_1, 41_position_27, 50_info_yagi, 51_info_damrey, 66_modal_position_intercept
- **Category:** Contrast / Accessibility
- **Problem:** `TEXT_COLOR_WHITE_BACKGROUND` is used for the large "Overall Avg" / per-group "Avg" figures and for storm names in the position modal list, all on white or `slate-50`. Several of those colors are far below AA even for large/bold text: orange `#FF9900` ("Overall Avg: 2.00" / "1.60") ≈ 2.1:1, TS green `#00BB00` ("Avg: 0.00", "Damrey 2023") ≈ 2.6:1, Cat-1 gold `#CC9900` ("Damrey 2012") ≈ 2.5:1, TD cyan `#0099CC` ≈ 2.8:1. AA requires 4.5:1 (normal) / 3:1 (large). These are core data values, so the failure is on the most information-dense elements.
- **Fix:** Do not use the raw badge palette as foreground on light backgrounds. Either (a) darken a dedicated "on-white" ramp so every entry clears 4.5:1 (e.g. green `#00BB00`→`#047857`, orange→`#B45309`, gold→`#92700B`, cyan→`#0E7490`), or (b) render these values as filled `IntensityBadge`-style chips (colored background + `TEXT_COLOR_BADGE`) which already pass. Applies in `PositionPageContent.tsx` (StormsSection avg spans), `InfoPageContent.tsx`, and `PositionModal.tsx` StormsTab name text.

### [High] Retired status and replacement name are lost in the intercept modal
- **Screens:** 65_modal_info_intercept (desktop+mobile) vs 50_info_yagi (desktop+mobile)
- **Category:** Consistency / Content parity
- **Problem:** The full Yagi page shows three retired signals: red skull icon, a red "Retired" pill, and a "Replaced by → Tomo" row. The intercept modal for the same name shows only the skull icon — no "Retired" text badge, and no replacement. `InfoModal` never renders `StatusBadge`, and passes `hideReplacedBy={!(origin === "names")}` to `NameDetailsContent`, so opening Yagi from search (as here) or from Storms strips the "Replaced by" row entirely. A lone skull is ambiguous (reads as "deadly," not "retired"), so a user peeking via the modal cannot tell the name is retired or what succeeded it.
- **Fix:** Render the same `StatusBadge` (Active/Retired/Misspelling/External) in the modal title area, and stop conditioning `hideReplacedBy` on entry point — a retired name's replacement is always relevant. Reuse `InfoPageContent`'s `StatusBadge` component so page and modal share one source of truth.

### [High] Modal and full page are different presentations of the same data
- **Screens:** 65_modal_info_intercept & 66_modal_position_intercept vs 50/51_info_* & 40/41_position_*
- **Category:** Consistency / Information architecture
- **Problem:** The two surfaces diverge well beyond responsive reflow. Info: the full page is a single stacked scroll (Name Details card + big colored StormCards, no tabs); the modal is *tabbed* (Storms / Name Details), uses a compact storm list with a "Show Map" toggle, and exposes an "Origin" (flag + country) field that the full page's Name Details omits (the page puts country in the header instead). Position: the full page leads with "Names Used" + grouped StormCards + Overall Avg + prev/next pagination; the modal's default tab set is **Names + Average only — there is no Storms tab** (the storm list in screenshot 66 is only reachable via `?origin=storms`), and the info modal's default tabs are Storms + Name Details. So field sets, primary content, and even which tabs exist differ per surface, making the modal feel like a different feature rather than a peek at the same record.
- **Fix:** Define one canonical field list and section order for a name and for a position, then have the modal render a condensed but structurally identical view (same fields, same labels, same status treatment). At minimum, add a "Storms" tab to the default `PositionModal` so its tab set mirrors the page's emphasis, and align the Name Details field set between `NameDetailsContent` (modal) and `NameDetailsSection` (`InfoPageContent`).

### [Medium] Two inconsistent not-found designs; one uses the wrong icon and broken grammar
- **Screens:** 43_position_notfound vs 52_info_notfound (both desktop+mobile)
- **Category:** Consistency / Content / Accessibility
- **Problem:** Invalid position → `FrownNotFound` (frown icon, "Something went wrong…"); invalid name → `EmptyResults` (a `FilterX` funnel-with-x icon, "No typhoon named this was found."). Same class of event (bad URL), two different visual languages. The `FilterX` icon implies "no results match your filters," which is misleading on a direct URL where no filter was applied. The copy is grammatically broken ("No typhoon named this was found." → should read "No typhoon with that name was found."), as is the position empty-slot string "No names have been assigned this slot." Neither state offers a next action.
- **Fix:** Standardize a single not-found component for detail routes (one icon — a neutral search/compass, not a filter), fix the copy, and add a primary CTA ("Search names" / "Browse positions"). Update the string in `InfoPageContent.tsx` (`EmptyResults description`) and the empty-slot text in `PositionPageContent.tsx` NamesSection.

### [Medium] Oversized empty image boxes with a tiny "No image" fallback and inconsistent copy
- **Screens:** 50_info_yagi, 51_info_damrey (both), 40/41_position_* StormCards
- **Category:** Visual design / Placeholder & broken-image handling
- **Problem:** On the info page the portrait column is `flex-1` (equal width to the text column) at a `4/3` aspect ratio, so on desktop it's a ~500px-wide, ~380px-tall box; when the image is absent it shows only 12px grey "No image" centred in a vast empty panel, with no icon or skeleton, reading as unfinished. It also creates a strong height imbalance — the short left column (Meaning/Language) ends far above the tall image box (clearly visible on Damrey, 51). Separately, the empty-state copy is inconsistent: `StormCard` prints "No track map" for a genuinely map-less storm but `ImageWithLoader` prints "No image" on a load error, so the same blank box says two different things. The failed-image fallback is a bare `<div>` with no `role`/`aria`, so it's invisible to screen readers, and image `alt` is just the bare name ("Yagi"), not descriptive.
- **Fix:** Cap the portrait column (e.g. `sm:max-w-xs` / `sm:w-64` instead of `flex-1`) so it doesn't dominate, and give the error/empty state an icon + single consistent label (e.g. an `ImageOff` glyph + "Image unavailable") shared by `ImageWithLoader` and `StormCard`. Give the fallback `role="img" aria-label="Image unavailable"` and make portrait `alt` descriptive (e.g. `${name} name illustration`). Consider `object-cover` on a fixed small frame rather than a large `object-contain` void.

### [Medium] Tabbed modal forces a 70vh body, leaving a large empty scroll area
- **Screens:** 65_modal_info_intercept desktop (Name Details tab)
- **Category:** Layout / Visual design
- **Problem:** Both modals set `styles.body.height` to a fixed `70vh` whenever they're in tabbed (non-single-lens) mode. When the active tab's content is short — e.g. Yagi's Name Details is just Meaning/Origin/Language — the modal still reserves 70vh, producing a big blank void below "Japanese" and an oddly tall dialog. It also means the modal's height jumps between tabs.
- **Fix:** Use `maxHeight: "70vh"` with `overflowY: "auto"` but let height be content-driven (`height: "auto"`, optionally `minHeight`), in both `InfoModal.tsx` and `PositionModal.tsx` `styles.body`. This removes the void and keeps long tabs scrollable.

### [Medium] Prev/next pagination wrap-link looks disabled
- **Screens:** 40_position_1 (desktop+mobile)
- **Category:** Affordance / Consistency
- **Problem:** `PositionPagination` styles the wrap-around link (prev at #1, next at #140) as a muted ghost link (`border-slate-100 text-slate-400`), while the normal direction is a solid blue button. At position #1 the "#140" control looks disabled/greyed even though it is a working link that wraps to the last position; users are unlikely to try it, and there's no hint the sequence loops. The "1 / 140" counter is `text-slate-400`, low-contrast on the grey page background.
- **Fix:** Give both directions equal, clearly-enabled styling (solid or consistent outline buttons) and add a small wrap hint (e.g. a loop icon or "(wraps)" tooltip). Darken the counter to at least `text-slate-600`.

### [Medium] Modal title color encodes a different meaning than the page title
- **Screens:** 65_modal_info_intercept vs 50_info_yagi
- **Category:** Consistency / Semantics
- **Problem:** On the full info page the H1 is colored by *name status* (`getNameStatusColorClass` → red for retired Yagi, green for active). In `InfoModal` the title color for the tabbed view is `avgIntensityColor` (derived from the average storm intensity), so the same name is a different color depending on surface, and the color no longer communicates retired/active status. This undercuts the status signaling that finding #3 already weakens in the modal.
- **Fix:** Color the modal title by name status to match the page (use `getNameStatusColor(nameData)`), or if intensity coloring is intentional, apply it consistently on both surfaces. Pick one semantic for title color across the app.

### [Low] Semantic heading and structure gaps in the modal
- **Screens:** 65, 66 (both)
- **Category:** Accessibility
- **Problem:** The modal title ("Yagi", "#1 Cambodia") is a styled `<span>` rather than a heading element; while antd wires `aria-labelledby`, there's no in-content heading hierarchy for AT users navigating by headings, unlike the pages which use proper `h1`/`h2`. The storm rows in the info modal use `h3` but there's no `h1`/`h2` above them.
- **Fix:** Wrap the modal title span in an appropriate heading (or add `aria-level`), and ensure a logical heading order inside the dialog body.

### [Low] Retired vs. active differentiation is otherwise good but color-only
- **Screens:** 50_info_yagi vs 51_info_damrey
- **Category:** Accessibility / Visual design
- **Problem:** The page differentiates retired (red skull + red title + red "Retired" pill) from active (green flame + green title + teal "Active" pill) well, but the distinction leans heavily on red/green — problematic for red-green color-vision deficiency since the icon shapes (skull vs flame) are the only non-color cue and are small. The text pill ("Retired"/"Active") is the reliable signal and is exactly what's dropped in the modal (finding #3).
- **Fix:** Keep the always-visible text pill on every surface (page and modal), so status never depends on color or a small glyph alone.
