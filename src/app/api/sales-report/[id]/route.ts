import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { salesReportItemSchema } from "@/utils/types/sales-report.type";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("User does not exist!");
    }

    const { id } = await params;

    const { supplierId, totalAmount, salesReportItems } = await request.json();
    const validatedData = salesReportItemSchema.array().parse(salesReportItems);

    if (validatedData.length === 0) {
      return NextResponse.json(
        { error: true, message: "Sales report items are required" },
        { status: 400 }
      );
    }

    const updatedSalesReport = await prisma.salesReport.update({
      where: { id },
      data: {
        supplierId,
        totalAmount,
        SalesReportItem: {
          deleteMany: {}, // Delete existing items
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

    return NextResponse.json(updatedSalesReport, { status: 200 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("User does not exist!");
    }

    const { id } = await params;

    await prisma.salesReport.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Sales report deleted successfully" },
      { status: 200 }
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
