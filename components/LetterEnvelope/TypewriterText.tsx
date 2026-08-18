"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type TypewriterTextProps = {
  text: string;
  active: boolean;
  className?: string;
};

export function TypewriterText({ text, active, className }: TypewriterTextProps) {
  const [count, setCount] = useState(0);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= text.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, 28);
    return () => window.clearInterval(id);
  }, [active, text]);

  useEffect(() => {
    const caret = caretRef.current;
    if (!caret) return;
    const scroller = caret.closest("article");
    if (!(scroller instanceof HTMLElement)) return;
    const caretBox = caret.getBoundingClientRect();
    const box = scroller.getBoundingClientRect();
    if (caretBox.bottom > box.bottom - 20) {
      scroller.scrollTop += caretBox.bottom - box.bottom + 20;
    }
  }, [count]);

  return (
    <p
      className={cn(
        "whitespace-pre-wrap font-serif text-lg italic font-light leading-relaxed text-foreground/90",
        className,
      )}
    >
      {text.slice(0, count)}
      {active && count < text.length ? (
        <span
          ref={caretRef}
          className="ml-0.5 inline-block h-4 w-[1.5px] translate-y-0.5 bg-wine/80"
          aria-hidden
        />
      ) : (
        <span ref={caretRef} aria-hidden />
      )}
    </p>
  );
}
