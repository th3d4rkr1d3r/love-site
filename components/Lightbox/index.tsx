"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { formatLongDatePt } from "@/lib/date-utils";
import type { PublicPhoto } from "@/lib/types";

type LightboxProps = {
  photos: PublicPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ photos, index, onClose, onPrev, onNext }: LightboxProps) {
  const photo = photos[index];
  const [touchX, setTouchX] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink/95"
      onTouchStart={(event) => setTouchX(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchX == null) return;
        const delta = event.changedTouches[0].clientX - touchX;
        if (delta > 50) onPrev();
        if (delta < -50) onNext();
        setTouchX(null);
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-10 text-xs uppercase tracking-[0.22em] text-gold/80"
      >
        Fechar
      </button>
      <div className="relative flex flex-1 items-center justify-center px-12 py-16">
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 hidden text-2xl text-gold/80 sm:block"
          aria-label="Anterior"
        >
          ‹
        </button>
        <div className="relative h-full w-full max-w-5xl">
          <Image
            src={photo.url}
            alt={photo.alt ?? photo.caption ?? "Foto"}
            fill
            className="object-contain"
          />
        </div>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 hidden text-2xl text-gold/80 sm:block"
          aria-label="Próxima"
        >
          ›
        </button>
      </div>
      <div className="px-6 pb-8 text-center">
        {photo.caption ? <p className="font-serif text-lg">{photo.caption}</p> : null}
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-foreground/55">
          {photo.date ? formatLongDatePt(new Date(photo.date)) : ""}
          {photo.placeName ? ` · ${photo.placeName}` : ""}
        </p>
      </div>
    </div>
  );
}

export function useLightbox(length: number) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((current) =>
      current == null ? current : (current + length - 1) % length,
    );
  }, [length]);
  const next = useCallback(() => {
    setOpenIndex((current) =>
      current == null ? current : (current + 1) % length,
    );
  }, [length]);

  return { openIndex, setOpenIndex, close, prev, next };
}
