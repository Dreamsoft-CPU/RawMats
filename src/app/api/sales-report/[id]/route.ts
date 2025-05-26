import prisma from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";
import { CreateSalesReportSchema } from "@/lib/types/salesReport.type";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw new Error("User does not exist!");
    }

    const { id } = await params;
    const requestData = await request.json();
    const validatedData = CreateSalesReportSchema.parse(requestData);

    const updatedSalesReport = await prisma.salesReport.update({
      where: { id },
      data: {
        supplierId: validatedData.supplierId,
        totalAmount: validatedData.totalAmount,
        SalesReportItem: {
          deleteMany: {},
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

    return NextResponse.json(updatedSalesReport, { status: 200 });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
      { status: 200 },
    );
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
