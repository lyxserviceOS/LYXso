// components/ui/ImagePlaceholder.tsx
// Reusable image placeholder component with consistent sizing

export interface ImagePlaceholderProps {
  /** Label showing recommended image size */
  label: string;
  /** Tailwind aspect ratio class (e.g., "aspect-[16/9]") */
  aspect?: string;
  /** Optional additional className */
  className?: string;
}

/**
 * ImagePlaceholder component for displaying placeholder images with consistent styling.
 * Use this for any image slots that will be replaced with actual images later.
 * 
 * @example
 * // Hero image placeholder
 * <ImagePlaceholder label="Hero-bilde 1920 x 820 px" aspect="aspect-[21/9]" />
 * 
 * // Card image placeholder
 * <ImagePlaceholder label="Kortbilde 800 x 600 px" aspect="aspect-[4/3]" />
 * 
 * // Profile image placeholder
 * <ImagePlaceholder label="Profil 600 x 600 px" aspect="aspect-[1/1]" />
 */
export function ImagePlaceholder({
  label,
  aspect = "aspect-[16/9]",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-slate-900/40 ring-1 ring-slate-700/60 ${aspect} ${className}`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[11px] text-slate-400">
        {label}
      </div>
    </div>
  );
}

// Common preset configurations
export const IMAGE_PRESETS = {
  hero: { aspect: "aspect-[21/9]", label: "Hero-bilde 1920 x 820 px" },
  card: { aspect: "aspect-[4/3]", label: "Kortbilde 800 x 600 px" },
  thumbnail: { aspect: "aspect-[1/1]", label: "Miniatyrbilde 300 x 300 px" },
  profile: { aspect: "aspect-[1/1]", label: "Profilbilde 600 x 600 px" },
  banner: { aspect: "aspect-[3/1]", label: "Banner 1200 x 400 px" },
  logo: { aspect: "aspect-[3/1]", label: "Logo 600 x 200 px" },
  service: { aspect: "aspect-[16/9]", label: "Tjenestebilde 1200 x 675 px" },
  product: { aspect: "aspect-[1/1]", label: "Produktbilde 800 x 800 px" },
} as const;
