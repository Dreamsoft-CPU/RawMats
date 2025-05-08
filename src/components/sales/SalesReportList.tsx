"use client";
import { SalesReport } from "@/utils/types/sales-report.type";
import React, { useState } from "react";
import EditSalesReportDialog from "./EditSalesReportDialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import CreateSalesReportDialog from "./CreateSalesReportDialog";
import { toast } from "sonner";
import { Product } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface SalesReportListProps {
  salesReports: SalesReport[];
  products: Product[];
  supplierId: string;
}

const SalesReportList: React.FC<SalesReportListProps> = ({
  salesReports,
  products,
  supplierId,
}) => {
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/sales-report/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Sales report deleted successfully");
        // Reload the page to refresh the list
        window.location.reload();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete sales report");
      }
    } catch (error) {
      toast.error("Failed to delete sales report");
      console.error("Error deleting sales report:", error);
    } finally {
      setReportToDelete(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-primary-500 font-bold">
          Sales Reports
        </CardTitle>
        <CreateSalesReportDialog supplierId={supplierId} products={products} />
      </CardHeader>
      <CardContent>
        {salesReports.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No sales reports found. Create your first report!
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-neutral-500 bg-opacity-20">
              <TableRow>
                <TableHead>Date Created</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Items Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-secondary-100">
                  <TableCell>
                    {format(new Date(report.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>${report.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{report.salesReportItems.length} items</TableCell>
                  <TableCell className="text-right space-x-2">
                    <EditSalesReportDialog
                      salesReport={report}
                      products={products}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => setReportToDelete(report.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Sales Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this sales report? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => reportToDelete && handleDelete(reportToDelete)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default SalesReportList;
