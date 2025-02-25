"use client";
import { HeartIcon } from "lucide-react";
import React, { Fragment, useState } from "react";
import { toast } from "sonner";

const FavoriteButton = ({
  favorite,
  id,
  userId,
}: {
  favorite: boolean;
  id: string;
  userId: string;
}) => {
  const [favorited, setFavorited] = useState(favorite);
  const toggleFavorite = async () => {
    const response = await fetch(`/api/product/${id}/favorite`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      setFavorited(!favorited);
    } else {
      toast.error("An error occurred while trying to favorite this product");
    }
  };
  return (
    <Fragment>
      <span onClick={toggleFavorite}>
        {!favorited ? (
          <HeartIcon
            size={16}
            className="transition-transform duration-200 hover:scale-200"
          />
        ) : (
          <HeartIcon
            size={16}
            className="text-red-600 transition-transform duration-200 "
            fill="currentColor"
          />
        )}
      </span>
    </Fragment>
  );
};

export default FavoriteButton;
