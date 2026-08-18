# love-site

Site pessoal de Gabriel & Stefani. Stack: Next.js 14 (App Router) + TypeScript, Tailwind, shadcn/ui, Prisma, PostgreSQL.

O site público fica em **coming soon** enquanto `Couple.isPublic = false`.

## Local

1. Suba o Postgres:

```bash
docker compose up -d
```

2. Copie o ambiente e ajuste se precisar:

```bash
cp .env.example .env
```

3. Instale, migre e popule:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

O Postgres do Docker escuta em **5433**. Nesta máquina `localhost`/`127.0.0.1` é interceptado por outro processo — o `.env` local usa `127.0.0.2:5433`. Se a 3000 estiver ocupada, `npx next dev -p 3456`.

Em desenvolvimento, `npm run db:migrate:dev` também vale (cria/nomeia migrations). **Em produção, nunca use `migrate dev`.**

## Vercel

- `DATABASE_URL` (pooled) e `DIRECT_URL` (conexão direta) no dashboard, por ambiente.
- Demais chaves: ver `.env.example` (`NEXTAUTH_*`, `ADMIN_*`, R2, Mapbox). Nada disso vai no git.
- Build já roda `prisma generate` (`postinstall` + script `build`).
- Depois do primeiro deploy, no ambiente de produção:

```bash
npx prisma migrate deploy
npx prisma db seed
```

O seed **não** roda automaticamente a cada deploy. Rode na mão quando quiser.

Domínio próprio: Project Settings → Domains, quando existir. Até lá, `*.vercel.app` serve — o coming soon continua na frente.

R2 (V3): política CORS no bucket liberando `PUT`/`POST` a partir do domínio de produção. Upload direto do browser; API routes da Vercel não carregam arquivos grandes (~4,5 MB).
