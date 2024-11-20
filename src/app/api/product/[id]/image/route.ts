import prisma from "@/utils/prisma/client";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const productId: string = (await params).id || "";
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("photos")
    .createSignedUrl(`${product.image}`, 3600);

  if (error || !data) {
    return NextResponse.json(
      { error: "Error fetching image" },
      { status: 500 },
    );
  }

  const { signedUrl } = data;
  console.log(signedUrl);

  return NextResponse.json({ signedUrl }, { status: 200 });
};
