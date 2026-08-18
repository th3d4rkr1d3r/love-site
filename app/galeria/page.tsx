import { PhotoGallery } from "@/components/PhotoGallery";
import { PublicGate } from "@/components/PublicGate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { getCouple, getPublicPhotos } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const couple = await getCouple();
  const photos = couple ? await getPublicPhotos(couple.id) : [];

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <SiteChrome>
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">
            Nossa galeria
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            Fotos
          </h1>
          <div className="mt-16">
            <PhotoGallery photos={photos} />
          </div>
        </main>
      </SiteChrome>
    </PublicGate>
  );
}
