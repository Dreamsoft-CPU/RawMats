"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductPreview } from "@/utils/Products";
import InlineLoading from "../Loading/InlineLoading";

const ProductPreviewCard: React.FC<ProductPreview> = ({
  id,
  name,
  supplier,
  price,
}) => {
  const router = useRouter();
  const onClickComponent = () => {
    router.push(`/product/${id}`);
  };

  const { businessLocation, businessName } = supplier;
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      const response = await fetch(`/api/product/${id}/image`);
      const data = await response.json();
      setImageUrl(data.signedUrl);
      console.log(data);
    };
    fetchImage();
    setLoading(false);
  }, [id]);

  return (
    <Card onClick={() => onClickComponent()} className="w-56 overflow-hidden">
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden items-center justify-center bg-gray-100">
        {loading ? (
          <InlineLoading />
        ) : (
          <Image
            width={500}
            height={500}
            src={imageUrl}
            alt={id}
            className="w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-blue-600 font-medium mb-2">₱ {price}</p>
        <CardDescription className="text-gray-500">
          Location: {businessLocation} Supplier: {businessName}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductPreviewCard;
