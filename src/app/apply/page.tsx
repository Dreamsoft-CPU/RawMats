import { SupplierRegistrationForm } from "@/components/applyAsSupplier/SupplierRegistrationForm";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { redirect } from "next/navigation";
import React from "react";

const SupplierApplication = async () => {
  const sidebarData = await getSidebarData();

  if (sidebarData.isSupplierPending) {
    redirect("/");
  }

  return (
    <div>
      <SupplierRegistrationForm />
    </div>
  );
};

export default SupplierApplication;
