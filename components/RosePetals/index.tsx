"use client";

import { useEffect, useState } from "react";

type Petal = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  drift: string;
  color: string;
  spin: string;
};

const COLORS = ["#6B1420", "#8A2432", "#5A1018", "#C9A24B", "#7A1C28"];

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 6}s`,
    duration: `${11 + Math.random() * 9}s`,
    size: 10 + Math.round(Math.random() * 14),
    drift: `${Math.random() * 90 - 45}px`,
    color: COLORS[id % COLORS.length],
    spin: `${400 + Math.round(Math.random() * 320)}deg`,
  }));
}

function PetalShape({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 24 32" aria-hidden>
      <path
        fill={color}
        d="M12 2C8 8 4 12 4 18c0 6 4 11 8 12 4-1 8-6 8-12 0-6-4-10-8-16Z"
      />
      <path
        fill="rgba(255,255,255,0.2)"
        d="M12 6c-1.5 4-3 7-3 11 0 2 .6 4 1.4 5.5C11 18 12 12 12 6Z"
      />
    </svg>
  );
}

export function RosePetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = window.innerWidth < 640 ? 10 : 18;
    setPetals(makePetals(count));
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal-fall absolute top-[-8vh]"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            ["--petal-drift" as string]: petal.drift,
            ["--petal-spin" as string]: petal.spin,
          }}
        >
          <PetalShape size={petal.size} color={petal.color} />
        </span>
      ))}
    </div>
  );
}
