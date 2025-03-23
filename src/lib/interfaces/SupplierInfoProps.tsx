import { Supplier, User } from "@prisma/client";

export interface SupplierInfoProps {
  data: Supplier & {
    user: User;
  };
}
