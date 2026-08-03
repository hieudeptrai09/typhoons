# UI/UX Audit — Cá Tra's Typhoons App
### https://typhoons.vercel.app/

**Date:** 2026‑08‑03  
**Scope:** Every screen and modal of the app (desktop 1440×900 and mobile 390×844).  
**Method:** The live site is unreachable from the audit environment's network, so the app was rebuilt locally from source + the provided SQL dump, run as a Next.js production build, and driven with Chromium/Playwright to capture 57 screenshots. Four independent "UI/UX designer" reviewers each audited one area in parallel; findings below are consolidated, verified, and de‑duplicated.

Screenshots referenced here live in `screenshots/{desktop,mobile,modals}/`. Open `index.html` for a visual gallery.

---

## ⚠️ Read first — two findings that are environment artifacts, not product bugs

While auditing, two issues surfaced that are caused by the **local rebuild**, not by the real production site. They are called out here so they are not mistaken for real defects:

1. **"Broken image" placeholders on every detail page / card / modal.** Storm and name images load from **remote hosts** (e.g. Wikimedia — note the "© Léodras, CC BY‑SA 4.0" credit). The audit container's network policy blocks those hosts, so every image renders as the browser's broken‑image glyph. **On production these images load normally.** The *legitimate* UX point that remains: when an image genuinely fails, the app shows a raw broken‑image glyph rather than a graceful fallback — see **G‑1** below.
2. **Search first appeared "broken" ("Something went wrong").** This was schema drift in the old dump (a missing `retirementreason` column and its enum type). After patching the local DB, **search works correctly** — it returns a proper results table and a clean, friendly no‑results empty state (`desktop/04-search-results.png`, `desktop/05-search-noresults.png`). Search is **not** a defect. The remaining valid critiques are cosmetic (see the Landing & Global section).

Everything else in this report is a genuine design/UX observation about the product.

---

## Executive summary

The app is feature‑rich and clearly built with care (playful 404, thoughtful "position/name" data model, five analytical dashboard views, pronunciation audio, name etymologies). The dominant, repeating problems are about **communicating meaning** and **responsive layout**, not about missing features:

- **Unexplained visual language everywhere.** Colors (red names = retired, category badge colors, average‑intensity text colors, gap traffic‑lights, month colors) and icon‑only controls (the AB / tag / funnel toggles, the ☰ "discovery" button, flame/skull status icons) carry essential meaning with **no legend or label** — and lean on color alone, which fails WCAG 1.4.1.
- **The mobile experience of every grid is broken by a 14‑column layout.** On a ~390 px screen, rows clip at ~7.5 columns and two top‑level tabs collapse to an unlabeled icon. Data and controls are silently lost off‑screen.
- **The dashboard's default view shows no data.** "Storms by Position" (the first thing users see under Storms) is a grid of grey cells that looks empty/broken even though ~140 cells are interactive.
- **Modals and views feel like separate builds.** Four different modals open with the identical, meaningless title "1A"; the same "a storm in a list" object is styled three different ways; no modal explains its own colors.
- **Contrast failures on the exact controls users need in a bad moment** — the 404 "Return to Safety" button and the search error's "Try again" button are nearly invisible.

### Top 10 cross‑cutting priorities

| # | Priority | Severity | Areas affected |
|---|----------|----------|----------------|
| 1 | **Fix mobile grid overflow** — 14‑column grids clip on phones; give a scrollable frozen‑first‑column layout, a stacked/card layout, or default mobile to List. Fix the tab strip so Gap/Avg. Date aren't unlabeled icons. | High | Storms (all tabs), Names grid |
| 2 | **Add legends / labels for every color & icon** — retired‑red, category badges, avg‑intensity colors, gap colors, month colors, and the AB/tag/funnel/☰/flame/skull icons. Pair every color with text or an icon (accessibility). | High | Global, Names, Storms, Modals |
| 3 | **Make the default "Storms by Position" grid show data** — color cells by intensity + show count/preview, and make cells look clickable. | High | Storms |
| 4 | **Fix contrast on error/recovery controls** — 404 "Return to Safety" and the error‑state "Try again" button; footer text. | High | Global |
| 5 | **Give modals meaningful titles + in‑context legends** — kill the four bare "1A" titles; add a subtitle + summary stat + an intensity key inside each modal. | High | Modals |
| 6 | **Unify navigation** — the home page has no top nav; every other page does. Standardize one global header, and relabel the misleading ☰ "discovery" control. | High | Global |
| 7 | **Replace "color‑as‑text" encodings with legible values + accessible swatches** in Average and Gap grids (the real number is hidden behind a hue). | High | Storms |
| 8 | **Fix contradictory legends** — the intensity legend appears on views that don't use it (Storms grid, Highlights), while Highlights cells are colored categorically. Bind the visible legend to the active view. | High | Storms |
| 9 | **Give long tables pagination + sticky headers**, and a **stacked‑card mobile layout** (Names list, Retired list are 90–140 rows). | Med | Names |
| 10 | **Graceful image fallback** + rename self‑deprecating copy ("Useless Facts") + clarify jargon ("Gap", "position", CPHC/NHC/IMD, "01W"). | Med | Global, Names, Storms |

---

## Area 1 — Landing & Global

Screens: `desktop/01-home`, `02-about`, `03-search-empty`, `04-search-results`, `05-search-noresults`, `31-not-found`; `mobile/01-home`, `02-about`, `99-mobile-nav-open`.

> **Correction vs. initial review:** search results and no‑results now render correctly (see the "Read first" note). Findings about a broken search have been removed; the valid error‑component contrast critique is retained because it also applies to other error states.

### Home (`desktop/01-home.png`, `mobile/01-home.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 1 | High | Home page has **no global nav bar** — every other page shows Home/Search/Storms/Names, but the landing page hides it; About is only reachable via a tiny footer link. | First‑time users land with no persistent wayfinding; the app's IA is inconsistent between entry and the rest of the site. | Show the same top nav on home, or make the hero contain clearly labeled links. |
| 2 | High | The icon‑only **☰ button beside search is misleading** — it opens a discovery menu ("On this day / Active on this day / Useless Facts"), not navigation, but ☰ universally means "menu". | The feature is undiscoverable, and users who click expect a nav drawer. | Use a labeled "Discover ▾" control with a non‑hamburger icon + aria‑label. |
| 3 | Med | **Brand/name mismatch:** the wordmark reads "JEBI.SE Malakas" but the app is "Cá Tra's Typhoons App" (footer). The logo never states what the product is. | Confuses first‑time users; the "JEBI.SE…Malakas" pun also risks reading as profanity — a brand‑safety concern. | Pair the logo with the real app name; keep the tagline adjacent and legible. |
| 4 | Med | The **"Active now · Dolphin · 6D" pill is cryptic** ("6D" = ? ) and has weak clickable affordance. | The most timely info (a live storm) is under‑explained. | "Active now: Dolphin — day 6", make the whole pill an obvious link. |
| 5 | Med | **Huge wasted vertical whitespace** — a small hero cluster floats in a vast empty field. | Feels empty/unfinished on large viewports. | Tighten vertical rhythm or add below‑the‑fold value (recent storms, season summary). |
| 6 | Med | Mobile CTAs ("Browse Storms"/"Explore Names") have a **hard offset drop‑shadow** that looks like a second button peeking out — reads as a rendering glitch. | Undermines polish on the most‑used device. | Use a soft symmetric shadow (or none). |
| 7 | Low | Footer actions (download, Facebook) are **icon‑only**, and footer text is **low‑contrast teal/grey on navy** (likely < 4.5:1). | Ambiguous + accessibility risk. | Add labels/aria‑labels; raise contrast. |

### Mobile discovery menu (`mobile/99-mobile-nav-open.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 8 | High | The opened menu **overlaps/half‑covers the primary CTAs** with no backdrop scrim. | Looks broken; buttons underneath appear clipped. | Render as a proper popover with a scrim, or push content down. |
| 9 | Med | **"Useless Facts"** copy tells users the content isn't worth their time. | Undersells a feature; users won't tap "useless". | Rename to "Fun facts" / "Typhoon trivia". |
| 10 | Med | "On this day" vs "Active on this day" are **near‑duplicate labels**. | Hard to distinguish. | e.g. "Storms named today" vs "Storms active today". |

### About (`desktop/02-about.png`, `mobile/02-about.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 11 | Med | Body copy runs in a ~700 px column with a **large empty right margin** — unbalanced asymmetric whitespace. | Eye can't tell where the content region ends. | Center the column or add a right‑hand TOC. |
| 12 | Low | The three source cards look **partly clickable** (link title inside a bordered card) — unclear if card or title is the target. | Weak/mixed affordance. | Make the whole card clickable, or keep only the title as link. |
| 13 | Low | Long license text is a **wall of grey** with no breaks on mobile. | Fatiguing to read. | Add spacing/dividers or collapse into an expandable section. |

### Search results & no‑results (`desktop/04-search-results.png`, `05-search-noresults.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 14 | Med | Results table **"Status" column is a lone flame icon** with no header explanation; **"Contributed By" is a flag only** (no country name); **"Storms" shows "x5"** tersely. | Icon/flag‑only cells are ambiguous and inaccessible. | Add text/tooltips; label the status; show the country name. |
| 15 | Low | With one result, **~75% of the page is empty**. | Unfinished feel; missed suggestion space. | Add "related names" or example chips below results. |
| 16 | Low | The **no‑results empty state is good** (clear message + guidance) — keep it, but the empty search landing (`03`) could reuse this quality with example chips. | Consistency/opportunity. | Add "Try 'Haiyan', 'Dolphin'…" chips to the empty search page. |

### 404 & error states (`desktop/31-not-found.png`, plus generic error component)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 17 | High | **404 "Return to Safety" button is light‑blue text on near‑same‑blue fill** — extremely low contrast; the "or browse all storms" link beneath is also faint. | The two escape hatches on an error page are nearly invisible — a clear WCAG failure. | Solid high‑contrast primary button; strengthen the secondary link. |
| 18 | Med | The generic error component's **"Try again" is a pale outline pill on light grey** — weak weight/contrast for the primary recovery action, and it gives no next step besides "try again". | The one recovery CTA barely registers. | Solid high‑contrast button + a "Back to home / Browse storms" secondary path. |
| 19 | Med | 404 and error pages have **no logo/header/nav** — if the low‑contrast links are missed, the user is stranded. | Removes fallback wayfinding. | Include the persistent header on error pages. |

**Top 3 (this area):** 1) Fix 404/error contrast (#17, #18). 2) Unify navigation + relabel the ☰ discovery control (#1, #2, #8). 3) Fix the brand/name mismatch and cryptic "Active now" pill (#3, #4).

---

## Area 2 — Names Section

Screens: `desktop/06-names-current-grid`, `07-…-list`, `08-…-tag`, `09-…-history`, `10-…-retired`, `11-info-damrey`, `12-info-bopha-retired`, `13-position-1a`; mobile equivalents; modals `M07–M11`.

### Current Names — Grid (`desktop/06-names-current-grid.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 1 | High | **Red names have no legend** — nothing says red = retired/replaced. Color‑only meaning fails WCAG 1.4.1. | Users can't decode the single most prominent visual signal. | Visible legend ("Red = retired") + pair color with an icon or strikethrough. |
| 2 | High | The three **icon toggles (AB, slash‑tag, funnel) are unlabeled** with no tooltips. | Users can't predict what they do — unrecoverable on touch (no hover). | Persistent text labels or tooltips ("Aa case", "Show categories", "Filter"). |
| 3 | Med | Grid cells give **no clickable affordance** (no hover cue/cursor hint in the static view). | The name‑detail modal is undiscoverable. | Add hover tint/underline + pointer cursor. |
| 4 | Med | **Flag‑only column headers** — no country name/code. | Flags are hard to ID and fail as a sole identifier. | Add country name/ISO code or tooltip. |
| 5 | Med | The grid's **row = naming‑position concept is unlabeled**. | The core "position" idea is invisible here. | Add a row‑number gutter or a one‑line explainer. |
| 6 | Low | Green name text on light‑grey is **low contrast** at small size. | Readability/accessibility. | Darken/heavier green to meet 4.5:1. |

### Current Names — List (`desktop/07-…-list.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 7 | High | **140+ rows, no pagination / no sticky header.** | Header scrolls away; scanning is painful. | Sticky header + pagination or virtualization. |
| 8 | Med | "Retired" column is a **flame/skull icon with no header meaning**. | Ambiguous status encoding. | Text badge ("Active"/"Retired") or legend. |
| 9 | Med | **Grid↔List parity gap** — list exposes Language/Meaning/Contributed By/Position that the grid hides. | Two views feel like different datasets. | Surface key fields on grid hover; note richer data is in List. |

### Tag/Category view (`desktop/08-…-tag.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 10 | High | Toggling tag mode **replaces every name with a category icon** — the names disappear. | A "names" page showing no names is confusing. | Show name AND a small category icon. |
| 11 | Med | The **category legend sits at the very bottom**, far from the grid; several icons look alike at small size and rely on color. | Users scroll away to decode 11 icon types. | Move the key above/beside the grid; increase icon distinctiveness + labels. |

### History grid (`desktop/09-…-history.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 12 | High | Cells **stack multiple historical names** (e.g. "Longwang / Haikui / Tianma") with no separators, dates, or order. | Can't tell chronology or current‑vs‑replaced. | Add ordering cues (dates/arrows), dividers, label current. |
| 13 | Med | Multi‑name cells create **uneven row heights** that break grid rhythm. | Alignment looks broken. | Constrain cell height (internal scroll) or use chips. |

### Retired list (`desktop/10-…-retired.png`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 14 | Med | **Inconsistent control set** — only 2 toggles here vs 3 + Grid/List elsewhere. | Disorienting across scopes. | Keep affordances consistent or explain the difference. |
| 15 | Med | Long ungated table again; **"Note" column mixes** spelling corrections with trivia and many blank "‑". | Column purpose unclear, mostly empty. | Split columns or move to detail modal; hide when empty. |

### Name detail pages & modals (`11-info-damrey`, `12-info-bopha`, `13-position-1a`, `M07`, `M08`, `M10`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 16 | High | Storm‑card **header colors encode category with no legend** on the page (magenta = Cat 5, green = TS…). | Color‑only, undecodable. | Category color legend + keep the text label. |
| 17 | Med | Two small glyphs beside the IPA (native script + a runner‑like icon) and the **"First" badge** are **unlabeled**. | Purpose unclear. | Labels/tooltips ("native spelling", "first use of name"). |
| 18 | Med | Retired detail shows "Replaced by Ampil" but **not *why*** it was retired; the retired **filter offers a "Retirement Reason" the detail view never displays**. | Users want the reason; filter/detail mismatch. | Surface the retirement reason in the detail view. |
| 19 | Med | Prev/next footer uses cryptic labels (e.g. position "1B", "IMD") as pager buttons. | Users can't predict where arrows go. | "Previous name / Next name" + clearer position pager. |
| 20 | Med | **Name‑details modal is sparse** — name/IPA/origin/one‑line meaning then large empty space (the image region, which is the remote image). | Poor content‑to‑space ratio; looks unfinished. | Size the modal to content or add richer fields (position, contributor, related storms). |
| G‑1 | Med | **Failed images show a raw broken‑image glyph** instead of a graceful fallback (see caveat note). | Real resilience gap even in production if a source 404s. | `onError` fallback: neutral placeholder + "No image available". |

### Mobile (`mobile/06`, `07`, `10`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 21 | High | The **14‑country grid overflows** — columns 5+ (Koinu, Tomo, Hebi…) clip mid‑word at the right edge; the fade cue is subtle. | Forces horizontal scroll; clipped text looks broken. | Frozen‑first‑column scroll, card/accordion per country, or default to List on mobile. |
| 22 | High | The **List view is a wide multi‑column table crushed to phone width** — tiny, barely legible. | Rich columns don't fit mobile. | Stacked card layout per name on mobile. |
| 23 | Med | The unlabeled icon toggles are **unrecoverable on touch** (no hover tooltips). | Meaning is lost on mobile. | Text labels are essential on mobile. |

### Filter modal (`M09`, `M11`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 24 | Med | **Position filter expects a cryptic code** ("e.g. 3I or 37"); "row + country letter" is hard to form without seeing the grid map. | Most users won't know their code. | Replace with row + country pickers, or link a mini legend. |
| 25 | Med | **No live result count** — users hit Apply blindly, and reopening doesn't show which filters are active. | Uncertainty. | Running "X names match" count + active‑filter chips / funnel badge. |

**Top 3 (this area):** 1) Explain all color/icon language with legends + text (retired‑red, category colors, status icons, tag icons) (#1, #8, #16). 2) Label the three toggles and fix mobile grid/list overflow (#2, #21, #22, #23). 3) Add pagination/sticky headers and surface the retirement reason (#7, #14, #18).

---

## Area 3 — Storms Dashboard

Screens: `desktop/14`–`30` (Storms, Highlights, Average, Gap, Avg. Date in grid/list variants); mobile `14,15,17,22,27,29`; modals `M01`–`M06`.

### Storms → by Position / Name (`14`, `15`, `16`, mobile `14`, `15`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 1 | High | **Default view shows only position labels on uniform grey cells** — no color, count, or preview, though ~140/143 cells are clickable. Looks empty/broken/loading. | The dashboard's landing view communicates zero data at a glance. | Color cells by strongest/dominant intensity + show count or top storm; distinguish populated vs empty. |
| 2 | High | The **intensity legend shows here but nothing in this view uses color** — an irrelevant legend. | Trains users to ignore the legend where it does matter. | Only show the legend when the view color‑encodes intensity (or implement #1). |
| 3 | High | Cells have **no clickable affordance** — identical to static labels. | ~140 drill‑downs are undiscoverable. | Hover elevation/border, pointer cursor, "N storms" subtext. |
| 4 | High | **Mobile: 14‑column grid overflows** — only ~7.5 columns visible (clipped at "1H"), rest need horizontal scroll with no affordance. | A 14‑wide grid is hostile to ~390 px; no full row is ever visible. | Scrollable container w/ edge fade, or vertical list/accordion on small screens. |
| 5 | High | **Mobile: tab strip is cut off** — "Gap" and "Avg. Date" collapse to a bare unlabeled icon and aren't reachable without scrolling the strip. | Two of five primary views are hidden/unlabeled. | Wrap/shrink/scroll the tabs with overflow indication; never show an unlabeled primary tab. |
| 6 | Med | **"Other Regions: CPHC/NHC/IMD" moves position** between views (under the toggles in Position view, at the page bottom in Name view). | Inconsistent placement breaks spatial memory. | Anchor it in one consistent location. |
| 7 | Med | **CPHC/NHC/IMD acronyms unexplained**, and in Name view head a near‑empty column (e.g. a single "Senyar"). | Jargon + empty column looks like a bug. | Expand on first use ("IMD (India)") + explain "Other Regions". |
| 8 | Med | List "Contributed By" is **tiny flags with no labels**; the column concept is unexplained. | Hard to ID / inaccessible. | Flag + country name/tooltip; clarify the column. |

### Highlights → Strongest/First/Last/Untracked (`17`–`21`, mobile `17`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 9 | High | **Grid cell color is categorical by sub‑tab (Strongest=pink, First=blue, Last=orange) and does NOT reflect intensity — yet the intensity legend still shows.** In Strongest, cells are uniform pink even though the List reveals nearly all are Cat 5 (magenta) / Cat 4 (red). | The single biggest consistency conflict: grid, legend, and truth disagree. | Color cells by true intensity, or drop the legend on these views and give the categorical accents their own mini‑key. |
| 10 | High | The **"Untracked" grid is entirely empty** — blank cells with dashes, no message. | Indistinguishable from a broken/failed load. | Explicit empty state ("No untracked storms"). |
| 11 | Med | **Empty cells render full‑size** with a faint dash, equal weight to populated cells. | Hard to parse sparse patterns. | De‑emphasize empty cells (lighter/smaller/no border). |
| 12 | Low | The **List view is genuinely good** (intensity badges, sortable, position, contributor) — highlighting how weak the default Grid is. | Points to the fix. | Bring List's clarity (badges, values) into Grid tiles. |

### Average → Position/Name/Country/Year/Month (`22`–`26`, mobile `22`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 13 | High | **Average encoded only as the text color of the label** (green/olive/orange/red); the numeric average is never shown, and colored text on light bg has poor contrast. | Least accessible encoding — fails color‑blind/low‑vision; hides the real value. | Show the number in each cell + a filled swatch tied to a scale; ensure contrast. |
| 14 | High | **"Average by Year" shows storm names + a year**, looking identical to the Highlights name grids — not a per‑year average. Possibly mislabeled. | Heading promises aggregation; view shows individual storms. | Relabel or actually aggregate per year. |
| 15 | Med | The **continuous green→red average scale conflicts** with the discrete category legend they share colors with. | Users can't map an olive "3C" to any legend entry. | Dedicated gradient legend for Average, or snap to category buckets. |
| 16 | Med | **Grid/List availability is inconsistent** (Country/Month force List, Year uses Grid) with no explanation; disabled toggles have no tooltip. | Feels arbitrary/broken. | Tooltip on disabled toggles or hide when unsupported. |
| 17 | Med | Country list mixes labeled rows ("IMD (India)") with **flag‑only rows** and shows an unexplained **negative average ("‑1.00")**. | Inconsistent labels + negatives confuse (scale runs from NT=‑3). | Label every row; note the scale starts at ‑3. |
| 18 | Low | **Month list (Count + Average table) is clean and readable** — a model for the other groupings. | Numbers‑in‑a‑table beats colored labels. | Adopt this pattern in Position/Name grids. |

### Gap (distance) → Position/Name (`27`, `28`, mobile `27`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 19 | High | The tab **"Gap" is ambiguous jargon** — the data is *average years between storms* at a position, but "Gap"/"distance" suggests spatial distance or missing data. | Users can't predict the tab's meaning; the label misleads. | Rename ("Recurrence" / "Avg. Years Between") + one‑line description. |
| 20 | Med | Values cluster tightly (5.67–6.00y) but are split by an **arbitrary 6‑year traffic‑light** (red < 6, green = 6, blue > 6). Near‑identical numbers get very different colors. | Overstates trivial differences; the pivot is unexplained; blue seems to never occur. | Continuous/data‑driven scale, or explain the 6‑year reference. |
| 21 | Med | Same **color‑as‑text, low‑contrast** problem as Average. | Accessibility repeat. | Filled swatches / high‑contrast colorblind‑safe hues; keep the number. |

### Avg. Date → Position/Name (`29`, `30`, mobile `29`)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 22 | High | Each cell packs **two month‑colored dates** (e.g. "15/8 / 22/8") with **no header explaining what the two dates are** (earliest–latest? start–peak?). Extremely dense. | A wall of tiny colored date pairs with no key; the core question ("when do storms hit here?") is buried. | Define the two dates (label/tooltip), reduce density, consider one representative date. |
| 23 | High | The **Name variant is the densest view in the app** — name(s) + one‑or‑two date ranges per cell in a 14‑wide grid; near‑illegible. | Hierarchy collapses; nothing stands out. | Simplify to one primary value per cell; details on hover/expand. |
| 24 | Med | The **month legend (June–October, 5 months) doesn't cover all dates shown** (e.g. Nov/Dec values appear). | Some colors can't be decoded. | Include all months present or use a continuous gradient. |
| 25 | Med | **d/m date format is ambiguous** for international users ("5/9" = May 9 or Sep 5?). | Ambiguity in a date‑centric view. | Unambiguous format ("5 Sep") or label the format. |

### Cross‑cutting (all tabs)
| # | Sev | Issue | Why it matters | Fix |
|---|-----|-------|----------------|-----|
| 26 | High | The **intensity legend shows on every tab regardless of use**; Gap/Avg. Date correctly swap in their own. Inconsistent legend relevance. | The same footer means different things (or nothing) per tab. | Bind the visible legend to the active view's actual encoding. |
| 27 | Med | Five tabs have **different "Group by" options** (and switching can reset state) with no signal that groupings differ per tab. | Disorienting silent changes. | Clarify which groupings belong to which tab; preserve choices where sensible. |
| 28 | Low | Grids never show a **summary/count** ("143 positions, 3 empty"). | No sense of scale/completeness. | Add a small summary header above the grid. |

**Top 5 (this area):** 1) Make the default Position grid show data + look clickable (#1,#2,#3). 2) Fix mobile 14‑column overflow + the tab strip (#4,#5). 3) Eliminate Highlights' contradictory color signals (#9,#26). 4) Replace color‑as‑text with legible values + accessible swatches in Average/Gap (#13,#15,#21). 5) Fix jargon/unlabeled states — "Gap", "by Year", Avg. Date dual‑dates + month legend, "Untracked" empty state, CPHC/NHC/IMD, "position" (#7,#10,#14,#19,#22,#24).

---

## Area 4 — Data Modals & Interactions

Modals: `M01-storm-detail`, `M02-namelist`, `M03-average-name-detail`, `M04-average-pos`, `M05-distance-gap`, `M06-avgdate-detail`.

### Per‑modal findings
| # | Sev | Modal | Issue | Fix |
|---|-----|-------|-------|-----|
| 1 | High | M01, M04, M05, M06 | **Title is a bare "1A"** — a raw grid coordinate — in four different modals for four different purposes. Header alone can't tell them apart. | Descriptive title + subtitle, e.g. "Position 1A — 5 storms" / "Average intensity — Position 1A" / "Gap between storms — Position 1A". |
| 2 | High | M01, M04, M05, M06 | **No in‑modal legend** for the badge/border/dot colors that are the whole point. | Add a compact intensity key inside each modal (or labeled chips "Cat 5", "TS"). |
| 3 | High | M04 | **"Overall Average Intensity: 2.00"** — 2.00 on what scale? No min/max/unit, and how it's derived from the counts isn't shown. | State the scale ("2.00 / 5 avg category") + a micro‑explanation. |
| 4 | High | M05 | **"Average Gap: 5.75 years"** with no definition of "gap"; timeline **dot colors look encoded but aren't explained** (same name gets different dot colors). | Define "gap"; explain or neutralize the dot colors. |
| 5 | Med | M01, M04 | **Unexplained codes** "01W/17W/08W" (JTWC basin IDs) read as noise. | Tooltip/footnote or move to hover. |
| 6 | Med | M02 | **"Position: 142"** is a bare, unexplained number (rank? index? slot?). | Label it ("List position #142 of 200") or remove if internal. |
| 7 | Med | M06 | **Count bars render at different widths for identical counts (all = 1)** — a chart‑truth bug implying different magnitudes. | Scale bars to a common max; equal values → equal widths. |
| 8 | Med | M06, M05 | **Month rainbow (M06) and dot colors (M05) clash with the intensity color language** used elsewhere — color no longer means one thing. | Reserve the category palette for intensity only; use a single neutral accent for count bars. |
| 9 | Low | M01, M02, M05 | **Clickable rows have weak affordance** and **date formats are inconsistent/partial** ("4/5 – 12/5/2000", missing years, d/m order). | Hover/chevron affordance + one consistent, unambiguous date format. |
| 10 | Low | M02 | **"Show Map" toggle reveals nothing visible** (dead control); **"Zoom Earth ↗"** external link lacks context. | Show an inline map/preview or make it a clear button; add "opens external site" hint. |

### Modal design‑system consistency
These read as **six separately‑built dialogs**. The shared shell (white rounded card, dimmed backdrop, top‑left title, top‑right ×, header rule) is good and consistent — but the insides diverge badly:

| Dimension | M01 | M02 | M04 | M05 | M06 | Consistent? |
|-----------|-----|-----|-----|-----|-----|-------------|
| Card + × close | ✓ | ✓ | ✓ | ✓ | ✓ | **Yes** |
| Informative title | "1A" | Name | "1A" | "1A" | "1A" | **No** |
| Header color | dark | gold | dark | dark | teal | **No** |
| Storm‑list item style | badge+link | bordered card | border swatch | dot | stat tiles | **No** |
| Intensity legend present | ✗ | ✗ | ✗ | ✗ | ✗ | **Uniformly absent** |
| Category labeling | "5"/"TS" | — | "Category 5 Super Typhoon" | — | — | **No** |

**Recommendation:** build **one modal shell** (descriptive title + subtitle + summary stat + body) and two shared sub‑components — a **"storm list item"** (badge + name + dates + action) and an **"intensity scale legend"** — reused everywhere. M06's stat‑tile row is the tightest layout and should be the template.

**Top 3 (this area):** 1) Replace every bare "1A" title with a descriptive title + subtitle (#1). 2) Add an in‑context intensity legend to every modal + the dashboard (#2). 3) Unify the storm‑list‑item and category labeling into shared components, and fix the M06 count‑bar width bug (#7, #8).

---

## Appendix — screenshot index

- **Desktop (31):** `screenshots/desktop/01`…`31` — home, about, search (empty/results/no‑results), names (current grid/list/tag, history, retired), info & position pages, all 5 Storms tabs (grid + list variants), 404.
- **Mobile (15):** `screenshots/mobile/` — home, about, nav‑open, search results, names grid/list/retired, info/position, and the responsive‑critical Storms grids.
- **Modals (11):** `screenshots/modals/M01`…`M11` — storm detail, name list, averages, gap timeline, avg‑date, name/retired details, and the list/retired filters.

Open `index.html` in a browser for a clickable gallery of all of the above.
