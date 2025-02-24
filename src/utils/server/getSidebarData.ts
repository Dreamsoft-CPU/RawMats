"use server";

import prisma from "../prisma";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

export const getSidebarData = async () => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.getUser();

    if (!data.user || error) {
      throw new Error(error?.message || "User not found!");
    }

    const userData = await prisma.user.findUnique({
      where: {
        email: data.user.email,
      },
      include: {
        Supplier: true,
      },
    });

    if (!userData) throw new Error("User not found!");

    const userIsAdmin = userData.role === "ADMIN";
    const userIsSupplier = userData.Supplier[0] !== null;

    return {
      isSupplier: userIsSupplier,
      isAdmin: userIsAdmin,
      user: {
        name: userData.displayName,
        email: userData.email,
        avatar: userData.profilePicture,
      },
    };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "An unexpected error occured";
    redirect(`/error?message=${encodeURIComponent(message)}`);
  }
};
