"use client";

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
  element.addEventListener("play", () => emit({ playing: true, blocked: false }));
  element.addEventListener("pause", () => emit({ playing: false }));
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
    audio = new Audio();
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;
    bindAudio(audio);
  }
  if (currentUrl !== url) {
    currentUrl = url;
    audio.src = url;
    audio.load();
  }
  return audio;
}

export function startSiteAudio() {
  if (!audio) return;
  audio
    .play()
    .then(() => emit({ playing: true, blocked: false }))
    .catch(() => emit({ blocked: true, playing: false }));
}

export function toggleSiteAudio() {
  if (!audio) return;
  if (audio.paused) {
    startSiteAudio();
    return;
  }
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
