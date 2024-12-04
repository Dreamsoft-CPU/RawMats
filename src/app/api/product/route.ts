import prisma from "@/utils/prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        supplier: {
          select: { businessName: true },
        },
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
};

// export const GET = async () => {
//   // This route gets ALL products
//   // Use prisma to retrieve data AND include supplier data to get supplier business name
//   // We will limit it to supplier name only, so we can save bandwidth
// };

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, description, price, supplierId, image } = body;

    if (!name || !description || !price || !supplierId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, description, price, or supplierId",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        supplierId,
        image,
      },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating product:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        { status: 500 }
      );
    }
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await prisma.favorite.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/", "layout");
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
};
