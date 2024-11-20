import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/utils/prisma/client";

const DesktopSignup = dynamic(
  () => import("@/components/ApplySupplier/DesktopSignup"),
  {
    loading: () => <p>Loading desktop signup...</p>,
    ssr: true,
  },
);

const MobileSignup = dynamic(
  () => import("@/components/ApplySupplier/MobileSignup"),
  {
    loading: () => <p>Loading mobile signup...</p>,
    ssr: true,
  },
);

const API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;
const mapId = process.env.GOOGLE_MAPS_MAP_ID as string;

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

  return (
    <div className="h-screen w-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="hidden md:block">
          <DesktopSignup apiKey={API_KEY} mapId={mapId} user={data.user} />
        </div>
        <div className="md:hidden w-full h-screen">
          <MobileSignup apiKey={API_KEY} mapId={mapId} user={data.user} />
        </div>
      </Suspense>
    </div>
  );
}
