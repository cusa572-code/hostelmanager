# Design Brief

## Direction

Hostel Management Suite — dark, data-driven interface spanning occupancy, students, payments, finances, credits, and complaints with emerald-green accents and color-coded status indicators.

## Tone

Minimalist brutalism. Dark backgrounds, surgical data presentation, zero playfulness. Focus on clarity, hierarchy, and action.

## Differentiation

Sidebar navigation (Dashboard, Rooms, Students, Payments, Udhar, Complaints, Notifications). Color-coded room cards (green=empty, orange=partial, red=full). Payment status badges (Paid/Pending/Overdue). Udhar ledger with running totals. Complaint tracker with status flow. Notification bell with dropdown. Language toggle (EN/HI). All cards responsive, all CTAs emerald-primary.

## Color Palette

| Token          | OKLCH           | Role                                    |
| -------------- | --------------- | --------------------------------------- |
| primary        | 0.65 0.18 155   | Emerald, available/paid/positive        |
| accent         | 0.72 0.17 70    | Orange, partial/pending/caution         |
| destructive    | 0.55 0.2 25     | Red, full/overdue/error                 |
| success        | 0.65 0.18 155   | Green (alias to primary)                |
| warning        | 0.72 0.17 70    | Orange (alias to accent)                |
| background     | 0.145 0.01 260  | Deep charcoal                           |
| card           | 0.18 0.012 260  | Surface elevation                       |
| muted          | 0.22 0.015 260  | Secondary content                       |

## Typography

Display: Space Grotesk. Body: DM Sans. Mono: Geist Mono. Labels: `text-xs-label`, metrics: `text-metric-value`.

## Elevation & Depth

`bg-card` surfaces on `bg-background` canvas. Borders: discrete `border-border`. No shadows. Hover: `opacity-90` via `transition-smooth`.

## Structural Zones

| Zone       | Background      | Border       | Notes                                       |
| ---------- | --------------- | ------------ | ------------------------------------------- |
| Header     | bg-card         | border-b     | Logo, notification bell, language toggle    |
| Sidebar    | bg-background   | border-r     | Nav items, primary accents on active        |
| Content    | bg-background   | —            | Room grid, student profiles, tables, forms  |
| Status Bar | bg-muted/30     | border-t     | KPI summary row below header (optional)     |

## New Components

Room cards: `room-card` with left border (empty=emerald, partial=orange, full=red). Payment badges: `badge-paid` (emerald), `badge-pending` (orange), `badge-overdue` (red). Complaint badges: `badge-complaint-pending`, `badge-complaint-progress`, `badge-complaint-resolved`. Student card: `student-card` + `student-avatar`. Udhar entry: `udhar-entry` with running total. Notification bell: `notification-badge` on bell icon, dropdown via `notification-item` list.

## Motion

Page load: fade-in 200ms. Modal: slide-in-up 300ms. Interaction: hover opacity shift. Focus: `focus-ring` (primary outline + offset). No excess animation.

## Interactive States

Buttons: hover (opacity-90) → active (opacity-80) → focus (ring). Form inputs: focus (ring-2 ring-primary ring-offset-2). Cards: hover (bg-card/90). Disabled: opacity-50.

## Constraints

Token-only colors (`bg-primary`, `text-destructive`). Monospace for data/time. All CTAs emerald by default. Modals: `modal-overlay` + `modal-content`. Empty states centered with icon, heading, description, CTA.
