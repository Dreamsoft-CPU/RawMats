"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product, Supplier, Favorite } from "@prisma/client";
import {
  ArrowLeft,
  HeartIcon,
  CheckCircle,
  XCircle,
  TagIcon,
  Building,
  Share2,
  MapPin,
} from "lucide-react";
import LoadingModal from "../Loading/LoadingModal";
import Image from "next/image";
import InlineLoading from "../Loading/InlineLoading";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductInformationCard({ userId }: { userId: string }) {
  const params = useParams<{ id: string }>();
  const id: string = `${params.id}`;
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [favoritedItem, setFavoritedItem] = useState<Favorite | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // First fetch product and supplier
        const productResponse = await fetch(`/api/product/${id}`);
        const { product, supplier } = await productResponse.json();
        setProduct(product);
        setSupplier(supplier);

        // Then fetch related data in parallel once we have product/supplier
        await Promise.all([
          // Fetch favorite status
          (async () => {
            if (product.id) {
              const favoriteResponse = await fetch(
                `/api/product/${product.id}/favorite/${userId}`,
              );
              const { favorite } = await favoriteResponse.json();
              console.log(favorite);
              if (favorite) {
                setFavoritedItem(favorite);
              }
            }
          })(),

          // Fetch image
          (async () => {
            const imageResponse = await fetch(`/api/product/${id}/image`);
            const data = await imageResponse.json();
            setImageUrl(data.signedUrl);
          })(),

          // Fetch location name if needed
          (async () => {
            if (supplier?.businessLocation?.includes("google.com/maps")) {
              try {
                const locationResponse = await fetch(`/api/supplier/location`, {
                  method: "POST",
                  body: JSON.stringify({
                    locationLink: supplier.businessLocation,
                  }),
                });
                const { locationName } = await locationResponse.json();
                setLocationName(locationName);
              } catch (error) {
                console.error("Error fetching location name:", error);
                setLocationName(supplier.businessLocation);
              }
            } else {
              setLocationName(supplier?.businessLocation || "");
            }
          })(),
        ]);
      } catch (error) {
        console.error("Error in data fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userId]); // Remove supplier.businessLocation dependency as it's handled inside

  const handleFavorite = async () => {
    try {
      const response = await fetch(
        `/api/product/${product?.id}/favorite/${userId}`,
        {
          method: favoritedItem ? "DELETE" : "POST",
          body: JSON.stringify({ favorite: favoritedItem }),
        },
      );
      const { favorite } = await response.json();
      setFavoritedItem(favorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  if (loading) {
    return <LoadingModal message="Loading product..." />;
  }

  if (!product || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rawmats-secondary-300 to-rawmats-secondary-100 p-4">
        <XCircle className="w-24 h-24 text-rawmats-feedback-error mb-4" />
        <p className="text-2xl text-rawmats-feedback-error mb-4">
          Product Not Found
        </p>
        <Button variant="default" asChild>
          <Link href="/" className="flex items-center gap-2 border">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rawmats-background-700 to-rawmats-secondary-100 py-8 px-4 md:px-8">
      <Card className="max-w-7xl mx-auto">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Column - Image Section */}
            <div className="relative bg-white p-4 lg:p-8">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="absolute top-6 left-6 z-10 bg-white/80 hover:bg-white"
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>

              <div className="relative aspect-square overflow-hidden rounded-lg bg-rawmats-secondary-100">
                {loading ? (
                  <InlineLoading />
                ) : (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="bg-white p-6 lg:p-8 flex flex-col">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex flex-col">
                  <h1 className="text-2xl lg:text-3xl font-bold text-rawmats-text-700">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 truncate"
                    >
                      <Building className="w-4 h-4" />
                      {supplier.businessName}
                    </Badge>
                    {product.verified && (
                      <Badge
                        variant="default"
                        className="bg-rawmats-feedback-success"
                      >
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Link
                    href={
                      supplier.businessLocation.includes("www.google.com/maps")
                        ? supplier.businessLocation
                        : `https://google.com/maps/search/${encodeURIComponent(supplier.businessLocation)}`
                    }
                    target="_blank"
                    className="text-blue-600 hover:underline mt-4 pt-4 text-md flex flex-row items-center gap-2"
                  >
                    <MapPin size={18} /> {locationName}
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavorite}
                    className="shrink-0"
                  >
                    {favoritedItem ? (
                      <HeartIcon className="w-5 h-5 fill-rawmats-feedback-error text-rawmats-feedback-error" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-rawmats-neutral-900" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-3xl font-bold text-rawmats-accent-300">
                    ₱{product.price}
                  </p>
                </div>

                <div className="prose prose-sm">
                  <h3 className="text-lg font-semibold text-rawmats-text-700">
                    Description
                  </h3>
                  <p className="text-rawmats-neutral-900">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {product.verified ? (
                    <Badge
                      variant="default"
                      className="bg-rawmats-feedback-success"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-rawmats-neutral-900 gap-2">
                  <TagIcon className="w-5 h-5 text-rawmats-accent-300" />
                  Added on {new Date(product.dateAdded).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
