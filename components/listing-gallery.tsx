"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ListingImage } from "@/data/types";
import { cn } from "@/lib/utils";

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-video bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
        <Maximize2 className="w-8 h-8 opacity-30" />
      </div>
    );
  }

  const [hero, ...thumbs] = images;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : 0));
  const next = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0));

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
        {/* Hero image */}
        <div
          className="col-span-4 sm:col-span-2 row-span-2 relative cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={hero.url}
            alt={hero.alt || title}
            fill
            className="object-cover group-hover:brightness-90 transition-all"
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Thumbnails — show up to 4 on desktop */}
        {thumbs.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={cn(
              "relative cursor-zoom-in group hidden sm:block",
              i === 3 && images.length > 5 ? "relative" : ""
            )}
            onClick={() => openLightbox(i + 1)}
          >
            <Image
              src={img.url}
              alt={img.alt || `${title} — photo ${i + 2}`}
              fill
              className="object-cover group-hover:brightness-90 transition-all"
              sizes="25vw"
            />
            {/* "More photos" overlay on last thumb */}
            {i === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-navy/60 flex items-center justify-center text-white font-semibold text-sm">
                +{images.length - 5} photos
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative w-full max-w-5xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt || title}
              width={1200}
              height={800}
              className="object-contain w-full max-h-[80vh] rounded-xl"
            />
            {/* Caption */}
            <p className="text-center text-white/60 text-sm mt-3">
              {lightboxIndex + 1} / {images.length}
            </p>
          </div>

          {/* Controls */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Photo suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
