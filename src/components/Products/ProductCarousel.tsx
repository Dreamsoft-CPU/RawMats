import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ProductPreviewCard from "./ProductPreviewCard";
import { Products } from "@/utils/Products";

const ProductCarousel: React.FC<Products> = ({ products }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md ">
      <div className="flex w-max space-x-4 p-4">
        {products.map((product) => (
          <ProductPreviewCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            supplier={product.supplier}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="hidden sm:flex" />
    </ScrollArea>
  );
};

export default ProductCarousel;
