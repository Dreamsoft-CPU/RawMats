import { Favorite, Supplier } from "@prisma/client";

export interface ProductCardProps {
  data: {
    id: string;
    name: string;
    image: string;
    price: number;
    userId: string;
    favorite: Partial<Favorite>[];
    supplier: Partial<Supplier>;
  };
}
