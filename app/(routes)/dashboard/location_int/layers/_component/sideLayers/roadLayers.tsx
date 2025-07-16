import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
} from "@mui/material";
import { LayerAccordionLoading } from "../../../_component/LayerAccordionLoading";
import { useGetRoadCategories } from "../../_hooks/roads";
import { Icon } from "@iconify/react";
import RoadCategories from "../roads/RoadCategories";
import React, { useState } from "react";

export const RoadLayers = () => {
  const { data, isLoading } = useGetRoadCategories();
  const roadCategories = data?.data as string[];
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return <LayerAccordionLoading />;
  }
  if (!data || !roadCategories?.length) return null;

  const displayedCategories = showAll
    ? roadCategories
    : roadCategories.slice(0, 5);

  return (
    <Accordion className="!m-0 !shadow-none !border-none">
      <AccordionSummary
        expandIcon={<Icon icon={"tdesign:adjustment"} className="size-5" />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="!bg-gray-100 !m-0 !border-none"
      >
        <Typography component="span" className="capitalize">
          Roads
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {displayedCategories.map((items, i) => (
          <RoadCategories key={"road-category" + i} category={items} />
        ))}
        {roadCategories.length > 5 && (
          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={() => setShowAll((prev) => !prev)}
            sx={{ mt: 1 }}
          >
            {showAll ? "See Less" : "See More"}
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
