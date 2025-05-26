import SupplierSidebar from "@/components/home/SupplierSidebar";
import SupplierInset from "@/components/sidebar/insets/SupplierInset";
import EditProductPageForm from "@/components/supplier/products/EditProductPageForm";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const sidebarData = await getSidebarData();
  const userData = await getDbUser();

  if ("error" in userData) {
    return <div>Error loading user data. Please refresh.</div>;
  }

  // Find the product
  const product = userData.Supplier[0].Product.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex h-screen w-full">
      <SupplierSidebar data={sidebarData} />
      <SupplierInset userData={userData}>
        <div className="flex flex-col w-full h-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <Link
              href="/supplier/products"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Products</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <span className="text-lg text-gray-600">• {product.name}</span>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto">
            <EditProductPageForm
              productId={product.id}
              supplierId={product.supplierId}
              initialData={{
                name: product.name,
                price: product.price,
                description: product.description,
                imageUrl: product.image,
                supplierId: product.supplierId,
              }}
            />
          </div>
        </div>
      </SupplierInset>
    </div>
  );
};

export default EditProductPage;
