# Ecom Experts

A React 19 + TypeScript + Vite single-page dashboard, styled with Tailwind CSS v4 and
shadcn/ui.

## Prerequisites

Make sure these are installed before you start:

- **Node.js 20.19+ or 22.12+** (Node 24 recommended) — check with `node -v`
- **npm 10+** (ships with Node) — check with `npm -v`
- **Git** — to clone the repository

## Step-by-step installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ecom-Experts
```

### 2. Install dependencies

```bash
npm install
```

This installs everything listed in `package.json` into `node_modules/`.

### 3. Start the dev server

```bash
npm run dev
```

Vite prints a local URL (default **http://localhost:5173**). Open it in your browser —
the dashboard loads at `/` and hot-reloads as you edit files.

### 4. Build for production (optional)

```bash
npm run build
```

Type-checks the project (`tsc -b`) and outputs an optimized bundle to `dist/`. Preview
that build locally with:

```bash
npm run preview
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

## Troubleshooting

- **Port already in use:** run `npm run dev -- --port 3000` to pick another port.
- **Stale dependencies / weird errors:** delete `node_modules` and `package-lock.json`,
  then run `npm install` again.
- **Type or lint errors on build:** run `npm run lint` and fix reported issues; the build
  fails if `tsc` reports type errors.
