import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Point, Area } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-modified";
import { CircleHelp } from "lucide-react";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  minZoom?: number;
  maxZoom?: number;
  cropShape?: "rect" | "round";
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
  aspectRatio = 4 / 3,
  minZoom = 1,
  maxZoom = 3,
  cropShape = "rect",
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when cropper is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const createCroppedImage = useCallback(async () => {
    try {
      setIsLoading(true);
      if (croppedAreaPixels) {
        const croppedImage = await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation,
        );
        onCropComplete(croppedImage);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "An error occurred";
      toast.error(`An error occurred in cropping the image: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [croppedAreaPixels, image, onCropComplete, rotation]);

  const handleCancel = () => {
    document.body.style.overflow = "unset";
    onCancel();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleResetClick = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
  };

  const cropperContent = (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      <div
        className="flex flex-col w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click when clicking inside
      >
        {/* Header */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Crop Your Image
              </h3>
              <Popover>
                <PopoverTrigger className="flex-shrink-0">
                  <CircleHelp
                    size={18}
                    className="text-primary-500 hover:text-primary-700"
                  />
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 text-xs sm:text-sm"
                  style={{ zIndex: 10000 }}
                >
                  <ul className="text-gray-600 list-disc list-inside space-y-1">
                    <li>Desktop: Drag to move, scroll to zoom</li>
                    <li>Mobile: Touch to move, pinch to zoom</li>
                    <li>Use sliders below for precise control</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-gray-900 min-h-0">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            rotation={rotation}
            cropShape={cropShape}
            showGrid={true}
            minZoom={minZoom}
            maxZoom={maxZoom}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                position: "relative",
              },
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 p-3 sm:p-4 border-t bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Zoom</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-6">1x</span>
                <Slider
                  value={[zoom]}
                  min={minZoom}
                  max={maxZoom}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-8">{maxZoom}x</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rotation
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-10">-180°</span>
                <Slider
                  value={[rotation]}
                  min={-180}
                  max={180}
                  step={1}
                  onValueChange={(value) => setRotation(value[0])}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-10">180°</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
            <Button
              type="button"
              onClick={handleResetClick}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={
                crop.x === 0 && crop.y === 0 && zoom === 1 && rotation === 0
              }
            >
              Reset
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="min-w-[80px]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createCroppedImage}
                disabled={isLoading}
                size="sm"
                className="min-w-[100px] bg-primary-500 hover:bg-primary-600"
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Don't render anything on server-side
  if (!mounted) return null;

  // Render as portal to document.body
  return createPortal(cropperContent, document.body);
};

export default ImageCropper;

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const rotRad = (rotation * Math.PI) / 180;

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");

  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("No 2d context");
  }

  // Set the size of the cropped canvas
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  ctx.restore();

  // Create a blob from the canvas
  return new Promise((resolve) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        }
      },
      "image/jpeg",
      0.95,
    ); // Better quality output
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = (rotation * Math.PI) / 180;

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}
