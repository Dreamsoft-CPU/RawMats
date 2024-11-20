import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import prisma from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const DesktopAdminDashboard = dynamic(
  () => import("@/components/admin/DesktopAdminDashboard"),
  {
    loading: () => <p>Loading desktop admin dashboard...</p>,
    ssr: true,
  },
);

const MobileAdminDashboard = dynamic(
  () => import("@/components/admin/MobileAdminDashboard"),
  {
    loading: () => <p>Loading mobile admin dashboard...</p>,
    ssr: true,
  },
);

const AdminDashboard = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }
  const fetchedProducts = await prisma.product.findMany({
    where: {
      verified: false,
    },
  });
  const fetchedSuppliers = await prisma.supplier.findMany({
    where: {
      verified: false,
    },
  });

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden md:flex w-full h-screen items-center justify-center">
          <DesktopAdminDashboard
            fetchedProducts={fetchedProducts}
            fetchedSuppliers={fetchedSuppliers}
          />
        </div>
        <div className="md:hidden w-full h-screen">
          <MobileAdminDashboard
            fetchedProducts={fetchedProducts}
            fetchedSuppliers={fetchedSuppliers}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default AdminDashboard;
