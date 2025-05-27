"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Package, Eye } from "lucide-react";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";
import { format } from "date-fns";
import { useState } from "react";
import { RatingsDialog } from "./RatingsDialog";

export const RecentRatingsList: React.FC<UserDataProps> = ({ userData }) => {
  const [showAllRatings, setShowAllRatings] = useState(false);

  // Get all ratings from all products and sort by date
  const getAllRatings = () => {
    const allRatings = userData.Supplier.flatMap((supplier) =>
      supplier.Product.flatMap((product) =>
        product.ratings.map((rating) => ({
          ...rating,
          productName: product.name,
          productImage: product.image,
        })),
      ),
    );

    return allRatings.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  const allRatings = getAllRatings();
  const recentRatings = allRatings.slice(0, 5);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (allRatings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Recent Ratings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No ratings yet</p>
            <p className="text-sm">
              Ratings will appear here once customers rate your products
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Recent Ratings
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllRatings(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentRatings.map((rating) => (
            <div
              key={rating.id}
              className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1">
                <img
                  src={rating.productImage}
                  alt={rating.productName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-sm truncate">
                      {rating.productName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(rating.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(rating.createdAt, "MMM dd, yyyy")}
                    </span>
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-muted-foreground">
                      {truncateText(rating.comment, 100)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <RatingsDialog
        isOpen={showAllRatings}
        onClose={() => setShowAllRatings(false)}
        ratings={allRatings}
      />
    </>
  );
};
