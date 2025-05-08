import SupplierSidebar from "@/components/home/SupplierSidebar";
import SalesReportList from "@/components/sales/SalesReportList";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";

const SupplierSales = async () => {
  const sidebarData = await getSidebarData();
  const userData = await getDbUser();

  if ("error" in userData) {
    return <div>Error loading user data. Please refresh.</div>;
  }

  const salesReportsData = await prisma.salesReport.findMany({
    where: { supplierId: userData.Supplier[0].id },
    include: {
      SalesReportItem: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data to match expected structure
  const salesReports = salesReportsData.map((report) => ({
    ...report,
    salesReportItems: report.SalesReportItem,
  }));

  const products = await prisma.product.findMany({
    where: { supplierId: userData.Supplier[0].id },
  });

  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset userData={userData}>
        <SalesReportList
          products={products}
          supplierId={userData.Supplier[0].id}
          salesReports={salesReports}
        />
      </SupplierInset>
    </div>
  );
};

export default SupplierSales;
