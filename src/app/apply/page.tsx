import { SupplierRegistrationForm } from "@/components/applyAsSupplier/SupplierRegistrationForm";
import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { redirect } from "next/navigation";
import React from "react";

const SupplierApplication = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  if (sidebarData.isSupplierPending) {
    redirect("/");
  }

  if (user.Supplier[0]) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-full ">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <SupplierRegistrationForm />
      </HomeInset>
    </div>
  );
};

export default SupplierApplication;
