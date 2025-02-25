import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import CreateProductForm from "@/components/supplier/products/CreateProductForm";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProducts = async () => {
  const sidebarData = await getSidebarData();
  const userData = await getDbUser();

  if ("error" in userData) {
    return <div>Error loading user data. Please refresh.</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset>
        <CreateProductForm supplierId={userData.Supplier[0].id} />
      </SupplierInset>
    </div>
  );
};

export default SupplierProducts;
