"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ManageListings from "@/components/supplier-dashboard/contents/ManageListing";
import Notification from "@/components/supplier-dashboard/contents/Notification";
import ProductListingForm from "@/components/supplier-dashboard/contents/ProductForm";
import ProductList from "@/components/supplier-dashboard/contents/ProductList";
import { useState } from "react";
import { Product } from "@/types/types";
import {
  CubeIcon,
  FolderOpenIcon,
  BellIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const DesktopSupplier = ({
  fetchedProducts,
  userID,
  supplierName,
}: {
  fetchedProducts: {
    id: string;
    name: string;
    supplierId: string;
    price: number;
    description: string;
    verified: boolean;
    verifiedDate: Date;
    dateAdded: Date;
    image?: string;
  }[];
  userID: string;
  supplierName: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [tabValue, setTabValue] = useState("products");

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <div className="max-h-screen w-full flex overflow-hidden">
      <div className="w-64 bg-[#B9EBFC] p-4 sticky top-0 left-0 h-screen shadow-2xl bg-opacity-50 z-10">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mt-10">
            <span className="text-xl font-bold text-white">
              {supplierName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#034169]">
            Welcome, {supplierName}!
          </h2>
          <p className="text-sm text-[#034169]">RawMats Supplier</p>
        </div>

        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className="flex flex-col mt-20"
        >
          <TabsList className="flex flex-col items-start bg-transparent mt-10">
            <Link
              href="/"
              className="flex items-center justify-start text-left hover:bg-white hover:text-[#034169] rounded-md px-6 py-2 w-full transition-all mb-3"
            >
              <div className="flex items-center">
                <HomeIcon className="mr-2 h-5 w-5" />
                <span className="text-[#034169]">Home</span>
              </div>
            </Link>

            <TabsTrigger
              value="products"
              className="flex items-center justify-start text-left hover:bg-white hover:text-[#034169] rounded-md px-6 py-2 w-full transition-all mb-3"
            >
              <CubeIcon className="mr-2 h-5 w-5" />
              <span className="text-[#034169]">Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="manage-products"
              className="flex items-center justify-start text-left hover:bg-white hover:text-[#034169] rounded-md px-6 py-2 w-full transition-all mb-3"
            >
              <FolderOpenIcon className="mr-2 h-5 w-5" />
              <span className="text-[#034169]">Manage Products</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center justify-start text-left hover:bg-white hover:text-[#034169] rounded-md px-6 py-2 w-full transition-all mb-3"
            >
              <BellIcon className="mr-2 h-5 w-5" />
              <span className="text-[#034169]">Notifications</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col overflow-auto">
        <div className="bg-[#A3E6FD] shadow p-9 bg-opacity-75 z-20 sticky top-0 w-full"></div>

        <div className="flex-1 p-6">
          <Tabs value={tabValue} onValueChange={setTabValue}>
            <TabsContent value="products">
              <ProductListingForm
                onAddProduct={handleAddProduct}
                supplierId={userID}
              />
              <ProductList products={fetchedProducts} />
            </TabsContent>

            <TabsContent value="manage-products">
              <ManageListings fetchedProducts={fetchedProducts} />
            </TabsContent>

            <TabsContent value="notifications">
              <Notification />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DesktopSupplier;
