import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { salesReportItemSchema } from "@/utils/types/sales-report.type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("User does not exist!");
    }

    const { supplierId, totalAmount, salesReportItems } = await req.json();
    const validatedData = salesReportItemSchema.array().parse(salesReportItems);

    if (validatedData.length === 0) {
      return NextResponse.json(
        { error: true, message: "Sales report items are required" },
        { status: 400 }
      );
    }

    const newSalesReport = await prisma.salesReport.create({
      data: {
        supplierId,
        totalAmount,
        SalesReportItem: {
          createMany: {
            data: validatedData.map((item) => ({
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
    const message = e instanceof Error ? e.message : "An error occured";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
