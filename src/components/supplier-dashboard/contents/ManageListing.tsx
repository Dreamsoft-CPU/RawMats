import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/types";

const ManageListings = ({
  fetchedProducts,
}: {
  fetchedProducts: Product[];
}) => {
  const [products, setProducts] = useState<Product[]>(fetchedProducts);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="mt-6">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="max-w-[250px] border rounded-lg shadow-xl overflow-hidden bg-[#F2F8FC] hover:shadow-2xl transition-shadow duration-300"
            >
              {product.image && (
                <div className="relative w-full h-40">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                    loading="lazy"
                    quality={75}
                  />
                </div>
              )}
              <div className="p-4 flex flex-col items-center">
                <h3 className="text-base font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-2 text-sm text-center">
                  {product.description}
                </p>
                <p className="text-green-500 mt-4 text-lg font-semibold">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="mt-4 bg-red-200 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 rounded-xl py-1 px-4 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products created yet.</p>
      )}
    </div>
  );
};

export default ManageListings;
