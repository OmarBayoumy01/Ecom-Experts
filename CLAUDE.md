# CLAUDE.md

Ecom Experts — a React 19 + TypeScript + Vite single-page app. It's a static dashboard with a thin,
route-composition structure described below. Keep new work consistent with it.

## Commands

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start the Vite dev server                      |
| `npm run build`        | Type-check then build (`tsc -b && vite build`) |
| `npm run lint`         | ESLint (flat config)                           |
| `npm run format`       | Prettier write                                 |
| `npm run format:check` | Prettier check                                 |
| `npm run preview`      | Preview the production build                   |

## Stack

React 19 · React Router 7 (`createBrowserRouter`) · Tailwind CSS v4 (`@tailwindcss/vite`) ·
shadcn/ui + Radix · Sonner (toasts) · lucide-react.

TypeScript is strict. The `@/*` alias resolves to `./src/*` and is configured in **both**
`tsconfig.json` and `vite.config.ts` — keep them in sync.

## Architecture — route composition

The app feature lives in `src/app/`:

- `routes.tsx` — exports the `appRoute` `RouteObject`; pages are wired in via `lazyPage()`
- `layout.tsx` — the app shell, rendering `<Outlet />`
- `pages/index.tsx` — page components as **named** `XController` exports (e.g. `DashboardController`), lazy-loaded

`src/routes/index.tsx` (`createAppRoutes()`) only **composes** the route objects plus the
top-level error pages — it never imports individual pages. `lazyPage(importer, exportName)`
in `src/routes/lazy-page.tsx` wraps `React.lazy` so pages can use **named** exports instead of a
default export.

**Adding a feature:** either add pages to `src/app/` (wire them into `appRoute`), or create a
new `src/<feature>/` folder with its own `routes.tsx` and register its route object in
`createAppRoutes()`.

## App shell

The app has **no auth gate and no data layer** — it's a static dashboard. `createAppRoutes()`
mounts `appRoute` directly at `/`; the root path lands on the dashboard (`/` → `/dashboard`).

## Conventions

- **Filenames:** kebab-case (`page-loader.tsx`, `mode-toggle.tsx`).
- **Exports:** named function/const components — avoid default exports except where a tool requires one.
- **State:** localStorage for theme; add local React state as needed.
- **Styling:** Tailwind v4; design tokens (OKLCH, light/dark) in `src/theme.css`. Merge classes
  with `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge). Component variants use CVA.
- **shadcn/ui:** components live in `src/components/ui/`, configured by `components.json`
  (neutral base, lucide icons, CSS variables). Add new components via the shadcn CLI.
  **ESLint ignores `src/components/ui` and `dist`** — don't hand-lint generated UI.
- **Toasts:** `useNotify()` (`src/hooks/notify.ts`) wraps Sonner; `<Toaster />` is mounted in `main.tsx`.
- **Theme:** `ThemeProvider` (`light | dark | system`, storage key `vite-ui-theme`) with the `ModeToggle` switcher.
- **Formatting (`.prettierrc`):** no semicolons, single quotes, trailing commas (all), printWidth 80, tabWidth 2.

## Folder structure

```
src/
├── app/                    # the app feature — routes, layout, pages (dashboard)
├── assets/
├── components/
│   ├── page-loader.tsx
│   ├── mode-toggle.tsx
│   └── ui/                 # shadcn/Radix components (eslint-ignored)
├── error-pages/            # 403.tsx, 404.tsx, suspended.tsx
├── hooks/                  # notify.ts (useNotify → Sonner)
├── lib/                    # utils.ts (cn)
├── providers/              # theme-provider, theme-context
├── routes/                 # index.tsx (createAppRoutes), lazy-page.tsx (lazyPage)
├── main.tsx
├── index.css
└── theme.css
```

## Provider composition (`main.tsx`)

`StrictMode > ThemeProvider > Suspense(PageLoader) > RouterProvider`,
with `<Toaster />` mounted alongside the router.

<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan

<!-- SPECKIT END -->
