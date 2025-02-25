import AdminSidebar from "@/components/home/AdminSidebar";
import ProductCard from "@/components/products/ProductCard";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const AdminProducts = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <ProductCard />
      </AdminInset>
    </div>
  );
};

export default AdminProducts;
