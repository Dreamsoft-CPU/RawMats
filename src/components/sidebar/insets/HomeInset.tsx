import SearchBar from "@/components/home/SearchBar";
import { SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import CustomSidebarTrigger from "../CustomSidebarTrigger";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";
import { InsetProps } from "@/lib/interfaces/InsetProps";

const HomeInset: React.FC<InsetProps> = ({ children, userData }) => {
  return (
    <SidebarInset>
      <header className="flex sticky bg-secondary-300 top-0 h-24 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <CustomSidebarTrigger />
          <Image
            src={"/logo-text.png"}
            alt="RawMats"
            width={400}
            height={400}
            className="hidden md:block"
          />
        </div>
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2 md:mr-8">
          <NotificationPopover userData={userData} />
        </div>
      </header>
      <div className="flex p-4">{children}</div>
    </SidebarInset>
  );
};

export default HomeInset;
