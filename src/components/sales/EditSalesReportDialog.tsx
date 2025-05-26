"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ChevronDown, Pencil, Plus, Trash, Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { Product } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-modified";
import {
  EditSalesReportSchema,
  EditSalesReportFormData,
  SalesReport,
} from "@/lib/types/salesReport.type";
import { Card, CardContent } from "../ui/card";

interface EditSalesReportDialogProps {
  salesReport: SalesReport;
  products: Product[];
}

const EditSalesReportDialog: React.FC<EditSalesReportDialogProps> = ({
  salesReport,
  products,
}) => {
  const [open, setOpen] = useState(false);
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});

  const form = useForm<EditSalesReportFormData>({
    resolver: zodResolver(EditSalesReportSchema),
    defaultValues: {
      id: salesReport.id,
      supplierId: salesReport.supplierId,
      totalAmount: salesReport.totalAmount,
      salesReportItems: salesReport.salesReportItems.map((item) => {
        return {
          productId: item.productId,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        };
      }),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "salesReportItems",
  });

  const watchedItems = form.watch("salesReportItems");
  const selectedProductIds = watchedItems
    .map((item) => item.productId)
    .filter(Boolean);

  const recalculateTotal = () => {
    const items = form.getValues("salesReportItems");
    const total = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    form.setValue("totalAmount", total);
  };

  const handleAddItem = () => {
    append({
      productId: "",
      quantity: 1,
      totalPrice: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length === 1) {
      toast.error("At least one item is required.");
      return;
    }
    remove(index);
    recalculateTotal();
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );
    if (selectedProduct) {
      const currentQuantity =
        form.getValues(`salesReportItems.${index}.quantity`) || 1;
      const totalPrice = selectedProduct.price * currentQuantity;

      form.setValue(`salesReportItems.${index}.productId`, productId);
      form.setValue(`salesReportItems.${index}.totalPrice`, totalPrice);

      setOpenPopovers((prev) => ({ ...prev, [index]: false }));
      recalculateTotal();
    }
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const productId = form.getValues(`salesReportItems.${index}.productId`);
    const selectedProduct = products.find(
      (product) => product.id === productId,
    );

    if (selectedProduct && quantity > 0) {
      const totalPrice = selectedProduct.price * quantity;
      form.setValue(`salesReportItems.${index}.totalPrice`, totalPrice);
      recalculateTotal();
    }
  };

  const getAvailableProducts = (currentIndex: number) => {
    return products.filter((product) => {
      const currentProductId = form.getValues(
        `salesReportItems.${currentIndex}.productId`,
      );
      return (
        !selectedProductIds.includes(product.id) ||
        product.id === currentProductId
      );
    });
  };

  const getProductById = (productId: string) => {
    return products.find((product) => product.id === productId);
  };

  const onSubmit = async (data: EditSalesReportFormData) => {
    try {
      const response = await fetch(`/api/sales-report/${salesReport.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          supplierId: data.supplierId,
          totalAmount: data.totalAmount,
          salesReportItems: data.salesReportItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sales report");
      }

      toast.success("Sales report updated successfully!");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating sales report:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update sales report",
      );
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setOpenPopovers({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-accent-500 hover:text-accent-700 hover:bg-accent-100 rounded-full"
        >
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-500">
            Edit Sales Report
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the details of this sales report.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="space-y-4">
              {fields.map((field, index) => {
                const selectedProduct = getProductById(
                  form.watch(`salesReportItems.${index}.productId`),
                );
                const availableProducts = getAvailableProducts(index);

                return (
                  <Card
                    key={field.id}
                    className="border-2 border-secondary-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-primary-500">
                          Item {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`salesReportItems.${index}.productId`}
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Product
                              </FormLabel>
                              <Popover
                                open={openPopovers[index] || false}
                                onOpenChange={(isOpen) =>
                                  setOpenPopovers((prev) => ({
                                    ...prev,
                                    [index]: isOpen,
                                  }))
                                }
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between h-10 px-3 border-2 hover:border-primary-300"
                                    >
                                      <span className="truncate">
                                        {selectedProduct?.name ||
                                          "Select product..."}
                                      </span>
                                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[320px] p-0"
                                  align="start"
                                >
                                  <Command>
                                    <div className="flex items-center border-b px-3">
                                      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                      <CommandInput
                                        placeholder="Search products..."
                                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                      />
                                    </div>
                                    <CommandList>
                                      <CommandEmpty>
                                        No products found.
                                      </CommandEmpty>
                                      <CommandGroup className="max-h-64 overflow-auto">
                                        {availableProducts.map((product) => (
                                          <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() =>
                                              handleProductSelect(
                                                index,
                                                product.id,
                                              )
                                            }
                                            className="cursor-pointer hover:bg-secondary-100"
                                          >
                                            <div className="flex flex-col w-full">
                                              <span className="font-medium">
                                                {product.name}
                                              </span>
                                              <span className="text-sm text-muted-foreground">
                                                ₱
                                                {product.price?.toLocaleString(
                                                  undefined,
                                                  {
                                                    minimumFractionDigits: 2,
                                                  },
                                                )}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`salesReportItems.${index}.quantity`}
                          render={({ field: formField }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Quantity
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  max="99999"
                                  className="h-10 border-2 hover:border-primary-300 focus:border-primary-500"
                                  {...formField}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value) || 1;
                                    formField.onChange(value);
                                    handleQuantityChange(index, value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Unit Price
                          </Label>
                          <div className="h-10 px-3 py-2 bg-gray-50 border-2 border-gray-200 rounded-md flex items-center">
                            <span className="text-sm">
                              ₱
                              {selectedProduct?.price?.toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                },
                              ) || "0.00"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-gray-700">
                            Total Price
                          </Label>
                          <div className="h-10 px-3 py-2 bg-primary-100 border-2 border-primary-200 rounded-md flex items-center">
                            <span className="font-semibold text-primary-700">
                              ₱
                              {form
                                .watch(`salesReportItems.${index}.totalPrice`)
                                ?.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                }) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 border-dashed border-primary-300 text-primary-500 hover:bg-primary-50 hover:border-primary-400"
              onClick={handleAddItem}
            >
              <Plus size={20} className="mr-2" />
              Add Another Item
            </Button>

            <Separator className="my-6" />

            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg border-2 border-primary-200">
              <div className="flex justify-between items-center">
                <Label className="text-lg font-semibold text-primary-700">
                  Total Amount
                </Label>
                <div className="text-2xl font-bold text-primary-600">
                  ₱
                  {form.watch("totalAmount")?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || "0.00"}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-primary-300 hover:bg-primary-500 text-white px-6"
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalesReportDialog;
