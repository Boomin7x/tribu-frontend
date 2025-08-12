# Tribu Web Frontend

A Next.js app for interactive geospatial visualization and analysis. It renders Mapbox maps, manages layer visibility and selections, and synchronizes UI state with URL and Redux for a shareable, resilient UX.

### Key Features

- **Interactive Map (Mapbox GL + react-map-gl)**: Buildings, roads, and junctions with layers, markers, and popups
- **URL-driven State**: Toggle layer visibility via query params for shareable/refresh-safe state
- **Redux Toolkit**: Centralized map and layer state, with category-specific slices
- **React Query**: Data fetching with caching, retry, and DevTools
- **Proxy API**: Server-side proxy to your backend using `app/api/proxy/[...path]`
- **UI/Styling**: Tailwind CSS + MUI theme

---

## Tech Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **State**: Redux Toolkit (`react-redux`), URL query params
- **Data**: @tanstack/react-query (+ DevTools)
- **Maps**: `mapbox-gl` + `react-map-gl`
- **Styling**: Tailwind CSS 3, MUI (@mui/material)
- **Networking**: Axios via a server-side proxy route

---

## Prerequisites

- Node.js ≥ 18.18 (recommend 20+)
- Package manager: npm or yarn (choose one; both lockfiles exist)

---

## Getting Started

1. Clone and install dependencies

```bash
# with npm
npm install
# or with yarn
yarn install
```

2. Configure environment variables
   Create `.env.local` in the project root:

```bash
# Base URL of your backend API that the proxy forwards to
NEXT_PUBLIC_MAP_BASE_URL=https://your-backend.example.com
```

Optional: If your backend requires an auth token for map requests, set it in Local Storage under `map-token` (used by the Axios client):

```js
// In the browser console
localStorage.setItem("map-token", "YOUR_JWT_OR_TOKEN");
```

3. Run the development server

```bash
# with npm
npm run dev
# or with yarn
yarn dev
```

Open the app at `http://localhost:3000`.

4. Build and start (production)

```bash
# build
npm run build
# start
npm run start
```

5. Lint

```bash
npm run lint
```

---

## Project Structure

```text
app/
  _components/                 # Shared UI and providers
    GeneralMap.tsx             # Main map container
    QueryClientProvider.tsx    # React Query provider/devtools
    ReduxToolkitProvider.tsx   # Redux store provider
    ThemeProvider.tsx          # MUI theme wrapper
  _hooks/                      # Reusable hooks (geocode, geolocation, URL state)
  _utils/                      # Utilities and shared types
  api/proxy/[...path]/route.ts # Server-side proxy to backend
  (routes)/dashboard/
    location_int/
      layers/                  # Layer pages (roads, buildings, junctions)
        _component/            # Layer UIs, drawers, sidebars
        _hooks/                # Data fetching hooks per layer type
        _utils/                # Enums, types, client services
app/store/                     # Redux Toolkit store and slices
public/                        # Static assets
styles/                        # Global styles, tailwind
```

---

## Architecture Overview

- **App Layout Providers**: `app/layout.tsx` composes providers in this order:

  - `ThemeProvider` (MUI)
  - `QueryClientProvider` (React Query + DevTools)
  - `ReduxToolkitProvider` (Redux store)

- **State Management**:

  - `app/store/store.ts` wires slices: `map`, `map_category`, `map_road`, `map_junction`
  - Slices track hovered/selected features and per-category zoom targets

- **Maps**:

  - `app/_components/GeneralMap.tsx` integrates Mapbox GL via `react-map-gl`
  - Composes building, road, and junction layers/popups/markers via custom hooks
  - Merges interactive layer IDs and handles click/hover to sync with Redux

- **Data Layer**:

  - `app/config/map_client_config.ts` exports an Axios client (`baseURL: /api/proxy`) with request/response interceptors
  - Adds `Authorization: Bearer <map-token>` from Local Storage when present

- **Proxy API**:
  - `app/api/proxy/[...path]/route.ts` forwards all HTTP methods (GET/POST/PUT/DELETE/PATCH) to `NEXT_PUBLIC_MAP_BASE_URL`, preserving query strings and headers (excluding `host`)

---

## URL State Management

This project uses URL query parameters to keep certain UI states persistent and shareable. A common pattern is used for layer toggles.

- Example URL when road layers are active:

```text
/dashboard/location_int/layers?roadLayers=motorway,primary,secondary
```

- Benefits:

  - Persistent across refreshes and navigations
  - Shareable links that restore the same view

- Building blocks:
  - `useUrlState` hook for simple boolean flags via a URL query param
  - Layer-specific hooks to map arrays (e.g., `roadLayers`) from the URL into Redux

Usage example for a boolean flag:

```ts
import { useUrlState } from "@/app/_hooks/useUrlState";

const [isOpen, setIsOpen] = useUrlState("sidebar", false);
// setIsOpen(true) → adds ?sidebar=true, setIsOpen(false) → removes param
```

Notes:

- The hook is optimized using `useMemo`/`useCallback` to avoid unnecessary recalculations and re-renders.
- For list-based params (e.g., multiple layers), use a wrapper hook that parses/serializes comma-separated strings and syncs with Redux.

---

## Styling

- Tailwind CSS 3 configured in `tailwind.config.js`
- MUI theme in `app/_components/ThemeProvider.tsx`

---

## Environment & Configuration

- `NEXT_PUBLIC_MAP_BASE_URL`: Required. The upstream API the proxy uses.
- Mapbox: The map currently uses a hardcoded token in `GeneralMap.tsx`. You can migrate to an env-based token (e.g., `NEXT_PUBLIC_MAPBOX_TOKEN`) and pass it to the Map component.

---

## Common Tasks

- Add a new layer type:

  - Create fetch hooks under `app/(routes)/.../layers/_hooks/<layer>/`
  - Add UI under `app/(routes)/.../layers/_component/<layer>/`
  - Register interactive layers and map click/hover handlers in `GeneralMap.tsx`
  - If needed, add a new slice or extend an existing one under `app/store/slice`

- Call backend API:
  - Use the Axios client from `app/config/map_client_config.ts`
  - Endpoint path `/api/proxy/<your-endpoint>` automatically forwards to `NEXT_PUBLIC_MAP_BASE_URL`

---

## Deployment

- Designed for Vercel. `vercel.json` sets a `Content-Security-Policy` header (`upgrade-insecure-requests`).
- Ensure `NEXT_PUBLIC_MAP_BASE_URL` is set in Vercel project environment variables.
- Build with `next build`; start with `next start` or use Vercel’s serverless runtime.

---

## Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Troubleshooting

- Map not rendering: verify Mapbox style URL, token, and network errors in the console
- 401/403 from proxy: ensure `map-token` is present in Local Storage (if required by your backend)
- URL state not updating: confirm the query parameter name and that navigation is client-side
- Type errors: ensure Node and TypeScript versions meet the `tsconfig.json` and Next.js requirements

---

## License

Proprietary. All rights reserved. Replace this section if you intend to open-source.
