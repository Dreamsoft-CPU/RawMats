import { Product, Supplier, User, Rating } from "@prisma/client";

export interface SupplierInfoProps {
  data: Supplier & {
    user: User;
    Product: (Product & {
      ratings: Rating[];
    })[];
  };
}
