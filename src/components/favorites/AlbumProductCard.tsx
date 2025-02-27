"use client";
import React, { useState } from "react";
import Image from "next/image";
import { StarFilledIcon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
      className="max-w-52 hover:border-primary transition-transform duration-200 hover:scale-105"
    >
      <CardHeader>
        <div className="-mx-6 -mt-6 aspect-square">
          <Image
            src={image}
            alt="Product"
            width={500}
            height={500}
            className="rounded-t-xl object-cover w-full h-full"
          />
        </div>
        <CardTitle className="truncate flex flex-row justify-between text-lg -mx-4 items-center ">
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
        <CardDescription className="-mx-4">
          {supplier.businessName || "RawMats Supplier"}
        </CardDescription>
      </CardHeader>
      <CardContent className="-mt-4 -mx-4">
        <p className="text-primary font-bold text-lg">₱{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="-mx-4">
        <p className="flex flex-row items-center gap-1">
          <StarFilledIcon className="text-yellow-300" />
          5.0
        </p>
      </CardFooter>
    </Card>
  );
};

export default AlbumProductCard;
