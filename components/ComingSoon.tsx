type ComingSoonProps = {
  nameA: string;
  nameB: string;
};

export function ComingSoon({ nameA, nameB }: ComingSoonProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6">
      <h1 className="font-serif text-4xl font-light tracking-tight text-balance sm:text-6xl">
        {nameA} <span className="text-wine">♥</span> {nameB}
      </h1>
      <span className="mt-8 h-px w-16 bg-gold/70" aria-hidden />
      <p className="mt-8 font-sans text-xs uppercase tracking-[0.35em] text-gold/80">
        Em breve
      </p>
    </main>
  );
}
