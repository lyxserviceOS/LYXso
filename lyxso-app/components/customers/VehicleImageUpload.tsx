"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

interface VehicleImage {
  id: string;
  url: string;
  uploaded_at: string;
}

interface Props {
  vehicleId: string;
  images: VehicleImage[];
  onImagesUpdated: () => void;
}

export default function VehicleImageUpload({ vehicleId, images, onImagesUpdated }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);

    // Validate files
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`Ugyldig filtype: ${file.name}. Kun JPEG, PNG og WebP er tillatt.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`Fil for stor: ${file.name}. Maks størrelse er 5MB.`);
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(
        `${API_BASE}/api/vehicles/${vehicleId}/images`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Opplasting feilet");
      }

      onImagesUpdated();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Feil ved opplasting av bilder";
      setError(errorMessage);
      Sentry.captureException(err, {
        extra: { vehicleId, filesCount: files.length },
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Er du sikker på at du vil slette dette bildet?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/api/vehicles/${vehicleId}/images/${imageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Kunne ikke slette bilde");
      }

      onImagesUpdated();
    } catch (err) {
      setError("Feil ved sletting av bilde");
      Sentry.captureException(err, {
        extra: { vehicleId, imageId },
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="space-y-2">
          {uploading ? (
            <>
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
              <p className="text-sm text-slate-600">Laster opp bilder...</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Klikk for å velge bilder
                </button>
                <span className="text-slate-600"> eller dra og slipp her</span>
              </div>
              <p className="text-xs text-slate-500">
                JPEG, PNG eller WebP (maks 5MB per bilde)
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              <img
                src={image.url}
                alt="Kjøretøy"
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 rounded-full bg-red-600 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-700"
                title="Slett bilde"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-600">Ingen bilder lastet opp ennå</p>
          <p className="text-sm text-slate-500 mt-1">
            Last opp bilder av kjøretøyet for dokumentasjon
          </p>
        </div>
      )}
    </div>
  );
}
