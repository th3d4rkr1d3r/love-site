import { PublicGate } from "@/components/PublicGate";
import { getCouple } from "@/lib/couple";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const couple = await getCouple();

  return (
    <PublicGate
      isPublic={couple?.isPublic ?? false}
      nameA={couple?.nameA ?? "Gabriel"}
      nameB={couple?.nameB ?? "Stefani"}
    >
      <main className="min-h-screen" />
    </PublicGate>
  );
}
