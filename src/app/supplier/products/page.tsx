import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import ProductList from "@/components/supplier/products/ProductList";
import ProductStatusCards from "@/components/supplier/products/ProductStatusCards";
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
      <SupplierInset userData={userData}>
        <div className="flex flex-col w-full gap-4">
          <ProductStatusCards userData={userData} />
          <ProductList userData={userData} />
        </div>
      </SupplierInset>
    </div>
  );
};

export default SupplierProducts;
