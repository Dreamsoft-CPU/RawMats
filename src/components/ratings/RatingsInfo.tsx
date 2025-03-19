"use client";

import React, { useState } from "react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import FeedbackModal from "./FeedbackModal";

//Mock Data basis!
const mockRatings = {
  averageRating: 4.5,
  totalReviews: 120,
  feedbacks: [
    {
      id: 1,
      user: "Lowest",
      comment: "Great quality boogsh!",
      rating: 5,
      date: "Feb 15, 2024",
    },
    {
      id: 2,
      user: "Curseten",
      comment: "LGTM!",
      rating: 4,
      date: "Jan 28, 2024",
    },
    {
      id: 3,
      user: "Alonsagay",
      comment: "No comment!",
      rating: 3,
      date: "Dec 10, 2023",
    },
    {
      id: 4,
      user: "L",
      comment: "Amazing product!",
      rating: 5,
      date: "Nov 20, 2023",
    },
    {
      id: 5,
      user: "J",
      comment: "Good value for money.",
      rating: 4,
      date: "Oct 15, 2023",
    },
  ],
};

const filterOptions: (string | number)[] = ["All Stars", 1, 2, 3, 4, 5];

const RatingsInfo = () => {
  const [selectedFilter, setSelectedFilter] = useState<string | number>(
    "All Stars"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRatingSubmit = (rating: number) => {
    console.log("Submitted rating:", rating);
  };

  const filteredFeedbacks =
    selectedFilter === "All Stars"
      ? mockRatings.feedbacks
      : mockRatings.feedbacks.filter(
          (feedback) => feedback.rating === Number(selectedFilter)
        );

  return (
    <div>
      <div className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center space-x-6">
          <p className="text-lg font-semibold">
            Total Reviews: {mockRatings.totalReviews}
          </p>
          <div className="flex items-center">
            <p className="text-lg font-semibold mr-2">
              Average Rating: {mockRatings.averageRating.toFixed(1)}
            </p>
            {[...Array(5)].map((_, index) => (
              <StarFilledIcon
                key={index}
                className={`w-5 h-5 ${
                  index < Math.floor(mockRatings.averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="border border-blue-500 text-black text-xs font-medium px-3 py-1.5 rounded-md transition hover:bg-blue-100"
        >
          <StarFilledIcon className="inline w-4 h-4 mr-1 text-blue-500" /> Rate
          this product
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6 px-4">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`px-4 py-2 text-sm font-medium border rounded-lg transition-all ${
              selectedFilter === option
                ? "bg-gray-800 text-white"
                : "border-gray-300 text-gray-700"
            }`}
            onClick={() => setSelectedFilter(option)}
          >
            {option} {typeof option === "number" ? "Star" : ""}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md max-w-7xl mx-auto">
        {filteredFeedbacks.map((feedback, index) => (
          <div
            key={feedback.id}
            className={`p-4 ${index !== 0 ? "border-t border-gray-300" : ""}`}
          >
            <div className="flex items-start">
              <div className="w-1/2 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-white">
                  {feedback.user.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-md font-semibold">{feedback.user}</p>
                  <p className="text-sm text-gray-500">{feedback.date}</p>

                  <div className="flex items-center space-x-1 mt-1">
                    <p className="text-sm font-semibold">{feedback.rating}</p>
                    {[...Array(5)].map((_, i) => (
                      <StarFilledIcon
                        key={i}
                        className={`w-4 h-4 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-l border-gray-300 h-auto mx-4"></div>

              <div className="w-1/2">
                <p className="text-sm text-gray-600">{feedback.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default RatingsInfo;
