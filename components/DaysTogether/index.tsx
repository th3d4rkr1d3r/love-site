"use client";

import { useEffect, useState } from "react";

import { daysTogether } from "@/lib/date-utils";

type DaysTogetherProps = {
  startIso: string;
};

export function DaysTogether({ startIso }: DaysTogetherProps) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const start = new Date(startIso);
    const tick = () => setDays(daysTogether(start));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [startIso]);

  return (
    <section
      id="dias"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 50% 40% at 18% 28%, rgba(90,31,50,0.28), transparent 70%)",
            "radial-gradient(ellipse 45% 35% at 82% 62%, rgba(66,27,41,0.22), transparent 65%)",
            "radial-gradient(ellipse 30% 25% at 50% 80%, rgba(201,162,75,0.07), transparent 70%)",
          ].join(","),
        }}
      />
      <div className="relative z-10">
        <p className="font-serif text-4xl italic font-normal text-foreground sm:text-6xl">
          Sendo feliz
        </p>
        <p className="mt-6 font-sans text-5xl font-light tracking-tight text-foreground sm:text-7xl">
          {days == null ? "—" : days} {days === 1 ? "dia" : "dias"}
        </p>
        <p className="mt-4 text-sm font-medium tracking-[0.22em] text-foreground/80">
          ao seu lado
        </p>
        <p className="mt-8 text-wine" aria-hidden>
          ♥
        </p>
      </div>
    </section>
  );
}
