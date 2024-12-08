import { Product, Supplier } from "@prisma/client";

export interface ProductWithSupplier extends Product {
  supplier: Supplier;
}

export interface Products {
  products: ProductWithSupplier[];
  userId: string;
}

export interface ProductPreview {
  userId: string;
  id: string;
  name: string;
  price: number;
  supplier: {
    businessName: string;
    businessLocation: string;
  };
}
