"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  ProductFormData,
  ProductFormDataSchema,
} from "@/lib/types/createProduct.type";
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

const CreateProductForm = ({ supplierId }: { supplierId: string }) => {
  const [open, setOpen] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormDataSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
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

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      formData.append("description", data.description);
      formData.append("supplierId", data.supplierId);

      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch("/api/product", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }

      const result = await response.json();
      console.log("Product created:", result.product);

      setOpen(false);
      form.reset();
    } catch (error) {
      const message = error instanceof Error && error.message;
      toast.error(`An error occured in creating the product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] min-w-fit">
        {showImageCropper && selectedImage ? (
          <ImageCropper
            image={selectedImage}
            onCropComplete={handleCropComplete}
            onCancel={() => setShowImageCropper(false)}
            aspectRatio={4 / 3}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                              handleImageSelect(e);
                            }}
                          />
                          {field.value && (
                            <div className="mt-2">
                              <div className="text-sm text-green-600 mb-1">
                                Image selected
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
                          )}
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Product"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductForm;
