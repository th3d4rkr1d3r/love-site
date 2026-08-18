"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/LetterEnvelope/TypewriterText";

type LetterEnvelopeProps = {
  title: string;
  content: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

const wine = "linear-gradient(180deg, #7e1c2a 0%, #6B1420 55%, #4e1018 100%)";
const cream =
  "linear-gradient(180deg, #fbf6ee 0%, #f4ead8 70%, #ead9c2 100%)";

export function LetterEnvelope({ title, content }: LetterEnvelopeProps) {
  const [open, setOpen] = useState(false);
  const [writing, setWriting] = useState(false);

  const openLetter = () => setOpen(true);
  const closeLetter = () => {
    setWriting(false);
    setOpen(false);
  };

  return (
    <div className="relative mx-auto w-full max-w-[380px]" style={{ perspective: 1200 }}>
      <motion.div
        className="overflow-hidden px-4"
        initial={false}
        animate={{ height: open ? 320 : 0 }}
        transition={{ duration: 0.7, ease }}
        onAnimationComplete={() => setWriting(open)}
      >
        <article
          className="relative h-[308px] overflow-y-auto px-7 py-8"
          style={{
            background: cream,
            boxShadow:
              "0 10px 28px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(201,162,75,0.35)",
          }}
          aria-label={title}
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0 27px, rgba(107,20,32,0.07) 27px 28px)",
            }}
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] bg-wine/35"
            aria-hidden
          />
          <div className="relative">
            <TypewriterText
              text={content}
              active={writing}
              className="text-[1.05rem] leading-[1.75] text-[#3a2a24]"
            />
          </div>
        </article>
      </motion.div>

      <div
        className="relative z-10 -mt-4 h-[230px] overflow-hidden"
        style={{
          background: wine,
          boxShadow:
            "0 22px 44px rgba(107,20,32,0.38), inset 0 0 0 1px rgba(201,162,75,0.4)",
        }}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1/2 opacity-50"
          style={{
            clipPath: "polygon(0 0, 100% 58%, 0 100%)",
            background: "linear-gradient(90deg, rgba(40,8,12,0.35), transparent)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-50"
          style={{
            clipPath: "polygon(100% 0, 0 58%, 100% 100%)",
            background: "linear-gradient(270deg, rgba(40,8,12,0.35), transparent)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 origin-top"
          initial={false}
          animate={{ rotateX: open ? -158 : 0 }}
          transition={{ duration: 0.55, ease }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="h-[128px] w-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg, #9a2d3c 0%, #6B1420 72%, #541018 100%)",
              filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.32))",
            }}
          />
        </motion.div>

        <span
          className="absolute left-1/2 top-[108px] z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-gold bg-[#7a1c28] text-xl text-gold"
          style={{
            boxShadow:
              "0 6px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,162,75,0.55)",
          }}
          aria-hidden
        >
          ♥
        </span>

        <div className="absolute inset-x-0 bottom-5 z-40 text-center">
          <Button type="button" variant="gold" size="lg" onClick={open ? closeLetter : openLetter}>
            {open ? "Recolher" : "Abrir minha carta ❤️"}
          </Button>
        </div>
      </div>
    </div>
  );
}
