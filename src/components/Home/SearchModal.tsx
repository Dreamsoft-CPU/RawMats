import { useState } from "react";
import { ProductWithSupplier } from "@/utils/Products";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ProductPreviewCard from "@/components/Products/ProductPreviewCard";

interface SearchModalProps {
  onClose: () => void;
  products: ProductWithSupplier[];
}

export default function SearchModal({ onClose, products }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <DialogContent className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto p-6 relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Search Products</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductPreviewCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                supplier={product.supplier} // Pass supplier details properly
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
