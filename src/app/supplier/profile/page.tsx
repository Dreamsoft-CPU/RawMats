import SupplierSidebar from "@/components/home/SupplierSidebar";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProfile = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div>
      <SupplierSidebar data={sidebarData} />
    </div>
  );
};

export default SupplierProfile;
