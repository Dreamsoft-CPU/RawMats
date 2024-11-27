"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Package, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "../../public/logo.png";
import { Product, Supplier, User } from "@prisma/client";
import { ItemVerification } from "@/components/Admin/ItemVerification";
import { SupplierVerification } from "./SupplierVerification";

const MobileAdminDashboard = ({
  fetchedProducts,
  fetchedSuppliers,
}: {
  fetchedProducts: Product[];
  fetchedSuppliers: (Supplier & { user: User })[];
}) => {
  const [selectedTab, setSelectedTab] = useState("item");

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
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 bg-card border-b">
        <Image
          src={logo}
          alt="RAWMATS Logo"
          width={100}
          height={50}
          className="max-w-full h-auto "
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <Image
                src={logo}
                alt="RAWMATS Logo"
                width={150}
                height={50}
                className="max-w-full h-auto self-center"
              />
            </div>
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              orientation="vertical"
              className="flex-1"
            >
              <TabsList className="flex flex-col w-full h-auto">
                <TabsTrigger value="item" className="justify-start mb-2">
                  <Package className="mr-2 h-4 w-4" />
                  Item Verification
                </TabsTrigger>
                <TabsTrigger value="supplier" className="justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Supplier Verification
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsContent value="item">
            <h2 className="text-2xl font-bold mb-4">Item Verification</h2>
            <ItemVerification
              products={fetchedProducts}
              verifyProduct={handleVerify}
              rejectProduct={handleReject}
            />
          </TabsContent>
          <TabsContent value="supplier">
            <h2 className="text-2xl font-bold mb-4">Supplier Verification</h2>
            {fetchedSuppliers.length === 0 && (
              <p>No supplier applications currently</p>
            )}
            <SupplierVerification suppliers={fetchedSuppliers} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MobileAdminDashboard;
