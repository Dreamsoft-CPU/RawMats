import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProfile = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset>
        <p></p>
      </SupplierInset>
    </div>
  );
};

export default SupplierProfile;
