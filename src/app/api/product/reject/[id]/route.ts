import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    console.log("Received ID:", id);
    const product = await prisma.product.delete({
      where: { id },
    });
    console.log("Product deleted:", product);
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error rejecting product:", error);
    return NextResponse.json(
      { error: "Failed to reject product" },
      { status: 500 },
    );
  }
}
