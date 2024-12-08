import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";
import DynamicScreen from "@/components/AuthComponents/DynamicScreen";
import SupplierForm from "@/components/ApplySupplier/SupplierForm";

export default async function ApplySupplier() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  const applicationSent = await prisma.supplier.findUnique({
    where: {
      userId: data.user.id,
    },
  });

  if (applicationSent) {
    redirect("/");
  }

  const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
  const mapId = process.env.GOOGLE_MAPS_MAP_ID as string;

  return (
    <DynamicScreen
      header="Connect. Collaborate. Succeed."
      message="Your trusted partner in business registration!"
      body={<SupplierForm apiKey={API_KEY} mapId={mapId} user={data.user} />}
      user={data.user}
      isSupplierForm={true}
    />
  );
}
