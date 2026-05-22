# Handoff: MrStocks — Pre-Market Scanner Member UI

## Overview

MrStocks is a subscription website for a pre-market stock scanner. It scans ~500 US large-caps every market morning at **09:15 NY**, computes whether SMA20 and SMA200 (on 2-minute bars) are in a "tight power-zone" setup, and surfaces candidates with a setup **state** and **Prior45 zone** position. Members check the dashboard before the open, optionally filter by their personal watchlists, and act on the signals manually. Daily alerts fire on A+ setups.

This handoff covers **8 screens** of the member-facing experience plus a marketing landing page.

## About the Design Files

The files in this bundle are **design references created as HTML/JSX prototypes**. They are not production code. Each component file (`components/ms-*.jsx`) shows the intended look, behavior, and interactivity for one screen. Together they make the design self-consistent — the design system (colors, type, spacing) is defined by usage, not as a separate tokens file.

The task is to **recreate these designs in your target codebase** (the brief specifies Next.js 15 App Router + React 18 + TypeScript + Tailwind CSS) using established patterns there. Do **not** copy the JSX directly:

- The prototypes use a small hand-written icon set (`ms-icons.jsx`) — replace each icon with the named [lucide-react](https://lucide.dev/) equivalent (see "Icon Mapping" below).
- The prototypes are plain `.jsx` with prop sketches in comments — convert each component to `.tsx` with explicit `interface` props.
- Mock data lives inline in `ms-data.jsx` — replace with your API integration.
- No external UI libraries (shadcn/Radix/Headless UI) were used per the brief; all controls are built from Tailwind primitives.

## Fidelity

**High-fidelity.** Every color, font size, spacing value, and interaction state is final. The developer should recreate the UI pixel-perfectly. Use the prototype files as the source of truth for exact values; this README documents the systems behind them.

---

## Tech Stack (from brief)

- **Next.js 15 App Router**
- **React 18 + TypeScript**
- **Tailwind CSS** for everything — including states. No shadcn / Radix / Headless UI.
- **lucide-react** for icons.
- Plain function components with default exports.
- Mobile-first; design targets 375px → 1280px+.
- CSS transitions only; no animation libraries.

---

## Design System

### Typography

- **All UI text uses `IBM Plex Mono`** — every weight 400/500/600. This is the terminal-style discipline of the design. No proportional sans-serif anywhere in the product UI.
- Load from Google Fonts. Use a `font-variant-numeric: tabular-nums` rule globally so columns of numbers align.
- The marketing landing page also uses IBM Plex Mono (kept consistent with the product).

Type scale (px values used in the prototypes):

| Use | Size | Weight | Tracking | Case |
|---|---|---|---|---|
| Hero numerics (symbol price) | 56 (desktop) / 42 (mobile) | 400 mono | -0.01em | — |
| Card price | 26 | 400 mono | -0.01em | — |
| Section heading | 12 | 500 | 0.12em | UPPERCASE |
| Body | 13 | 400 | 0 | sentence |
| Metric value | 13 | 400 mono | 0 | tabular |
| Metric label | 9.5 – 10.5 | 400 | 0.06em – 0.12em | UPPERCASE |
| Eyebrow (§01) | 9.5 | 400 | 0.18em | amber, UPPERCASE |
| Status/F-key | 9.5 – 10.5 | 400/500 | 0.08em – 0.14em | UPPERCASE |
| Decorative `│` separator | 10 | 400 | — | uses amber/30 |

### Color Palette

All colors are defined in **oklch** so the L/C plane stays consistent across hues. The same lightness/chroma is reused across hues so the palette feels coordinated.

```
/* Surfaces (true black + near-black layers) */
--bg-canvas        : #000000
--bg-surface       : #0B0B0B
--bg-surface-2     : #050505
--bg-hover         : #121212

/* Borders (alpha whites — solid, brighter than ordinary SaaS) */
--border-faint     : rgba(255,255,255,0.10)
--border-default   : rgba(255,255,255,0.15)
--border-strong    : rgba(255,255,255,0.22)
--border-emphasis  : rgba(255,255,255,0.25)

/* Text (alpha whites) */
--fg-primary       : #FFFFFF
--fg-strong        : rgba(255,255,255,0.85)
--fg-default       : rgba(255,255,255,0.75)
--fg-muted         : rgba(255,255,255,0.65)
--fg-faint         : rgba(255,255,255,0.45)

/* Accents (oklch — same L/C plane, varying hue) */
--accent-amber-brand : oklch(0.82 0.16 75)    /* primary CTA / brand wordmark / function keys */
--accent-amber-symbol: oklch(0.86 0.14 75)    /* ticker symbols (brighter) */
--accent-cyan        : oklch(0.78 0.12 200)   /* small uppercase labels, secondary data */
--accent-green       : oklch(0.78 0.16 150)   /* positive gaps, LIVE / READY status */
--accent-red         : oklch(0.74 0.17 28)    /* negative gaps, destructive, errors */

/* Setup-state hues (each state gets one — never decorative) */
--state-narrow           : oklch(0.74 0.17 250)  /* blue */
--state-wide-snapback    : oklch(0.80 0.16 72)   /* amber */
--state-trending-near-20 : oklch(0.78 0.16 150)  /* green */
--state-watch-loose      : oklch(0.76 0.12 200)  /* teal */
--state-too-tight        : oklch(0.62 0.01 250)  /* gray */
--state-middle           : oklch(0.70 0.01 250)  /* neutral */
```

**Color semantics — each hue means one thing**

| Hue | Used for |
|---|---|
| Amber `0.82 0.16 75` | Brand wordmark, primary CTAs, section eyebrows, F-key labels, status-bar dividers (`│`), warning/locked states |
| Amber-bright `0.86 0.14 75` | Ticker symbols only (NVDA, AAPL…) |
| Cyan `0.78 0.12 200` | Small uppercase labels (SMA FAST, DIST, ATR…), watchlist counts, "secondary numeric" data |
| Green `0.78 0.16 150` | Positive gaps %, LIVE pill, READY status, active/saved indicators, A+ count |
| Red `0.74 0.17 28` | Negative gaps %, destructive actions, errors / blocked states |
| State badges | Color-coded per setup state — never used outside badges |

### Spacing scale

Tailwind's default scale + a few one-off hard pixel values. Common values:

| Token | px | Used for |
|---|---|---|
| `gap-1` | 4 | tight icon+label clusters |
| `gap-1.5` | 6 | inline chip groups |
| `gap-2` / `gap-2.5` | 8 / 10 | most inter-element gaps |
| `gap-3` / `gap-4` | 12 / 16 | row gaps in card grids |
| `gap-5` / `gap-6` | 20 / 24 | between sections |
| `px-3` mobile / `px-5` desktop | 12 / 20 | side gutters in screens |
| `px-4` to `px-8` | 16 / 32 | marketing-page gutters |

Cards / sections use `p-4` (16) or `p-5` (20) internal padding.

### Border-radius

The design is **mostly sharp**. Default radius is `2-4px` (`rounded-sm`). Full pills are not used. Round dots use `rounded-full` only for status indicators (1.5px circles).

| Token | Use |
|---|---|
| `rounded-sm` (2px) | Every container, button, badge, chip, input |
| `rounded` (4px) | Icon-tile containers in empty states |
| `rounded-full` | Status dots only |

### Shadows

The design uses **shadows extremely sparingly**. Almost everything relies on borders for separation. The only shadow types in use:

- `shadow-[0_0_8px_oklch(0.78_0.16_150)]` — colored glow under LIVE/active dots.
- `shadow-[0_0_6px_oklch(0.82_0.16_75)]` — amber glow on slider thumb / focus.
- `boxShadow: '0 0 60px oklch(0.82 0.16 75 / 0.1)'` — soft amber bloom under the marketing pricing card.
- No drop-shadows on cards, no elevation stack.

### Tabular nums everywhere

Apply `font-variant-numeric: tabular-nums` globally (or on `.font-mono`). Every number in the UI must be tabular.

---

## Components — Build Order

Build the design system primitives first, then compose screens. **Each `.jsx` file in `components/` maps roughly to a screen, plus shared primitives.**

| File | Exports | Use on |
|---|---|---|
| `ms-data.jsx` | All mock data + the `STATES` config object | Replace with API integration; keep `STATES` as a config map |
| `ms-icons.jsx` | Custom SVG icon set | **Discard** — replace with lucide-react (see mapping below) |
| `ms-dashboard.jsx` | `Dashboard`, `StockCard`, `TopBar`, `FilterRows`, `StateBadge`, `ScoreMeter`, `StatusBar`, `EmptyState`, `LoadingScreen`, `FKey` | Screens 1, 3 (signals), 5 (day archive) |
| `ms-symbol.jsx` | `SymbolDetail`, `ZoneBand`, `DetailSection`, `KV` | Screen 2 |
| `ms-watchlists.jsx` | `WatchlistsList`, `WatchlistDetail`, `SymbolChip`, `SymbolSearch` | Screen 3 |
| `ms-alerts.jsx` | `AlertsList`, `AlertEditor`, `AlertRuleRow`, `ChipToggle`, `Toggle`, `ScoreSlider`, `ChannelRow`, `PredicateLine` | Screen 4 |
| `ms-history.jsx` | `HistoryView`, `HistoryDay`, `CalendarGrid`, `MonthStats`, `HeatLegend` | Screen 5 |
| `ms-settings.jsx` | `SettingsView`, `SettingsSection`, `SettingsField`, `Input`, `RadioRow`, `PushControl` | Screen 6 |
| `ms-marketing.jsx` | `MarketingPage`, `Hero`, `MarketingNav`, `Features`, `Pricing`, `FAQ`, `Footer`, `ProductPreview` | Screen 7 |
| `ms-marketing-fx.jsx` | `HeroScanner`, `TickerTape`, `BigStats`, `MethodViz`, `RuleSandbox`, `useCountUp` | Screen 7 (interactive sections) |
| `ms-states.jsx` | `StateCard`, plus 6 state variants (`StateNoScan`, `StateSyncFailed`, `StateNoSubscription`, `StateWatchlistEmpty`, `StatePushBlocked`, `StateMaintenance`), `StatesGallery` | Screen 8 + reusable across the app |

### Icon mapping (custom → lucide-react)

| Custom | lucide-react |
|---|---|
| `Star` / `StarFilled` | `Star` (toggle `fill` prop) |
| `ChevronDown` | `ChevronDown` |
| `ChevronRight` / `ChevronLeft` | `ChevronRight` / `ChevronLeft` |
| `ArrowUpRight` | `ArrowUpRight` |
| `Search` | `Search` |
| `Bell` | `Bell` |
| `Clock` | `Clock` |
| `Sparkles` | `Sparkles` |
| `Filter` | `SlidersHorizontal` |
| `Menu` | `Menu` |
| `X` | `X` |
| `Refresh` | `RefreshCw` |
| `Inbox` | `Inbox` |
| `Logo` | **Keep the custom Logo SVG** — it's the brand mark |

All icons are sized inline via a `size` prop. lucide-react uses `size` natively, so this is a 1-to-1 swap.

---

## Screens

### Screen 1 — Dashboard (`/dashboard`)
**Purpose**: morning at-a-glance of today's scan candidates.

**Layout**
- **TopBar** (sticky, h-48px desktop / h-44px mobile). Order L→R: logo + `MR/STOCKS │ OPENING SCANNER` wordmark · centered LIVE pill with `SCAN 09:15 NY · 20-MAY` and `NEXT 23H 14M` · F-key chips (F1 HELP / F2 ALERT / F3 WATCH) · bell · avatar (LM initials).
- **FilterRows** (3 rows): `STATE`, `PRIOR45`, `LIST`. Each row has a 58px-wide amber uppercase label, then horizontally-scrollable chips. Mobile rows scroll independently.
- **StockCard grid**: 1 col on mobile, 3 col on desktop, 12px gap, 16px outer padding.
- **StatusBar** (sticky bottom, h-32px). `● READY │ CAND 012/503 │ UNIV US-LRG │ TF 2M │ V2.4` + right-side hint row `/ SEARCH · F FILTER · W WATCH · ? HELP`.

**StockCard anatomy**
- 162px high on mobile; auto on desktop.
- Border: `1px rgba(255,255,255,0.15)`, radius 2px, bg `#0F1114`. Hover lifts to `#13161A`.
- Top row: amber ticker (mono 20px) + state badge + DirBadge ("LONG · ABOVE CLUSTER" tiny bordered chip) · star toggle right.
- Middle row: white price `$229.95` (mono 26px tabular) + colored gap `+1.82%` (mono 12px) + ScoreMeter (top-right, big colored number + 3px progress bar).
- Hairline divider.
- 2×3 grid: each metric is label-above-value, label is cyan 9.5px UPPERCASE, value is mono 13px tabular. Order: MA dist (ATR) · MA dist % · ATR · Vol $ · Slope fast (signed, colored) · Prior45.
- Entire card is keyboard-accessible: `<div role="link" tabIndex={0}>` with onClick + Enter/Space handlers (don't nest the star button inside a `<button>`).

**ScoreMeter**
- Threshold-colored: ≥90 green, ≥75 amber/blue, ≥60 orange, else red.
- Big number (22px mono) above a 3px-tall 44px-wide bar filled to `${score}%`.

**State color mapping for badges** — see Design Tokens `--state-*` above. Badges are translucent: `bg = oklch(0.30 0.10 <hue> / 0.30)`, `text = oklch(0.74-0.80 chroma <hue>)`, `inset shadow border = tone @ 30%`.

**Variants required**
1. Default (data loaded)
2. Empty — "NO SCAN YET TODAY · next scan in 07h 42m 18s" big amber clock icon.
3. Loading — skeleton chip rows + status banner `SCAN IN PROGRESS · 09:15:04 NY · evaluating 487/503 candidates` + skeleton cards.

### Screen 2 — Symbol Detail (`/dashboard/[symbol]`)
**Purpose**: deep-dive on one candidate.

**Layout**
- **SymbolHeader** — back arrow · symbol (mono amber-bright 15px) · company name (truncate) · star toggle · refresh button (desktop).
- **HeroBlock**: badges row (state badge md + `SCORE 100 · PRIOR45 Inside`) → giant price (mono 56px desktop / 42px mobile) + colored gap → tiny mono meta line `PRE-MKT · 08:42 NY │ VOL 218.4M`. Desktop only: 3 mini-stats card on the right (SMA 20 / SMA 200 / MA DIST).
- **DetailSections** (desktop): 7/5 col grid. Left col: Moving averages (§01) + Prior45 zone (§02, includes ZoneBand). Right col: Liquidity (§03) + Scanner notes (§04).
- **DetailSections** (mobile): all four sections stacked, collapsible (Moving averages + Prior45 default-open, others default-closed). Eyebrow numbering: amber `01` `02` `03` `04` followed by white uppercase title.
- **Sticky bottom CTA**: white `Add to watchlist` button (full-width on mobile). Desktop adds a secondary "ALERT ME ON TRIGGER" outline button.

**ZoneBand (the Prior45 visualization)**
- A 9-tall amber-glowing rectangle divided into 7 columns: `Lower #3 · Lower #2 · Lower #1 · Inside · Upper #1 · Upper #2 · Upper #3`.
- Inside column has a soft blue fill `oklch(0.30 0.06 250 / 0.30)`.
- Two vertical white/25 lines mark cluster boundaries (between L#1 and Inside; between Inside and U#1).
- Current-price marker: 2px wide vertical bar at position determined by linear-interp between cluster low/mid/high values, in the state's tone, with a colored glow `boxShadow: 0 0 8px <tone>` and a small triangle above.
- 3-up scale labels above the band (cluster low / mid / high in $).
- 7-column compact labels below (`L3 L2 L1 IN U1 U2 U3`).

**Variants required**: default · loading (skeleton hero + sections) · not-in-scan (centered "NOT IN TODAY'S SCAN" + Back to Dashboard).

### Screen 3 — Watchlists (`/watchlists`, `/watchlists/[id]`)

**List view**
- **Mobile**: stacked rows. Each row: name + `DEFAULT` pill (amber outline, conditional) · density meta line `SYM 12 · TODAY 07 · UPD 20-MAY 08:14` · kebab menu icon.
- **Desktop**: explicit table. Columns: NAME (1fr) · SYM (64px right) · TODAY (64px right, green if >0) · UPDATED (140px) · PREVIEW (120px: 4 amber bordered ticker chips + `+N` overflow) · kebab (44px). Sticky header row with cyan column labels.
- Header sub-bar above the list: `ALL LISTS │ COUNT 06` + `+ NEW LIST` amber pill on the right.

**Detail view**
- Sub-header: back arrow · `WATCHLIST │ Tech leaders` · `DEFAULT` pill · checkbox "SET AS DEFAULT" · `RENAME` button · `DELETE` (red).
- **§01 SYMBOLS** — wrapping flex of SymbolChips + a dashed-border `SymbolSearch` input chip at the end. SymbolChip = state-color dot + amber-bright ticker + colored gap % + × remove. SymbolSearch shows an autocomplete dropdown of universe tickers not already in the list; click adds.
- **§02 TODAY'S SIGNALS** — `HITS 07` (green) — reuses StockCard in a 1-col (mobile) / 3-col (desktop) grid filtered to this list's symbols. Empty-but-list-has-symbols copy: "None of these symbols hit today's scan."

**Variants**: default · empty (`new_idea` watchlist with no symbols → dashed empty-list box) · loading.

### Screen 4 — Alerts (`/alerts`, `/alerts/new`)

**Rule list**
- Each rule row uses an explicit CSS grid:
  - Mobile: `[14px enabled-dot] [1fr name] [auto toggle] [auto edit-btn]`
  - Desktop: `[14px dot] [1fr name] [180px stats] [auto toggle] [auto edit-btn]`
- Then a predicate row spanning the full width (left-indented 26px to align with name) — one flowing line: state names in their state colors → cyan amber-divider `·` → zones in white → list name in cyan → `SCORE ≥ 85` in white. No section labels.
- Then a channels row: `[EMAIL]` `[PUSH]` chips (cyan).
- Disabled rules get `opacity-55`.
- **Toggle** primitive: two-segment ON|OFF border. Active segment has amber outline + amber/18 fill + amber text. Inactive segment is white/10 bg with `/45` text.

**New rule editor (`/alerts/new`)**
- Header bar with breadcrumb `RULE │ <name>` and a live `PREVIEW · MATCHES TODAY 04` count (recomputes against `SCAN_RESULTS` as the form changes).
- Two-column desktop / one-column mobile layout:
  - **Left col 8/12** — `§01 NAME` text input + `§02 WHEN` (state chip multi-select with state-color dots, zone chip multi-select, watchlist single-select chips with ANY option, MIN SCORE slider).
  - **Right col 4/12** — `§03 NOTIFY` (Email + Web Push ChannelRows with hint text + Toggle), `§04 PREVIEW` (big mono match count + descriptive sentence that adapts to count).
- **ScoreSlider** is custom: a 3px track with a 4x16px amber thumb, tick marks at 60/75/90 with `C·60 B·75 A+·90` labels under, and the actual `<input type=range>` invisible-overlaid for accessibility/keyboard.
- **ChipToggle** — multi-select chip with state-color dot, amber outline + amber/10 fill + white text when active, plus a tiny X icon at the end of active chips. `whitespace-nowrap` required.
- Sticky save bar at bottom: `UNSAVED CHANGES` text (desktop) + Cancel (outline) + Save Rule (amber filled, with `⏎` hint).

### Screen 5 — History (`/history`, `/history/[date]`)

**Month view (CalendarGrid)**
- 7-col grid, Monday-first (markets are M-F). DOW labels `MON TUE WED THU FRI SAT SUN` in white/45 9px tracked 0.18em.
- Each cell is a button, aspect-square (mobile) or 1.1:1 (desktop), 6px padding.
- **Heatmap colors** (single-hue amber 5-bucket):
  - 0 candidates → `#0C0C0C` bg, white/40 text
  - 1-15 → `oklch(0.24 0.06 75)`
  - 16-30 → `oklch(0.36 0.10 75)`
  - 31-45 → `oklch(0.52 0.14 75)`
  - 46+ → `oklch(0.68 0.16 75)`
  - Weekend → `#060606`, white/18 text, `—` glyph centered
  - Future → `#080808`, white/18 text, `·` glyph
- **Today's cell**: 1.5px solid amber border + amber `0 0 12px / 0.55` boxShadow + "NOW" pill in the top-right (bg-black/60, amber text).
- Day number top-left (mono 9.5px tabular, opacity 80%).
- A+ count rendered as up to 3 white/85 1×1px dots in the top-right (or "NOW" pill if today).
- Center: large mono count (15px mobile / 20px desktop), white if count ≥31 else white/85.
- Selected day: amber ring offset.

**MonthStats card** (right column desktop, below grid mobile)
- 6 rows in a divided border-card: DAYS SCANNED · TOTAL CANDIDATES · AVG PER DAY · A+ HITS (green) · ALERTS FIRED · PEAK DAY (amber).
- Each row: cyan UPPERCASE label + faint hint sub-label, big mono value right-aligned.

**SelectedDayCard** (below grid)
- DOW + `20-MAY` (mono 28px) | divider | 3 stats (CANDIDATES / A+ HITS green / ALERTS amber) | spacer | `OPEN SCAN →` amber pill.

**Month nav bar**: prev/next arrows · `MAY 2026` (next disabled) · `JUMP TO TODAY` · HeatLegend on the right (`FEWER [5 swatches] MORE`).

**Day archive view** (`/history/[date]`)
- Same shell as Dashboard but TopBar title is "HISTORY", generatedAt is the archived date string + "ARCHIVE", nextScan is "—".
- A second header bar replaces the filter rows: back arrow · `ARCHIVE │ TUE · 19-MAY 2026 │ CAND 56 │ A+ 08` (green) + Prev/Next day buttons.
- Body: the same StockCard grid, no filters.

### Screen 6 — Settings (`/settings`)

**Layout**: centered `max-w-[760px]` column on desktop, full-width on mobile, sections stacked with 20px gap.

**Header**: `ACCOUNT │ LEO MENDEZ · leo.mendez@protonmail.com` + `ALL CHANGES SAVED` indicator (green, right-aligned).

**Section: 01 PROFILE**
- 3 fields, each label-above-input. Email (disabled with `CHANGE` action button inset on the right). Display name (editable). Timezone (disabled, `EDIT` action).
- **Input primitive**: bordered (white/22 default, amber on focus-within), rounded-sm, bg `#080808`, with optional `after` slot for inline action button.

**Section: 02 NOTIFICATIONS**
- Field: EMAIL FREQUENCY — radio group (3 RadioRows: Daily digest / Per hit / Off, each with hint text).
- **RadioRow primitive**: 14×14 circle border (amber when on) with a 1.5×1.5 amber filled dot inside (with amber glow). Active row gets amber/6 bg.
- Field: WEB PUSH — `PushControl` with 3 states: NOT ENABLED (amber Enable button), ENABLED (green pill `PUSH ENABLED · CHROME · MACBOOK PRO` + Disable button), BLOCKED (red `BLOCKED IN BROWSER` + amber "HOW TO FIX" button).

**Section: 03 SUBSCRIPTION**
- ACTIVE pill (green) + "SINCE 12-MAR 2026" line.
- Big mono `MEMBER · $29/MO` (22px) + renewal line.
- Amber "MANAGE BILLING ↗" CTA on the right.
- Lower row: next invoice date + "VIEW INVOICES ↗" cyan link.

**Bottom row**: Sign Out (white outline) + Delete Account (red outline). Right side: tiny build info `SCANNER V2.4 · BUILD 26.05.20`.

### Screen 7 — Marketing landing (`/`)

The landing page is order-sensitive. Render in this order:

1. **MarketingNav** — sticky top. Desktop: logo + `MR/STOCKS` + nav (METHOD/PRICING/CHANGELOG/FAQ) + LIVE pill + SIGN IN + SUBSCRIBE amber CTA. Mobile: logo + SUBSCRIBE pill + menu icon (drawer not implemented in proto — wire to nav drawer).
2. **TickerTape** — infinite-marquee under nav. Loops `SCAN_RESULTS` with state-color dot + ticker + price + colored gap + zone. 60s loop, CSS keyframes (`translateX 0 → -50%`), edge fades via gradient overlays. **Use `prefers-reduced-motion` to disable**.
3. **Hero** — desktop split (1.05/1 grid). Left: amber `OPENING SCANNER · v2.4` pill + huge UPPERCASE headline `PRE-MARKET // SIGNALS. EVERY MARKET MORNING. BEFORE YOU LOG IN.` (68px desktop / 42px mobile, "SIGNALS." amber, "BEFORE YOU LOG IN." white/50) + supporting paragraph + amber `SUBSCRIBE · $29/MO` + outline `SEE TODAY'S SCAN` + social proof line (`2,140 MEMBERS · CANCEL ANYTIME · BILLED VIA WHOP`). Right: **HeroScanner**.
4. **HeroScanner** — animated terminal log inside a bordered black card. Lines stream in every ~380ms (`09:14:58 │ SYS INIT scanner v2.4` → `09:15:00 │ EVAL NVDA → NARROW · SCORE 100 [PASS]` etc). When complete, holds 3.5s then resets to line 1. Mobile uses shorter timestamps (`14:58`) and abbreviates EVAL rows. Blinking amber `▌` cursor at the bottom while streaming.
5. **BigStats** — 4-up animated count-up grid: 47,840 CANDIDATES (white) · 1,230 A+ SETUPS (green) · 29,104 ALERTS DELIVERED (amber) · 99.4% UPTIME (cyan). Each animates from 0 to target over 1600ms with easeOutCubic. **Use `useCountUp` only if `prefers-reduced-motion: no-preference`; otherwise render final value directly.**
6. **MethodViz** — copy + animated SVG. SVG shows two SMA lines (blue SMA20, amber SMA200) animating from wide-apart to tight-cluster. A cluster band (amber dashed) fades in at convergence. Current-price marker pulses. CSS keyframes: `ms-fast` (translateY 0→38px), `ms-slow` (0→-26px), `ms-cluster` (opacity 0→1), `ms-pulse` (radius and opacity).
7. **ProductPreview** — faux browser frame containing the **actual Dashboard component** rendered at sized height. Three fake traffic-light dots + URL `mrstocks.app/dashboard`. Caption below: `THE DASHBOARD · 09:15 NY · 12 CANDIDATES SHOWN`.
8. **RuleSandbox** — interactive lead generator. Two-col on desktop: left has chip multi-selects (states/zones) + score slider; right has bordered amber card with live "WOULD FIRE TODAY 04 of 12" + matching symbol chips + amber "SUBSCRIBE TO SAVE THIS RULE" CTA. Recomputes on every state change.
9. **Features** — 3-up card grid with per-card accent tone (amber/cyan/green): DAILY SCAN · YOUR WATCHLIST · A+ ALERTS. Each card: eyebrow number (top-left, tone-colored) + big stat number (top-right, tone-colored) + uppercase title + body + mono uppercase footer hint.
10. **Pricing** — single tier, centered card (`max-w-[480px]`) with amber 0.4 border + faint amber bloom shadow. `MEMBER` eyebrow · `$29/MO` huge mono · 6 feature bullets with green dots · amber `SUBSCRIBE VIA WHOP ↗` full-width CTA · secure checkout hint.
11. **FAQ** — native `<details>` accordion in a bordered card. 4 items. Open chevron rotates 180deg.
12. **Footer** — 5-col grid (logo+copy + 4 link cols). Bottom strip: `© 2026 MR/STOCKS LLC · ALL RIGHTS RESERVED` + `NOT FINANCIAL ADVICE · MEMBER USE ONLY`.

### Screen 8 — Empty / error states

Single reusable `StateCard` scaffold (icon tile + eyebrow + status line + headline + body + primary/secondary buttons) parameterized by `tone`. Six variants:

| State | Tone | Eyebrow | When |
|---|---|---|---|
| `StateNoScan` | amber | NO SCAN YET | Dashboard when today's scan hasn't run yet (`/dashboard` before 09:15 NY) |
| `StateSyncFailed` | red | SYNC FAILED | Dashboard when the scanner failed to deliver; primary action retries |
| `StateNoSubscription` | amber | LOCKED | Any logged-in page when subscription is inactive |
| `StateWatchlistEmpty` | cyan | EMPTY LIST | Newly-created watchlist `/watchlists/[id]` with zero symbols |
| `StatePushBlocked` | red | PUSH BLOCKED | Settings web-push when browser permission is denied |
| `StateMaintenance` | amber | MAINTENANCE | Banner across the app during scheduled maintenance |

Each card has its own colored bloom under the icon tile (computed from the tone via `radial-gradient`).

---

## Interactions & Behavior

### Navigation flows
- Dashboard StockCard click → `/dashboard/[symbol]`
- Symbol detail back arrow → `/dashboard`
- Watchlists row click → `/watchlists/[id]`
- Alerts row Edit → `/alerts/[id]/edit` (reuses `AlertEditor` seeded with the rule)
- History day cell click → selects + reveals `SelectedDayCard`; clicking `OPEN SCAN →` navigates to `/history/[date]`
- All amber CTAs (SUBSCRIBE, MANAGE BILLING) point to Whop external URL — open in new tab.

### Hover / focus / disabled states
- All interactive elements have a `hover:` variant — borders go from `/15` to `/25`, backgrounds gain a faint `/4` or `/6` overlay.
- Focus rings: `focus-visible:ring-2 focus-visible:ring-[oklch(0.74_0.17_250)]` (blue) on cards; `focus-visible:border-[oklch(0.82_0.16_75/0.7)]` (amber) on inputs. Never remove focus indication.
- Disabled buttons drop to `opacity-55` and `cursor-default`.

### Loading
- Every screen has a loading state with skeleton blocks (`bg-white/8` + `animate-pulse`). The skeleton layouts mirror the real layouts so there's no content shift.

### Empty
- Each major screen has its own empty state (see Screen 8) — surface them at the appropriate empty-list/no-data condition.

### Animations
- Dashboard StatusBar dot: `animate-pulse` only when status is SCANNING.
- LIVE pill dot: pulse + `0 0 8px` green glow shadow.
- HeroScanner: stream 1 line every 380ms, hold complete state 3500ms, restart.
- MethodViz: 6s loop, ease-in-out, CSS keyframes only.
- TickerTape: 60s linear infinite translateX.
- RuleSandbox count: no animation — instant recompute on change.
- BigStats count-up: 1600ms easeOutCubic on mount/in-view.
- Filter chip click: `transition-colors` 150ms (Tailwind default).
- Tweak panel toggles: none; instant.
- **Respect `prefers-reduced-motion: reduce`** — kill TickerTape, BigStats count-up, MethodViz, and HeroScanner streaming; render final states immediately.

### Forms
- Email frequency: enum `'digest' | 'per_hit' | 'off'`.
- Alert rule validation: at least one state, at least one zone, score 0-100. Disable save if invalid.
- Watchlist name: 1-40 chars, unique. SymbolSearch only adds tickers from a fixed universe (replace mock universe with API).
- Push: actual `Notification.requestPermission()` call; persist resulting state.

---

## State Management

This is a Next.js App Router app — use **Server Components by default** with `'use client'` only for interactive bits (toggles, sliders, the RuleSandbox, the HeroScanner animation).

| State | Where | Notes |
|---|---|---|
| Scan results | Server fetched per-request; revalidate at 09:15 NY | Cache key: date |
| Watchlists | DB; SWR or Server Action mutations | Optimistic UI on add/remove symbol |
| Alert rules | DB; Server Actions | The live preview can be a pure client computation |
| Settings (display name, email freq) | DB; Server Action submit | Show "ALL CHANGES SAVED" pill on success |
| Push permission | Browser API state; mirror to DB row | Re-check on each settings mount |
| Subscription | Read from Whop webhook → DB; surface as `ACTIVE`/`PAST_DUE`/`CANCELLED` |
| Today's date | Server-derived | All "today" / "next scan" calculations use `America/New_York` |

---

## Responsive Behavior

- Design targets **375px (mobile) → 1280px+ (desktop)**.
- Components accept a `layout: 'mobile' | 'desktop'` prop in the prototype. In Next.js, use Tailwind responsive utilities (`md:` breakpoint at 768px) instead. Examples:
  - Dashboard grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
  - StatusBar: hide secondary chips below `md` (or stack into a second row).
  - TopBar: F-keys hidden below `lg`.
  - Symbol detail: switch from collapsible sections (mobile) to two-column grid (desktop) at `md`.
  - Settings: max-width-760 column only above `md`; full-width below.
  - Marketing hero: split layout at `md`; stacked below.

---

## Accessibility

- Every interactive element must be keyboard-reachable. Cards-as-links use `role="link" tabIndex={0}` + onClick + Enter/Space handlers (StockCard, WatchlistRow). Don't nest buttons inside buttons.
- All toggles/checkboxes have `role="switch"` / `aria-checked`.
- All form inputs have associated `<label>` text.
- All icon-only buttons have `aria-label`.
- Focus rings use color (amber for inputs, blue for cards). Never `outline-none` without a visible alternative.
- Tabular numerics improve readability; keep `font-variant-numeric: tabular-nums` on all `.font-mono` text.
- The color palette is high-contrast (white text on near-black). Verify with the WCAG checker — most combinations are AAA. The dimmest text is `text-white/45` (~5:1 contrast).

---

## Mock Data

`ms-data.jsx` contains:
- `STATES` — 6 setup states with label/tone/soft (translucent bg).
- `ZONES` — 7 Prior45 buckets.
- `STATE_FILTERS`, `ZONE_FILTERS` — array forms with "all" prepended for chip rows.
- `WATCHLISTS` (compact list for dropdown) + `WATCHLIST_DETAIL` (full records).
- `SCAN_RESULTS` — 12 sample candidates (NVDA…ORCL). Replace with API response.
- `ALERT_RULES` — 4 sample rules.

**`STATES` is configuration, not mock data — keep its shape in production.** Each entry has `{ label, tone, soft }`. Add new states by extending this map.

---

## Design Tokens (copy-paste)

```ts
// tailwind.config.ts (extend)
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
        display: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // Setup state palette (use as `bg-state-narrow`, `text-state-narrow`, etc.)
        state: {
          narrow:    'oklch(0.74 0.17 250)',
          'wide-snapback': 'oklch(0.80 0.16 72)',
          trending:  'oklch(0.78 0.16 150)',
          'watch-loose': 'oklch(0.76 0.12 200)',
          'too-tight': 'oklch(0.62 0.01 250)',
          middle:    'oklch(0.70 0.01 250)',
        },
        accent: {
          amber:      'oklch(0.82 0.16 75)',
          'amber-2':  'oklch(0.86 0.14 75)',
          cyan:       'oklch(0.78 0.12 200)',
          green:      'oklch(0.78 0.16 150)',
          red:        'oklch(0.74 0.17 28)',
        },
        surface: {
          0: '#000000',
          1: '#0B0B0B',
          2: '#050505',
          3: '#121212',
        },
      },
    },
  },
};
```

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background: #000;
  color: #fff;
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { scrollbar-width: none; }
```

---

## Assets

- **Fonts**: IBM Plex Mono (400, 500, 600, 700). Load via `next/font/google`.
- **Logo SVG**: keep the custom `Icons.Logo` SVG (rounded square with checkmark line + dot, amber stroke). Place in `app/components/Logo.tsx`.
- **No images.** All decoration is CSS/SVG. The marketing landing has no stock photos — only generated visuals (the SMA cluster animation, the heatmap, the tape).
- **No third-party SVGs**. Icons are lucide-react only.

---

## Files

```
design_handoff_mrstocks/
  README.md                    ← this file
  preview.html                 ← run via static server to view all screens (sidebar nav)
  components/
    ms-data.jsx                ← STATES, ZONES, sample data
    ms-icons.jsx               ← custom icons (replace with lucide-react)
    ms-dashboard.jsx           ← Screen 1 + shared primitives (StockCard, TopBar, StatusBar, StateBadge, ScoreMeter, FKey)
    ms-symbol.jsx              ← Screen 2 + ZoneBand
    ms-watchlists.jsx          ← Screen 3 + SymbolChip, SymbolSearch
    ms-alerts.jsx              ← Screen 4 + Toggle, ChipToggle, ScoreSlider, PredicateLine
    ms-history.jsx             ← Screen 5 + CalendarGrid, MonthStats, HeatLegend
    ms-settings.jsx            ← Screen 6 + Input, RadioRow, PushControl
    ms-marketing.jsx           ← Screen 7 page composition (Hero, Nav, Features, Pricing, FAQ, Footer, ProductPreview)
    ms-marketing-fx.jsx        ← Screen 7 interactive bits (HeroScanner, TickerTape, BigStats, MethodViz, RuleSandbox)
    ms-states.jsx              ← Screen 8 + all 6 state variants
```

### Running the preview locally

```bash
cd design_handoff_mrstocks
python3 -m http.server 8000
# open http://localhost:8000/preview.html
```

The preview is just a navigation sidebar + rendered screens at their intended dimensions — useful for screenshotting, sharing with stakeholders, or visual diffing during implementation.

---

## Implementation Order (suggested)

1. **Tailwind config + globals** — get colors, font, and base styles in place.
2. **Shared primitives** — `StateBadge`, `Toggle`, `ChipToggle`, `Input`, `RadioRow`, `StatusBar`, `TopBar`, `FKey`. These are used by 4+ screens.
3. **Dashboard (Screen 1)** — biggest screen; gets you a working `StockCard` which then powers Screen 3 and Screen 5 day-archive.
4. **Symbol Detail (Screen 2)** — depends on the StockCard color system.
5. **Watchlists (Screen 3)** — list + detail, reuses StockCard.
6. **Alerts (Screen 4)** — biggest form work; ScoreSlider is custom.
7. **History (Screen 5)** — CalendarGrid is novel; budget time for the heatmap logic.
8. **Settings (Screen 6)** — wire `Notification.requestPermission()` for real.
9. **States (Screen 8)** — quick; surface variants throughout the app.
10. **Marketing (Screen 7)** — last because of the animations; can be deferred / built in parallel by a different person.

---

## Out of Scope

- Charts. The brief explicitly says no charts in v1.
- A second visual variant (a more colorful "terminal-max" v2 was prototyped but discarded — design landed on the amber-as-accent system).
- Localization. All copy is en-US.
- A native mobile app. Mobile design is **mobile web** at 375px+.
