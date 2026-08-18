import { MusicPlayer } from "@/components/MusicPlayer";
import { PublicGate } from "@/components/PublicGate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCouple, getSongs } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function MusicaPage() {
  const couple = await getCouple();
  const songs = couple ? await getSongs(couple.id) : [];
  const song = songs[0];

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <SiteChrome>
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Nossa música
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            {song?.title ?? "Nossa música"}
          </h1>
          <div className="mt-16">
            {song ? (
              <MusicPlayer
                song={{
                  title: song.title,
                  artist: song.artist,
                  url: song.url,
                  note: song.note,
                  provider: song.provider,
                  coverUrl: song.coverUrl,
                }}
              />
            ) : (
              <p className="text-sm text-foreground/60">Nenhuma música cadastrada ainda.</p>
            )}
          </div>
        </main>
      </SiteChrome>
    </PublicGate>
  );
}
