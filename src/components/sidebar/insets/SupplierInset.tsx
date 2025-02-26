import { SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import CustomSidebarTrigger from "../CustomSidebarTrigger";

const SupplierInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset className="w-full">
      <header className="flex sticky bg-secondary-300 top-0 h-24 shrink-0 items-center gap-2 border-b px-4 w-full">
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
      </header>
      <div className="flex w-full items-center justify-center gap-2 p-4">
        {children}
      </div>
    </SidebarInset>
  );
};

export default SupplierInset;
