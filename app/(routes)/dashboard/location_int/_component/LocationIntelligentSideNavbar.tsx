"use client";
import React from "react";
import { RouteNames } from "../_utils";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/tailwindLib";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { INavItem } from "../_utils/types";

const LocationIntelligentSideNavbar = () => {
  const navItems: INavItem[] = [
    {
      name: "Target",
      icon: "ph:crosshair",
      Link: RouteNames.location_int_target,
    },

    {
      name: "Contacts",
      icon: "carbon:enterprise",
      Link: RouteNames.location_int_contacts,
    },
    {
      name: "Layers",
      icon: "bi:layers",
      Link: RouteNames.location_int_layers,
    },
    {
      name: "Campaigns",
      icon: "ep:data-analysis",
      Link: RouteNames.location_int_campaigns,
    },
  ];

  return (
    <div className="flex ">
      {navItems.map((item) => (
        <NavItem key={item?.Link} {...item} />
      ))}
    </div>
  );
};

const NavItem = (item: INavItem) => {
  const pathname = usePathname();
  return (
    <Link
      key={item.name}
      href={item.Link}
      className={cn(
        "flex group hover:text-primary-600 items-center min-w-[4rem] justify-center h-[4rem] px-4  gap-x-2  transition-colors",
        pathname.includes(item?.Link) &&
          "border-b-2 border-primary-600 text-primary-600"
      )}
    >
      <Tooltip title={item.name} placement="bottom" arrow>
        <Icon icon={item.icon} className="size-6" />
      </Tooltip>
      <span
        className={cn(
          "max-w-0 overflow-hidden  transition-all  duration-300 ease-in-out ",
          pathname.includes(item?.Link) && "max-w-full"
        )}
      >
        {item.name}
      </span>
    </Link>
  );
};

export default LocationIntelligentSideNavbar;
