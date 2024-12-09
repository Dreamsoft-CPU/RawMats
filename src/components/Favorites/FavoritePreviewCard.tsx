"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Building, MoreVertical } from "lucide-react";
import { ProductPreview } from "@/utils/Products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddToAlbumDialog } from "@/components/Albums/AddToAlbumDialog";
import { Badge } from "@/components/ui/badge";

interface Album {
  id: string;
  name: string;
}

interface FavoritePreviewCardProps extends ProductPreview {
  albums: Album[];
}

const FavoritePreviewCard: React.FC<FavoritePreviewCardProps> = ({
  userId,
  id,
  name,
  supplier,
  price,
  albums,
}) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("/products/default.jpg");
  const [imageError, setImageError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [imageResponse, locationResponse] = await Promise.all([
          fetch(`/api/product/${id}/image`, { next: { revalidate: 3600 } }),
          fetch(`/api/supplier/location`, {
            method: "POST",
            body: JSON.stringify({ locationLink: supplier.businessLocation }),
          }),
        ]);

        if (!imageResponse.ok) throw new Error("Failed to fetch image");
        if (!locationResponse.ok) throw new Error("Failed to fetch location");

        const imageData = await imageResponse.json();
        const { locationName } = await locationResponse.json();

        setImageUrl(imageData.publicUrl);
        setLocationName(locationName || supplier.businessLocation);
      } catch (error) {
        console.error("Error fetching data:", error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, supplier.businessLocation]);

  const handleRemoveFavorite = async () => {
    setIsAlertOpen(true);
  };

  const confirmRemoveFavorite = async () => {
    try {
      const response = await fetch(`/api/product/${id}/favorite/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove favorite");
      router.refresh();
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setIsAlertOpen(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Card
      className="w-full max-w-md overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={imageError ? "/products/default.jpg" : imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold truncate">
            {name}
            <div className="flex text-gray-500 items-center text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{locationName}</span>
            </div>
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-56"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleRemoveFavorite}
                  >
                    Remove from Favorites
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the item from your favorites. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmRemoveFavorite}
                      className="bg-rawmats-primary-500 text-white hover:bg-rawmats-primary-700"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AddToAlbumDialog
                userId={userId}
                productId={id}
                albums={albums}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary" className="text-rawmats-primary-300">
            ₱{price.toFixed(2)}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span>0.0</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Building className="w-4 h-4 mr-1" />
          <span className="truncate">{supplier.businessName}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritePreviewCard;
