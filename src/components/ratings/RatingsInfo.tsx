"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Star, ArrowLeft } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface Rating {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    displayName: string;
    profilePicture: string;
  };
}

interface RatingsInfoProps {
  productId: string;
  initialRatings?: Rating[];
  averageRating?: number;
  totalReviews?: number;
  currentUserId?: string;
  productName?: string;
}

const filterOptions: (string | number)[] = ["All Stars", 1, 2, 3, 4, 5];

const RatingsInfo: React.FC<RatingsInfoProps> = ({
  productId,
  initialRatings = [],
  averageRating = 0,
  totalReviews = 0,
  currentUserId,
  productName = "this product",
}) => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string | number>(
    "All Stars",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>(initialRatings);
  const [avgRating, setAvgRating] = useState<number>(averageRating);
  const [reviewCount, setReviewCount] = useState<number>(totalReviews);
  const [userRating, setUserRating] = useState<Rating | null>(
    initialRatings.find((r) => r.userId === currentUserId) || null,
  );

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?productId=${productId}`);
        if (!response.ok) throw new Error("Failed to fetch ratings");

        const data = await response.json();
        setRatings(data.ratings);
        setAvgRating(data.averageRating);
        setReviewCount(data.totalReviews);
        setUserRating(
          data.ratings.find((r: Rating) => r.userId === currentUserId) || null,
        );
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    if (initialRatings.length === 0) {
      fetchRatings();
    }
  }, [productId, initialRatings.length, currentUserId]);

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!currentUserId) {
      // Redirect to login if user is not logged in
      router.push(`/login?redirect=/ratings?productId=${productId}`);
      return;
    }

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      const data = await response.json();

      // Add the new rating to the state
      setRatings((prev) => {
        // If user already rated, replace their rating
        const filteredRatings = prev.filter((r) => r.userId !== currentUserId);
        return [data.rating, ...filteredRatings];
      });

      setAvgRating(data.newAverageRating);
      setUserRating(data.rating);

      // Only increment count if it's a new rating
      if (!ratings.some((r) => r.userId === currentUserId)) {
        setReviewCount((prev) => prev + 1);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const filteredRatings =
    selectedFilter === "All Stars"
      ? ratings
      : ratings.filter((r) => r.rating === Number(selectedFilter));

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteRating = async () => {
    if (!confirm("Are you sure you want to delete your rating?")) return;

    try {
      const response = await fetch("/api/ratings", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }), // assuming `productId` is in scope
      });

      if (!response.ok) throw new Error("Failed to delete rating");

      // Optional: toast notification if you're using a toast library
      // toast.success("Rating deleted successfully");

      setUserRating(null); // Clear user's rating from state
      setRatings((prev) => prev.filter((r) => r.userId !== currentUserId));
      setReviewCount((prev) => Math.max(0, prev - 1));

      // Optionally re-fetch updated ratings or refresh
      // router.refresh(); // Uncomment if needed to revalidate data
    } catch (error) {
      console.error("Error deleting rating:", error);
      // toast.error("Failed to delete rating");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Back button */}
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/product/${productId}`)}
          className="flex items-center gap-2 text-mobile-sm hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-mobile-xl font-bold text-gray-800">
          Reviews for {productName}
        </h1>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 transition-all duration-300 ${
                    reviewCount > 0 && i < Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">
              {reviewCount > 0 ? avgRating.toFixed(1) : "No ratings yet"}
            </span>
            {reviewCount > 0 && (
              <span className="text-gray-500 text-sm">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-indigo-600 text-blue-600 hover:bg-indigo-100 py-2 px-5 rounded-full text-sm font-medium transition-all shadow-md"
          >
            {userRating ? "Edit Your Review" : "Write a Review"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 text-sm font-medium border rounded-full transition-all shadow-sm ${
              selectedFilter === option
                ? "bg-indigo-100 text-black border-indigo-600"
                : "border-indigo-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedFilter(option)}
          >
            {option} {typeof option === "number" ? "Star" : ""}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredRatings.length > 0 ? (
          filteredRatings.map((rating) => (
            <div
              key={rating.id}
              className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all relative"
            >
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={rating.user.profilePicture}
                    alt={rating.user.displayName}
                  />
                  <AvatarFallback>
                    {rating.user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {rating.user.displayName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(rating.createdAt)}
                  </p>
                  <div className="flex items-center mt-1 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 transition-all ${
                          i < rating.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-none text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  {rating.comment && (
                    <p className="text-gray-700 mt-3 text-sm">
                      {rating.comment}
                    </p>
                  )}
                </div>

                {rating.userId === currentUserId && (
                  <button
                    onClick={handleDeleteRating}
                    className="mt-4 border border-red-500 text-red-500 hover:bg-red-50 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-full transition-all"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-gray-500 rounded-lg">
            No reviews found for this product with the selected filter.
          </div>
        )}
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRatingSubmit={handleRatingSubmit}
        productName={productName}
        initialRating={userRating?.rating}
        initialComment={userRating?.comment || ""}
      />
    </div>
  );
};

export default RatingsInfo;
