import { SupplierVerificationComponent } from "@/components/admin/PendingSupplierCard";
import AdminSidebar from "@/components/home/AdminSidebar";
import AdminInset from "@/components/sidebar/insets/AdminInset";
import prisma from "@/utils/prisma";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { createClient } from "@/utils/supabase/server";
import React from "react";

const AdminSuppliers = async () => {
  const sidebarData = await getSidebarData();
  const supabase = await createClient();

  const suppliers = await prisma.supplier.findMany({
    where: {
      verified: false,
    },
    include: {
      user: true,
    },
  });

  for (const supplier of suppliers) {
    // Initialize an array to store signed URLs
    const signedUrls = [];

    // Check if supplier has business documents
    if (supplier.businessDocuments && supplier.businessDocuments.length > 0) {
      // Create signed URLs for each business document
      for (const documentPath of supplier.businessDocuments) {
        const { data, error } = await supabase.storage
          .from("private")
          .createSignedUrl(documentPath, 3600);

        if (error) {
          console.error(
            `Error creating signed URL for ${documentPath}: `,
            error.message,
          );
          continue;
        }

        if (data) {
          signedUrls.push(data.signedUrl);
        }
      }

      // Replace the file paths with signed URLs
      supplier.businessDocuments = signedUrls;
    } else {
      supplier.businessDocuments = [];
    }
  }

  return (
    <div className="flex h-screen w-full">
      <AdminSidebar data={sidebarData} />
      <AdminInset>
        <SupplierVerificationComponent suppliers={suppliers} />
      </AdminInset>
    </div>
  );
};

export default AdminSuppliers;
