"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  supplier: {
    businessName: string;
  };
}

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length > 1) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/search?query=${encodeURIComponent(query)}&limit=5`,
          );
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
          setSuggestions(data.products);
          setShowSuggestions(true);
          router.push(`/?search=${query}`);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      }, 1000); // 2 second delay
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      // Clear any existing timeout when query is too short
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    // Cleanup the timeout when component unmounts or query changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set("search", query);
      searchParams.set("page", "1");
      router.push(`/?${searchParams.toString()}`);
    }
  };

  return (
    <div
      className="flex flex-col w-full max-w-md relative"
      ref={searchContainerRef}
    >
      <form onSubmit={handleSearch} className="flex items-center h-24">
        <Input
          placeholder="Search for an item..."
          className="bg-background rounded-r-none rounded-l-full h-12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" className="rounded-l-none rounded-r-full h-12">
          <SearchIcon />
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full top-20 bg-white rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map((product) => (
              <li key={product.id}>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="rounded-full mr-2"
                        width={32}
                        height={32}
                        style={{ objectFit: "cover" }}
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">
                          {product.supplier.businessName}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700">
                      ₱{product.price.toFixed(2)}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
