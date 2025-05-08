"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { SalesReport } from "@/utils/types/sales-report.type";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronDown, Pencil, Plus, Search, Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import { Product } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

interface EditSalesReportDialogProps {
  salesReport: SalesReport;
  products: Product[];
}

const EditSalesReportDialog: React.FC<EditSalesReportDialogProps> = ({
  salesReport,
  products,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [totalAmount, setTotalAmount] = useState(salesReport.totalAmount);
  const [items, setItems] = useState(
    salesReport.salesReportItems.map((item) => {
      const product =
        item.product || products.find((p) => p.id === item.productId);
      const productPrice = product?.price || 0;

      return {
        productId: item.productId,
        quantity: item.quantity,
        productPrice: productPrice,
        totalPrice: item.totalPrice,
      };
    })
  );

  const recalculateTotal = () => {
    const total = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
    setTotalAmount(total);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, productPrice: 0, totalPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    setTimeout(recalculateTotal, 0);
  };

  const updateTotalPrice = (index: number, newQuantity: number) => {
    const item = items[index];
    const newTotalPrice = item.productPrice * newQuantity;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity: newQuantity,
      totalPrice: newTotalPrice,
    };
    setItems(newItems);
    setTimeout(recalculateTotal, 0);
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (field === "quantity") {
      updateTotalPrice(index, Number(value));
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find(
      (product) => product.id === productId
    );
    if (selectedProduct) {
      const productPrice = selectedProduct.price || 0;
      const quantity = items[index].quantity;
      const totalPrice = productPrice * quantity;

      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        productId: selectedProduct.id,
        productPrice,
        totalPrice,
      };
      setItems(newItems);
      setTimeout(recalculateTotal, 0);
    }
    setSearchQuery("");
  };

  // Filter products based on search query
  const getFilteredProducts = (query: string) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getProductById = (productId: string) => {
    return products.find((product) => product.id === productId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate the items
      const itemsToSubmit = items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        totalPrice: Number(item.totalPrice),
      }));

      // Simple validation before sending to API
      if (
        itemsToSubmit.some(
          (item) =>
            !item.productId || item.quantity <= 0 || item.totalPrice <= 0
        )
      ) {
        throw new Error("All items must have a product and quantity");
      }

      const response = await fetch(`/api/sales-report/${salesReport.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierId: salesReport.supplierId,
          totalAmount,
          salesReportItems: itemsToSubmit,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update sales report");
      }

      toast.success("Sales report updated successfully");
      setOpen(false);
      // Reload the page to refresh the data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update sales report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-accent-500 hover:text-accent-700"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary-500">
            Edit Sales Report
          </DialogTitle>
          <DialogDescription>
            Update the details of this sales report.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 border rounded-lg bg-secondary-100"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash size={14} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Product</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {item.productId
                              ? getProductById(item.productId)?.name ||
                                "Select product..."
                              : "Select product..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[280px]">
                          <div className="flex items-center border-b p-2">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <ScrollArea className="h-[200px]">
                            {getFilteredProducts(searchQuery).length > 0 ? (
                              getFilteredProducts(searchQuery).map(
                                (product) => (
                                  <DropdownMenuItem
                                    key={product.id}
                                    onClick={() =>
                                      handleProductSelect(index, product.id)
                                    }
                                  >
                                    {product.name} - $
                                    {product.price?.toFixed(2)}
                                  </DropdownMenuItem>
                                )
                              )
                            ) : (
                              <div className="text-center p-2 text-sm text-gray-500">
                                No products found
                              </div>
                            )}
                          </ScrollArea>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Unit Price</Label>
                      <div className="p-2 bg-gray-50 border rounded-md">
                        ${item.productPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Total</Label>
                      <div className="p-2 bg-gray-50 border rounded-md font-medium">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-1 border-dashed"
              onClick={handleAddItem}
            >
              <Plus size={16} /> Add Item
            </Button>

            <Separator />

            <div className="flex justify-between items-center">
              <Label htmlFor="totalAmount" className="text-lg font-medium">
                Total Amount
              </Label>
              <div className="text-xl font-bold text-primary-500">
                ${totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary-300 hover:bg-primary-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalesReportDialog;
