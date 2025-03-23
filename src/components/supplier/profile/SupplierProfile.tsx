"use client";

import React from "react";
import { CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import { SupplierInfoProps } from "@/lib/interfaces/SupplierInfoProps";
import { Button } from "@/components/ui/button";

const SupplierProfileCard: React.FC<SupplierInfoProps> = ({ data }) => {
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
          <h1 className="text-lg font-semibold text-gray-800">
            {data.businessName}
          </h1>
          <p className="text-green-600 text-xs font-semibold">
            RawMats Supplier
          </p>
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
              <div
                className="flex absolute top-0 left-0 overflow-hidden"
                style={{ width: `${(4.8 / 5) * 100}%` }}
              >
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`fg-${index}`}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-600">
              ({(4.8).toFixed(1)} • {Number(1432).toLocaleString()} reviews)
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-300" />

      <div className="space-y-3">
        <h2 className="text-base font-medium text-gray-800">
          Business Details
        </h2>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-md text-xs font-semibold">
            <CheckCircle size={12} /> Verified
          </span>
        </div>
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

      <div className="space-y-4">
        <h2 className="text-base font-medium text-gray-800">
          Supplier Reviews
        </h2>

        {/* Review 1 */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Reviewer"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">John Smith</p>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r1-bg-${index}`}
                      size={14}
                      className="text-gray-200"
                    />
                  ))}
                </div>
                <div
                  className="flex absolute overflow-hidden"
                  style={{ width: `${(5 / 5) * 70}px` }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r1-fg-${index}`}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-auto">2 days ago</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">
              Excellent quality and service
            </h3>
            <p className="text-gray-600 text-xs mt-1">
              I have been ordering raw materials from this supplier for over a
              year now. Their products are consistently high quality and
              delivery is always on time. Highly recommended for anyone in the
              manufacturing industry.
            </p>
          </div>
        </div>

        {/* Review 2 */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Reviewer"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">Maria Rodriguez</p>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r2-bg-${index}`}
                      size={14}
                      className="text-gray-200"
                    />
                  ))}
                </div>
                <div
                  className="flex absolute overflow-hidden"
                  style={{ width: `${(4 / 5) * 70}px` }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r2-fg-${index}`}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-auto">1 week ago</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">Great communication</h3>
            <p className="text-gray-600 text-xs mt-1">
              What sets this supplier apart is their excellent communication.
              They are always responsive and willing to work with us on custom
              orders. The materials are good quality and reasonably priced.
            </p>
          </div>
        </div>

        {/* Review 3 */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Reviewer"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">David Chen</p>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r3-bg-${index}`}
                      size={14}
                      className="text-gray-200"
                    />
                  ))}
                </div>
                <div
                  className="flex absolute overflow-hidden"
                  style={{ width: `${(4.5 / 5) * 70}px` }}
                >
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={`r3-fg-${index}`}
                      size={14}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-auto">3 weeks ago</span>
          </div>
          <div>
            <h3 className="font-medium text-sm">Reliable and consistent</h3>
            <p className="text-gray-600 text-xs mt-1">
              We have tried several suppliers in the past, but this one has been
              the most reliable. Their materials are consistent in quality and
              they are very transparent about their sourcing. Will continue to
              order from them.
            </p>
          </div>
        </div>

        <Button variant="outline" className="w-full text-sm">
          View all reviews
        </Button>
      </div>
    </div>
  );
};

export default SupplierProfileCard;
