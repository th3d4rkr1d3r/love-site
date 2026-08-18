export default function AdminHomePage() {
  return (
    <section className="glass px-6 py-8">
      <h1 className="font-serif text-3xl font-light">Painel</h1>
      <p className="mt-3 max-w-lg text-sm text-muted-foreground">
        Autenticação e CRUD entram no V3. Esta rota existe só como casca — não
        consulta o banco e não lista memórias, fotos ou endereços.
      </p>
    </section>
  );
}
