import prisma from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  // This route gets a specific product
  // You can use this when clicking a product where the user sees all info
  // This includes supplier name, supplier location, etc.
  const productId: string = (await params).id || "";
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  const supplier = await prisma.supplier.findUnique({
    where: {
      id: product?.supplierId,
    },
  });

  return NextResponse.json({ product, supplier }, { status: 200 });
};

// This is for other methods like POST, PUT, DELETE, but me and Jeff only need to do the GET!

// export const POST = async () => {}
// export const PUT = async () => {}
// export const DELETE = async () => {}
