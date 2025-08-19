import { ROAD_CATEGORY_COLORS } from "@/app/_hooks/useRoadsUtils";
import { cn } from "@/app/lib/tailwindLib";
import {
  setRoadFeatures,
  setToggleRoadView,
  setZoomToRoadFeature,
} from "@/app/store/slice/map_road.slice";
import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { Feature, FeatureCollection } from "geojson";
import { FC, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetCategoryRoads } from "../../_hooks/buildings";
import RoadDrawerDetails from "./RoadDrawerDetails";

import { useUrlState } from "@/app/_hooks/useUrlState";
import { isColorLight } from "../../_utils";

interface IRoadCategories {
  category: string;
}

const RoadCategories: FC<IRoadCategories> = ({ category }) => {
  const dispatch = useDispatch();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isView, setIsView] = useUrlState(category, false);
  // const globalBbox = useSelector(
  //   (state: RootState) => state.globalBbox.bbox,
  //   shallowEqual
  // );

  const { data, isLoading } = useGetCategoryRoads(
    {
      category,
      bbox:
        // globalBbox?.join(",") ??
        "0.703125, 1.2852925793638545, 28.828125, 14.9341698993427",
      limit: 50,
    },
    isView
  );

  const convertedData: FeatureCollection = useMemo(() => {
    if (!data) return { type: "FeatureCollection", features: [] };
    return data?.data as FeatureCollection;
  }, [data?.data]);

  const roadColor = useMemo(() => ROAD_CATEGORY_COLORS[category], [category]);

  const textColor = useMemo(() => {
    if (!isView) return undefined;
    return isColorLight(roadColor) ? "black" : "white";
  }, [isView, roadColor]);

  const categoryDisplayName = useMemo(
    () => category?.replace(/_/g, " "),
    [category]
  );

  const handleToggleView = useCallback(() => {
    setIsView(!isView);
  }, [isView, setIsView]);

  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  const handleZoomToFeature = useCallback(
    (feature: Feature) => {
      dispatch(setZoomToRoadFeature({ category, feature }));
    },
    [dispatch, category]
  );

  useEffect(() => {
    if (convertedData?.features?.length) {
      dispatch(
        setRoadFeatures({
          category,
          features: convertedData?.features ?? null,
        })
      );
    }
  }, [convertedData, dispatch, category]);

  useEffect(() => {
    dispatch(setToggleRoadView({ category, isOpen: isView }));
  }, [isView, dispatch, category]);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: isView ? roadColor : undefined,
      color: textColor,
    }),
    [isView, roadColor, textColor]
  );

  const dotStyle = useMemo(
    () => ({
      backgroundColor: roadColor,
    }),
    [roadColor]
  );

  return (
    <div
      style={containerStyle}
      className={cn(
        "flex items-center justify-between p-2 border-b last:border-0",
        isView && ""
      )}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={dotStyle} />
        <Typography className="capitalize">{categoryDisplayName}</Typography>
      </div>
      <div className="flex items-center gap-3">
        {isLoading && (
          <div className="size-4 rounded-full border-2 border-t-gray-200/20 animate-spin" />
        )}
        <Tooltip title="More details" arrow>
          <IconButton
            aria-label="Button"
            disabled={!isView}
            onClick={handleIsDetailsOpen}
          >
            <Icon icon={"pixelarticons:open"} className="size-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle visibility" arrow>
          <IconButton onClick={handleToggleView}>
            <Icon
              icon={isView ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              className="size-4"
            />
          </IconButton>
        </Tooltip>
      </div>
      {isDetailsOpen && (
        <RoadDrawerDetails
          isLoading={isLoading}
          open={isDetailsOpen}
          onClose={handleIsDetailsOpen}
          data={convertedData}
          onZoomToFeature={handleZoomToFeature}
        />
      )}
    </div>
  );
};

export default memo(RoadCategories);
