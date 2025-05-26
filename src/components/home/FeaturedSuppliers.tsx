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
    <div className="mb-6 sm:mb-8">
      <h2 className="text-mobile-xl text-blue-950 font-bold mb-3 sm:mb-4 px-mobile-padding sm:px-0">
        Featured Suppliers
      </h2>
      <div className="grid-suppliers-mobile px-mobile-padding sm:px-0">
        {suppliers.map((supplier) => (
          <Link
            href={`/supplier/${supplier.businessName}`}
            key={supplier.id}
            legacyBehavior
          >
            <Card className="w-full hover:border-primary card-hover cursor-pointer h-full flex flex-col min-h-[200px] sm:min-h-[240px]">
              <CardHeader className="p-0">
                <div className="w-full h-24 sm:h-32 md:h-40 overflow-hidden relative group">
                  <Image
                    src={supplier.businessPicture || "/businesses/default.jpg"}
                    alt={supplier.businessName}
                    width={300}
                    height={200}
                    className="rounded-t-xl object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 flex flex-col flex-grow">
                <CardTitle className="text-mobile-base font-semibold line-clamp-2 mb-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight">
                  {supplier.businessName}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="w-fit mb-2 text-mobile-xs sm:text-xs"
                >
                  {supplier.productCount} Product
                  {supplier.productCount !== 1 ? "s" : ""}
                </Badge>
                <div className="flex items-center gap-1 mt-auto pt-1">
                  <StarFilledIcon
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      supplier.totalReviews > 0
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                  <span className="text-mobile-xs sm:text-sm line-clamp-1">
                    {supplier.totalReviews > 0
                      ? `${supplier.averageRating.toFixed(1)} (${supplier.totalReviews})`
                      : "No reviews"}
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
