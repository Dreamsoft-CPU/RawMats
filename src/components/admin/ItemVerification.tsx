import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@prisma/client";

interface ItemVerificationProps {
  products: Product[];
  verifyProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
}

export function ItemVerification({
  products,
  verifyProduct,
  rejectProduct,
}: ItemVerificationProps) {
  return (
    <ScrollArea>
      {products.map((product) => (
        <Card className="my-3" key={product.id}>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Price: ${product.price}</p>
            <p>Supplier ID: {product.supplierId}</p>
            <p>
              Date Added: {new Date(product.dateAdded).toLocaleDateString()}
            </p>
            {product.verified && (
              <p>
                Verified Date:{" "}
                {new Date(product.verifiedDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex gap-4">
            <Button
              onClick={() => verifyProduct(product.id)}
              disabled={product.verified}
            >
              <Check className="mr-2 h-4 w-4" />
              Verify
            </Button>
            <Button
              onClick={() => rejectProduct(product.id)}
              variant="destructive"
              disabled={product.verified}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}
