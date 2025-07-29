import { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UseLayerURLStateOptions {
  paramName: string;
  initializeAction: (payload: { categories: string[] }) => {
    type: string;
    payload: { categories: string[] };
  };
}

export const useLayerURLState = ({
  paramName,
  initializeAction,
}: UseLayerURLStateOptions) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const isUpdatingRef = useRef(false);

  // Get all active layers from URL
  const getActiveLayers = useCallback(() => {
    const layers = searchParams.get(paramName);
    return layers ? layers.split(",").filter(Boolean) : [];
  }, [searchParams, paramName]);

  // Initialize Redux state from URL on mount
  useEffect(() => {
    if (!isUpdatingRef.current) {
      const activeLayers = getActiveLayers();
      if (activeLayers.length > 0) {
        dispatch(initializeAction({ categories: activeLayers }));
      }
    }
  }, [dispatch, getActiveLayers, initializeAction]);

  // Update URL with new layers - prevent page reload
  const updateLayersInURL = useCallback(
    (layers: string[]) => {
      if (isUpdatingRef.current) return;

      isUpdatingRef.current = true;

      // Create a new URLSearchParams object to avoid mutating the original
      const newSearchParams = new URLSearchParams();

      // Copy all existing search params except the one we're updating
      searchParams.forEach((value, key) => {
        if (key !== paramName) {
          newSearchParams.set(key, value);
        }
      });

      // Add our layer param if there are layers
      if (layers.length > 0) {
        newSearchParams.set(paramName, layers.join(","));
      }

      const newURL = `${pathname}?${newSearchParams.toString()}`;

      // Use replace with scroll: false to prevent page reload and scroll to top
      router.replace(newURL, { scroll: false });

      // Reset the flag after a short delay to prevent race conditions
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 100);
    },
    [searchParams, router, pathname, paramName]
  );

  // Check if a specific layer is active
  const isLayerActive = useCallback(
    (category: string) => {
      const activeLayers = getActiveLayers();
      return activeLayers.includes(category);
    },
    [getActiveLayers]
  );

  // Toggle a specific layer
  const toggleLayer = useCallback(
    (category: string) => {
      const currentLayers = getActiveLayers();
      let newLayers: string[];

      if (isLayerActive(category)) {
        // Remove category from URL
        newLayers = currentLayers.filter((layer) => layer !== category);
      } else {
        // Add category to URL
        newLayers = [...currentLayers, category];
      }

      // Only update URL if the state actually changed
      const currentLayersStr = currentLayers.sort().join(",");
      const newLayersStr = newLayers.sort().join(",");

      if (currentLayersStr !== newLayersStr) {
        updateLayersInURL(newLayers);
      }
    },
    [getActiveLayers, isLayerActive, updateLayersInURL]
  );

  return {
    getActiveLayers,
    updateLayersInURL,
    isLayerActive,
    toggleLayer,
    searchParams,
  };
};
