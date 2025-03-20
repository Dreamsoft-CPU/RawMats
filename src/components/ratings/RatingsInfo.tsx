"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import FeedbackModal from "./FeedbackModal";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Reviews for {productName}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    reviewCount > 0 && i < Math.floor(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium">
              {reviewCount > 0 ? avgRating.toFixed(1) : "No ratings yet"}
            </span>
            {reviewCount > 0 && (
              <>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-600">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            {userRating ? "Edit Your Review" : "Write a Review"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all ${
              selectedFilter === option
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedFilter(option)}
          >
            {option} {typeof option === "number" ? "Star" : ""}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {filteredRatings.length > 0 ? (
          filteredRatings.map((rating, index) => (
            <div
              key={rating.id}
              className={`p-4 ${index !== 0 ? "border-t border-gray-200" : ""}`}
            >
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={rating.user.profilePicture}
                    alt={rating.user.displayName}
                  />
                  <AvatarFallback>
                    {rating.user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <p className="font-medium">{rating.user.displayName}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(rating.createdAt)}
                    </p>
                    <div className="flex items-center mt-1">
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
                      <p className="text-gray-700 mt-2">{rating.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
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
