# Tribu Web Frontend

## URL State Management for Road Layers

This project implements a robust URL state management system for road layer visibility that prevents state resets when components unmount/remount.

### How it works

1. **URL Query Parameters**: Road layer states are persisted in URL query parameters using the `roadLayers` parameter
2. **Redux Sync**: The Redux state is synchronized with URL parameters to maintain consistency
3. **Reusable Hook**: A generic `useLayerURLState` hook manages URL state for any layer type

### URL Format

When road layers are active, the URL will look like:

```
/dashboard/location_int/layers?roadLayers=motorway,primary,secondary
```

### Benefits

- **Persistent State**: Layer visibility persists across page refreshes and navigation
- **Shareable URLs**: Users can share URLs with specific road layers visible
- **No State Reset**: States don't reset when components unmount/remount
- **Reusable**: The same pattern can be applied to buildings, junctions, and other layer types

### Implementation

The system uses:

- `useLayerURLState` hook for URL management
- Redux actions for state synchronization
- Next.js router for URL updates
- Dynamic text color based on background color brightness

### Usage

```typescript
const { isLayerActive, toggleLayer } = useLayerURLState({
  paramName: "roadLayers",
  initializeAction: initializeRoadStatesFromURL,
});

// Check if a layer is active
const isActive = isLayerActive("motorway");

// Toggle a layer
toggleLayer("motorway");
```

### Alternative Approaches Considered

1. **Local Storage**: Would persist across browser sessions but not shareable
2. **Session Storage**: Would persist during session but not shareable
3. **URL Hash**: Would work but query parameters are more standard for this use case
4. **Redux Persist**: Would work but adds complexity and doesn't provide shareable URLs

The URL query parameter approach was chosen because it provides the best balance of persistence, shareability, and simplicity.
