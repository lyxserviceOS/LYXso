// components/TyreImageUpload.tsx
"use client";

import React, { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type TyrePosition = "front_left" | "front_right" | "rear_left" | "rear_right";

interface TyreImage {
  position: TyrePosition;
  file: File | null;
  preview: string | null;
  uploaded: boolean;
  url?: string;
}

interface Props {
  tyreSetId: string;
  onUploadComplete: (imageUrls: Record<TyrePosition, string>) => void;
  onCancel: () => void;
}

const POSITION_LABELS: Record<TyrePosition, string> = {
  front_left: "Venstre foran",
  front_right: "Høyre foran",
  rear_left: "Venstre bak",
  rear_right: "Høyre bak",
};

export default function TyreImageUpload({ tyreSetId, onUploadComplete, onCancel }: Props) {
  const supabase = createClient();
  const [images, setImages] = useState<Record<TyrePosition, TyreImage>>({
    front_left: { position: "front_left", file: null, preview: null, uploaded: false },
    front_right: { position: "front_right", file: null, preview: null, uploaded: false },
    rear_left: { position: "rear_left", file: null, preview: null, uploaded: false },
    rear_right: { position: "rear_right", file: null, preview: null, uploaded: false },
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((position: TyrePosition, file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Kun bildefiler er tillatt");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("Bildet er for stort (maks 10MB)");
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);

    setImages((prev) => ({
      ...prev,
      [position]: {
        ...prev[position],
        file,
        preview,
      },
    }));
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, position: TyrePosition) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(position, file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: Partial<Record<TyrePosition, string>> = {};

      // Upload each image
      for (const [position, image] of Object.entries(images)) {
        if (!image.file) {
          setError(`Mangler bilde for ${POSITION_LABELS[position as TyrePosition]}`);
          setUploading(false);
          return;
        }

        const fileName = `${tyreSetId}/${position}_${Date.now()}.${image.file.name.split(".").pop()}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from("tyre-images")
          .upload(fileName, image.file, {
            contentType: image.file.type,
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Feil ved opplasting av ${POSITION_LABELS[position as TyrePosition]}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("tyre-images")
          .getPublicUrl(fileName);

        uploadedUrls[position as TyrePosition] = urlData.publicUrl;

        // Update state
        setImages((prev) => ({
          ...prev,
          [position]: {
            ...prev[position as TyrePosition],
            uploaded: true,
            url: urlData.publicUrl,
          },
        }));
      }

      // Call completion handler
      onUploadComplete(uploadedUrls as Record<TyrePosition, string>);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Feil ved opplasting");
    } finally {
      setUploading(false);
    }
  };

  const allImagesSelected = Object.values(images).every((img) => img.file !== null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Last opp dekkbilder</h3>
        <p className="text-sm text-gray-600">
          Last opp et bilde av hvert dekk for AI-analyse
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(Object.entries(images) as [TyrePosition, TyreImage][]).map(([position, image]) => (
          <div key={position} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {POSITION_LABELS[position]}
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                image.preview
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
              onDrop={(e) => handleDrop(e, position)}
              onDragOver={handleDragOver}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(position, file);
                };
                input.click();
              }}
            >
              {image.preview ? (
                <div className="relative">
                  <img
                    src={image.preview}
                    alt={POSITION_LABELS[position]}
                    className="w-full h-40 object-cover rounded"
                  />
                  {image.uploaded && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      ✓ Lastet opp
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Klikk eller dra bilde hit
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          disabled={uploading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Avbryt
        </button>
        <button
          onClick={handleUpload}
          disabled={!allImagesSelected || uploading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Laster opp..." : "Last opp og analyser"}
        </button>
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-600">
          <div className="animate-spin inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
          Laster opp bilder...
        </div>
      )}
    </div>
  );
}
