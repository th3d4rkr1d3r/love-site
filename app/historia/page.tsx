import { PublicGate } from "@/components/PublicGate";
import { Timeline } from "@/components/Timeline";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCouple, getPublicMemories } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function HistoriaPage() {
  const couple = await getCouple();
  const memories = couple ? await getPublicMemories(couple.id) : [];

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <SiteChrome>
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Nossa história
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            A timeline
          </h1>
          <div className="mt-16">
            <Timeline memories={memories} />
          </div>
        </main>
      </SiteChrome>
    </PublicGate>
  );
}
