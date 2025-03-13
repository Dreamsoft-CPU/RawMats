"use client";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";
import React from "react";
import CreateProductForm from "./CreateProductForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import EditProductForm from "./EditProductForm";

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
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <CreateProductForm supplierId={userData.Supplier[0].id} />
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md w-64"
          />
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {filteredProducts.map((product, index) => (
          <AccordionItem
            value={`${index}`}
            key={product.id}
            className="border rounded-lg mb-2 overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 font-medium">
              <div className="flex justify-between w-full items-center">
                <span>{product.name}</span>
                <span className="text-sm text-muted-foreground">
                  ₱{Number(product.price).toFixed(2)} ·{" "}
                  {new Date(product.dateAdded).toLocaleDateString()}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-1/3 h-64 rounded-md overflow-hidden border">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-gray-600">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Status</h3>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {product.verified ? "Verified" : "Pending verification"}
                      </span>
                      {product.verified && (
                        <span className="text-xs text-gray-500 ml-2">
                          Verified on{" "}
                          {new Date(product.verifiedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    {/* Add import for EditProductForm at the top if not already present */}
                    <EditProductForm
                      productId={product.id}
                      supplierId={product.supplierId}
                      initialData={{
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        imageUrl: product.image,
                        supplierId: product.supplierId,
                      }}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {filteredProducts.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          No products match your search
        </div>
      )}
    </div>
  );
};

export default ProductList;
