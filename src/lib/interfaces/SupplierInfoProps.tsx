import { Product, Supplier, User } from "@prisma/client";

export interface SupplierInfoProps {
  data: Supplier & {
    user: User;
    Product: Product[];
  };
}
