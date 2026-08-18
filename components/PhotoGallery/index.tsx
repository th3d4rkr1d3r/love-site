"use client";

import Image from "next/image";

import { Lightbox, useLightbox } from "@/components/Lightbox";
import type { PublicPhoto } from "@/lib/types";

export function PhotoGallery({ photos }: { photos: PublicPhoto[] }) {
  const { openIndex, setOpenIndex, close, prev, next } = useLightbox(photos.length);

  if (photos.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg px-8 py-16 text-center">
        <p className="font-serif text-2xl font-light">As fotos ainda vão chegar</p>
        <p className="mt-3 text-sm text-foreground/60">
          A galeria está pronta. As imagens entram depois, pelo admin.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.id}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-gold/15"
            onClick={() => setOpenIndex(index)}
          >
            <Image
              src={photo.url}
              alt={photo.alt ?? photo.caption ?? "Foto"}
              width={photo.width ?? 1200}
              height={photo.height ?? 1600}
              className="h-auto w-full object-cover"
            />
          </button>
        ))}
      </div>
      {openIndex != null ? (
        <Lightbox
          photos={photos}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </>
  );
}
