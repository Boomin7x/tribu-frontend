import { Icon } from "@iconify/react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Fragment, useState } from "react";

export const LITargetSidebarContent = () => {
  const [selectedPersona, setselectedPersona] = useState("");
  const [addPersonaDrawer, setaddPersonaDrawer] = useState(false);
  return (
    <Fragment>
      <div className="flex items-center">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Select Persona</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedPersona}
            label="Select persona"
            // placeholder="Select persona"
            onChange={(e) => setselectedPersona(e.target.value)}
          >
            {/* <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
        <Tooltip title="Add new persona" placement="top" arrow>
          <div
            onClick={() => setaddPersonaDrawer(true)}
            className="flex shrink-0 items-center justify-center size-10 rounded-full bg-primary-700 text-white ml-4 cursor-pointer"
          >
            <Icon icon="tabler:plus" className="size-6" />
          </div>
        </Tooltip>
      </div>
      <div>
        <div className="px-4 py-1 flex items-center gap-1 rounded-full w-fit bg-primary-700 text-white">
          Persona 1
          <Icon icon="basil:cross-outline" className="size-6" />
        </div>
      </div>
      <Accordion className="!border-none !shadow-none">
        <AccordionSummary
          expandIcon={<Icon icon="tabler:plus" className="size-6" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      <Accordion className="!border-none !shadow-none">
        <AccordionSummary
          expandIcon={<Icon icon="tabler:plus" className="size-6" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          malesuada lacus ex, sit amet blandit leo lobortis eget.
        </AccordionDetails>
      </Accordion>
      {addPersonaDrawer ? (
        <Drawer
          open={addPersonaDrawer}
          onClose={() => setaddPersonaDrawer(false)}
          //   title="Add Persona"x
          anchor="right"
          PaperProps={{
            className: "min-w-[600px]",
          }}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-semibold">Add new persona</h2>
              <Icon
                onClick={() => setaddPersonaDrawer(false)}
                icon="tabler:x"
                className="size-6 cursor-pointer hover:scale-110 hover:text-primary-600 transition-transform"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Content goes here */}
              <p className="text-sm text-gray-600">
                {"Here you can manage your layers."}
              </p>
            </div>
          </div>
          <div className="p-4 border-t">
            <button className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 transition-colors">
              Add Layer
            </button>
          </div>
        </Drawer>
      ) : null}
    </Fragment>
  );
};
