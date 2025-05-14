import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import { getSidebarData } from "@/utils/server/getSidebarData";
import React from "react";
import SalesChart from "@/components/admin/sales/SalesChart";
import AllSalesReportList from "@/components/admin/sales/AllSalesReportList";
import prisma from "@/utils/prisma";
import { format } from "date-fns";

// Function to aggregate sales data for the chart
const aggregateSalesData = async () => {
  // Fetch all sales reports
  const salesReports = await prisma.salesReport.findMany({
    include: {
      supplier: true,
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

// Function to get all suppliers with sales reports
const getSuppliersWithSales = async () => {
  // Get all suppliers who have at least one sales report
  const supplierData = await prisma.supplier.findMany({
    where: {
      SalesReport: {
        some: {},
      },
    },
    include: {
      SalesReport: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const suppliers = supplierData.map((supplier) => ({
    ...supplier,
    salesReports: supplier.SalesReport.map((report) => ({
      ...report,
      createdAt: report.createdAt.toString(),
    })),
  }));

  // Format data for the component
  return suppliers.map((supplier) => {
    const totalSales = supplier.salesReports.reduce(
      (sum, report) => sum + report.totalAmount,
      0
    );

    const lastReportDate =
      supplier.salesReports.length > 0
        ? format(new Date(supplier.salesReports[0].createdAt), "MMM dd, yyyy")
        : "N/A";

    return {
      id: supplier.id,
      name: supplier.businessName,
      reportCount: supplier.salesReports.length,
      totalSales,
      lastReportDate,
    };
  });
};

const AdminSales = async () => {
  const sidebarData = await getSidebarData();
  const salesData = await aggregateSalesData();
  const suppliersWithSales = await getSuppliersWithSales();

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-primary-500">
            Sales Dashboard
          </h1>

          <SalesChart
            dailyData={salesData.dailyData}
            weeklyData={salesData.weeklyData}
            monthlyData={salesData.monthlyData}
            yearlyData={salesData.yearlyData}
          />

          <AllSalesReportList suppliers={suppliersWithSales} />
        </div>
      </AdminInset>
    </div>
  );
};

export default AdminSales;
