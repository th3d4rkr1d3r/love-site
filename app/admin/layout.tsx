import Link from "next/link";

import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-ink-soft">
      <header className="border-b border-gold/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href={ADMIN_HOME_PATH} className="font-serif text-lg tracking-tight">
            Admin
          </Link>
          <Link
            href={ADMIN_LOGIN_PATH}
            className="text-xs uppercase tracking-[0.2em] text-gold/80"
          >
            Login
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
