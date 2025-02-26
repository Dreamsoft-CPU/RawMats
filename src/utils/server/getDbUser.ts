"use server";

import prisma from "../prisma";
import { createClient } from "../supabase/server";

export const getDbUser = async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      throw new Error(error?.message || "User not found!");
    }

    const databaseUser = await prisma.user.findUnique({
      where: {
        email: data.user.email,
      },
      include: {
        Supplier: {
          include: {
            Product: {
              include: {
                favorites: true,
              },
            },
          },
        },
      },
    });

    if (!databaseUser) {
      throw new Error("User not found in database");
    }

    return databaseUser;
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    return {
      error: true,
      message,
    };
  }
};
