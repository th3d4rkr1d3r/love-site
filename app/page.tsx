import { BodasCarousel } from "@/components/BodasCarousel";
import { CoverflowGallery } from "@/components/CoverflowGallery";
import { CoupleHero } from "@/components/CoupleHero";
import { DaysTogether } from "@/components/DaysTogether";
import { LetterEnvelope } from "@/components/LetterEnvelope";
import { MusicPlayer } from "@/components/MusicPlayer";
import { OpenAtTop } from "@/components/OpenAtTop";
import { PublicGate } from "@/components/PublicGate";
import { RosePetals } from "@/components/RosePetals";
import { SectionReveal } from "@/components/SectionReveal";
import { Timeline } from "@/components/Timeline";
import { SiteChrome } from "@/components/layout/SiteChrome";
import {
  getCouple,
  getLetter,
  getPublicMemories,
  getPublicPhotos,
  getSongs,
} from "@/lib/couple";
import { formatLongDatePt } from "@/lib/date-utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const couple = await getCouple();
  const startIso = couple?.relationshipStart.toISOString() ?? "";
  const photos = couple ? await getPublicPhotos(couple.id) : [];
  const memories = couple ? await getPublicMemories(couple.id) : [];
  const songs = couple ? await getSongs(couple.id) : [];
  const letter = couple ? await getLetter(couple.id) : null;
  const song = songs[0];

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <SiteChrome hideNav>
        {couple ? (
          <main>
            <OpenAtTop />
            <RosePetals />
            <CoupleHero
              nameA={couple.nameA}
              nameB={couple.nameB}
              startIso={startIso}
              startLabel={formatLongDatePt(couple.relationshipStart)}
              coverPhotoUrl={couple.coverPhotoUrl}
            />
            <SectionReveal>
              <DaysTogether startIso={startIso} />
            </SectionReveal>
            <SectionReveal>
              <BodasCarousel startIso={startIso} />
            </SectionReveal>

            <SectionReveal id="galeria" className="px-4 py-24 sm:px-6">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                nossos momentos
              </p>
              <h2 className="mt-2 text-center font-serif text-5xl italic font-light sm:text-6xl">
                Galeria
              </h2>
              <div className="mt-12">
                <CoverflowGallery photos={photos} />
              </div>
            </SectionReveal>

            <SectionReveal id="historia" className="px-6 py-24">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Nossa história
              </p>
              <h2 className="mt-3 text-center font-serif text-4xl font-light sm:text-5xl">
                A timeline
              </h2>
              <div className="mt-16">
                {memories.length > 0 ? (
                  <Timeline memories={memories} />
                ) : (
                  <p className="text-center text-sm text-foreground/60">
                    A timeline ainda vai ser preenchida.
                  </p>
                )}
              </div>
            </SectionReveal>

            <SectionReveal className="px-6 py-24">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Nossa música
              </p>
              <h2 className="mt-3 text-center font-serif text-4xl font-light sm:text-5xl">
                {song?.title ?? "Nossa música"}
              </h2>
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
                  <p className="text-center text-sm text-foreground/60">
                    Nenhuma música cadastrada ainda.
                  </p>
                )}
              </div>
            </SectionReveal>

            <SectionReveal className="px-6 pb-32 pt-24">
              <p className="text-center text-[11px] uppercase tracking-[0.28em] text-gold/80">
                Uma carta para você
              </p>
              <h2 className="mt-3 text-center font-serif text-4xl font-light sm:text-5xl">
                {letter?.title ?? "Carta"}
              </h2>
              <div className="mt-16">
                {letter ? (
                  <LetterEnvelope title={letter.title} content={letter.content} />
                ) : (
                  <p className="text-center text-sm text-foreground/60">
                    A carta ainda não foi escrita.
                  </p>
                )}
              </div>
            </SectionReveal>
          </main>
        ) : (
          <main className="min-h-screen" />
        )}
      </SiteChrome>
    </PublicGate>
  );
}
