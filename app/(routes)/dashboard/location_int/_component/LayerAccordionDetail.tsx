import { AccordionDetails, Typography } from "@mui/material";
import { Icon } from "@iconify/react";
import React, { FC, useState } from "react";
import { useGetBuildingByCategory } from "../layers/_hooks/buildings";
import { bbox } from "@/app/_utils";
import BuildingDrawerDetails from "../layers/_component/buildings/BuildingDrawerDetails";
import { IBuildingApiResponse } from "../layers/_utils/types/buildings/buildings_types";

interface ILayerAccordionDetail {
  category: string;
}
const LayerAccordionDetail: FC<ILayerAccordionDetail> = ({ category }) => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
    <div className="flex items-center bg-green-300 justify-between p-2 border-b last:border-0">
      <Typography className="capitalize">
        {category?.replace(/_/g, " ")}
      </Typography>
      <Icon
        icon="mdi:eye-outline"
        className="size-4"
        onClick={handleIsDetailsOpen}
      />
      {isDetailsOpen ? (
        <BuildingDrawerDetails
          data={data as IBuildingApiResponse}
          onClose={handleIsDetailsOpen}
          open={isDetailsOpen}
        />
      ) : null}
    </div>
  );
};

export default LayerAccordionDetail;
