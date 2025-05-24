"use client";
import React, { useState } from "react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddToAlbumDialog from "./AddToAlbumDialog";
import { Card } from "@/components/ui/card";
import { Album } from "./albumTypes.type";

interface FavoriteProductCardProps {
  id: string;
  favoriteId: string;
  name: string;
  price: number;
  image: string | null;
  supplier: string;
  albums: Album[];
}

const FavoriteProductCard = ({
  id,
  favoriteId,
  name,
  image,
  price,
  supplier,
  albums,
}: FavoriteProductCardProps) => {
  const [addToAlbumOpen, setAddToAlbumOpen] = useState(false);

  return (
    <>
      <Card className="w-full max-w-52 h-[360px] border border-blue-950 hover:border-primary transition-transform duration-200 hover:scale-105 overflow-hidden">
        <div className="w-full h-52 overflow-hidden">
          <Link href={`/product/${id}`}>
            {image ? (
              <Image
                src={image}
                alt={name}
                width={500}
                height={500}
                className="rounded-t-xl object-cover object-center w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-xl">
                No Image
              </div>
            )}
          </Link>
        </div>
        <div className="p-6 pt-4">
          <div className="flex flex-row justify-between items-center">
            <h3 className="font-medium truncate text-lg">{name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setAddToAlbumOpen(true)}>
                  Add to Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground truncate whitespace-nowrap overflow-hidden">
            {supplier || "RawMats Supplier"}
          </p>
          <p className="inline-block text-sm font-semibold text-black bg-blue-100 rounded-full px-3 py-1 mt-4">
            ₱{price.toFixed(2)}
          </p>
        </div>
      </Card>

      <AddToAlbumDialog
        open={addToAlbumOpen}
        setOpen={setAddToAlbumOpen}
        albums={albums}
        favoriteId={favoriteId}
      />
    </>
  );
};

export default FavoriteProductCard;
