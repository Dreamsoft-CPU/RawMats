"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductPreviewCard from "./ProductPreviewCard";
import { Products } from "@/utils/Products";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const ProductCarousel: React.FC<Products> = ({ products, userId }) => {
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
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <ProductPreviewCard
              userId={userId}
              id={product.id}
              name={product.name}
              price={product.price}
              supplier={product.supplier}
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden sm:flex" />
    </ScrollArea>
  );
};

export default ProductCarousel;
