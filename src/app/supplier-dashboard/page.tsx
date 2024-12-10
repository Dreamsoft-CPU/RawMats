import React from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import prisma from "@/utils/prisma/client";

const DesktopSupplier = dynamic(
  () => import("@/components/supplier-dashboard/DesktopSupplier"),
  {
    loading: () => <p>Loading desktop supplier dashboard...</p>,
    ssr: true,
  }
);

const MobileSupplier = dynamic(
  () => import("@/components/supplier-dashboard/MobileSupplier"),
  {
    loading: () => <p>Loading mobile supplier dashboard...</p>,
    ssr: true,
  }
);

const SupplierDashboard = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/");
  }

  const isSupplier = await prisma.supplier.findUnique({
    where: {
      userId: data.user.id,
      verified: true,
    },
    include: {
      user: true,
    },
  });

  if (!isSupplier) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: {
      supplier: {
        userId: data.user.id,
      },
    },
  });


  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden md:flex w-full h-screen items-center justify-center">
          <DesktopSupplier
            fetchedProducts={products}
            userID={isSupplier.id}
            supplierName={supplierName}
          />
        </div>
        <div className="md:hidden w-full h-screen">
          <MobileSupplier
            fetchedProducts={products}
            userID={isSupplier.id}
            supplierName={supplierName}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default SupplierDashboard;
