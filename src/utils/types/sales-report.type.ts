import { z } from "zod";

export const salesReportItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  totalPrice: z.number(),
});

export const salesReportSchema = z.object({
  supplierId: z.string(),
  totalAmount: z.number(),
  salesReportItems: z.array(salesReportItemSchema),
});

export type SalesReport = z.infer<typeof salesReportSchema>;
export type SalesReportItem = z.infer<typeof salesReportItemSchema>;
