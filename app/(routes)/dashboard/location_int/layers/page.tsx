// import { GeneralMaps } from "@/app/_components/GeneralMap";
"use client";
import dynamic from "next/dynamic";

const GeneralMaps = dynamic(() => import("@/app/_components/GeneralMap"), {
  ssr: false,
});
import React from "react";

const LocationIntelligenceLayersPage = () => {
  return (
    <div className=" size-full relative overflow-hidden">
      <GeneralMaps />
    </div>
  );
  // return <>fixes made</>;
};

export default LocationIntelligenceLayersPage;
