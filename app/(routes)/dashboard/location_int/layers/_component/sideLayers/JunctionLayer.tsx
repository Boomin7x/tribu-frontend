import { Icon } from "@iconify/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { JunctionType } from "../../_utils/enum";
import JunctionCategories from "../junctions/junctionCategories";

const JUNCTION_TYPES = [
  JunctionType.ThreeWay,
  JunctionType.FourWay,
  JunctionType.Complex,
  JunctionType.Interchange,
];
const JUNCTION_TYPE_LABELS: Record<JunctionType, string> = {
  [JunctionType.ThreeWay]: "3-way Junctions",
  [JunctionType.FourWay]: "4-way Junctions",
  [JunctionType.Complex]: "Complex Junctions",
  [JunctionType.Interchange]: "Interchanges",
};

const JunctionLayer = () => {
  return (
    <div>
      <Accordion className="!m-0 !shadow-none !border-none">
        <AccordionSummary
          expandIcon={<Icon icon="tdesign:adjustment" className="size-5" />}
          aria-controls={`panel-${4}-content`}
          id={`panel-${4}-header`}
          className="!bg-gray-100 !m-0 !border-none"
        >
          <Typography component="span" className="capitalize">
            Junctions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {JUNCTION_TYPES?.map((items) => (
            <JunctionCategories
              key={items}
              junction_title={JUNCTION_TYPE_LABELS[items]}
              junction_type={items}
            />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default JunctionLayer;
