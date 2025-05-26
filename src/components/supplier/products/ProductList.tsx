"use client";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search, Package, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ProductList: React.FC<UserDataProps> = ({ userData }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    return userData.Supplier[0].Product.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price.toString().includes(searchTerm),
    );
  }, [searchTerm, userData.Supplier]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/supplier/products/create">
          <Button className="bg-primary-500 hover:bg-primary-600 text-white shadow-sm">
            <Plus size={16} className="mr-2" />
            Create Product
          </Button>
        </Link>

        <div className="relative w-full sm:w-auto">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search products by name or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80 border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No products found" : "No products yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Start by creating your first product"}
          </p>
          {!searchTerm && (
            <Link href="/supplier/products/create">
              <Button className="bg-primary-500 hover:bg-primary-600 text-white shadow-sm">
                <Plus size={16} className="mr-2" />
                Create Product
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {filteredProducts.map((product, index) => (
            <AccordionItem
              value={`${index}`}
              key={product.id}
              className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50 [&[data-state=open]]:bg-gray-50">
                <div className="flex justify-between w-full items-center text-left">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {product.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium text-primary-600">
                        ₱{Number(product.price).toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>
                        Added {new Date(product.dateAdded).toLocaleDateString()}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.verified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                        sizes="(max-width: 1024px) 100vw, 320px"
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Status
                      </h4>
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.verified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.verified
                            ? "✓ Verified"
                            : "⏳ Pending verification"}
                        </span>
                        {product.verified && product.verifiedDate && (
                          <span className="text-sm text-gray-500">
                            Verified on{" "}
                            {new Date(
                              product.verifiedDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Link href={`/supplier/products/${product.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Edit3 size={14} className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ProductList;
