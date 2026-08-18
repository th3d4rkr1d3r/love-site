"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSiteAudio } from "@/components/SiteAudio/useSiteAudio";
import {
  detectProvider,
  spotifyEmbedUrl,
  youtubeEmbedUrl,
} from "@/lib/music-url";
import { cn } from "@/lib/utils";

export type PlayerSong = {
  title: string;
  artist: string;
  url: string;
  note: string | null;
  provider: string;
  coverUrl: string | null;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 10v4h3l5 4V6L7 10H4Z" strokeLinejoin="round" />
      {muted ? (
        <path d="M16 10l4 4M20 10l-4 4" />
      ) : (
        <path d="M16 9.5c1.2 1 1.8 2.2 1.8 2.5s-.6 1.5-1.8 2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function MusicPlayer({ song }: { song: PlayerSong }) {
  const [volumeOpen, setVolumeOpen] = useState(false);
  const provider =
    song.provider === "spotify" || song.provider === "youtube"
      ? song.provider
      : detectProvider(song.url);
  const hasFile = provider === "file" && Boolean(song.url);
  const youtube = provider === "youtube" ? youtubeEmbedUrl(song.url) : null;
  const spotify = provider === "spotify" ? spotifyEmbedUrl(song.url) : null;
  const audio = useSiteAudio(hasFile ? song.url : null);

  return (
    <div className="glass mx-auto w-full max-w-xl overflow-hidden">
      <div className="px-6 pb-2 pt-6">
        <h3 className="truncate font-serif text-2xl font-light">{song.title}</h3>
        <p className="mt-1 text-sm text-foreground/65">{song.artist}</p>
        {song.note ? (
          <p className="mt-3 text-sm leading-relaxed text-foreground/55">{song.note}</p>
        ) : null}
      </div>

      {youtube ? (
        <iframe
          title={song.title}
          src={youtube}
          className="aspect-video w-full border-t border-gold/15"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : null}

      {spotify ? (
        <iframe
          title={song.title}
          src={spotify}
          className="h-40 w-full border-t border-gold/15"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      ) : null}

      {provider === "file" ? (
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <Button type="button" onClick={audio.toggle} disabled={!hasFile} variant="gold">
              {audio.playing ? "Pausar" : "Tocar"}
            </Button>
            <div className="min-w-0 flex-1">
              <button
                type="button"
                className="block h-1.5 w-full rounded-full bg-gold/20"
                aria-label="Progresso da música"
                onClick={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const ratio = (event.clientX - rect.left) / rect.width;
                  audio.seek(ratio);
                }}
              >
                <span
                  className="block h-1.5 rounded-full bg-gold"
                  style={{
                    width: audio.duration
                      ? `${Math.min(100, (audio.current / audio.duration) * 100)}%`
                      : "0%",
                  }}
                />
              </button>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="font-sans text-xs tracking-[0.12em] text-foreground/70">
                  {formatTime(audio.current)} / {formatTime(audio.duration)}
                </p>
                <div className="flex items-center justify-end">
                  {volumeOpen ? (
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={audio.volume}
                      disabled={!hasFile}
                      onChange={(event) => audio.setVolume(Number(event.target.value))}
                      className="mr-1 h-1 w-20 cursor-pointer appearance-none rounded-full bg-gold/20 accent-gold"
                      aria-label="Volume"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setVolumeOpen((open) => !open)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-gold/75 transition-colors hover:bg-white/5 hover:text-gold",
                      volumeOpen && "bg-white/5 text-gold",
                    )}
                    aria-label="Volume"
                    aria-expanded={volumeOpen}
                  >
                    <SpeakerIcon muted={audio.volume === 0} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {!hasFile ? (
            <p className="mt-4 text-sm text-foreground/55">
              A faixa ainda vai ser definida. O player já está no ar.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
