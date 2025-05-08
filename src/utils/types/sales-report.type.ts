import { z } from "zod";

export const salesReportItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  totalPrice: z.number().min(0, "Total price must be positive"),
});

export type SalesReportItem = z.infer<typeof salesReportItemSchema> & {
  id?: string;
  salesReportId?: string;
  product?: {
    id: string;
    name: string;
    price: number;
  };
};

export interface SalesReport {
  id: string;
  supplierId: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  salesReportItems: SalesReportItem[];
}
