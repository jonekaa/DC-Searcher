# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Primary users: Logistics managers, fleet dispatchers, supply chain coordinators, and distribution network planners in Indonesia.
- Job: Finding nearby distribution centers (DCs) based on radial distance and road travel time, evaluating route feasibility, and comparing candidate DCs for dispatching or warehousing.
- Admin users: Operations managers updating DC location coordinates, names, and travel duration matrices.

## Product Purpose
DC Searcher enables rapid discovery, visual mapping, capacity triage, and multi-point route comparison of distribution centers across Indonesian logistics networks. Success means an operator can input a location or select a company, define constraints (radius in KM, maximum duration in HH:MM), immediately visualize matching DCs on an interactive map, inspect pallet availability, heed road advisories, and compare optimal routes with minimal cognitive friction.

## Positioning
Combines real-time Firestore database sync with client-side haversine proximity filtering, precomputed travel time matrices, and Leaflet Routing Machine turn-by-turn road calculations specifically calibrated for Indonesian distribution center networks, road travel times, and freight capacity requirements.

## Operating Context
- **Environments**: Desktop and mobile web browsers in logistics dispatch rooms, warehouse offices, transport depots, and field planning stations.
- **Workflows**:
  1. *Search & Autocomplete*: Type-ahead search by PT company name or Loc ID with keyboard-navigable suggestions (Arrow keys, Enter).
  2. *Proximity & Duration Filtering*: Set maximum radius (KM) and travel duration (HH:MM); results automatically filter and sort by road distance or travel time.
  3. *Nationwide & Radial Map Visualization*: Interactive Leaflet map rendering nationwide DC dots on initial load, zooming to radial boundaries upon search, with distinct start and candidate markers.
  4. *Multi-Point Route Comparison*: Checkbox selection of multiple candidate DCs to render distinct color-coded Leaflet Routing Machine polylines and comparative metric summaries.
  5. *Pallet Capacity & Demand Triage*: Real-time visibility into Food Pallet (`fpallet`/`fpalletcap`) and Non-Food Pallet (`nfpallet`/`nfpalletcap`) allocations to avoid routing to overloaded facilities.
  6. *Road Restriction & Avoidance Advisories*: Automatic lookup against `avoided_destinations` to flag high-risk or restricted routes with visual badges (`⚠️ AVOID: reason`).
  7. *Protected Admin Data Management*: Secure administration portal (`manage/DC_Manager.html`) with Firebase Authentication, supporting bulk CSV upload and step-by-step manual data entry for DCs and duration matrices.

## Capabilities and Constraints
- **Proximity Search**: Haversine distance calculation in kilometers for radial filtering.
- **Travel Time & Road Matrix**: HH:MM parsing and filtering against precomputed duration documents in Firestore (`durations`).
- **Route Engine**: Leaflet Routing Machine for dynamic multi-waypoint polyline generation with distinct color palettes.
- **Capacity Tracking**: Dual-category pallet metrics (Food vs. Non-Food) comparing daily demand throughput against maximum capacity.
- **Safety Advisories**: Dedicated `avoided_destinations` Firestore collection alerting dispatchers to seasonal or infrastructure route hazards.
- **Backend**: Firebase Firestore 10.12.2 (real-time sync) and Firebase Authentication for admin access.
- **Frontend Stack**: Static HTML5, Tailwind CSS (CDN), Leaflet 1.9.4, Vanilla JavaScript ES modules.
- **Hosting**: Static web hosting (GitHub Pages compatible), zero custom backend server requirements.

## Brand Commitments
- **Name**: DC Searcher (IC Find DC Nearby)
- **Tone**: Functional, reliable, high-utility, map-centric, unadorned operational clarity.
- **Color Accents**: Emerald green (`#059669` / `text-emerald-600`) as primary action color, slate/gray background, high-contrast status markers, and distinct comparison route colors.

## Evidence on Hand
- Main search & map interface: `index.html`, `js/app.js`, `js/ui.js`, `js/utils.js`, `css/style.css`
- Admin management portal: `manage/DC_Manager.html`, `manage/css/manage_style.css`
- Firebase configuration: `js/firebaseConfig.js`
- Documentation & feature specs: `README.md`

## Product Principles
1. **Map and data first**: The map and search controls must remain fast, responsive, and prominent without unnecessary UI decoration.
2. **Unambiguous operational metrics**: Distance (KM), duration (HH:MM), and pallet quantities (Food / Non-Food) must always be formatted consistently and read at a glance.
3. **Fast triage without reload**: Operators should be able to scan suggestions, apply filters, and compare candidate DCs dynamically on a single responsive screen.
4. **Operational safety upfront**: Road warnings and route avoidances must be surfaced immediately on cards and map popups to prevent dispatch errors.
5. **Seamless offline-to-online state**: Clear connection feedback during Firestore database sync.

## Accessibility & Inclusion
- Clear visual contrast for map markers, text, cards, and active route paths.
- Keyboard accessible autocomplete dropdown (Arrow key navigation, Enter to select, Escape to dismiss).
- Responsive mobile and desktop layout support for tablet, phone, and desktop dispatch consoles.
