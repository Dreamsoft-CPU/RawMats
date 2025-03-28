"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "../ui/sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import RejectionDialog from "./RejectionDialog";
import Image from "next/image";
import { ProductWithSupplier } from "@/lib/types/userToFavorite.type";
import { toast } from "sonner";

interface ItemVerificationProps {
  products: ProductWithSupplier[];
}

export function ItemVerificationComponent({ products }: ItemVerificationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    userID: string;
  }>({ productId: "", userID: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const verifyProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/verify/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId: selectedProduct.userID }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify product");
      }
      toast.success("Product verified successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Error verifying product: ${message}`);
    }
  };

  const rejectProduct = async (
    productID: string,
    reasons: string[],
    comment: string,
    userID: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/verify/item`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: productID,
          reasons,
          comment,
          userId: userID,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to reject product");
      }
      toast.success("Product rejected successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Error rejecting product: ${message}`);
    }
  };

  const openRejectModal = (productId: string, userID: string) => {
    setSelectedProduct({ productId, userID });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="p-4 h-fit">
      <div className="flex items-center gap-2 md:gap-10 flex-col md:flex-row">
        <div className="flex flex-row justify-center items-center w-full md:w-auto relative">
          <SidebarTrigger className="absolute md:static left-0 md:mr-4 border size-8 bg-gray-100" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Product Verification
          </h2>
        </div>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button variant="ghost">
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="h-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {paginatedProducts.length === 0 && (
            <p>No supplier applications currently</p>
          )}
          {paginatedProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="block"
            >
              <Card className="flex flex-col h-full transition-transform duration-200 hover:scale-105">
                <div className="relative w-full pt-[56.25%]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="rounded-t-lg object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="font-semibold">
                    Price: ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                    Supplier ID: {product.supplierId}
                  </p>
                  <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis">
                    Supplier Name:{" "}
                    <Link
                      href={`/supplier/${product.supplier.businessName}`}
                      className="underline"
                    >
                      {product.supplier.businessName}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Date Added:{" "}
                    {new Date(product.dateAdded).toLocaleDateString()}
                  </p>
                  {product.verified && (
                    <p className="text-xs text-muted-foreground">
                      Verified Date:{" "}
                      {new Date(product.verifiedDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 justify-between mt-auto">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      verifyProduct(product.id);
                    }}
                    disabled={product.verified}
                    className="flex-1 hover:bg-rawmats-primary-100 w-full"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openRejectModal(product.id, product.supplier.userId);
                    }}
                    variant="destructive"
                    disabled={product.verified}
                    className="flex-1 w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination className="mt-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <RejectionDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        rejectFunction={rejectProduct}
        rejectID={selectedProduct.productId}
        userID={selectedProduct.userID}
        rejectionReasons={[
          "Inappropriate content",
          "Poor image quality",
          "Inaccurate description",
          "Incorrect pricing",
          "Duplicate listing",
        ]}
      />
    </div>
  );
}
