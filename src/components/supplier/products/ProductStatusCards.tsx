import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle, Hourglass, Package } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";

const ProductStatusCards: React.FC<UserDataProps> = ({ userData }) => {
  const verifiedProducts = userData.Supplier[0].Product.filter(
    (product) => product.verified,
  ).length;

  const pendingProducts = userData.Supplier[0].Product.filter(
    (product) => !product.verified,
  ).length;

  const totalProducts = userData.Supplier[0].Product.length;

  const cardData = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Products",
      value: pendingProducts,
      icon: Hourglass,
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      iconColor: "text-yellow-500",
    },
    {
      title: "Verified Products",
      value: verifiedProducts,
      icon: CheckCircle,
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      iconColor: "text-green-600",
    },
  ];

  const StatCard = ({ data }: { data: (typeof cardData)[0] }) => (
    <Card
      className={`border-0 shadow-md ${data.bgColor} hover:shadow-lg transition-shadow`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {data.title}
            </CardTitle>
            <p className={`text-3xl font-bold ${data.textColor}`}>
              {data.value}
            </p>
          </div>
          <data.icon size={32} className={`${data.iconColor} opacity-80`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {cardData.map((data, index) => (
          <StatCard key={index} data={data} />
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {cardData.map((data, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5">
                <StatCard data={data} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default ProductStatusCards;
