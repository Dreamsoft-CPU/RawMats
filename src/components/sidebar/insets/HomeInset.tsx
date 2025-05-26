import SearchBar from "@/components/home/SearchBar";
import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import CustomSidebarTrigger from "../CustomSidebarTrigger";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { InsetProps } from "@/lib/interfaces/InsetProps";
import ClickableLogo from "../ClickableLogo";

const HomeInset: React.FC<InsetProps> = ({ children, userData }) => {
  return (
    <SidebarInset>
      <header className="flex flex-col sm:flex-row sticky z-40 bg-secondary-300 top-0 h-auto sm:h-24 shrink-0 items-center sm:items-center gap-2 border-b px-4 py-2">
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <CustomSidebarTrigger />
          <ClickableLogo url="/" />
          <div className="flex items-center gap-2 sm:hidden">
            <NotificationPopover userData={userData} />
          </div>
        </div>
        <div className="flex-1 flex justify-center w-full sm:w-auto">
          <SearchBar />
        </div>
        <div className="hidden sm:flex items-center gap-2 md:mr-8">
          <NotificationPopover userData={userData} />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <div className="flex p-4">{children}</div>
      </div>
    </SidebarInset>
  );
};

export default HomeInset;
