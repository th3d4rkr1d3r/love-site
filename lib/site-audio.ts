"use client";

import { SITE_SONG_ELEMENT_ID } from "@/lib/site-song";

type SiteAudioState = {
  playing: boolean;
  blocked: boolean;
  current: number;
  duration: number;
  volume: number;
};

const DEFAULT_VOLUME = 0.16;

const idle: SiteAudioState = {
  playing: false,
  blocked: false,
  current: 0,
  duration: 0,
  volume: DEFAULT_VOLUME,
};

const listeners = new Set<() => void>();
let state: SiteAudioState = idle;
let audio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
let listenersBound = false;
let wantPlaying = false;
let unlockBound = false;

function emit(partial: Partial<SiteAudioState>) {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener());
}

function bindAudio(element: HTMLAudioElement) {
  if (listenersBound) return;
  listenersBound = true;
  const syncDuration = () => {
    const duration = Number.isFinite(element.duration) ? element.duration : 0;
    emit({ duration });
  };
  element.addEventListener("timeupdate", () => emit({ current: element.currentTime }));
  element.addEventListener("durationchange", syncDuration);
  element.addEventListener("loadedmetadata", syncDuration);
  element.addEventListener("canplay", () => {
    if (wantPlaying && element.paused) startSiteAudio();
  });
  element.addEventListener("play", () => emit({ playing: true, blocked: false }));
  element.addEventListener("pause", () => {
    if (wantPlaying) {
      element.play().catch(() => {});
      return;
    }
    emit({ playing: false });
  });
}

function armUnlock() {
  if (unlockBound || typeof window === "undefined") return;
  unlockBound = true;
  const events = ["pointerdown", "touchstart", "click", "keydown"] as const;
  const unlock = (event: Event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("[data-sound-toggle]")) return;
    startSiteAudio();
    if (!audio?.paused) {
      events.forEach((name) => window.removeEventListener(name, unlock, true));
    }
  };
  events.forEach((name) => window.addEventListener(name, unlock, true));
}

export function subscribeSiteAudio(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function getSiteAudioState() {
  return state;
}

export function getServerSiteAudioState() {
  return idle;
}

export function ensureSiteAudio(url: string) {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio =
      (document.getElementById(SITE_SONG_ELEMENT_ID) as HTMLAudioElement | null) ??
      new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.setAttribute("playsinline", "true");
    audio.volume = DEFAULT_VOLUME;
    bindAudio(audio);
  }
  const abs = new URL(url, window.location.href).href;
  if (currentUrl !== url) {
    currentUrl = url;
    if (audio.src !== abs) {
      audio.src = url;
    }
  }
  armUnlock();
  return audio;
}

export function startSiteAudio() {
  if (!audio) return;
  wantPlaying = true;
  if (!audio.paused) {
    emit({ playing: true, blocked: false });
    return;
  }
  audio
    .play()
    .then(() => emit({ playing: true, blocked: false }))
    .catch((error: unknown) => {
      const name =
        error && typeof error === "object" && "name" in error ? String(error.name) : "";
      if (name === "AbortError") {
        window.setTimeout(() => {
          if (wantPlaying && audio?.paused) {
            audio.play().catch(() => emit({ blocked: true, playing: false }));
          }
        }, 120);
        return;
      }
      emit({ blocked: true, playing: false });
    });
}

export function toggleSiteAudio() {
  if (!audio) return;
  if (audio.paused) {
    startSiteAudio();
    return;
  }
  wantPlaying = false;
  audio.pause();
}

export function seekSiteAudio(ratio: number) {
  if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
  audio.currentTime = Math.min(1, Math.max(0, ratio)) * audio.duration;
}

export function setSiteAudioVolume(volume: number) {
  const next = Math.min(1, Math.max(0, volume));
  if (audio) audio.volume = next;
  emit({ volume: next });
}
