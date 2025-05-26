import { z } from "zod";

export const SalesReportItemSchema = z.object({
  productId: z
    .string()
    .min(1, "Product is required")
    .max(50, "Product ID must not exceed 50 characters"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(99999, "Quantity must not exceed 99,999"),
  totalPrice: z
    .number()
    .positive("Total price must be positive")
    .min(0.01, "Total price must be at least 0.01")
    .max(10000000, "Total price must not exceed 10,000,000"),
});

export const CreateSalesReportSchema = z.object({
  supplierId: z
    .string()
    .min(1, "Supplier ID is required")
    .max(50, "Supplier ID must not exceed 50 characters"),
  totalAmount: z
    .number()
    .positive("Total amount must be positive")
    .min(0.01, "Total amount must be at least 0.01")
    .max(10000000, "Total amount must not exceed 10,000,000"),
  salesReportItems: z
    .array(SalesReportItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Maximum 50 items allowed"),
});

export const EditSalesReportSchema = CreateSalesReportSchema.extend({
  id: z.string().min(1, "Report ID is required"),
});

export type SalesReportItem = z.infer<typeof SalesReportItemSchema>;
export type CreateSalesReportFormData = z.infer<typeof CreateSalesReportSchema>;
export type EditSalesReportFormData = z.infer<typeof EditSalesReportSchema>;

// Extended types for UI components
export interface SalesReportItemWithProduct extends SalesReportItem {
  product?: {
    id: string;
    name: string;
    price: number;
  };
}

export interface SalesReport {
  id: string;
  supplierId: string;
  totalAmount: number;
  createdAt: string | Date;
  salesReportItems: SalesReportItemWithProduct[];
}

// Legacy export for backward compatibility
export const salesReportItemSchema = SalesReportItemSchema;
