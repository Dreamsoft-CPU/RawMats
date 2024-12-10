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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface AlbumProductCardProps extends ProductPreview {
  albumId: string;
}

const AlbumProductCard: React.FC<AlbumProductCardProps> = ({
  userId,
  id,
  name,
  supplier,
  price,
  image,
  albumId,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState<"favorite" | "album">("favorite");
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationResponse = await fetch(`/api/supplier/location`, {
          method: "POST",
          body: JSON.stringify({ locationLink: supplier.businessLocation }),
        });
        if (!locationResponse.ok) throw new Error("Failed to fetch location");
        const { locationName } = await locationResponse.json();

        setLocationName(locationName || supplier.businessLocation);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch location data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supplier.businessLocation]);

  const handleRemoveFavorite = async () => {
    setAlertType("favorite");
    setIsAlertOpen(true);
  };

  const handleRemoveFromAlbum = async () => {
    setAlertType("album");
    setIsAlertOpen(true);
  };

  const confirmRemove = async () => {
    try {
      if (alertType === "favorite") {
        const response = await fetch(`/api/product/${id}/favorite/${userId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove favorite");
      } else {
        const response = await fetch(`/api/albums/${albumId}/product/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove from album");
      }
      router.refresh();
      toast({
        title: "Success",
        description: `Product removed from ${alertType === "favorite" ? "favorites" : "album"}`,
      });
    } catch (error) {
      console.error(`Error removing ${alertType}:`, error);
      toast({
        title: "Error",
        description: `Failed to remove product from ${alertType === "favorite" ? "favorites" : "album"}`,
        variant: "destructive",
      });
    } finally {
      setIsAlertOpen(false);
    }
  };

  const handleCardClick = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Card
      className="w-full overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <Image
            src={imageError ? "/products/default.jpg" : image}
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
                      This will remove the item from your favorites and all
                      albums. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmRemove}
                      className="bg-rawmats-primary-500 text-white hover:bg-rawmats-primary-700"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={handleRemoveFromAlbum}
                  >
                    Remove from Album
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove from Album</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the item from this album. This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmRemove}
                      className="bg-rawmats-primary-500 text-white hover:bg-rawmats-primary-700"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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

export default AlbumProductCard;
