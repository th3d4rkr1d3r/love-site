"use client";

import { useEffect, useState } from "react";

import { getElapsedSince, type ElapsedTime } from "@/lib/date-utils";

function unit(value: number, singular: string, plural: string) {
  return `${value} ${value === 1 ? singular : plural}`;
}

type LoveCounterProps = {
  startIso: string;
};

export function LoveCounter({ startIso }: LoveCounterProps) {
  const [elapsed, setElapsed] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) return;

    const tick = () => {
      try {
        setElapsed(getElapsedSince(start, new Date()));
      } catch {
        setElapsed(getElapsedSince(start));
      }
    };

    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [startIso]);

  const value = elapsed;

  return (
    <div className="mt-10">
      <p className="font-sans text-lg font-light text-foreground/80 sm:text-xl">
        {value
          ? `${unit(value.years, "ano", "anos")} · ${unit(value.months, "mês", "meses")} · ${unit(value.days, "dia", "dias")}`
          : "—"}
      </p>
    </div>
  );
}
