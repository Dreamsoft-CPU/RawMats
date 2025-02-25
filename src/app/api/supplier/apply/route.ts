import { SupplierRegistrationFormSchema } from "@/lib/types/supplierRegistration.type";
import prisma from "@/utils/prisma";
import { getUserData } from "@/utils/server/getUserData";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const POST = async (request: NextRequest) => {
  const supabase = await createClient();

  try {
    // Use FormData instead of JSON for file uploads
    const formData = await request.formData();

    // Extract and validate form fields
    const businessName = formData.get("businessName") as string;
    const businessLocation = formData.get("businessLocation") as string;
    const businessPhone = formData.get("businessPhone") as string;
    const files = formData.getAll("businessDocuments") as File[];

    // Validate the data using your schema
    const validatedData = SupplierRegistrationFormSchema.parse({
      businessName,
      businessLocation,
      businessPhone,
      businessDocuments: files,
    });

    const user = await getUserData();
    if ("error" in user && user.error) {
      throw new Error(user.message);
    }

    if (!("error" in user)) {
      const uploadedFilePaths: string[] = [];

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        let processedBuffer = Buffer.from(fileBuffer);

        if (file.type.startsWith("image/")) {
          processedBuffer = await sharp(processedBuffer)
            .jpeg({ quality: 80 })
            .toBuffer();
        }

        const fileExtension = file.type.startsWith("image/")
          ? "jpg"
          : file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${file.name.split(".")[0]}.${fileExtension}`;

        const contentType = file.type.startsWith("image/")
          ? "image/jpeg"
          : file.type;

        const { data: fileData, error: fileError } = await supabase.storage
          .from("private")
          .upload(fileName, processedBuffer, {
            contentType,
            upsert: false,
          });

        if (fileError) {
          throw new Error(`File upload failed: ${fileError.message}`);
        }

        uploadedFilePaths.push(fileData.path);
      }

      const userData = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!userData) throw new Error("User not found!");

      await prisma.supplier.create({
        data: {
          userId: userData.id,
          businessName: validatedData.businessName,
          businessLocation: validatedData.businessLocation,
          businessPhone: validatedData.businessPhone,
          businessDocuments: uploadedFilePaths,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Supplier registration successful",
        },
        { status: 201 },
      );
    }

    throw new Error("User validation failed");
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: true, message },
      { status: 400 }, // Using 400 for validation/client errors instead of 401
    );
  }
};
