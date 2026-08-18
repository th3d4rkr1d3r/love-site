import { getCouple, getSongs } from "@/lib/couple";
import { detectProvider } from "@/lib/music-url";

import { SiteAudio } from "./index";

export async function SiteAudioLoader() {
  try {
    const couple = await getCouple();
    if (!couple) return null;
    const songs = await getSongs(couple.id);
    const song = songs[0];
    if (!song?.url) return null;
    if (detectProvider(song.url) !== "file" && song.provider !== "file") return null;
    return <SiteAudio url={song.url} />;
  } catch {
    return null;
  }
}
