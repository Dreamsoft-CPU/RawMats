import React from "react";
import prisma from "@/utils/prisma/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DynamicScreen from "@/components/admin/DynamicScreen";

const AdminDashboard = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/login");
  }

  const isAdmin = await prisma.user.findUnique({
    where: {
      id: data.user.id,
    },
    select: {
      role: true,
    },
  });

  // redirect if user is not an admin
  if (isAdmin && isAdmin.role !== "ADMIN") {
    redirect("/");
  }

  const fetchedProducts = await prisma.product.findMany({
    where: {
      verified: false,
    },
  });

  for (const product of fetchedProducts) {
    const { data, error } = await supabase.storage
      .from("photos")
      .createSignedUrl(`${product.image}`, 3600);

    if (error) {
      console.error(
        "Error fetching signed URL for product image:",
        error.message,
      );
    }

    if (data) {
      product.image = data.signedUrl;
    }
  }

  const fetchedSuppliers = await prisma.supplier.findMany({
    where: {
      verified: false,
    },
    include: {
      user: true,
    },
  });

  return (
    <DynamicScreen
      fetchedProducts={fetchedProducts}
      fetchedSuppliers={fetchedSuppliers}
    />
  );
};

export default AdminDashboard;
