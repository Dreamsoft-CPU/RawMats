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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="mobile-card w-full border border-blue-950 hover:border-primary card-hover cursor-pointer overflow-hidden">
        <CardHeader className="p-0">
          <div className="mobile-card-image w-full overflow-hidden relative group">
            <Link href={`/product/${id}`}>
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  width={500}
                  height={500}
                  className="rounded-t-xl object-cover object-center w-full h-full group-hover:scale-110 transition-transform duration-300"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-xl text-mobile-sm text-gray-500">
                  No Image
                </div>
              )}
            </Link>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:opacity-100">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setAddToAlbumOpen(true)}>
                      Add to Album
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mobile-card-content flex-1 flex flex-col">
          <Link href={`/product/${id}`} className="flex-1">
            <CardTitle className="text-mobile-base font-semibold mb-1 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
              {name}
            </CardTitle>
            <CardDescription className="text-mobile-sm mb-2 line-clamp-1">
              {supplier || "RawMats Supplier"}
            </CardDescription>

            <div className="mb-3">
              <span className="inline-block text-mobile-sm font-bold text-white bg-blue-600 rounded-full px-2 py-1 sm:px-3 sm:py-1">
                ₱{price.toFixed(2)}
              </span>
            </div>
          </Link>
        </CardContent>

        {/* Mobile-only menu button */}
        <div className="block sm:hidden absolute top-2 right-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setAddToAlbumOpen(true)}>
                  Add to Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
