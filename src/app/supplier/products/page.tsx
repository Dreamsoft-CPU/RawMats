import SupplierSidebar from "@/components/home/SupplierSidebar";
import ProductCard from "@/components/products/ProductCard";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProducts = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset>
        <ProductCard />
      </SupplierInset>
    </div>
  );
};

export default SupplierProducts;
