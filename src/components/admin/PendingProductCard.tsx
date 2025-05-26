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
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const itemsPerPage = 9;

  const router = useRouter();

  const toggleOpen = (state: boolean, images?: string[]) => () => {
    if (state && images) {
      setCurrentImages(images);
    }
    setOpen(state);
  };

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  const verifyProduct = async (id: string, userID: string) => {
    try {
      const response = await fetch(`/api/admin/verify/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userID }),
      });
      if (!response.ok) {
        throw new Error("Failed to verify product");
      }
      router.refresh();
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
      router.refresh();
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

      <ScrollArea className="h-fit">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {paginatedProducts.length === 0 && (
            <p className="text-center text-muted-foreground col-span-full">
              No pending products for verification.
            </p>
          )}
          {paginatedProducts.map((product) => (
            <Card
              className="w-full max-w-sm mx-auto shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
              key={product.id}
            >
              <div className="relative w-full pt-[56.25%] flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="rounded-t-lg object-cover"
                />
              </div>
              <CardHeader className="p-4 pb-2 flex-shrink-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2 flex-grow">
                <p className="font-bold text-primary text-lg">
                  ₱{product.price.toFixed(2)}
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    Supplier:{" "}
                    <Link
                      href={`/supplier/${product.supplier.businessName}`}
                      className="underline hover:text-primary"
                    >
                      {product.supplier.businessName}
                    </Link>
                  </p>
                  <p>
                    Date Added:{" "}
                    {new Date(product.dateAdded).toLocaleDateString()}
                  </p>
                  {product.verified && (
                    <p>
                      Verified:{" "}
                      {new Date(product.verifiedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2 flex-shrink-0">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    verifyProduct(product.id, product.supplier.userId);
                  }}
                  disabled={product.verified}
                  className="flex-1 hover:bg-green-600 hover:text-white transition-colors text-sm"
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
                  className="flex-1 hover:bg-red-700 transition-colors text-sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardFooter>
            </Card>
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

      <Lightbox
        open={open}
        close={toggleOpen(false)}
        index={index}
        plugins={[Zoom]}
        slides={currentImages.map((img) => ({
          src: img,
        }))}
        on={{ view: updateIndex }}
        animation={{ fade: 0 }}
        zoom={{
          scrollToZoom: true,
          maxZoomPixelRatio: 10,
          wheelZoomDistanceFactor: 200,
          pinchZoomDistanceFactor: 200,
        }}
      />

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
