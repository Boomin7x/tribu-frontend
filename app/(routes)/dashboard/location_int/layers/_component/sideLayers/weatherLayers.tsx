import { cn } from "@/app/lib/tailwindLib";
import { IconButton, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useGetWeatherByCoordinates from "../../_hooks/weather/useGetWeatherByCoordinates";

const WeatherLayers = () => {
  //   const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const handleIsDetailsOpen = () => {
    setIsDetailsOpen(!isDetailsOpen);
  };
  const handleToggleView = () => {
    setIsView(!isView);
  };

  const { data, isLoading, isError } = useGetWeatherByCoordinates(
    {
      lat: 7.3697,
      lon: 12.3547,
      buffer_radius: 1000,
    },
    isView
  );

  console.log("weather Data", data);
  if (isError || !data) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between p-2 border-b last:border-0",
        isView && "text-white"
      )}
      style={
        isView
          ? {
              backgroundColor: "#f59e42",
            }
          : {}
      }
    >
      <Typography variant="subtitle1" gutterBottom>
        Weather
      </Typography>
      <div className="flex items-center gap-3">
        {isLoading && (
          <div className="size-4 rounded-full border-2 border-t-gray-200/20 animate-spin" />
        )}
        <Tooltip title="More details" arrow>
          <IconButton
            aria-label="Button"
            disabled={!isView}
            disableRipple
            sx={{
              borderRadius: "3px",
              ...(isDetailsOpen && { backgroundColor: "#d97706" }),
              "&:hover": {
                backgroundColor: "#d97706",
                borderRadius: "3px",
              },
            }}
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
      {/* {isDetailsOpen && (
    <JunctionDrawerDetails
      open={isDetailsOpen}
      onClose={handleIsDetailsOpen}
      data={convertedData}
      onZoomToFeature={handleZoomToFeature}
      isLoading={isLoading}
    />
  )} */}
    </div>
  );
};

export default WeatherLayers;
