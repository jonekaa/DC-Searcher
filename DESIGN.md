---
name: DC Searcher
description: Find Distribution Centers - Fast, Visual, and Intelligent
colors:
  primary: "#059669"
  primary-hover: "#047857"
  primary-light: "#d1fae5"
  accent-warning: "#ea580c"
  accent-danger: "#dc2626"
  accent-admin: "#fdba74"
  neutral-bg: "#f7f7f9"
  neutral-surface: "#ffffff"
  neutral-border: "#e2e8f0"
  neutral-text: "#1f2937"
  neutral-text-muted: "#6b7280"
  route-blue: "#3388ff"
  route-purple: "#800080"
  route-green: "#008000"
  route-orange: "#ff8c00"
  route-red: "#e30022"
  route-turquoise: "#00ced1"
  route-avoid: "#ff4500"
typography:
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-dc:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  input-field:
    backgroundColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: DC Searcher

## Overview

**Creative North Star: "The Tactical Logistics Radar"**

DC Searcher is a purpose-built operational console for logistics dispatchers and supply chain planners across Indonesia. Its aesthetic rejects consumer decoration and corporate genericism in favor of crisp, high-density utility: high contrast, zero-latency feedback, legible geographic typography, and unambiguous status indicators. The interface acts like a radar display: quiet and neutral until an inquiry is made, after which actionable routes, distance thresholds, and facility capacities command immediate focus.

The interface pairs a clean neutral background with purposeful emerald accents, vibrant multi-route comparison lines, and high-visibility danger/warning flags. Everything is structured around a single viewport interaction pattern where controls, visual geospatial mapping, and triage cards coexist seamlessly.

**Key Characteristics:**
- **Map and metric primacy:** The interactive Leaflet viewport and critical numerical readouts (KM, duration, pallet count) take precedence over ornamental framing.
- **Instant scanability:** Clear typographic hierarchy and color-coded left borders allow rapid scanning of DC candidates in high-pressure dispatch workflows.
- **High-contrast operational feedback:** Emerald for affirmative actions, vibrant distinct hues for multi-waypoint routes, and bold red/amber badges for route hazards and capacity bottlenecks.
- **Tactile, responsive controls:** Subtly elevated cards with smooth micro-hover lifts and crisp focus rings that feel responsive under mouse or keyboard navigation.

## Colors

The palette uses a high-utility neutral foundation grounded in slate and light gray, energized by an authoritative logistics emerald, accompanied by high-contrast route and alert accents.

### Primary
- **Logistics Emerald** (`#059669`): The primary brand and action color. Applied to primary search triggers, branding badges, active highlight spans, and affirmative indicators.
- **Logistics Emerald Hover** (`#047857`): Interactive hover state for primary action buttons.
- **Logistics Emerald Light** (`#d1fae5`): Background tint for active suggestion items and subtle confirmation highlights.

### Secondary
- **Operational Orange** (`#ea580c` / `#fdba74`): Used for admin portal transitions (`Edit DC` button) and warning notices.
- **Hazard Crimson** (`#dc2626`): Error messages, database disconnection alerts, and critical capacity threshold warnings.

### Route Comparison Accents
- **Route Blue** (`#3388ff`): First candidate DC route polyline.
- **Route Purple** (`#800080`): Second candidate DC route polyline.
- **Route Green** (`#008000`): Third candidate DC route polyline.
- **Route Amber** (`#ff8c00`): Fourth candidate DC route polyline.
- **Route Crimson** (`#e30022`): Fifth candidate DC route polyline.
- **Route Turquoise** (`#00ced1`): Sixth candidate DC route polyline.
- **Route Avoid Danger** (`#ff4500`): Dedicated high-contrast polyline for avoided/restricted routes.

### Neutral
- **Console Slate** (`#1f2937`): Primary text, headings, and high-contrast labels.
- **Muted Steel** (`#6b7280`): Secondary text, placeholder indicators, unit descriptors, and coordinate hints.
- **Border Smoke** (`#e2e8f0`): Structural card borders, dividers, input strokes, and table separators.
- **Canvas Gray** (`#f7f7f9`): Application background tint providing soft contrast against pure white cards.
- **Surface White** (`#ffffff`): Card surfaces, modal sheets, dropdown menus, and map control containers.

### Named Rules
**The Single-Hero Rule.** Only the primary search button uses the filled Logistics Emerald treatment in the filter panel. All secondary actions (Clear, Edit DC) use neutral or subdued tonal variants to prevent competing visual weight.
**The Route Chroma Rule.** Polylines rendered on the map and active comparison indicator badges must match their assigned index color exactly, maintaining 1:1 cognitive synchronization between list cards and map routes.

## Typography

**Display Font:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
**Body Font:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
**Label/Mono Font:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace (for coordinates, Loc IDs, and duration timestamps)

**Character:** Clean, engineered, and utilitarian. Inter provides neutral clarity across diverse screen resolutions, while tabular numbers and uppercase identifiers preserve rigorous alignment in data-heavy dispatch lists.

### Hierarchy
- **Display / App Header** (Bold 700, clamp(1.875rem, 4vw, 2.25rem), line-height 1.25): Application title with colored brand mark.
- **Headline / Section Title** (Bold 700, 1.25rem / 20px, line-height 1.4): Panel headers, "DC Found Near [City]", and modal titles.
- **Title / Subheader** (Semi-bold 600, 1rem / 16px, line-height 1.4): DC names on list cards and filter field labels.
- **Body** (Regular 400, 0.9375rem / 15px, line-height 1.5): Descriptive copy, instructions, and empty state guidance.
- **Label / Metric** (Medium 500 & Semi-bold 600, 0.8125rem / 13px, line-height 1.25): Distance (KM), duration (HH:MM), pallet capacity counts, and status tags.

### Named Rules
**The Tabular Metric Rule.** Distance values, durations, and pallet numbers must use tabular figures or structured key-value pairs so multi-card lists scan vertically without visual wobble.

## Layout

The interface implements a responsive tactical dashboard layout constrained to a maximum width (`max-w-6xl` / 1152px) centered horizontally on desktop displays, with fluid edge-to-edge behavior on mobile screens.

- **Desktop Structure:** Top centered header, 3-tier control grid (PT Search 3 cols, KM 1 col, Duration 1 col), primary action bar, and a unified 60/40 horizontal split:
  - **Left (60% width, min-height 500px):** Interactive Leaflet map container with edge-anchored zoom controls and attribution.
  - **Right (40% width, scrollable):** Results toolbar (search-in-results, clear comparison) and vertically scrolling DC candidate cards.
- **Mobile Structure:** Stacks smoothly into single-column vertical flow with full-width inputs, collapsible or pinned map view, and tactile touch targets.
- **Spacing Rhythm:** Based on an 8px modular baseline (4px, 8px, 12px, 16px, 24px, 32px) ensuring consistent padding across containers, grids, and cards.

## Elevation & Depth

DC Searcher relies primarily on crisp tonal layering and delicate borders rather than heavy ambient blur or dramatic drop shadows. Depth serves to separate floating overlays and interactive controls from base map tiles.

### Shadow Vocabulary
- **Card Rest** (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): Standard resting elevation for panel cards and input containers.
- **Card Hover** (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Hover lift for DC cards indicating clickability for route comparison.
- **Panel Container** (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): Outer container shadow framing the main search card and map visualizer.
- **Floating Overlay** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): Autocomplete dropdown menu (`z-[9999]`) and loading screen.

### Named Rules
**The Flat Canvas Rule.** The application canvas remains flat (`#f7f7f9`). Shadow is reserved strictly for operational surfaces (search bar, map card, interactive cards) and interactive focus states.

## Shapes

- **Corner Radii:**
  - Panels & Main Containers: Large rounded corners (`rounded-xl` / 12px).
  - Cards, Buttons, and Inputs: Medium rounded corners (`rounded-lg` / 8px).
  - Status Pills & Badges: Small rounded corners (`rounded` / 4px) or full capsule (`rounded-full` / 9999px).
- **Form Accents:**
  - Candidate Cards: Solid 4px left border (`border-l-4 solid #10b981`) creating visual rhythm down the list.
  - Dropdown Menus: Clean squared bottom corners with subtle 1px border stroke.

## Components

### Buttons
- **Primary Search Button ("Find DC"):** Full-width or dominant grid item with Logistics Emerald background (`#059669`), white bold text, 12px vertical padding, hover darkening (`#047857`), and a disabled state (`#9ca3af` / cursor-not-allowed). Includes inline magnifying search icon.
- **Secondary Action ("Clear"):** Subdued light gray background (`#e5e7eb`), dark slate text, clear icon, hover transition to `#d1d5db`.
- **Navigation Button ("Edit DC"):** Warm orange accent (`#fdba74`), high visibility for admin portal navigation without clashing with primary emerald.
- **Clear Comparison Button:** Blue circular/square action icon button resetting multi-DC route selection.

### Inputs & Autocomplete
- **Search Input:** Clean border stroke (`#d1d5db`), 12px padding, subtle placeholder styling, instant focus ring.
- **Suggestions Dropdown:** High-z-index absolute overlay (`z-[9999]`), max height 288px (`max-h-72`), itemized rows with keyboard selection highlight (`#d1fae5`), bold matched text, and instant click handler.

### DC Candidate Card
- **Structure:** White container with 4px left emerald accent border, flex layout with candidate checkbox, DC Name / Loc ID, road distance (KM), travel duration, and structured pallet specification lists (Daily Demand, Capacity, Available).
- **Interactivity:** Micro-elevation transform on hover (`translateY(-2px)`), click-to-compare toggle, and distinct comparison badge when active.
- **Warning State:** Alert banner on cards flagged under `avoided_destinations` with amber/crimson background and hazard text (`⚠️ AVOID: reason`).

### Map & Popups
- **Leaflet Map Container:** Contained in rounded card with inner border stroke. Displays OpenStreetMap tiles with custom-colored markers (Blue for Origin, Red for Candidates, Multi-color polylines for active routes).
- **Marker Popups:** Crisp white popup containing origin/destination names, road km, duration, and structured pallet specification lists for Food and Non-Food daily demand and capacity.

## Do's and Don'ts

### Do:
- **Do** maintain strict visual synchrony between the color of a candidate DC's comparison checkbox and its Leaflet route polyline.
- **Do** display travel duration and road distance together (`X KM (HH:MM)`) to prevent ambiguous route assumptions.
- **Do** prominently flag routes matching `avoided_destinations` with high-visibility warning banners on both the card and map popup.
- **Do** keep autocomplete search responsive and keyboard navigable (Arrow keys navigate, Enter selects, Escape dismisses).
- **Do** preserve the 60/40 map-to-list layout balance on desktop displays.

### Don't:
- **Don't** use decorative gradients, ambient glow filters, or glassmorphism that degrades contrast or slows map rendering.
- **Don't** hide pallet capacity numbers (`fpallet`/`fpalletcap`, `nfpallet`/`nfpalletcap`) behind deep modals; keep them scannable.
- **Don't** allow map marker popups or dropdown lists to be obscured by navigation headers (maintain strict z-index hierarchy).
- **Don't** over-engineer the UI with heavy multi-page frameworks; keep the lightweight vanilla JS and Tailwind architecture fast and maintainable.
