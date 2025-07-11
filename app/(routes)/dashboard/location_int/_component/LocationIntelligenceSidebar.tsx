"use client";
import { usePathname } from "next/navigation";
import { RouteNames } from "../_utils";
import LocationIntelligentSideNavbar from "./LocationIntelligentSideNavbar";
import { LITargetSidebarContent } from "../target/_components/LITagetSideBarContent";
import { LILayerSidebarContent } from "../layers/_component/LILayerSidebarContent";
import { LIContactSidebarContent } from "../contacts/_components/LIContactSidebarContent";
import LICampaignSidebarContent from "../campaigns/_component/LICampaignSidebarContent";

export const LocationIntelligenceSidebar = () => {
  const urlPrefix = RouteNames.location_int + "/";
  const pathname = usePathname();

  console.log("current path", urlPrefix + RouteNames.location_int_layers);
  return (
    <div className="flex-1 flex flex-col border-r h-screen relative !overflow-x-visible">
      <div className="flex w-full border-b shrink-0">
        <LocationIntelligentSideNavbar />
      </div>
      <div className="w-full flex-1 h-full overflow-y-auto !overflow-x-visible relative flex flex-col gap-2 py-6 px-4">
        {pathname?.includes(urlPrefix + RouteNames.location_int_target) ? (
          <LITargetSidebarContent />
        ) : null}
        {pathname?.includes(urlPrefix + RouteNames.location_int_layers) ? (
          <LILayerSidebarContent />
        ) : null}
        {pathname?.includes(urlPrefix + RouteNames.location_int_contacts) ? (
          <LIContactSidebarContent />
        ) : null}
        {pathname?.includes(urlPrefix + RouteNames.location_int_campaigns) ? (
          <LICampaignSidebarContent />
        ) : null}
      </div>
    </div>
  );
};
