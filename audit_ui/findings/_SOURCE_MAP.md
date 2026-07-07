# Source file map (fe/src/)
- Root layout: app/layout.tsx  | Home: app/(home)/page.tsx + _components/ (SearchBar, FunFacts, OnThisDay)
- NavBar: lib/layout/NavBar/ (DesktopNav, MobileNav, MenuToggle, NavLink, SearchBar)
- Search page: app/(navbar)/search/SearchPageContent.tsx
- Storms dashboard: app/(navbar)/storms/DashboardPageContent.tsx, _utils/fns.ts,
  _components/_widgets/ (StormGrid, GridCell, DashboardViewButton, SpecialButtons, SpecialNamesListDiv),
  _components/_modals/ (DashboardModal, StormDetailModal, AverageModal)
- Names: app/(navbar)/names/_components/_views/ (NamesView, RetiredView),
  _widgets/ (FilteredNamesTable, RetiredNamesTable, PositionNameGrid, SuggestionCard),
  _modals/ (ListFilterModal, RetiredFilterModal, NamesSettingsModal, RetiredNameDetailsModal)
- Position page: app/(navbar)/positions/[position]/PositionPageContent.tsx
- Info page: app/(navbar)/info/[name]/  | Intercept modals: app/@modal/(.)info + (.)positions
- Shared components: lib/components/ (StormCard, IntensityBadge, CountryFlag, LetterNavigation,
  PageHeader, NameDetailsContent, EmptyResults, FrownNotFound, ImageWithLoader, TyphoonSpinner, Tabs)
- globals.css: app/globals.css
NOTE: Track-map images (upload.wikimedia.org) are blocked in this environment, so map/image
boxes appear empty — treat missing external images as an ENV artifact, but the placeholder/
loading/broken-image DESIGN is fair to critique.
