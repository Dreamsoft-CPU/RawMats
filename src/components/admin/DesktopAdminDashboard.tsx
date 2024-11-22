"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Package } from "lucide-react";
import logo from "../../public/logo.png";
import { useState } from "react";
import { ItemVerification } from "@/components/Admin/ItemVerification";
import { Product, Supplier } from "@prisma/client";
import { SupplierVerification } from "./SupplierVerification";

const DesktopAdminDashboard = ({
  fetchedProducts,
  fetchedSuppliers,
}: {
  fetchedProducts: Product[];
  fetchedSuppliers: Supplier[];
}) => {
  const [selectedTab, setSelectedTab] = useState("supplier");

  const handleVerify = async (id: string) => {
    try {
      const response = await fetch(`/api/product/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify product");
      }
      alert("Product verified successfully.");
    } catch (error) {
      console.error("Error verifying product:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/product/reject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject product");
      }
      alert("Product rejected successfully.");
    } catch (error) {
      console.error("Error rejecting product:", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <aside className="flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b self-center">
          <Image
            src={logo}
            alt="RAWMATS Logo"
            width={150}
            height={50}
            className="max-w-full h-auto"
          />
        </div>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          orientation="vertical"
          className="flex-1"
        >
          <TabsList className="flex flex-col w-full h-auto">
            <TabsTrigger value="supplier" className="justify-start mb-2">
              <Mail className="mr-2 h-4 w-4" />
              Supplier Verification
            </TabsTrigger>
            <TabsTrigger value="item" className="justify-start">
              <Package className="mr-2 h-4 w-4" />
              Item Verification
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsContent value="supplier">
            <h2 className="text-2xl font-bold mb-4">Supplier Verification</h2>
            {fetchedSuppliers.length === 0 && (
              <p>No supplier applications currently</p>
            )}
            <SupplierVerification suppliers={fetchedSuppliers} />
          </TabsContent>
          <TabsContent value="item">
            <h2 className="text-2xl font-bold mb-4">Item Verification</h2>
            <ItemVerification
              products={fetchedProducts}
              verifyProduct={handleVerify}
              rejectProduct={handleReject}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DesktopAdminDashboard;
