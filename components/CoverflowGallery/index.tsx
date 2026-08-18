"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

import { Lightbox, useLightbox } from "@/components/Lightbox";
import type { PublicPhoto } from "@/lib/types";
import { cn } from "@/lib/utils";

type CoverflowGalleryProps = {
  photos: PublicPhoto[];
};

const STEP = 150;

function wrapOffset(offset: number, length: number) {
  if (length <= 0) return 0;
  const half = length / 2;
  let value = offset;
  while (value > half) value -= length;
  while (value <= -half) value += length;
  return value;
}

function imageFit(photo: PublicPhoto) {
  if (photo.width && photo.height) {
    return photo.width >= photo.height ? "object-contain" : "object-cover";
  }
  return /flipper/i.test(photo.url) ? "object-contain" : "object-cover";
}

export function CoverflowGallery({ photos }: CoverflowGalleryProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const dragXRef = useRef(0);
  const dragged = useRef(false);
  const { openIndex, setOpenIndex, close, prev, next } = useLightbox(photos.length);

  const go = useCallback(
    (delta: number) => {
      if (photos.length === 0) return;
      setIndex((current) => (current + delta + photos.length) % photos.length);
    },
    [photos.length],
  );

  const settle = useCallback(
    (deltaX: number) => {
      const steps = Math.round(deltaX / STEP);
      if (steps !== 0) go(-steps);
      setDragX(0);
      setDragging(false);
      startX.current = null;
    },
    [go],
  );

  if (photos.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg px-8 py-16 text-center">
        <p className="font-serif text-2xl font-light">As fotos ainda vão chegar</p>
        <p className="mt-3 text-sm text-foreground/60">
          A galeria em carrossel já está pronta. As imagens entram depois, pelo admin.
        </p>
      </div>
    );
  }

  const nearestIndex =
    (((index - Math.round(dragX / STEP)) % photos.length) + photos.length) % photos.length;
  const active = photos[nearestIndex];

  return (
    <>
      <div
        className="relative mx-auto w-full max-w-6xl cursor-grab select-none touch-none active:cursor-grabbing"
        onPointerDown={(event) => {
          startX.current = event.clientX;
          dragged.current = false;
          setDragging(true);
          setDragX(0);
          dragXRef.current = 0;
          (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (startX.current == null) return;
          const delta = event.clientX - startX.current;
          if (Math.abs(delta) > 8) dragged.current = true;
          dragXRef.current = delta;
          setDragX(delta);
        }}
        onPointerUp={(event) => {
          if (startX.current == null) return;
          settle(event.clientX - startX.current);
        }}
        onPointerCancel={() => {
          settle(dragXRef.current);
        }}
      >
        <div
          className="relative mx-auto h-[400px] w-full sm:h-[520px] md:h-[580px]"
          style={{ perspective: "1400px" }}
        >
          {photos.map((photo, i) => {
            const slot = wrapOffset(i - index + dragX / STEP, photos.length);
            const abs = Math.abs(slot);
            if (abs > 1.45) return null;
            const centered = abs < 0.5;
            const scale = 1 - Math.min(abs, 1) * 0.14;

            return (
              <button
                type="button"
                key={photo.id}
                onClick={() => {
                  if (dragged.current) return;
                  if (centered) {
                    setOpenIndex(i);
                    return;
                  }
                  setIndex(i);
                }}
                className={cn(
                  "absolute left-1/2 top-1/2 overflow-hidden rounded-2xl border-2 bg-ink-soft",
                  centered ? "border-gold/55" : "border-gold/15",
                  "h-[320px] w-[250px] sm:h-[440px] sm:w-[360px] md:h-[500px] md:w-[420px]",
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${slot * 62}%) rotateY(${slot * -28}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  zIndex: 10 - Math.round(abs),
                  boxShadow: centered
                    ? "0 28px 70px rgba(0,0,0,0.5), 0 0 48px rgba(107,20,32,0.28)"
                    : "0 14px 32px rgba(0,0,0,0.4)",
                  transition: dragging
                    ? "none"
                    : "transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease",
                }}
                aria-label={centered ? "Abrir foto" : `Ver foto ${i + 1}`}
              >
                <span className="relative block h-full w-full">
                  <Image
                    src={photo.url}
                    alt={photo.alt ?? photo.caption ?? "Foto"}
                    fill
                    className={cn("pointer-events-none", imageFit(photo))}
                    sizes="(max-width: 640px) 250px, (max-width: 768px) 360px, 420px"
                    draggable={false}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {active?.caption ? (
        <p className="mx-auto mt-8 max-w-xl px-6 text-center text-sm leading-relaxed text-foreground/75">
          {active.caption}
        </p>
      ) : null}

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
