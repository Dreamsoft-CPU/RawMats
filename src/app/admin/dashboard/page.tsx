import AnalyticsPage from "@/components/admin/dashboard/AnalyticsPage";
import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const AdminDashboard = async () => {
  const sidebarData = await getSidebarData();
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <AnalyticsPage />
      </AdminInset>
    </div>
  );
};

export default AdminDashboard;
