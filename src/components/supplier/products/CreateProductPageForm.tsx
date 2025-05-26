"use client";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ProductFormData,
  ProductFormDataSchema,
} from "@/lib/types/createProduct.type";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageCropper from "@/components/images/ImageCropper";
import { toast } from "sonner";
import { Upload, Image as ImageIcon } from "lucide-react";

const CreateProductPageForm = ({ supplierId }: { supplierId: string }) => {
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormDataSchema),
    defaultValues: {
      name: "",
      price: undefined,
      description: "",
      supplierId: supplierId,
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowImageCropper(true);
    }
  };

  const handleCropComplete = useCallback(
    (croppedBlob: Blob) => {
      try {
        const croppedFile = new File([croppedBlob], "cropped_image.jpg", {
          type: "image/jpeg",
        });

        form.setValue("image", croppedFile, { shouldValidate: true });
        setShowImageCropper(false);

        if (selectedImage) {
          URL.revokeObjectURL(selectedImage);
          setSelectedImage(null);
        }
      } catch (error) {
        console.error("Error handling crop complete:", error);
        toast.error("Error processing cropped image");
      }
    },
    [form, selectedImage],
  );

  const handleCropCancel = useCallback(() => {
    setShowImageCropper(false);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  }, [selectedImage]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("price", data.price.toString());
      formData.append("description", data.description.trim());
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

      toast.success("Product created successfully!");
      router.push("/supplier/products");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to create product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Product Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                            {...field}
                          />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Price (₱) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            max="1000000"
                            className="border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseFloat(value) : undefined,
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your product in detail..."
                          className="min-h-[120px] border-gray-300 focus:border-primary-500 focus:ring-primary-500 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-600">
                        Please input package description, net weight, etc. for
                        better verification.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Product Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Upload Product Image *
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {!field.value ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                              <Upload
                                size={48}
                                className="mx-auto text-gray-400 mb-4"
                              />
                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer"
                              >
                                <span className="text-lg font-medium text-gray-700">
                                  Click to upload an image
                                </span>
                                <p className="text-sm text-gray-500 mt-2">
                                  PNG, JPG, WEBP up to 5MB
                                </p>
                              </label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <ImageIcon
                                  size={20}
                                  className="text-green-600"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-green-800">
                                    ✓ Image selected and cropped
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Ready to upload
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    form.setValue("image", null);
                                    // Reset file input
                                    const input = document.getElementById(
                                      "image-upload",
                                    ) as HTMLInputElement;
                                    if (input) input.value = "";
                                  }}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </div>

                              <div className="relative aspect-[4/3] max-w-md border rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                  src={URL.createObjectURL(field.value as File)}
                                  alt="Product preview"
                                  fill
                                  className="object-contain"
                                />
                              </div>

                              <label
                                htmlFor="image-upload"
                                className="cursor-pointer"
                              >
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <span>Change Image</span>
                                </Button>
                              </label>
                              <Input
                                id="image-upload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageSelect}
                                className="hidden"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/supplier/products")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-500 hover:bg-primary-600 text-white min-w-[140px]"
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* ImageCropper */}
      {showImageCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={4 / 3}
        />
      )}
    </>
  );
};

export default CreateProductPageForm;
