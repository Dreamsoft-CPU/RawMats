"use server";

import { z } from "zod";
import prisma from "@/utils/prisma/client";

const createAlbumSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  userId: z.string(),
});

export async function createAlbum(values: z.infer<typeof createAlbumSchema>) {
  const validatedFields = createAlbumSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid input" };
  }

  const { name, description, userId } = validatedFields.data;

  try {
    const album = await prisma.album.create({
      data: {
        name,
        description,
        userId,
      },
    });
    return { success: true, album };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create album" };
  }
}
