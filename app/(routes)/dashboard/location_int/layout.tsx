import React, { FC } from "react";
import { LocationIntelligenceSidebar } from "./_component/LocationIntelligenceSidebar";
import "mapbox-gl/dist/mapbox-gl.css";

interface ILocationIntelligenceLayout {
  children: React.ReactNode;
}
const LocationIntelligenceLayout: FC<ILocationIntelligenceLayout> = ({
  children,
}) => {
  return (
    <div className="h-screen w-screen max-w-screen overflow-x-hidden grid grid-cols-5 max-h-screen relative overflow-y-hiiden">
      <LocationIntelligenceSidebar />
      <div className="col-span-4 size-full h-screen overflow-y-auto relative">
        {children}
      </div>
    </div>
  );
};

export default LocationIntelligenceLayout;
