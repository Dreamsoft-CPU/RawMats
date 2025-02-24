import SupplierSidebar from "@/components/home/SupplierSidebar";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProducts = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div>
      <SupplierSidebar data={sidebarData} />
    </div>
  );
};

export default SupplierProducts;
