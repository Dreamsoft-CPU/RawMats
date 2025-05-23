"use server";

import prisma from "../prisma";
import { createClient } from "../supabase/server";

export const getSupplierData = async (username: string) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      throw new Error(error?.message || "User not found!");
    }

    const supplierInfo = await prisma.supplier.findFirst({
      where: {
        businessName: {
          equals: username,
          mode: "insensitive",
        },
      },
      include: {
        user: true,
        Product: {
          include: {
            ratings: true,
          },
        },
      },
    });

    if (!supplierInfo) {
      throw new Error("User not found in database");
    }

    return supplierInfo;
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return {
      error: true,
      message,
    };
  }
};
