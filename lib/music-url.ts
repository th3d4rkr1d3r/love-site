export type SongProvider = "file" | "spotify" | "youtube";

export function detectProvider(url: string): SongProvider {
  if (url.includes("spotify.com")) return "spotify";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "file";
}

export function youtubeEmbedUrl(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function spotifyEmbedUrl(url: string) {
  const match = url.match(
    /open\.spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/,
  );
  if (!match) return null;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
}
