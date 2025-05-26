import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { CreateSalesReportSchema } from "@/lib/types/salesReport.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("User does not exist!");
    }

    const requestData = await req.json();
    const validatedData = CreateSalesReportSchema.parse(requestData);

    const newSalesReport = await prisma.salesReport.create({
      data: {
        supplierId: validatedData.supplierId,
        totalAmount: validatedData.totalAmount,
        SalesReportItem: {
          createMany: {
            data: validatedData.salesReportItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            })),
          },
        },
      },
    });

    return NextResponse.json(newSalesReport, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    console.log("Error creating sales report:", message);
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
