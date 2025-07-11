import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

export const LoadingLayers = () => {
  return [1, 2, 3].map((_, i) => (
    <LayerAccordionLoading key={"skeleton" + i} />
  ));
};

export const LayerAccordionLoading = () => (
  <Accordion
    className="!m-0 !shadow-none !border-none"
    expanded
    // disabled
  >
    <AccordionSummary
      expandIcon={<div className="size-5 bg-gray-200 rounded-full" />}
      aria-controls="panel1-content"
      id="panel1-header"
      className="!bg-gray-100 !m-0 !border-none"
    >
      <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
    </AccordionSummary>
    <AccordionDetails>
      {[1, 2, 3].map((_, i) => (
        <div
          key={`skeleton-child` + i}
          className="flex items-center justify-between p-2 border-b last:border-0"
        >
          <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="size-4 bg-gray-200 rounded-sm animate-pulse" />
        </div>
      ))}
    </AccordionDetails>
  </Accordion>
);

// export default LoadingLayers;
