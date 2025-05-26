"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";



import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Supplier } from "@prisma/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AlbumProductCardProps {
  data: {
    id: string;
    name: string;
    image: string;
    price: number;
    supplier: Supplier;
    userId: string;
    albumId: string;
  };
}

const AlbumProductCard: React.FC<AlbumProductCardProps> = ({
  data: { id, name, image, price, supplier, albumId },
}) => {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleRemoveFromAlbum = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setIsRemoving(true);
      const response = await fetch(`/api/album/${albumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favoriteId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from album");
      }

      toast.success("Removed from album");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Card
      onClick={() => router.push(`/product/${id}`)}
      className="w-full max-w-52 h-[360px] hover:border-primary transition-transform duration-200 hover:scale-105"
    >
      <CardHeader className="p-0">
        <div className="w-full h-52 overflow-hidden rounded-t-xl relative">
          <Image
            src={image || "/placeholder.svg"}
            alt="Product"
            fill
            className="object-cover object-center w-full h-full"
            sizes="100%"
          />
        </div>
      </CardHeader>

      <CardHeader className="px-4 pt-2">
        <CardTitle className="truncate flex justify-between items-center text-lg">
          {name}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="focus:outline-none">
                <DotsVerticalIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteAlert(true);
                }}
                className="text-red-500 focus:text-red-500"
              >
                Remove from Album
              </DropdownMenuItem>
            </DropdownMenuContent>
            <AlertDialog
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove this product from your album.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRemoveFromAlbum}
                    disabled={isRemoving}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenu>
        </CardTitle>
        <CardDescription>
          {supplier.businessName || "RawMats Supplier"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="inline-block text-sm font-semibold text-black bg-blue-100 rounded-full px-3 py-1">
          ₱{price.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
};

export default AlbumProductCard;
