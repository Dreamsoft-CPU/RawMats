"use client";
import React from "react";
import { SalesReport } from "@/utils/types/sales-report.type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SupplierSalesChart from "./SupplierSalesChart";
import { SalesDataPoint } from "./SalesChart";

interface SupplierSalesReportProps {
  supplier: {
    id: string;
    businessName: string;
  };
  salesReports: SalesReport[];
  dailyData: SalesDataPoint[];
  weeklyData: SalesDataPoint[];
  monthlyData: SalesDataPoint[];
  yearlyData: SalesDataPoint[];
}

const SupplierSalesReport: React.FC<SupplierSalesReportProps> = ({
  supplier,
  salesReports,
  dailyData,
  weeklyData,
  monthlyData,
  yearlyData,
}) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-500">
          {supplier.businessName} - Sales Reports
        </h1>
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back to All Suppliers
        </Button>
      </div>

      <SupplierSalesChart
        supplierName={supplier.businessName}
        dailyData={dailyData}
        weeklyData={weeklyData}
        monthlyData={monthlyData}
        yearlyData={yearlyData}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary-500">
            Detailed Sales Reports
          </CardTitle>
          <CardDescription>
            Complete history of all sales reports submitted by this supplier
          </CardDescription>
        </CardHeader>
        <CardContent>
          {salesReports.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No sales reports found for this supplier.
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {salesReports.map((report) => (
                <AccordionItem key={report.id} value={report.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <span>
                        Report from{" "}
                        {format(new Date(report.createdAt), "MMM dd, yyyy")}
                      </span>
                      <span className="font-semibold">
                        ₱{report.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader className="bg-secondary-100">
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">
                            Unit Price
                          </TableHead>
                          <TableHead className="text-right">
                            Total Price
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.salesReportItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.product?.name || "Unknown Product"}
                            </TableCell>
                            <TableCell className="text-right">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                              ₱{(item.totalPrice / item.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              ₱{item.totalPrice.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-2 text-right font-bold">
                      Total: ₱{report.totalAmount.toFixed(2)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplierSalesReport;
