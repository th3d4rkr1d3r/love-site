import { LetterEnvelope } from "@/components/LetterEnvelope";
import { PublicGate } from "@/components/PublicGate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCouple, getLetter } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function CartaPage() {
  const couple = await getCouple();
  const letter = couple ? await getLetter(couple.id) : null;

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <SiteChrome>
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Uma carta para você
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            {letter?.title ?? "Carta"}
          </h1>
          <div className="mt-16">
            {letter ? (
              <LetterEnvelope title={letter.title} content={letter.content} />
            ) : (
              <p className="text-sm text-foreground/60">A carta ainda não foi escrita.</p>
            )}
          </div>
        </main>
      </SiteChrome>
    </PublicGate>
  );
}
