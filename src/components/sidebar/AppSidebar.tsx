"use client";

import * as React from "react";

import { NavMain } from "./components/NavMain";
import { PageSwitcher } from "./components/SwitcherPopup";
import { NavUser } from "./components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/lib/types/sidebarData.type";
import { Home } from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  data: SidebarData;
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  const { pages } = data;
  const newPages = [{ name: "Home", logo: Home, url: "/" }, ...pages];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <PageSwitcher pages={newPages} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
