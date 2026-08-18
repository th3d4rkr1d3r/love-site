"use client";

import { SITE_SONG_URL } from "@/lib/site-song";

import { SiteAudio } from "./index";

export function SiteAudioEager() {
  return <SiteAudio url={SITE_SONG_URL} />;
}
