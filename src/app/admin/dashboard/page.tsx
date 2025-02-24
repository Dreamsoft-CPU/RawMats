import AdminSidebar from "@/components/home/AdminSidebar";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const AdminDashboard = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div>
      <AdminSidebar data={sidebarData} />
    </div>
  );
};

export default AdminDashboard;
