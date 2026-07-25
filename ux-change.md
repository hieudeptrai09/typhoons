# UX Review: /names and /storms

Advice from a design review session (2026-07-24). Overall verdict: **the data model and URL
design are genuinely good; the main weakness on both pages is that features are hidden behind
unlabeled icon buttons and a modal, and that content choices are mixed together with display
preferences.**

---

## Top 3 priorities (if nothing else)

1. **Turn /names scope into visible `Current | History | Retired` tabs** (replaces the skull
   toggle and the "Show History" switch).
2. **Put the /storms view switcher on the page with labels** instead of behind the icon-only
   purple button.

All three address the same root issue: the site's content is rich and well-modeled, but the UI
asks visitors to already know what's there.

---

## 1. Organization of /names

### Current problems

- Three dimensions are collapsed into one control cluster:
  - **Content scope** — Current names / Full history / Retired names
  - **Layout** — Grid (position table) / List (detail table)
  - **Display preferences** — letter nav, names vs. tag icons, color-by-reuse, images in list
- Scope is split between the skull toggle (`NamesView.tsx`) and the "Show History" switch
  buried inside the Settings modal (`NamesSettingsModal.tsx`). "What am I looking at" is decided
  in two unrelated places, one behind a gear icon that users expect to hold cosmetics.
- The skull toggle has classic toggle ambiguity: does the skull mean "you are viewing retired
  names" or "click to view retired names"? The permanently-`hidden` hint pills in the code are
  the tell — when a control needs a hint pill to explain itself, the control is the problem.

### Recommendations — one control per dimension, ranked by frequency of use

1. **Scope as visible tabs/segmented control at the top: `Current | History | Retired`.**
   These are the three "pages within the page," and the URL scheme already models it exactly
   (`/names/`, `/names/history/`, `/names/retired/`). The UI should mirror the URLs. This
   removes the skull button, removes "Show History" from settings, and makes the retired
   section discoverable — today a visitor would never guess a skull icon leads to a whole
   retired-names feature with suggestion data.
2. **Layout as an inline two-icon toggle (grid/list) next to the tabs**, not a radio group
   inside the settings modal. Switching layout is a frequent, low-stakes action; today it costs
   open-modal → radio → Apply. (The storms DashboardModal already does this pattern well with
   Segmented + icons.)
3. **Filter button with badge — keep as is.** The modal is fine for filtering; the
   active-count badge is good.
4. **Settings gear holds only true preferences**: letter navigation, names-vs-tag-icons,
   color-by-reuse, images-in-list. Once scope and layout move out, this modal becomes small and
   honest.

### Smaller items

- **"Show Name" is really a view mode, not a setting.** Names-off/tag-icons-on is a delightful
  "browse by category" mode (the icon legend under the grid is nice) — but nobody will find it
  under a switch called "Show Name". Rename it for what it gives you ("Show category icons
  instead of names"), or make it a third layout option.
- **Retired names are reachable two ways with different presentations** — the Retired tab and
  `status=retired` in the list filter. Acceptable, but make the Retired tab the canonical
  destination and consider having the filter's retired status link there.

---

---

## 3. Organization of /storms

The organizing principle, stated explicitly: /storms has a clean three-level hierarchy —

1. **View** (what analysis: Storms / Highlights / Average / Gap)
2. **Group-by** (analysis axis)
3. **Display mode** (grid / list)

— and the URL scheme (`/storms/{view}/{filter}/list` in `storms/_utils/fns.ts`) already encodes
exactly that hierarchy. The "most logical organization" doesn't need to be invented; it's making
the visible controls mirror the URL hierarchy, with prominence matching level:

- **View as labeled tabs** (primary — it changes what the page _is_)
- **Group-by as a segmented control** (secondary)
- **Grid/list as an icon toggle** (tertiary)

The DashboardModal already has all three rows built; they just live one click too deep and are
apply-gated.

**URL wrinkle:** the legacy alias slugs (`/list`, `/names`, `/positions` as shortcuts into the
storms view) make the storms view's addressing inconsistent with the other three views. Fine for
SEO/back-compat, but treat `storms/name` / `storms/position` as the canonical mental model and
keep the aliases as redirects only.

### /storms for the average user — priority order

1. **Lift the three modal sections onto the page as an inline control bar.** The current entry
   point — a purple button showing three icons separated by slashes — is unreadable to anyone
   but the author. A first-time visitor cannot know (a) that it's the way to change views,
   (b) what any icon means, or (c) that Highlights, Average, and Gap even exist. Apply
   immediately on click; exploration should cost one click, not modal → three choices → Apply.
   On mobile, collapsing back into the modal is a reasonable fallback.
   - Side benefit: the view/filter/mode interdependencies (country and month are list-only,
     storms-by-position is grid-only) become self-explanatory when the disabled option is
     visible in context, instead of a mysteriously grayed segment in a modal.
2. **Default view: consider names-list for newcomers.** The position grid is the signature
   power-user visualization, but a first-timer understands a sortable table of names
   (`/storms/list/`) far more readily than a 10×14 numbered grid. At minimum, the grid needs
   the legend visible on arrival.

---

## 4. /names for the average user

1. **/names has no legends, and it needs them more than /storms does.** /storms ships
   IntensityLegend and GapLegend, but on /names an average user sees names colored by status
   (`getNameStatusColorClass`), letter-nav letters colored blue/red/green by retired/active mix,
   and optionally reuse-count colors — with no key anywhere for any of them. The tag-icon legend
   under the grid proves the pattern is known; status colors deserve the same treatment.

---
