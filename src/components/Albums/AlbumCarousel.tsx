"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import AlbumPreviewCard from "./AlbumPreviewCard";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Album {
  id: string;
  name: string;
  favorites: Array<{ product: { id: string; name: string; image: string } }>;
}

interface AlbumCarouselProps {
  albums: Album[];
}

const AlbumCarousel: React.FC<AlbumCarouselProps> = ({ albums }) => {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2,
      spacing: 16,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: { perView: 2.2, spacing: 16 },
      },
      "(min-width: 768px)": {
        slides: { perView: 3.2, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 4.2, spacing: 16 },
      },
    },
  });

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div ref={sliderRef} className="keen-slider">
        {albums.map((album) => (
          <div key={album.id} className="keen-slider__slide">
            <AlbumPreviewCard
              id={album.id}
              name={album.name}
              favorites={album.favorites}
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden sm:flex" />
    </ScrollArea>
  );
};

export default AlbumCarousel;
