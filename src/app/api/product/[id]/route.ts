import prisma from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const productId = params.id;
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: product.supplierId },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ product, supplier }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
};
