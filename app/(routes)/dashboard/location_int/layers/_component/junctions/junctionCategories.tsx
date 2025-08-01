import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Typography, Tooltip, IconButton } from "@mui/material";
import { JunctionType } from "../../_utils/enum";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState } from "@/app/store/store";
import { setToggleJunctionView } from "@/app/store/slice/map_junction.slice";
import { setJunctionFeatures } from "@/app/store/slice/map_junction.slice";
import { useGetJunctions } from "../../_hooks/buildings/useGetJunctions";
import { FeatureCollection, Feature } from "geojson";
import JunctionDrawerDetails from "./JunctionDrawerDetails";
import { setZoomToJunctionFeature } from "@/app/store/slice/map_junction.slice";
import { cn } from "@/app/lib/tailwindLib";

interface IJunctionCategories {
  junction_type: JunctionType;
  junction_title: string;
}
const JunctionCategories: FC<IJunctionCategories> = ({
  junction_title,
  junction_type,
}) => {
  const dispatch = useDispatch();
  const isView = useSelector(
    (state: RootState) => state.map_junction[junction_type]?.toggleJunctionView,
    shallowEqual
  );

  const { data, isLoading } = useGetJunctions(
    {
      junction_type_code: junction_type,
      // limit: 10,
    },
    isView
  );

  // Convert coordinates to [lng, lat] and ensure numbers
  const convertedData: FeatureCollection = useMemo(() => {
    if (!data?.data) return { type: "FeatureCollection", features: [] };
    return {
      ...data.data,
      features: data.data.features.map((feature: Feature) => {
        if (
          feature.geometry.type === "Point" &&
          Array.isArray(feature.geometry.coordinates)
        ) {
          const coords = feature.geometry.coordinates.map(Number);
          return {
            ...feature,
            geometry: {
              ...feature.geometry,
              coordinates: [coords[0], coords[1]],
            },
          };
        }
        return feature;
      }),
    };
  }, [data?.data]);

  useEffect(() => {
    if (convertedData?.features?.length) {
      dispatch(
        setJunctionFeatures({
          category: junction_type,
          features: convertedData?.features ?? null,
        })
      );
    }
    // dispatch(setToggleJunctionView({ category: junction_type, isOpen: true }));
  }, [junction_type, convertedData, dispatch]);

  const handleToggleView = useCallback(() => {
    dispatch(
      setToggleJunctionView({ category: junction_type, isOpen: !isView })
    );
  }, [dispatch, junction_type, isView]);

  const handleZoomToFeature = useCallback(
    (feature: Feature) => {
      dispatch(setZoomToJunctionFeature({ category: junction_type, feature }));
    },
    [dispatch, junction_type]
  );

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 border-b last:border-0",
        isView && "bg-[#f59e42] text-white"
      )}
    >
      <Typography variant="subtitle1" gutterBottom>
        {junction_title}
      </Typography>
      <div className="flex items-center gap-3">
        {isLoading && (
          <div className="size-4 rounded-full border-2 border-t-gray-200/20 animate-spin" />
        )}
        <Tooltip title="More details" arrow>
          <IconButton
            aria-label="Button"
            disabled={!isView}
            disableRipple
            sx={{
              borderRadius: "3px",
              ...(isDetailsOpen && { backgroundColor: "#d97706" }),
              "&:hover": {
                backgroundColor: "#d97706",
                borderRadius: "3px",
              },
            }}
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
        <JunctionDrawerDetails
          open={isDetailsOpen}
          onClose={handleIsDetailsOpen}
          data={convertedData}
          onZoomToFeature={handleZoomToFeature}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default JunctionCategories;
