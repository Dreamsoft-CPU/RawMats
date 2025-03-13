import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  try {
    const formData = await req.formData();
    const id = params.id;

    if (!id) {
      throw new Error("Supplier ID is required");
    }

    // Get optional fields
    const businessName = formData.get("businessName") as string | null;
    const businessLocation = formData.get("businessLocation") as string | null;
    const businessPhone = formData.get("businessPhone") as string | null;
    const bio = formData.get("bio") as string | null;
    const businessPicture = formData.get("businessPicture") as File | null;

    // Create update data object with only provided fields
    const updateData: any = {};
    if (businessName) updateData.businessName = businessName;
    if (businessLocation) updateData.businessLocation = businessLocation;
    if (businessPhone) updateData.businessPhone = businessPhone;
    if (bio) updateData.bio = bio;

    // Process image if provided
    if (businessPicture && businessPicture.size > 0) {
      // Convert to buffer
      const bytes = await businessPicture.arrayBuffer();
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
      updateData.businessPicture = publicUrl;
    }

    // Update supplier if update data is not empty
    if (Object.keys(updateData).length === 0) {
      throw new Error("No fields provided for update");
    }

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/supplier/profile");
    revalidatePath(`/api/supplier/${id}`);
    return NextResponse.json({ supplier }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            displayName: true,
            email: true,
            profilePicture: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ supplier }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
}
