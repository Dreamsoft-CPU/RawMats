import { ItemVerificationComponent } from "@/components/admin/PendingProductCard";
import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import prisma from "@/utils/prisma";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const AdminProducts = async () => {
  const sidebarData = await getSidebarData();

  const products = await prisma.product.findMany({
    where: {
      verified: false,
    },
    include: {
      supplier: {
        include: {
          user: true,
        },
      },
    },
  });

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <ItemVerificationComponent products={products} />
      </AdminInset>
    </div>
  );
};

export default AdminProducts;
