"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageCropper from "@/components/images/ImageCropper";
import { toast } from "sonner";
import {
  EditProductFormData,
  EditProductFormDataSchema,
} from "@/lib/types/editProduct.type";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EditProductFormProps {
  productId: string;
  supplierId: string;
  initialData: Omit<EditProductFormData, "image"> & { imageUrl?: string };
}

const EditProductForm = ({
  productId,
  supplierId,
  initialData,
}: EditProductFormProps) => {
  const [open, setOpen] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditProductFormData>({
    resolver: zodResolver(EditProductFormDataSchema),
    defaultValues: {
      name: initialData.name,
      price: initialData.price,
      description: initialData.description,
      supplierId: supplierId,
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert blob to File to use with the form
    const croppedFile = new File([croppedBlob], "cropped_image.jpg", {
      type: "image/jpeg",
    });

    form.setValue("image", croppedFile, { shouldValidate: true });
    setShowImageCropper(false);
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("id", productId);
      formData.append("name", data.name || "");
      formData.append("price", data.price ? data.price.toString() : "0");
      formData.append("description", data.description || "");
      formData.append("supplierId", data.supplierId || "");

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch(`/api/product/`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const result = await response.json();
      console.log("Product updated:", result.product);

      setOpen(false);
      toast.success("Product updated successfully");
    } catch (error) {
      const message = error instanceof Error && error.message;
      toast.error(`An error occurred while updating the product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`/api/product/`, {
        method: "DELETE",
        body: JSON.stringify({ id: productId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      setOpen(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      const message = error instanceof Error && error.message;
      toast.error(`An error occurred while updating the product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        {showImageCropper && selectedImage ? (
          <ImageCropper
            image={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={() => setShowImageCropper(false)}
            aspectRatio={4 / 3}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            handleImageSelect(e);
                          }}
                        />
                        {field.value ? (
                          <div className="mt-2">
                            <div className="text-sm text-green-600 mb-1">
                              New image selected
                            </div>
                            <div className="relative h-40 w-full border rounded-md overflow-hidden">
                              <Image
                                src={URL.createObjectURL(field.value as File)}
                                alt="Product preview"
                                fill
                                className="object-contain"
                                onLoad={(
                                  e: React.SyntheticEvent<HTMLImageElement>,
                                ) => {
                                  // Clean up the object URL after the image loads
                                  URL.revokeObjectURL(
                                    (e.target as HTMLImageElement).src,
                                  );
                                }}
                              />
                            </div>
                          </div>
                        ) : initialData.imageUrl ? (
                          <div className="mt-2">
                            <div className="text-sm text-muted-foreground mb-1">
                              Current image
                            </div>
                            <div className="relative h-40 w-full border rounded-md overflow-hidden">
                              <Image
                                src={initialData.imageUrl}
                                alt="Current product image"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      {isSubmitting ? "Deleting..." : "Delete Product"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this product.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isSubmitting}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProductForm;
