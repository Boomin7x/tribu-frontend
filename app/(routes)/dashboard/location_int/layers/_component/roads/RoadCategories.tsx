import { useLayerURLState } from "@/app/_hooks/useLayerURLState";
import { ROAD_CATEGORY_COLORS } from "@/app/_hooks/useRoadsUtils";
import { cn } from "@/app/lib/tailwindLib";
import {
  initializeRoadStatesFromURL,
  setRoadFeatures,
  setToggleRoadView,
  setZoomToRoadFeature,
} from "@/app/store/slice/map_road.slice";
import { RootState } from "@/app/store/store";
import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { FeatureCollection } from "geojson";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useGetCategoryRoads } from "../../_hooks/buildings";
import RoadDrawerDetails from "./RoadDrawerDetails";

interface IRoadCategories {
  category: string;
}

const isColorLight = (hexColor: string): boolean => {
  const hex = hexColor.replace("#", "");

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

const RoadCategories: FC<IRoadCategories> = ({ category }) => {
  const dispatch = useDispatch();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Use the reusable hook for URL state management
  const { isLayerActive, toggleLayer } = useLayerURLState({
    paramName: "roadLayers",
    initializeAction: initializeRoadStatesFromURL,
  });

  // Get the current state from URL query params
  const isViewFromURL = useMemo(() => {
    return isLayerActive(category);
  }, [isLayerActive, category]);

  // Sync URL state with Redux state
  const isView = useSelector(
    (state: RootState) => state.map_road[category]?.toggleRoadView,
    shallowEqual
  );

  // Update Redux state when URL changes
  useEffect(() => {
    if (isViewFromURL !== isView) {
      dispatch(setToggleRoadView({ category, isOpen: isViewFromURL }));
    }
  }, [isViewFromURL, isView, category, dispatch]);

  // Fetch roads for this category
  const { data, isLoading, isFetching } = useGetCategoryRoads(
    {
      category,
      bbox: "0.703125, 1.2852925793638545, 28.828125, 14.9341698993427",
      limit: 50,
    },
    isViewFromURL
  );

  const convertedData: FeatureCollection = useMemo(() => {
    if (!data) return { type: "FeatureCollection", features: [] };
    return data?.data as FeatureCollection;
  }, [data?.data]);

  useEffect(() => {
    dispatch(
      setRoadFeatures({
        category,
        features: convertedData?.features ?? null,
      })
    );
  }, [category, convertedData, dispatch]);

  const handleToggleView = useCallback(() => {
    toggleLayer(category);
  }, [toggleLayer, category]);

  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  // Determine text color based on background color brightness
  const textColor = useMemo(() => {
    if (!isViewFromURL) return undefined;
    const backgroundColor = ROAD_CATEGORY_COLORS[category];
    return isColorLight(backgroundColor) ? "black" : "white";
  }, [isViewFromURL, category]);

  return (
    <div
      style={{
        backgroundColor: isViewFromURL
          ? ROAD_CATEGORY_COLORS[category]
          : undefined,
        color: textColor,
      }}
      className={cn(
        "flex items-center justify-between p-2 border-b last:border-0",
        isViewFromURL && ""
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: ROAD_CATEGORY_COLORS[category] }}
        />
        <Typography className="capitalize">
          {category?.replace(/_/g, " ")}
        </Typography>
      </div>
      <div className="flex items-center gap-3">
        <Tooltip title="More details" arrow>
          <IconButton
            aria-label="Button"
            disabled={!isViewFromURL}
            onClick={handleIsDetailsOpen}
          >
            <Icon icon={"pixelarticons:open"} className="size-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle visibility" arrow>
          <IconButton onClick={handleToggleView}>
            <Icon
              icon={isViewFromURL ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              className="size-4"
            />
          </IconButton>
        </Tooltip>
      </div>
      {isDetailsOpen ? (
        <RoadDrawerDetails
          isLoading={isLoading ?? isFetching}
          open={isDetailsOpen}
          onClose={handleIsDetailsOpen}
          data={convertedData}
          onZoomToFeature={(feature) =>
            dispatch(setZoomToRoadFeature({ category, feature }))
          }
        />
      ) : null}
    </div>
  );
};

export default RoadCategories;
