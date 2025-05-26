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
    <Card className="mobile-card w-full border border-blue-950 hover:border-primary card-hover cursor-pointer overflow-hidden">
      <CardHeader className="p-0">
        <div
          onClick={() => router.push(`/product/${id}`)}
          className="mobile-card-image w-full overflow-hidden relative group"
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={500}
            height={500}
            className="rounded-t-xl object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-300"
            style={{ objectFit: "cover" }}
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="focus:outline-none p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <DotsVerticalIcon className="h-3 w-3 sm:h-4 sm:w-4" />
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
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mobile-card-content flex-1 flex flex-col">
        <div onClick={() => router.push(`/product/${id}`)} className="flex-1">
          <CardTitle className="text-mobile-base font-semibold mb-1 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
            {name}
          </CardTitle>
          <CardDescription className="text-mobile-sm mb-2 line-clamp-1">
            {supplier.businessName || "RawMats Supplier"}
          </CardDescription>

          <div className="mb-3">
            <span className="inline-block text-mobile-sm font-bold text-white bg-blue-600 rounded-full px-2 py-1 sm:px-3 sm:py-1">
              ₱{price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Mobile-only menu button */}
      <div className="block sm:hidden absolute top-2 right-2">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="focus:outline-none p-1 hover:bg-gray-100 rounded-full transition-colors">
                <DotsVerticalIcon className="h-3 w-3" />
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
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
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
    </Card>
  );
};

export default AlbumProductCard;
