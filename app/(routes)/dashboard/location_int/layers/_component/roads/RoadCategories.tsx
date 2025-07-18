import {
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

// Converts projected coordinates to geographic [lng, lat]
// const convertCoordinates = (data: FeatureCollection): FeatureCollection => {
//   if (!data?.features) return { type: "FeatureCollection", features: [] };
//   const convertProjectedToGeographic = (
//     x: number,
//     y: number
//   ): [number, number] => {
//     const longitude = (x / 20037508.34) * 180;
//     const latitude =
//       (Math.atan(Math.exp((y * Math.PI) / 20037508.34)) * 2 - Math.PI / 2) *
//       (180 / Math.PI);
//     return [longitude, latitude];
//   };
//   const convertedFeatures = data.features.map((feature: Feature) => {
//     if (feature.geometry.type === "LineString") {
//       return {
//         ...feature,
//         geometry: {
//           ...feature.geometry,
//           coordinates: (feature.geometry.coordinates as number[][]).map(
//             (coord: number[]) =>
//               convertProjectedToGeographic(coord[0], coord[1])
//           ),
//         },
//       };
//     }
//     // If not a LineString, return as is
//     return feature;
//   });
//   return { type: "FeatureCollection", features: convertedFeatures };
// };

const RoadCategories: FC<IRoadCategories> = ({ category }) => {
  const dispatch = useDispatch();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isView = useSelector(
    (state: RootState) => state.map_road[category]?.toggleRoadView,
    shallowEqual
  );

  // Fetch roads for this category
  const { data } = useGetCategoryRoads({
    category,
    bbox: "0.703125, 1.2852925793638545, 28.828125, 14.9341698993427",
    limit: 12,
  });

  // Convert coordinates if needed (assume data is a FeatureCollection)
  const convertedData: FeatureCollection = useMemo(() => {
    if (!data) return { type: "FeatureCollection", features: [] };
    // If you need to convert coordinates, do it here
    return data?.data as FeatureCollection;
  }, [data?.data]);

  useEffect(() => {
    dispatch(
      setRoadFeatures({
        category,
        features: convertedData?.features ?? null,
      })
    );
    dispatch(setToggleRoadView({ category, isOpen: true }));
  }, [category, convertedData, dispatch]);

  const handleToggleView = useCallback(() => {
    dispatch(setToggleRoadView({ category, isOpen: !isView }));
  }, [dispatch, category, isView]);

  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex items-center justify-between p-2 border-b last:border-0">
      <Typography className="capitalize">
        {category?.replace(/_/g, " ")}
      </Typography>
      <div className="flex items-center gap-3">
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
      {isDetailsOpen ? (
        <RoadDrawerDetails
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
