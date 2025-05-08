import React from "react";
import prisma from "@/utils/prisma";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import SupplierSalesReport from "@/components/admin/sales/SupplierSalesReport";
import { format } from "date-fns";

// Function to aggregate sales data for a specific supplier
const aggregateSupplierSalesData = async (supplierId: string) => {
  // Fetch all sales reports for this supplier
  const salesReports = await prisma.salesReport.findMany({
    where: {
      supplierId: supplierId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Process data into different time intervals
  const dailyData: { date: string; amount: number }[] = [];
  const weeklyData: { date: string; amount: number }[] = [];
  const monthlyData: { date: string; amount: number }[] = [];
  const yearlyData: { date: string; amount: number }[] = [];

  // Group by day
  const dailyMap = new Map<string, number>();
  // Group by week (using the first day of week)
  const weeklyMap = new Map<string, number>();
  // Group by month
  const monthlyMap = new Map<string, number>();
  // Group by year
  const yearlyMap = new Map<string, number>();

  salesReports.forEach((report) => {
    const date = new Date(report.createdAt);

    // Daily format: "Jul 15"
    const dayKey = format(date, "MMM dd");
    dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + report.totalAmount);

    // Weekly format: "Week 28"
    const weekKey = `Week ${format(date, "w")}`;
    weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + report.totalAmount);

    // Monthly format: "Jul 2023"
    const monthKey = format(date, "MMM yyyy");
    monthlyMap.set(
      monthKey,
      (monthlyMap.get(monthKey) || 0) + report.totalAmount
    );

    // Yearly format: "2023"
    const yearKey = format(date, "yyyy");
    yearlyMap.set(yearKey, (yearlyMap.get(yearKey) || 0) + report.totalAmount);
  });

  // Convert maps to arrays
  dailyMap.forEach((amount, date) => {
    dailyData.push({ date, amount });
  });

  weeklyMap.forEach((amount, date) => {
    weeklyData.push({ date, amount });
  });

  monthlyMap.forEach((amount, date) => {
    monthlyData.push({ date, amount });
  });

  yearlyMap.forEach((amount, date) => {
    yearlyData.push({ date, amount });
  });

  return {
    dailyData: dailyData.sort((a, b) => a.date.localeCompare(b.date)),
    weeklyData: weeklyData.sort((a, b) => a.date.localeCompare(b.date)),
    monthlyData: monthlyData.sort((a, b) => a.date.localeCompare(b.date)),
    yearlyData: yearlyData.sort((a, b) => a.date.localeCompare(b.date)),
  };
};

// Get supplier data with all sales reports
const getSupplierData = async (supplierId: string) => {
  const supplier = await prisma.supplier.findUnique({
    where: {
      id: supplierId,
    },
  });

  if (!supplier) {
    return null;
  }

  const salesReports = await prisma.salesReport.findMany({
    where: {
      supplierId: supplierId,
    },
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

  // Map the SalesReportItem to salesReportItems to match the expected type
  const typedSalesReports = salesReports.map((report) => ({
    ...report,
    salesReportItems: report.SalesReportItem,
  }));

  return {
    supplier,
    salesReports: typedSalesReports,
  };
};

interface PageProps {
  params: {
    id: string;
  };
}

const SupplierSalesPage = async ({ params }: PageProps) => {
  const sidebarData = await getSidebarData();
  const supplierData = await getSupplierData(params.id);

  if (!supplierData) {
    notFound();
  }

  const salesChartData = await aggregateSupplierSalesData(params.id);

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <div className="p-6">
          <SupplierSalesReport
            supplier={supplierData.supplier}
            salesReports={supplierData.salesReports}
            dailyData={salesChartData.dailyData}
            weeklyData={salesChartData.weeklyData}
            monthlyData={salesChartData.monthlyData}
            yearlyData={salesChartData.yearlyData}
          />
        </div>
      </AdminInset>
    </div>
  );
};

export default SupplierSalesPage;
