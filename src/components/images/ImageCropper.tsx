import React, { useState, useCallback } from "react";
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
      toast.error(`An error occured in cropping the image: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [croppedAreaPixels, image, onCropComplete, rotation]);

  return (
    <div className="flex flex-col w-screen sm:w-[600px] h-screen sm:h-[95vh] bg-white rounded-lg shadow-lg p-4">
      <div className="mb-2">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">Crop Your Image</h3>
          <Popover>
            <PopoverTrigger>
              <CircleHelp size={22} color="#ff0000" strokeWidth={2} />
            </PopoverTrigger>
            <PopoverContent className="overflow-visible max-w-full">
              <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
                <li>
                  Desktop: Use your mouse to drag the image and resize the crop
                  area.
                </li>
                <li>
                  Mobile: Use your finger to move the image within the crop
                  area.
                </li>
                <li>
                  Pinch to zoom in/out on both desktop (with trackpad) and
                  mobile.
                </li>
                <li>Use the slider below to adjust zoom and rotation.</li>
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="relative grow w-full bg-gray-100 rounded-md overflow-hidden">
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
        />
      </div>

      <div className="mt-4 flex flex-col sm:flex-row justify-evenly gap-2 sm:gap-6 m-auto">
        <div className="space-y-1 min-w-64 shrink-0">
          <label className="text-sm font-medium text-gray-700">Zoom</label>
          <div className="flex items-center gap-2">
            <span className="text-xs">1x</span>
            <Slider
              value={[zoom]}
              min={minZoom}
              max={maxZoom}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="flex-grow"
            />
            <span className="text-xs">{maxZoom}x</span>
          </div>
        </div>

        <div className="space-y-1 min-w-64 shrink-0">
          <label className="text-sm font-medium text-gray-700">Rotation</label>
          <div className="flex items-center gap-2">
            <span className="text-xs">-180°</span>
            <Slider
              value={[rotation]}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => setRotation(value[0])}
              className="flex-grow"
            />
            <span className="text-xs">180°</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Button
          onClick={() => {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
            setCroppedAreaPixels(null);
          }}
          variant="link"
          type="button"
          className="text-red-600"
          disabled={
            crop.x === 0 && crop.y === 0 && zoom === 1 && rotation === 0
          }
        >
          Reset
        </Button>

        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline" type="button">
            Cancel
          </Button>

          <Button
            onClick={createCroppedImage}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? "Processing..." : "Confirm Crop"}
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
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
