import { ProductFormDataSchema } from "@/lib/types/createProduct.type";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import prisma from "@/utils/prisma";

export const POST = async (req: NextRequest) => {
  const supabase = await createClient();
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = formData.get("description") as string;
    const supplierId = formData.get("supplierId") as string;
    const image = formData.get("image") as File;

    const validatedData = ProductFormDataSchema.parse({
      name,
      price,
      description,
      supplierId,
      image,
    });

    // Process image
    let imagePath = "/products/default.jpg";
    if (image && image.size > 0) {
      // Convert to buffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Resize and convert to JPEG
      const processedImage = await sharp(buffer)
        .resize(800) // resize to width 800px (maintains aspect ratio)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload to Supabase storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, processedImage, {
          contentType: "image/jpeg",
        });

      if (uploadError || !uploadData) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      imagePath = publicUrl;
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        description: validatedData.description,
        supplierId: validatedData.supplierId,
        image: imagePath,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const PUT = async (req: NextRequest) => {
  const supabase = await createClient();
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Product ID is required");
    }

    // Get optional fields
    const name = formData.get("name") as string | null;
    const priceString = formData.get("price") as string | null;
    const price = priceString ? parseFloat(priceString) : undefined;
    const description = formData.get("description") as string | null;
    const supplierId = formData.get("supplierId") as string | null;
    const image = formData.get("image") as File | null;

    // Create update data object with only provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (price) updateData.price = price;
    if (description) updateData.description = description;
    if (supplierId) updateData.supplierId = supplierId;

    // Process image if provided
    if (image && image.size > 0) {
      // Convert to buffer
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Resize and convert to JPEG
      const processedImage = await sharp(buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload to Supabase storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, processedImage, {
          contentType: "image/jpeg",
        });

      if (uploadError || !uploadData) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      // Get public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);
      updateData.image = publicUrl;
    }

    // Update product if update data is not empty
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields provided for update");
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ status: 204 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
