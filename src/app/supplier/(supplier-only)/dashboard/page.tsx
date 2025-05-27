import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import { FavoritesBarChart } from "@/components/supplier/dashboard/FavoritesBarChart";
import { RatingsBarChart } from "@/components/supplier/dashboard/RatingsBarChart";
import { RecentRatingsList } from "@/components/supplier/dashboard/RecentRatingsList";
import ProductStatusCards from "@/components/supplier/products/ProductStatusCards";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierDashboard = async () => {
  const sidebarData = await getSidebarData();
  const userData = await getDbUser();

  if ("error" in userData) {
    return <div>Error loading user data. Please refresh.</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset userData={userData}>
        <div className="flex flex-col w-full gap-6">
          {/* Status Cards */}
          <ProductStatusCards userData={userData} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <FavoritesBarChart userData={userData} />
            <RatingsBarChart userData={userData} />
          </div>

          {/* Recent Ratings */}
          <RecentRatingsList userData={userData} />
        </div>
      </SupplierInset>
    </div>
  );
};

export default SupplierDashboard;
