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

  const isAdmin = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
    select: {
      role: true,
    },
  });

  // redirect if user is not an admin
  if (isAdmin && isAdmin.role !== "ADMIN") {
    redirect("/");
  }

  const fetchedProducts = await prisma.product.findMany({
    where: {
      verified: false,
    },
  });

  for (const product of fetchedProducts) {
    const { data, error } = await supabase.storage
      .from("photos")
      .createSignedUrl(`${product.image}`, 3600);

    if (error) {
      console.error(
        "Error fetching signed URL for product image:",
        error.message,
      );
    }

    if (data) {
      product.image = data.signedUrl;
    }
  }

  const fetchedSuppliers = await prisma.supplier.findMany({
    where: {
      verified: false,
    },
    include: {
      user: true,
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
