"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { formatLongDatePt } from "@/lib/date-utils";

export type TimelineMemory = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  photoUrl: string | null;
  category: string | null;
  placeName: string | null;
};

function TimelineItem({ memory, index }: { memory: TimelineMemory; index: number }) {
  const date = formatLongDatePt(new Date(memory.date));

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.06, 0.28) }}
      className="relative pl-10"
    >
      <span
        className="absolute left-0 top-1.5 h-3 w-3 rounded-full border border-gold/70 bg-wine"
        aria-hidden
      />
      <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-gold/80">
        {date}
        {memory.placeName ? ` · ${memory.placeName}` : ""}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-light">{memory.title}</h2>
      {memory.description ? (
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/70">
          {memory.description}
        </p>
      ) : null}
      {memory.photoUrl ? (
        <div className="relative mt-4 aspect-[4/3] max-w-md overflow-hidden rounded-xl border border-gold/15">
          <Image
            src={memory.photoUrl}
            alt={memory.title}
            fill
            className="object-cover"
          />
        </div>
      ) : null}
    </motion.article>
  );
}

export function Timeline({ memories }: { memories: TimelineMemory[] }) {
  return (
    <div className="relative mx-auto max-w-2xl">
      <span
        className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-gold/40 via-wine/50 to-transparent"
        aria-hidden
      />
      <div className="space-y-14">
        {memories.map((memory, index) => (
          <TimelineItem key={memory.id} memory={memory} index={index} />
        ))}
      </div>
    </div>
  );
}
