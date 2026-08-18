"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { V1_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

type PublicNavProps = {
  overlay?: boolean;
};

export function PublicNav({ overlay = false }: PublicNavProps) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <header
      className={cn(
        "z-20 w-full",
        overlay
          ? "fixed inset-x-0 top-0 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent"
          : "relative border-b border-gold/15",
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="font-serif text-lg tracking-tight">
          G <span className="text-wine">&</span> S
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-5">
          {V1_NAV.map((item) => {
            const itemHash = item.href.includes("#") ? `#${item.href.split("#")[1]}` : "";
            const active =
              item.href === "/"
                ? pathname === "/" && hash === ""
                : pathname === "/" && hash === itemHash;
            return (
              <li key={item.href}>
                <Link
                  href={pathname === "/" && itemHash ? itemHash : item.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 ease-out sm:text-[11px] sm:tracking-[0.22em]",
                    active ? "text-gold" : "text-foreground/70 hover:text-gold/90",
                  )}
                  onClick={(event) => {
                    if (pathname !== "/") {
                      setHash(itemHash);
                      return;
                    }
                    event.preventDefault();
                    setHash(itemHash);
                    const id = itemHash.slice(1);
                    if (!id) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      window.history.pushState(null, "", "/");
                      return;
                    }
                    window.history.pushState(null, "", itemHash);
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
