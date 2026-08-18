"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";

import {
  ensureSiteAudio,
  getServerSiteAudioState,
  getSiteAudioState,
  seekSiteAudio,
  setSiteAudioVolume,
  startSiteAudio,
  subscribeSiteAudio,
  toggleSiteAudio,
} from "@/lib/site-audio";

export function useSiteAudio(url?: string | null) {
  const state = useSyncExternalStore(
    subscribeSiteAudio,
    getSiteAudioState,
    getServerSiteAudioState,
  );

  useEffect(() => {
    if (!url) return;
    ensureSiteAudio(url);
  }, [url]);

  return {
    ...state,
    toggle: toggleSiteAudio,
    seek: seekSiteAudio,
    setVolume: setSiteAudioVolume,
    start: startSiteAudio,
  };
}
