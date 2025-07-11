import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { Icon } from "@iconify/react";

interface ILayerAccordion {
  category: string[];
  title: string;
}
export const LayerAccordion: FC<ILayerAccordion> = ({ category, title }) => {
  return (
    <Accordion
      //   key={'layerItems' + i}
      className="!m-0 !shadow-none !border-none"
    >
      <AccordionSummary
        expandIcon={<Icon icon={"tdesign:adjustment"} className="size-5" />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="!bg-gray-100 !m-0 !border-none"
      >
        <Typography component="span" className="capitalize">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {category?.map((items, i) => {
          return (
            <div
              key={`items?.children` + i}
              className="flex items-center justify-between p-2 border-b last:border-0"
            >
              <Typography className="capitalize">
                {items?.replace(/_/g, " ")}
              </Typography>
              <Icon icon="mdi:eye-outline" className="size-4" />
            </div>
          );
        })}
      </AccordionDetails>
    </Accordion>
  );
};
