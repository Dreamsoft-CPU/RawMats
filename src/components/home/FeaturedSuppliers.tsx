import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

export interface FeaturedSupplierData {
  id: string;
  businessName: string;
  businessPicture: string;
  productCount: number;
  averageRating: number;
  totalReviews: number;
}

interface FeaturedSuppliersProps {
  suppliers: FeaturedSupplierData[];
}

const FeaturedSuppliers: React.FC<FeaturedSuppliersProps> = ({ suppliers }) => {
  if (!suppliers || suppliers.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl md:text-3xl text-primary font-bold mb-4">
        Featured Suppliers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {suppliers.map((supplier) => (
          <Link
            href={`/supplier/${supplier.businessName}`}
            key={supplier.id}
            legacyBehavior
          >
            <Card className="w-full hover:border-primary transition-transform duration-200 hover:scale-105 cursor-pointer h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="w-full h-40 overflow-hidden">
                  <Image
                    src={supplier.businessPicture || "/businesses/default.jpg"}
                    alt={supplier.businessName}
                    width={300}
                    height={200}
                    className="rounded-t-xl object-cover w-full h-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-grow">
                <CardTitle className="text-lg truncate mb-1">
                  {supplier.businessName}
                </CardTitle>
                <Badge variant="secondary" className="w-fit mb-2">
                  {supplier.productCount} Product
                  {supplier.productCount !== 1 ? "s" : ""}
                </Badge>
                <div className="flex items-center gap-1 mt-auto pt-2">
                  <StarFilledIcon
                    className={
                      supplier.totalReviews > 0
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                  <span className="text-sm">
                    {supplier.totalReviews > 0
                      ? `${supplier.averageRating.toFixed(1)} (${supplier.totalReviews} review${supplier.totalReviews !== 1 ? "s" : ""})`
                      : "No product reviews"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSuppliers;
