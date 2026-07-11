# Bundle Builder

A multi-step **bundle builder** for a home-security system, with a live review panel
beside it. Built as a React 19 + TypeScript + Vite single-page app, styled with
Tailwind CSS v4 and shadcn/ui, with state managed by [Jotai](https://jotai.org/).

The shopper assembles a system through a 4-step accordion (cameras → plan → sensors →
extra protection); the review panel ("Your security system") reflects every selection
live, recalculates the total, and can be saved for later.

## Prerequisites

- **Node.js 20.19+ or 22.12+** (Node 24 recommended) — check with `node -v`
- **npm 10+** (ships with Node) — check with `npm -v`
- **Git** — to clone the repository

## Getting started

```bash
git clone <repository-url>
cd blue-print
npm install
npm run dev
```

Vite prints a local URL (default **http://localhost:5173**). Open it — the builder loads
at `/` and hot-reloads as you edit. It builds and runs from a clean clone.

### Build for production

```bash
npm run build      # type-checks (tsc -b) then bundles to dist/
npm run preview    # serve the production build locally
```

## Available scripts

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite dev server (HMR)          |
| `npm run build`        | Type-check then build to `dist/`         |
| `npm run preview`      | Preview the production build locally     |
| `npm run lint`         | Run ESLint                               |
| `npm run format`       | Format the codebase with Prettier        |
| `npm run format:check` | Check formatting without writing changes |

## How it works

- **4-step accordion** — one step open at a time (Step 1 open on load). Each header shows
  "STEP X OF 4", an icon, the title, and a state indicator (open → "N selected" + up
  chevron; collapsed → down chevron). The open step ends with a "Next: …" button.
- **Product cards** — image, optional "Save %" badge, title, description, "Learn More",
  a variant selector, a quantity stepper, and compare-at + active pricing. A card with a
  quantity above zero shows the selected (purple-border) state.
- **Per-variant quantities** — each colour is tracked independently. The card's stepper is
  bound to the currently-selected variant: add 2 White, switch to Black, and the stepper
  reads 0 while the 2 White are untouched. Every variant with a count above zero appears as
  its own line in the review panel.
- **Live review panel** — lists selected items grouped by category, each with its own
  stepper and pricing, plus the guarantee badge, financing line, discounted total, savings
  callout, Checkout, and "Save my system for later". Steppers stay in sync with the cards.
- **Persistence** — "Save my system for later" writes the configuration to `localStorage`;
  it's restored exactly on reload / return visit.

## Architecture

```
src/app/
├── data/
│   ├── products.json      # the data source — all products (JSON)
│   └── catalog.ts         # loads the JSON, resolves icon names, exposes helpers
├── state/
│   └── quantities.ts      # Jotai atoms: quantities (per variant), totals, save/load
├── components/
│   ├── product-card.tsx   # accordion product card
│   └── order-summary.tsx  # the review panel
└── pages/index.tsx        # the DashboardController: accordion + summary
```

- **Data-driven:** everything renders from `products.json`. No per-product markup is
  hardcoded — add/edit a product there and both the builder and the summary update.
- **State:** a single Jotai atom holds quantities keyed by `productId__Variant`. Cards and
  summary lines read/write the same atoms, so the two views can never drift. Totals and the
  "N selected" counts are derived atoms.

## Decisions, tradeoffs & what's unfinished

- **Font — Poppins instead of Gilroy.** The design uses Gilroy (Medium/SemiBold/Bold) and
  TT Norms Pro for the Checkout button. Both are commercial fonts with no free/licensed
  files available, so I substituted **Poppins**, the closest free geometric match, wired
  through the `--font-sans` token. Swapping in real Gilroy is a one-line change: add the
  `@font-face` files and update that token.
- **Design tokens sampled + confirmed against Figma.** Colours (purple `#4E2FD2`, grays,
  divider/price colours) and the selected-card border (`rgba(78,47,210,0.7)`) were taken
  from the Figma file. Product images and the satisfaction badge are the real exported
  assets, served from `public/products/`.
- **Data is a local JSON file.** Per the brief, a local JSON source is fine; there's no
  backend (the bonus). `icon` fields store lucide icon *names* (JSON can't hold a
  component); they're a fallback for the few items without a photo.
- **Checkout** is a placeholder (no destination), as allowed by the brief.
- **Persistence is explicit** (on Save click), not autosave — matching the "configure →
  save → leave → return" flow described in the brief.
- **Responsive:** desktop matches the Figma (builder on top, review below); the layout
  collapses to a single column down to phone widths.
- **Known nice-to-haves not done:** the colour chips use solid swatches rather than the
  tiny product thumbnails in the design, and a couple of type sizes are marginally smaller
  than the 28px headings in Figma.
```
