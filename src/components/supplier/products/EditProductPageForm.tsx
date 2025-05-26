"use client";
import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";

interface EditProductPageFormProps {
  productId: string;
  supplierId: string;
  initialData: Omit<EditProductFormData, "image"> & { imageUrl?: string };
}

const EditProductPageForm = ({
  productId,
  supplierId,
  initialData,
}: EditProductPageFormProps) => {
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

  const onSubmit = async (data: EditProductFormData) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("id", productId);
      formData.append("name", data.name?.trim() || "");
      formData.append("price", data.price ? data.price.toString() : "0");
      formData.append("description", data.description?.trim() || "");
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

      toast.success("Product updated successfully!");
      router.push("/supplier/products");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to update product: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await fetch(`/api/product/`, {
        method: "DELETE",
        body: JSON.stringify({ id: productId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      router.push("/supplier/products");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Failed to delete product: ${message}`);
    } finally {
      setIsDeleting(false);
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
                          Product Name
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
                          Price (₱)
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
                        Description
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
                        Product Image (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {field.value ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <ImageIcon
                                  size={20}
                                  className="text-green-600"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-green-800">
                                    ✓ New image selected and cropped
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
                                    form.setValue("image", undefined);
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
                            </div>
                          ) : initialData.imageUrl ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <ImageIcon
                                  size={20}
                                  className="text-blue-600"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-blue-800">
                                    Current product image
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Upload a new image to replace
                                  </p>
                                </div>
                              </div>

                              <div className="relative aspect-[4/3] max-w-md border rounded-lg overflow-hidden bg-gray-50">
                                <Image
                                  src={initialData.imageUrl}
                                  alt="Current product image"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <Upload
                                size={48}
                                className="mx-auto text-gray-400 mb-4"
                              />
                              <p className="text-lg font-medium text-gray-700">
                                No image uploaded
                              </p>
                              <p className="text-sm text-gray-500 mt-2">
                                Click below to upload an image
                              </p>
                            </div>
                          )}

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
                              <span>
                                {field.value || initialData.imageUrl
                                  ? "Change Image"
                                  : "Upload Image"}
                              </span>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={isSubmitting || isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {isDeleting ? "Deleting..." : "Delete Product"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-3">
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
                  disabled={isSubmitting || isDeleting}
                  className="bg-primary-500 hover:bg-primary-600 text-white min-w-[140px]"
                >
                  {isSubmitting ? "Updating..." : "Update Product"}
                </Button>
              </div>
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

export default EditProductPageForm;
