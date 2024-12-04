import Image from "next/image";

interface ProductListProps {
  products: {
    id: string;
    name: string;
    supplierId: string;
    price: number;
    description: string;
    verified: boolean;
    verifiedDate: Date;
    dateAdded: Date;
    image?: string;
  }[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="mt-6 justify-center">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
          {products.map((product) => (
            <div
              key={product.id}
              className="max-w-[250px] border rounded-lg shadow-xl overflow-hidden bg-[#F2F8FC] hover:shadow-1xl transition-shadow duration-300"
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
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products created yet.</p>
      )}
    </div>
  );
}
