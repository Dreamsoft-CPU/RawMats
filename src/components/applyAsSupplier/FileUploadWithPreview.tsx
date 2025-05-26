import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ControllerRenderProps } from "react-hook-form";
import { FileSchema, PreviewType } from "@/lib/types/supplierRegistration.type";

interface FileUploadProps {
  field: ControllerRenderProps<any, string>;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
}

const FileUploadWithPreview: React.FC<FileUploadProps> = ({
  field,
  maxFiles = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup function for preview URLs
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  const validateFile = (file: File): boolean => {
    try {
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      FileSchema.parse(fileData);

      if (file.size > maxFileSize) {
        throw new Error(
          `File size must be less than ${maxFileSize / 1024 / 1024}MB`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      }
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = selectedFiles.filter(validateFile);
    if (validFiles.length !== selectedFiles.length) {
      return;
    }

    // Update files state
    const newFiles = [...files, ...validFiles];
    setFiles(newFiles);

    // Create new previews
    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    // Update form field value with the array of files
    field.onChange(newFiles);
  };

  const removeFile = (index: number) => {
    setError(null);

    // Create new arrays without the removed file
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // Remove preview and revoke URL
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => {
        if (i === index) {
          URL.revokeObjectURL(prev[i].url);
          return false;
        }
        return true;
      });
      return newPreviews;
    });

    // Update the form field value with the array of remaining files
    field.onChange(newFiles);

    // Reset the input if there are no files left
    if (newFiles.length === 0) {
      const inputElement = document.querySelector(
        `input[name="${field.name}"]`,
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = "";
      }
    }
  };

  return (
    <FormItem>
      <FormLabel>
        Business Documents
        <span className="block text-xs text-gray-500 font-normal mt-1">
          DTI Registration, BIR Registration, or Proof of Business
        </span>
      </FormLabel>
      <FormControl>
        <Input
          type="file"
          multiple
          name={field.name}
          ref={field.ref}
          onBlur={field.onBlur}
          onChange={handleFileChange}
          accept="image/*"
          className="mb-4"
        />
      </FormControl>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={preview.url}
                  alt={preview.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg 
                         hover:bg-red-600 transition-colors"
                aria-label={`Remove ${preview.name}`}
              >
                <X size={16} />
              </button>
              <p
                className="mt-1 text-sm text-gray-500 truncate"
                title={preview.name}
              >
                {preview.name}
              </p>
              <p className="text-xs text-gray-400">
                {(preview.file.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
          ))}
        </div>
      )}
      <FormMessage />
    </FormItem>
  );
};

export default FileUploadWithPreview;
