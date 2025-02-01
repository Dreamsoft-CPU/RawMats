"use client";
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { Supplier } from "@prisma/client";

interface ProductListProps {
  products: {
    id: string;
    name: string;
    supplierId: string;
    price: number;
    description: string;
    packaging: string;
    stocks: number;
    verified: boolean;
    verifiedDate: Date;
    dateAdded: Date;
    image: string;
    supplier: Supplier;
  }[];
}

export default function ProductList({ products }: ProductListProps) {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const verifiedCount = products.filter((product) => product.verified).length;
  const pendingCount = products.filter((product) => !product.verified).length;

  return (
    <div className="mt-6 justify-center">
      {products.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4 px-4 py-2 border rounded-lg bg-gray-100">
            <div className="text-sm text-gray-600">
              <strong>Product Health Summary:</strong>
            </div>
            <div className="text-sm text-gray-600">
              <span className="mr-4">Verified: {verifiedCount}</span>
              <span className="mr-4">Pending: {pendingCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                supplier={product.supplier}
                price={product.price}
                image={product.image}
                verified={product.verified}
                description={product.description}
                packaging={product.packaging}
                stocks={product.stocks}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-2 border rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-2 border rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-gray-200"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">No products created yet.</p>
      )}
    </div>
  );
}
