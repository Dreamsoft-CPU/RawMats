"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product, Supplier, Favorite } from "@prisma/client";
import {
  ArrowLeft,
  Heart,
  CheckCircle,
  XCircle,
  Tag,
  Building,
  Share2,
  MapPin,
} from "lucide-react";
import LoadingModal from "../Loading/LoadingModal";
import Image from "next/image";
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
  const [locationName, setLocationName] = useState<string>("");
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productResponse, favoriteResponse] = await Promise.all([
          fetch(`/api/product/${id}`),
          fetch(`/api/product/${id}/favorite/${userId}`),
        ]);
        if (!productResponse.ok)
          throw new Error("Failed to fetch product data");
        if (!favoriteResponse.ok)
          throw new Error("Failed to fetch favorite status");
        const { product, supplier } = await productResponse.json();
        const { favorite } = await favoriteResponse.json();

        setProduct(product);
        setSupplier(supplier);
        setFavoritedItem(favorite);
        if (supplier?.businessLocation) {
          const locationResponse = await fetch(`/api/supplier/location`, {
            method: "POST",
            body: JSON.stringify({ locationLink: supplier.businessLocation }),
          });
          if (locationResponse.ok) {
            const { locationName } = await locationResponse.json();
            setLocationName(locationName || supplier.businessLocation);
          }
        }
      } catch (error) {
        console.error("Error in data fetching:", error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userId]);

  const handleFavorite = async () => {
    try {
      const response = await fetch(
        `/api/product/${product?.id}/favorite/${userId}`,
        {
          method: favoritedItem ? "DELETE" : "POST",
          body: JSON.stringify({ favorite: favoritedItem }),
        },
      );
      if (!response.ok) throw new Error("Failed to update favorite");
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
                <Image
                  src={imageError ? "/products/default.jpg" : product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
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
                    <MapPin size={18} />
                    {locationName}
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavorite}
                    className="shrink-0"
                  >
                    <Heart
                      className={`w-5 h-5 ${favoritedItem ? "fill-current text-red-500" : ""}`}
                    />
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
                    ₱{product.price.toFixed(2)}
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
                  <Tag className="w-5 h-5 text-rawmats-accent-300" />
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
