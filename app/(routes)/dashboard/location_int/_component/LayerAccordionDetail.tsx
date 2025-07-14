import { bbox } from "@/app/_utils";
import {
  setToggleMapView,
  setZoomToFeature,
} from "@/app/store/slice/map.slice";
import { Icon } from "@iconify/react";
import { IconButton, Typography } from "@mui/material";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BuildingDrawerDetails from "../layers/_component/buildings/BuildingDrawerDetails";
import { useGetBuildingByCategory } from "../layers/_hooks/buildings";
import { IBuildingApiResponse } from "../layers/_utils/types/buildings/buildings_types";
import { RootState } from "@/app/store/store";

interface ILayerAccordionDetail {
  category: string;
}
const LayerAccordionDetail: FC<ILayerAccordionDetail> = ({ category }) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const isViewMap = useSelector((state: RootState) => state.map.toggleMavView);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleIsDetailsOpen = () => {
    setIsDetailsOpen((prev) => !prev);
  };

  const { data } = useGetBuildingByCategory({
    bbox: bbox.params,
    building_category: category,
    limit,
    page,
  });
  return (
    <div className="flex items-center  justify-between p-2 border-b last:border-0">
      <Typography className="capitalize">
        {category?.replace(/_/g, " ")}
      </Typography>
      <div className="flex items-center gap-3">
        <IconButton disabled={!isViewMap} onClick={handleIsDetailsOpen}>
          <Icon icon={"pixelarticons:open"} className="size-4" />
        </IconButton>
        <IconButton
          onClick={() => {
            dispatch(setToggleMapView(!isViewMap));
          }}
        >
          <Icon
            icon={isViewMap ? "mdi:eye-outline" : "mdi:eye-off-outline"}
            className="size-4"
          />
        </IconButton>
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
