"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { LoveCounter } from "@/components/LoveCounter";
import { getBodaStatuses, nextBodaIndex, type BodaStatus } from "@/lib/bodas";
import { getElapsedSince, type ElapsedTime } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const CARD = 260;
const GAP = 28;
const STEP = CARD + GAP;
const EDGE = `calc(50vw - ${CARD / 2}px)`;
const RING = 224;

function unit(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function BodaRemaining({ anniversaryIso, complete, days }: { anniversaryIso: string; complete: boolean; days: number }) {
  const [remaining, setRemaining] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    if (complete) return;
    const anniversary = new Date(anniversaryIso);
    const tick = () => setRemaining(getElapsedSince(new Date(), anniversary));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [anniversaryIso, complete]);

  if (complete) {
    return (
      <>
        <p className="font-sans text-lg font-medium">Completo</p>
        <p className="mt-1 text-sm text-foreground/60">há {days} dias</p>
      </>
    );
  }

  return (
    <>
      <p className="font-sans text-lg font-medium">
        {remaining
          ? `${unit(remaining.years, "ano", "anos")} · ${unit(remaining.months, "mês", "meses")} · ${unit(remaining.days, "dia", "dias")}`
          : "—"}
      </p>
      <p className="mt-1 text-sm text-foreground/60">para completar</p>
    </>
  );
}

function ProgressRing({ progress, selected }: { progress: number; selected: boolean }) {
  const stroke = selected ? 10 : 8;
  const radius = (RING - stroke) / 2 - 2;
  const circumference = 2 * Math.PI * radius;
  const visible = Math.max(progress, progress > 0 && progress < 0.06 ? 0.06 : progress);
  const offset = circumference * (1 - visible);

  return (
    <svg
      className="pointer-events-none absolute inset-0 -rotate-90"
      viewBox={`0 0 ${RING} ${RING}`}
      aria-hidden
    >
      <circle
        cx={RING / 2}
        cy={RING / 2}
        r={radius}
        fill="none"
        stroke="rgba(107,20,32,0.55)"
        strokeWidth={stroke}
      />
      <circle
        cx={RING / 2}
        cy={RING / 2}
        r={radius}
        fill="none"
        stroke="#8B2432"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function BodaIcon({ type }: { type: BodaStatus["icon"] }) {
  const common = "h-14 w-14 stroke-[1.35] text-foreground/90";
  return (
    <svg viewBox="0 0 48 48" className={common} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {type === "paper" ? (
        <>
          <path d="M14 12h16l6 6v18H14V12Z" />
          <path d="M30 12v6h6" />
          <path d="M20 24h10M20 29h7" />
          <path d="M18 18h8" stroke="#6B1420" />
        </>
      ) : null}
      {type === "cotton" ? (
        <>
          <circle cx="24" cy="18" r="5" />
          <circle cx="17" cy="21" r="4.2" />
          <circle cx="31" cy="21" r="4.2" />
          <circle cx="20" cy="27" r="4" />
          <circle cx="28" cy="27" r="4" />
          <path d="M24 30v8M21 38h6" />
        </>
      ) : null}
      {type === "leather" ? (
        <>
          <path d="M12 18c0-4 5-7 12-7s12 3 12 7v14c0 4-5 6-12 6s-12-2-12-6V18Z" />
          <path d="M12 22c4 2 8 3 12 3s8-1 12-3" />
          <path d="M20 28h8" />
        </>
      ) : null}
      {type === "flowers" ? (
        <>
          <circle cx="24" cy="16" r="3.2" />
          <circle cx="17" cy="19" r="3" />
          <circle cx="31" cy="19" r="3" />
          <circle cx="19" cy="26" r="3" />
          <circle cx="29" cy="26" r="3" />
          <circle cx="24" cy="22" r="2.2" />
          <path d="M24 28v10M20 36c2 2 6 2 8 0" />
        </>
      ) : null}
      {type === "wood" ? (
        <>
          <ellipse cx="24" cy="15" rx="11" ry="5" />
          <path d="M13 15v17c0 3 5 5.5 11 5.5s11-2.5 11-5.5V15" />
          <path d="M13 24c3.5 2 7.5 3 11 3s7.5-1 11-3" />
          <path d="M22 17v14" />
        </>
      ) : null}
      {type === "perfume" ? (
        <>
          <rect x="18" y="18" width="12" height="18" rx="2" />
          <path d="M21 18V13h6v5" />
          <path d="M20 13h8" />
          <path d="M31 10c2 1 3 3 2 5" />
          <path d="M33 8c.5 2 0 4-1 5" />
        </>
      ) : null}
      {type === "brass" ? (
        <>
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="6" />
          <path d="M24 12v4M24 32v4M12 24h4M32 24h4" />
        </>
      ) : null}
      {type === "bronze" ? (
        <>
          <path d="M24 8l10 6v12c0 8-6 13-10 15-4-2-10-7-10-15V14l10-6Z" />
          <path d="M24 16v14" />
          <path d="M19 22h10" />
        </>
      ) : null}
      {type === "ceramic" ? (
        <>
          <path d="M16 20c0-5 3.5-8 8-8s8 3 8 8c4 1 6 4 6 8 0 6-6 10-14 10S10 34 10 28c0-4 2-7 6-8Z" />
          <path d="M18 20c1-3 3-5 6-5" />
        </>
      ) : null}
      {type === "tin" ? (
        <>
          <path d="M16 16h16l2 20H14l2-20Z" />
          <path d="M15 22h18" />
          <ellipse cx="24" cy="16" rx="8" ry="3" />
        </>
      ) : null}
      {type === "crystal" ? (
        <>
          <path d="M24 8l10 14-10 18L14 22 24 8Z" />
          <path d="M14 22h20M24 8v28M19 16l5 6 5-6" />
        </>
      ) : null}
      {type === "porcelain" ? (
        <>
          <path d="M14 22c0-2 4-4 10-4s10 2 10 4v8c0 4-4 7-10 7s-10-3-10-7v-8Z" />
          <path d="M34 24c3 0 5 2 5 5s-2 4-5 4" />
          <path d="M20 18c0-3 2-5 4-5s4 2 4 5" />
        </>
      ) : null}
      {type === "silver" ? (
        <>
          <circle cx="24" cy="24" r="11" />
          <circle cx="24" cy="24" r="6.5" />
          <path d="M24 17.5v13M17.5 24h13" />
        </>
      ) : null}
    </svg>
  );
}

export function BodasCarousel({ startIso }: { startIso: string }) {
  const statuses = useMemo(() => getBodaStatuses(new Date(startIso)), [startIso]);
  const [index, setIndex] = useState(() => nextBodaIndex(statuses));
  const dragged = useRef(false);
  const active = statuses[index];

  return (
    <section id="bodas" className="relative min-h-screen overflow-x-hidden py-24">
      <div className="mb-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
          nosso tempo em
        </p>
        <h2 className="font-serif mt-2 text-5xl italic font-normal sm:text-6xl">Bodas</h2>
        <LoveCounter startIso={startIso} />
      </div>

      {active ? (
        <p className="mb-8 text-center">
          <span className="inline-flex rounded-full bg-wine px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-wine-foreground">
            {active.years} {active.years === 1 ? "Ano" : "Anos"}
          </span>
        </p>
      ) : null}

      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ gap: GAP, paddingLeft: EDGE, paddingRight: EDGE }}
        animate={{ x: -index * STEP }}
        drag="x"
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => {
          dragged.current = true;
        }}
        onDragEnd={(_, info) => {
          const projected = info.offset.x + info.velocity.x * 0.18;
          const delta = projected < -40 ? 1 : projected > 40 ? -1 : 0;
          setIndex((current) => {
            const next = Math.min(statuses.length - 1, Math.max(0, current + delta));
            return next;
          });
          window.setTimeout(() => {
            dragged.current = false;
          }, 80);
        }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {statuses.map((boda, i) => {
          const selected = i === index;
          return (
            <button
              type="button"
              key={boda.years}
              onClick={() => {
                if (dragged.current) return;
                setIndex(i);
              }}
              className="shrink-0"
              style={{ width: CARD }}
              aria-label={`${boda.name}, ${Math.round(boda.progress * 100)}%`}
            >
              <div
                className={cn(
                  "relative mx-auto flex h-56 w-56 items-center justify-center rounded-full transition-transform duration-300 ease-out",
                  selected ? "scale-100" : "scale-90",
                )}
                style={{
                  boxShadow: selected
                    ? "0 0 80px rgba(107,20,32,0.5)"
                    : "0 0 24px rgba(107,20,32,0.16)",
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(13,13,15,0.2), rgba(10,10,11,0.94))",
                }}
              >
                <ProgressRing progress={boda.progress} selected={selected} />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <BodaIcon type={boda.icon} />
                  <span className="font-sans text-xl font-medium">{boda.name}</span>
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>

      {active ? (
        <div className="mt-10 text-center">
          <BodaRemaining
            anniversaryIso={active.anniversaryIso}
            complete={active.complete}
            days={active.days}
          />
          <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-foreground/65">
            {active.meaning}
          </p>
        </div>
      ) : null}
    </section>
  );
}
