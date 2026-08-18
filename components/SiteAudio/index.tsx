"use client";

import { useEffect } from "react";

import { useSiteAudio } from "@/components/SiteAudio/useSiteAudio";

type SiteAudioProps = {
  url: string | null;
};

export function SiteAudio({ url }: SiteAudioProps) {
  const { playing, blocked, toggle, start } = useSiteAudio(url);

  useEffect(() => {
    if (!url) return;
    start();
  }, [url, start]);

  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      start();
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => window.removeEventListener("pointerdown", unlock);
  }, [blocked, start]);

  if (!url) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed bottom-5 left-5 z-40 rounded-xl border border-gold/55 bg-[#2B151E]/92 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-gold shadow-[0_8px_22px_rgba(0,0,0,0.45)]"
      aria-label={playing ? "Pausar música" : "Tocar música"}
    >
      {playing ? "Som · on" : blocked ? "Toque para ouvir" : "Som · off"}
    </button>
  );
}
