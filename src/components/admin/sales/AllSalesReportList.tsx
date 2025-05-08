"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface SupplierWithSalesData {
  id: string;
  name: string;
  reportCount: number;
  totalSales: number;
  lastReportDate: string;
}

interface AllSalesReportListProps {
  suppliers: SupplierWithSalesData[];
}

const AllSalesReportList: React.FC<AllSalesReportListProps> = ({
  suppliers,
}) => {
  const router = useRouter();

  const handleViewSupplier = (supplierId: string) => {
    router.push(`/admin/sales/supplier/${supplierId}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary-500">
          Suppliers with Sales Reports
        </CardTitle>
        <CardDescription>
          Overview of all suppliers and their sales activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        {suppliers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No suppliers with sales reports found.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-neutral-500 bg-opacity-20">
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead className="text-right">Reports</TableHead>
                <TableHead className="text-right">Total Sales</TableHead>
                <TableHead className="text-right">Last Report</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="hover:bg-secondary-100">
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell className="text-right">
                    {supplier.reportCount}
                  </TableCell>
                  <TableCell className="text-right">
                    ₱{supplier.totalSales.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {supplier.lastReportDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-accent-500 hover:text-accent-700"
                      onClick={() => handleViewSupplier(supplier.id)}
                    >
                      View Details
                      <ChevronRight size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AllSalesReportList;
