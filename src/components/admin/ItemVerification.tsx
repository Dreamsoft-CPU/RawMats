import { useState } from "react";
import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ItemVerificationProps {
  products: Product[];
  verifyProduct: (id: string) => void;
  rejectProduct: (id: string) => void;
}

const rejectionReasons = [
  "Inappropriate content",
  "Poor image quality",
  "Inaccurate description",
  "Incorrect pricing",
  "Duplicate listing",
];

export function ItemVerification({
  products,
  verifyProduct,
  rejectProduct,
}: ItemVerificationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  const openRejectModal = (productId: string) => {
    setSelectedProduct(productId);
    setIsModalOpen(true);
  };

  const handleReject = () => {
    if (selectedProduct) {
      rejectProduct(selectedProduct);
      setIsModalOpen(false);
      setSelectedProduct(null);
      setSelectedReasons([]);
      setComment("");
    }
  };

  const handleReasonChange = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason],
    );
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="relative w-full pt-[50%]">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-semibold">
                  Price: ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supplier ID: {product.supplierId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Date Added: {new Date(product.dateAdded).toLocaleDateString()}
                </p>
                {product.verified && (
                  <p className="text-sm text-muted-foreground">
                    Verified Date:{" "}
                    {new Date(product.verifiedDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2 justify-between">
                <Button
                  onClick={() => verifyProduct(product.id)}
                  disabled={product.verified}
                  className="flex-1 bg-rawmats-primary-300 hover:bg-rawmats-feedback-success hover:text-rawmats-text-500 "
                >
                  <Check className="mr-2 h-4 w-4" />
                  Verify
                </Button>
                <Button
                  onClick={() => openRejectModal(product.id)}
                  variant="destructive"
                  disabled={product.verified}
                  className="flex-1 bg-rawmats-feedback-error hover:bg-red-600"
                >
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setSelectedReasons([]);
            setComment("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reasons">Rejection Reasons</Label>
              <Select onValueChange={handleReasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reasons" />
                </SelectTrigger>
                <SelectContent>
                  {rejectionReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedReasons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedReasons.map((reason) => (
                    <div
                      key={reason}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment">Additional Comments</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide additional details about the rejection..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-rawmats-feedback-error hover:bg-red-600"
              onClick={handleReject}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}