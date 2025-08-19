// import { convertFakeDataCoordinates } from "@/app/_components/GeneralMap";
import { cn } from "@/app/lib/tailwindLib";
import { setZoomToFeature } from "@/app/store/slice/map.slice";
import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import BuildingDrawerDetails from "../layers/_component/buildings/BuildingDrawerDetails";
import useBuildingCategoriesUtils from "../layers/_hooks/buildings/useBuildingCategoriesUtils";
import { IBuildingApiResponse } from "../layers/_utils/types/buildings/buildings_types";
import { BUILDING_CATEGORY_COLORS } from "@/app/_hooks/useBuildingUtils";
import { isColorLight } from "../layers/_utils";

interface ILayerAccordionDetail {
  category: string;
}
const LayerAccordionDetail: FC<ILayerAccordionDetail> = ({ category }) => {
  const {
    data,
    dispatch,
    handleIsDetailsOpen,
    handleToggleView,
    isDetailsOpen,
    isLoading,
    isView,
    isFetching,
    // fetchMore,
  } = useBuildingCategoriesUtils({ category });

  const buildingColor = useMemo(
    () => BUILDING_CATEGORY_COLORS[category] || "#8B5CF6",
    [category]
  );
  const textColor = useMemo(() => {
    if (!isView) return undefined;
    return isColorLight(buildingColor) ? "black" : "white";
  }, [isView, buildingColor]);

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 border-b last:border-0"
      )}
      style={{
        backgroundColor: isView ? buildingColor : undefined,
        color: textColor,
      }}
    >
      <Typography className="capitalize">
        {category?.replace(/_/g, " ")}
      </Typography>
      <div className="flex items-center gap-3">
        {isLoading && (
          <div className="size-4 rounded-full border-2 border-t-gray-200/20 animate-spin" />
        )}
        <div />
        <Tooltip title="More details" arrow>
          <IconButton
            color="inherit"
            aria-label="Button"
            disabled={!isView}
            onClick={handleIsDetailsOpen}
          >
            <Icon icon={"pixelarticons:open"} className="size-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle visibility" arrow>
          <IconButton color="inherit" onClick={handleToggleView}>
            <Icon
              icon={isView ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              className="size-4"
            />
          </IconButton>
        </Tooltip>
      </div>
      {/* {isDetailsOpen ? ( */}
      <BuildingDrawerDetails
        fetchMore={() => {}}
        data={data as IBuildingApiResponse}
        onClose={handleIsDetailsOpen}
        open={isDetailsOpen}
        isLoading={isLoading}
        isFetching={isFetching}
        category={category}
        onZoomToFeature={(feature) => dispatch(setZoomToFeature(feature))}
      />
      {/* ) : null} */}
    </div>
  );
};

export default LayerAccordionDetail;
