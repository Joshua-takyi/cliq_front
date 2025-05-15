"use client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

interface ImageUploaderProps {
  images: string[];
  onUploadSuccess: (secure_url: string) => void; // Callback to handle successful uploads
  onDeleteImage: (index: number) => void; // Callback to handle image deletion
  error?: string;
}

export const FormImageUpload = ({
  images,
  onUploadSuccess,
  onDeleteImage,
  error,
}: ImageUploaderProps) => {
  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <CldUploadWidget
        uploadPreset="CliqNStyle"
        onSuccess={(result) => {
          if (
            result &&
            result.info &&
            typeof result.info === "object" &&
            "secure_url" in result.info
          ) {
            const secure_url = result.info.secure_url as string; // Type assertion
            onUploadSuccess(secure_url); // Pass the URL to the parent component
          } else {
            console.error("Unexpected upload result format:", result);
          }
        }}
        onError={(error) => console.error("Upload error:", error)}
        options={{
          multiple: true,
          maxFiles: 4,
          folder: "cliq",
          resourceType: "image",
          clientAllowedFormats: ["jpeg", "png", "webp"],
          maxFileSize: 10000000,
        }}
      >
        {({ open, isLoading }) => (
          <Button
            type="button"
            onClick={() => open()}
            disabled={isLoading}
            className="bg-black text-white p-4 rounded-md transition-all"
          >
            {isLoading ? "Uploading..." : "Upload an Image"}
          </Button>
        )}
      </CldUploadWidget>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden">
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                type="button"
                onClick={() => onDeleteImage(index)}
                className="absolute top-2 right-2 bg-white/90 text-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
