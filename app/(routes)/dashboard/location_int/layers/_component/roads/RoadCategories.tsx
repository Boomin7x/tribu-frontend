import { Icon } from "@iconify/react";
import { IconButton, Tooltip, Typography } from "@mui/material";
import React, { FC } from "react";
import { useGetCategoryRoads } from "../../_hooks/buildings";
import { bbox } from "@/app/_utils";

interface IRoadCategories {
  category: string;
}
const RoadCategories: FC<IRoadCategories> = ({ category }) => {
  const { data } = useGetCategoryRoads({
    bbox: bbox.params,
    category,
    limit: 10,
    page: 1,
  });

  console.log({ roads: data });
  return (
    <div className="flex items-center justify-between p-2 border-b last:border-0">
      <Typography className="capitalize">
        {category?.replace(/_/g, " ")}
      </Typography>
      <div className="flex items-center gap-3">
        <Tooltip title="More details" arrow>
          <IconButton
            aria-label="Button"
            // disabled={!isView}
            // onClick={handleIsDetailsOpen}
          >
            <Icon icon={"pixelarticons:open"} className="size-4" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle visibility" arrow>
          <IconButton onClick={() => {}}>
            <Icon
              icon={true ? "mdi:eye-outline" : "mdi:eye-off-outline"}
              className="size-4"
            />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default RoadCategories;
