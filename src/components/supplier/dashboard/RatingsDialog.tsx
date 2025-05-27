"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Package, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Rating {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  productName: string;
  productImage: string;
}

interface RatingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ratings: Rating[];
}

export const RatingsDialog: React.FC<RatingsDialogProps> = ({
  isOpen,
  onClose,
  ratings,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const ratingsPerPage = 10;

  // Filter ratings based on selected rating
  const filteredRatings = ratings.filter((rating) => {
    if (ratingFilter === "all") return true;
    return rating.rating === parseInt(ratingFilter);
  });

  const totalPages = Math.ceil(filteredRatings.length / ratingsPerPage);
  const startIndex = (currentPage - 1) * ratingsPerPage;
  const endIndex = startIndex + ratingsPerPage;
  const currentRatings = filteredRatings.slice(startIndex, endIndex);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (value: string) => {
    setRatingFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getRatingStats = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      stats[rating.rating as keyof typeof stats]++;
    });
    return stats;
  };

  const ratingStats = getRatingStats();
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : "0";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            All Ratings ({ratings.length})
          </DialogTitle>
        </DialogHeader>

        {/* Rating Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="col-span-2 md:col-span-1">
            <div className="text-center">
              <div className="text-2xl font-bold">{averageRating}</div>
              <div className="flex justify-center">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
          </div>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="text-center">
              <div className="text-lg font-semibold">
                {ratingStats[star as keyof typeof ratingStats]}
              </div>
              <div className="flex justify-center">{renderStars(star)}</div>
              <div className="text-xs text-muted-foreground">{star} star</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={ratingFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ratings List */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {currentRatings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No ratings found for the selected filter</p>
            </div>
          ) : (
            currentRatings.map((rating) => (
              <div
                key={rating.id}
                className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-card hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <img
                    src={rating.productImage}
                    alt={rating.productName}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">
                          {rating.productName}
                        </span>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {format(rating.createdAt, "MMM dd, yyyy")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {renderStars(rating.rating)}
                      </div>
                      <span className="text-sm font-medium">
                        {rating.rating}/5
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {rating.comment}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredRatings.length)} of{" "}
              {filteredRatings.length} ratings
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
