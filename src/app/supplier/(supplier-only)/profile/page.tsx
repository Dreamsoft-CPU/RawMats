import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import EditableProfileCard from "@/components/supplier/profile/EditableProfileCard";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierProfile = async () => {
  const sidebarData = await getSidebarData();
  const userData = await getDbUser();

  if ("error" in userData) {
    return <div>Error loading user data. Please refresh.</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset userData={userData}>
        <EditableProfileCard userData={userData} />
      </SupplierInset>
    </div>
  );
};

export default SupplierProfile;
