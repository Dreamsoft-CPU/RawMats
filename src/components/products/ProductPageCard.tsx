"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import type { ProductCardProps } from "@/lib/interfaces/ProductPageProps";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { Star } from "lucide-react";
import FeedbackModal from "../ratings/FeedbackModal";

const ProductPageCard = ({ data }: ProductCardProps) => {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(
    data.favorites?.some((favorite) => favorite.userId === data.userId) ||
      false,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const totalReviews = data.totalReviews || 0;
  const hasRatings = totalReviews > 0;
  const averageRating = data.averageRating || 0;

  const createConversation = async () => {
    try {
      setIsCreatingConversation(true);
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId: data.supplier.userId }),
      });

      if (response.ok) {
        const { conversation } = await response.json();
        router.push(`/conversations?conversationId=${conversation.id}`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create conversation");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Failed to create conversation. Please try again.");
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const toggleFavorite = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/product/${data.id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: data.userId }),
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update favorite status");
      console.log("Failed to update favorite status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isFavorite, data.id, data.userId, router]);

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: data.id,
          rating,
          comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      router.refresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto my-4 md:my-8">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-8">
        <div className="relative aspect-square w-full">
          <Image
            src={data.image || "/placeholder.svg"}
            alt={data.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-4 md:p-6 flex flex-col">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {data.name}
            </h1>
            <button
              onClick={toggleFavorite}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isFavorite ? (
                <HeartIcon className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    hasRatings && i < Math.floor(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">
              {hasRatings ? averageRating.toFixed(1) : "No ratings yet"}
            </span>
            {hasRatings && (
              <>
                <span className="mx-2 text-gray-500">•</span>
                <Link
                  href={`/ratings?productId=${data.id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-auto text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1 px-2 rounded-md transition-colors"
            >
              {data.userRating ? "Edit Rating" : "Rate Product"}
            </button>
          </div>

          <div className="mt-3 md:mt-4">
            <span className="text-2xl md:text-3xl font-bold text-indigo-600">
              ₱{data.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 md:mt-6 border-t border-gray-200 pt-3 md:pt-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={data.supplier.businessPicture}
                  alt={data.supplier.businessName}
                />
                <AvatarFallback>
                  {data.supplier.businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">
                  <Link
                    href={`/supplier/${data.supplier.businessName}`}
                    className="hover:underline"
                  >
                    {data.supplier.businessName}
                  </Link>
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(data.supplier.businessLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm text-blue-600 hover:underline"
                >
                  {data.supplier.businessLocation}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-6">
            <h2 className="text-base md:text-lg font-semibold mb-2">
              Description
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {data.description}
            </p>
          </div>

          <div className="mt-auto pt-4 md:pt-6">
            <button
              onClick={() => {
                createConversation();
              }}
              disabled={isCreatingConversation}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingConversation ? "Creating..." : "Contact Supplier"}
            </button>
          </div>
        </div>
      </div>

      {data.ratings && data.ratings.length > 0 && (
        <div className="p-4 md:p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">
              Recent Reviews
            </h2>
            <Link
              href={`/ratings?productId=${data.id}`}
              className="text-sm text-indigo-600 hover:underline"
            >
              View all reviews
            </Link>
          </div>
          <div className="space-y-4">
            {data.ratings.map((rating) => (
              <div
                key={rating.id}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="flex items-center mb-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={rating.user.profilePicture}
                      alt={rating.user.displayName}
                    />
                    <AvatarFallback>
                      {rating.user.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {rating.user.displayName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(rating.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-none text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {rating.comment && (
                  <p className="text-sm text-gray-600 mt-1">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRatingSubmit={handleRatingSubmit}
        productName={data.name}
        initialRating={data.userRating?.rating}
        initialComment={data.userRating?.comment || ""}
      />
    </div>
  );
};

export default ProductPageCard;
