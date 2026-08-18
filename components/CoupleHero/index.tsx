"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { LoveCounter } from "@/components/LoveCounter";

type CoupleHeroProps = {
  nameA: string;
  nameB: string;
  startIso: string;
  startLabel: string;
  coverPhotoUrl: string | null;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function CoupleHero({
  nameA,
  nameB,
  startIso,
  startLabel,
  coverPhotoUrl,
}: CoupleHeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {coverPhotoUrl ? (
        <>
          <Image
            src={coverPhotoUrl}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/75" />
        </>
      ) : null}
      <motion.div
        className="relative z-10 max-w-3xl"
        initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[420px] w-[min(90vw,640px)] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 62% at 50% 50%, rgba(90,31,50,0.55), transparent 74%)",
          }}
        />
        <h1 className="relative font-serif text-5xl font-normal italic tracking-tight text-balance sm:text-7xl">
          {nameA} <span className="text-wine">♥</span> {nameB}
        </h1>
        <p className="mt-6 font-sans text-sm text-foreground/50">
          Juntos desde {startLabel}
        </p>
        <LoveCounter startIso={startIso} />
      </motion.div>
    </section>
  );
}
