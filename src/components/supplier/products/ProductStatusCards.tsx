import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="flex flex-col gap-4 w-full z-50">
      {/* For desktop/larger screens */}
      <div className="hidden md:flex md:space-x-4 w-full">
        <Card className="relative border border-gray-200 shadow-lg bg-white p-6 flex-1">
          <div className="flex items-start">
            <Package size={32} className="h-7 w-7 text-blue-600 mr-3" />
            <div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {totalProducts}
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
        <Card className="relative border border-gray-200 shadow-lg bg-white p-6 flex-1">
          <div className="flex items-start">
            <Hourglass className="h-7 w-7 text-yellow-500 mr-3" />
            <div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">
                  Pending Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-yellow-500">
                  {pendingProducts}
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
        <Card className="relative border border-gray-200 shadow-lg bg-white p-6 flex-1">
          <div className="flex items-start">
            <CheckCircle className="h-7 w-7 text-green-600 mr-3" />
            <div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">
                  Verified Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {verifiedProducts}
                </p>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>

      {/* For mobile screens */}
      <div className="flex flex-col items-center justify-center md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <Card className="border border-gray-200 shadow-lg bg-white p-6">
                <div className="flex items-start">
                  <Package size={32} className="h-7 w-7 text-blue-600 mr-3" />
                  <div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-700">
                        Total Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">5</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="border border-gray-200 shadow-lg bg-white p-6">
                <div className="flex items-start">
                  <Hourglass className="h-7 w-7 text-yellow-500 mr-3" />
                  <div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-700">
                        Pending Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-yellow-500">5</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="border border-gray-200 shadow-lg bg-white p-6">
                <div className="flex items-start">
                  <CheckCircle className="h-7 w-7 text-green-600 mr-3" />
                  <div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-gray-700">
                        Verified Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">5</p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default ProductStatusCards;
