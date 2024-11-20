import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product, Supplier, Favorite } from "@prisma/client";
import {
  ArrowLeft,
  HeartIcon,
  CheckCircle,
  XCircle,
  TagIcon,
  Building,
} from "lucide-react";
import LoadingModal from "../Loading/LoadingModal";
import Image from "next/image";
import InlineLoading from "../Loading/InlineLoading";
import Link from "next/link";

export default function ProductInformationCard() {
  const params = useParams<{ id: string }>();
  const id = `${params.id}`;
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [favorite, setFavorite] = useState<Favorite | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const getProductAndSupplier = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        const { product, supplier, favorite } = await response.json();
        setProduct(product);
        setSupplier(supplier);
        setFavorite(favorite);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      const response = await fetch(`/api/product/${id}/image`);
      const data = await response.json();
      setImageUrl(data.signedUrl);
      console.log(data);
    };
    fetchImage();
    getProductAndSupplier();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const response = await fetch(`/api/products/${product?.id}/favorite`, {
        method: favorite ? "DELETE" : "POST",
      });
      const updatedFavorite = await response.json();
      setFavorite(updatedFavorite);
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  if (loading) {
    return <LoadingModal message="Loading product..." />;
  }

  if (!product || !supplier) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
        <XCircle className="w-24 h-24 text-red-400 mb-4" />
        <p className="text-2xl text-red-600 mb-4">Product Not Found</p>
        <Link
          href="/"
          className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-2">
      <div className="max-w-6xl w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 gap-8 relative">
        {/* Product Image Section */}
        <div className="relative bg-gray-100 md:rounded-r-3xl overflow-hidden">
          <Link
            href="/"
            className="absolute top-4 left-4 z-10 p-2 bg-white bg-opacity-75 rounded-full shadow-md text-rawmats-text-500 hover:bg-rawmats-secondary-700 hover:text-white transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          {product.name ? (
            <div className="h-[500px] md:h-full w-full overflow-hidden group">
              {loading ? (
                <InlineLoading />
              ) : (
                <Image
                  width={500}
                  height={500}
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-xl">No Image Available</span>
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-blue-600">
                  ₱{product.price}
                </span>
                {supplier && (
                  <span className="text-sm text-gray-500 ml-2 flex items-center gap-1">
                    <Building className="w-4 h-4" /> {supplier.businessName}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleFavorite}
              className="hover:scale-110 transition-transform"
              aria-label="Toggle Favorite"
            >
              <HeartIcon
                className={`w-8 h-8 ${
                  favorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400 hover:text-red-400"
                }`}
              />
            </button>
          </div>

          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.verified ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
              <span
                className={`font-medium ${product.verified ? "text-green-600" : "text-red-600"}`}
              >
                {product.verified ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 gap-2">
            <TagIcon className="w-5 h-5 text-blue-400" />
            Added on {new Date(product.dateAdded).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
