import { SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import CustomSidebarTrigger from "../CustomSidebarTrigger";
import { InsetProps } from "@/lib/interfaces/InsetProps";
import { NotificationPopover } from "@/components/notifications/NotificationPopover";

const SupplierInset: React.FC<InsetProps> = ({ children, userData }) => {
  return (
    <SidebarInset className="w-full">
      <header className="flex sticky z-10 bg-secondary-300 top-0 h-24 shrink-0 items-center justify-between border-b px-4 w-full">
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
        <div className="flex items-center gap-2">
          <NotificationPopover userData={userData} />
        </div>
      </header>
      <div className="flex z-0 w-full items-center justify-center gap-2 p-4">
        {children}
      </div>
    </SidebarInset>
  );
};

export default SupplierInset;
