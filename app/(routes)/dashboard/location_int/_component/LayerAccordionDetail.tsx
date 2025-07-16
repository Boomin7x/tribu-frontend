// import { convertFakeDataCoordinates } from "@/app/_components/GeneralMap";
import { bbox } from "@/app/_utils";
import { setZoomToFeature } from "@/app/store/slice/map.slice";
import {
  setFeatures,
  setToggleMapView as setToggleView,
} from "@/app/store/slice/map_category.slice";
import { RootState } from "@/app/store/store";
import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { FeatureCollection } from "geojson";
import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import BuildingDrawerDetails from "../layers/_component/buildings/BuildingDrawerDetails";
import { useGetBuildingByCategory } from "../layers/_hooks/buildings";
import { IBuildingApiResponse } from "../layers/_utils/types/buildings/buildings_types";
import { convertFakeDataCoordinates } from "@/app/_utils/coordinateUtils";

interface ILayerAccordionDetail {
  category: string;
}
const LayerAccordionDetail: FC<ILayerAccordionDetail> = ({ category }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const dispatch = useDispatch();

  // Only select the toggle state for this category
  const isView = useSelector(
    (state: RootState) => state.map_many[category]?.toggleMavView,
    shallowEqual
  );

  const { data } = useGetBuildingByCategory({
    bbox: bbox.params,
    building_category: category,
    limit: 10,
    page: 1,
  });

  // Memoize conversion
  const convertedData: FeatureCollection = useMemo(
    () => convertFakeDataCoordinates(data),
    [data]
  );

  // Only update features when convertedData changes
  useEffect(() => {
    dispatch(
      setFeatures({
        category,
        features: convertedData?.features ?? null,
      })
    );
    dispatch(setToggleView({ category, isOpen: true }));
  }, [category, convertedData, dispatch]);

  // Memoize handlers
  const handleIsDetailsOpen = useCallback(() => {
    setIsDetailsOpen((prev) => !prev);
  }, []);

  const handleToggleView = useCallback(() => {
    dispatch(setToggleView({ category, isOpen: !isView }));
  }, [dispatch, category, isView]);

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
        <BuildingDrawerDetails
          data={data as IBuildingApiResponse}
          onClose={handleIsDetailsOpen}
          open={isDetailsOpen}
          onZoomToFeature={(feature) => dispatch(setZoomToFeature(feature))}
        />
      ) : null}
    </div>
  );
};

export default LayerAccordionDetail;
