"use client";
import { Star } from "lucide-react";
import { SupplierInfoProps } from "@/lib/interfaces/SupplierInfoProps";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SupplierProfileCard: React.FC<SupplierInfoProps> = ({ data }) => {
  const productCount = data.Product.filter(
    (product) => product.verified,
  ).length;
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg space-y-4 text-sm w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative group shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <Image
              src={data.businessPicture || "/placeholder-business.jpg"}
              alt={data.businessName || "Business"}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {data.businessName}
              </h1>
              <p className="text-green-600 text-xs font-semibold">
                RawMats Supplier
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              >
                Copy link
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex relative">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`bg-${index}`}
                    size={16}
                    className="text-gray-200"
                  />
                ))}
              </div>
              <div className="grid grid-cols-5 absolute top-0 left-0">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={`fg-${index}`}
                    style={{ width: `${index === 4 ? "35" : "100"}%` }}
                    className="overflow-hidden"
                  >
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  </div>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-600">
              ({productCount} verified product{productCount !== 1 && "s"} •{" "}
              {Number(1432).toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Business Details
        </h2>
        <div>
          <div className="flex justify-between items-center">
            <strong className="text-gray-700">Bio</strong>
          </div>
          {data.bio ? (
            <p className="text-gray-600 text-xs mt-1">{data.bio}</p>
          ) : (
            <p className="text-gray-400 italic text-xs mt-1">No bio added.</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <strong className="text-gray-700">Location:</strong>
            <p className="text-blue-500 text-xs mt-1 cursor-pointer hover:underline">
              {data.businessLocation || "No location added"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Supplier Personal Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Supplier name:</strong>
            </div>
            <p className="text-gray-600 text-xs mt-1">
              {data.user.displayName}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Email:</strong>
            </div>
            <p className="text-gray-600 text-xs mt-1">{data.user.email}</p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <strong className="text-gray-700">Phone:</strong>
            </div>
            <p className="text-gray-600 text-xs mt-1">
              {data.businessPhone || "No phone number added"}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Verified Products
        </h2>
        <div className="grid sm:grid-cols-5 gap-4">
          {data.Product.length > 0 ? (
            data.Product.map((product) => {
              let averageRating = 0;

              for (let i = 0; i < product.ratings.length; i++) {
                averageRating += product.ratings[i].rating;
              }

              averageRating = averageRating / product.ratings.length;

              const avgRatingNumber = Math.floor(averageRating);
              const avgRatingDecimal = (averageRating - avgRatingNumber) * 100;

              return (
                <Card
                  key={product.id}
                  className="w-full max-w-52 max-h-96 h-fit hover:border-primary transition-transform duration-200 hover:scale-105"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <CardHeader className="p-0">
                    <div className="w-full h-36 overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="rounded-t-xl object-cover w-full h-full object-center"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="p-4">
                      <CardTitle className="truncate flex flex-col justify-between text-lg items-start">
                        {product.name}
                        <div className="flex relative items-center w-full">
                          <div className="flex">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={`bg-${index}`}
                                size={16}
                                className="text-gray-200"
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-5 absolute top-0 left-0">
                            {!Number.isNaN(averageRating) &&
                              [...Array(avgRatingNumber + 1)].map(
                                (_, index) => (
                                  <div
                                    key={`fg-${index}`}
                                    style={{
                                      width: `${index === avgRatingNumber ? String(avgRatingDecimal) : "100"}%`,
                                    }}
                                    className="overflow-hidden"
                                  >
                                    <Star
                                      size={16}
                                      className="fill-yellow-400 text-yellow-400"
                                    />
                                  </div>
                                ),
                              )}
                          </div>
                          <div className="absolute right-0 text-gray-600 ml-2">
                            {averageRating ? averageRating.toFixed(1) : "N/A"}
                          </div>
                        </div>
                      </CardTitle>
                      <CardDescription className="truncate mt-2">
                        {product.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-primary font-bold text-lg">
                      ₱{product.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-400 italic text-xs mt-1">
              No verified products yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProfileCard;
