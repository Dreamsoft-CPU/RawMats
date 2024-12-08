import prisma from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

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

    const supabase = createClient();
    const { data } = supabase.storage
      .from("photos")
      .getPublicUrl(
        product.image.startsWith("/") ? product.image.slice(1) : product.image,
      );

    if (!data) {
      console.error("Error fetching image URL");
      return NextResponse.json(
        {
          error: "Error fetching image",
          fallbackImage: "/products/default.jpg",
        },
        { status: 500 },
      );
    }

    const { publicUrl } = data;
    return NextResponse.json({ publicUrl }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        fallbackImage: "/products/default.jpg",
      },
      { status: 500 },
    );
  }
};
