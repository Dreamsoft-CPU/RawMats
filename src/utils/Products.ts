import { Product, Supplier } from "@prisma/client";

export interface ProductWithSupplier extends Product {
  supplier: Supplier;
}

export interface Products {
  products: ProductWithSupplier[];
}

export interface ProductPreview {
  id: string;
  name: string;
  price: number;
  supplier: {
    businessName: string;
    businessLocation: string;
  };
}
