import { SidebarInset } from "@/components/ui/sidebar";
import React from "react";
import CustomSidebarTrigger from "../CustomSidebarTrigger";
import ClickableLogo from "../ClickableLogo";

const AdminInset = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarInset>
      <header className="flex sticky z-40 bg-secondary-300 top-0 h-24 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex items-center gap-2">
          <CustomSidebarTrigger />
          <ClickableLogo url="/admin/dashboard" />
        </div>
      </header>
      {children}
    </SidebarInset>
  );
};

export default AdminInset;
