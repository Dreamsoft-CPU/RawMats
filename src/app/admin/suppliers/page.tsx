import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const AdminSuppliers = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <p></p>
      </AdminInset>
    </div>
  );
};

export default AdminSuppliers;
