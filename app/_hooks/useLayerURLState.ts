import { useCallback, useEffect } from "react";
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

  // Get all active layers from URL
  const getActiveLayers = useCallback(() => {
    const layers = searchParams.get(paramName);
    return layers ? layers.split(",").filter(Boolean) : [];
  }, [searchParams, paramName]);

  // Initialize Redux state from URL on mount
  useEffect(() => {
    const activeLayers = getActiveLayers();
    if (activeLayers.length > 0) {
      dispatch(initializeAction({ categories: activeLayers }));
    }
  }, [dispatch, getActiveLayers, initializeAction]);

  // Update URL with new layers
  const updateLayersInURL = useCallback(
    (layers: string[]) => {
      const newSearchParams = new URLSearchParams(searchParams);

      if (layers.length > 0) {
        newSearchParams.set(paramName, layers.join(","));
      } else {
        newSearchParams.delete(paramName);
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
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

      updateLayersInURL(newLayers);
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
