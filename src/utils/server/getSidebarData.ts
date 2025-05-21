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

    // Ensure email is available before querying
    if (!data.user.email) {
      throw new Error("User email not found!");
    }

    const userData = await prisma.user.findFirst({
      where: {
        email: {
          equals: data.user.email,
          mode: "insensitive",
        },
      },
      include: {
        Supplier: true,
      },
    });

    if (!userData) throw new Error("User not found!");

    const userIsAdmin = userData.role === "ADMIN";
    const userSupplierRecord = userData.Supplier[0];
    let userIsSupplier: boolean = false;
    let userIsSupplierPending: boolean = false;

    if (!!userSupplierRecord) {
      userIsSupplier =
        userSupplierRecord && userSupplierRecord.verified === true;
      userIsSupplierPending =
        userSupplierRecord && userSupplierRecord.verified === false;
    }

    return {
      isSupplier: userIsSupplier,
      isAdmin: userIsAdmin,
      isSupplierPending: userIsSupplierPending,
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
