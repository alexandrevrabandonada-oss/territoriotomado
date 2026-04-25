"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Compass, Home, Map, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const desktopNavigation = [
  { href: "/", label: "Inicio" },
  { href: "/bairros", label: "Bairros" },
  { href: "/mapa", label: "Mapa" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/agir", label: "Agir" },
  { href: "/admin", label: "Admin" },
];

const mobileNavigation = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/bairros", label: "Bairros", icon: Compass },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/imoveis", label: "Imoveis", icon: Building2 },
  { href: "/agir", label: "Agir", icon: Shield },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="tt-shell pointer-events-none absolute inset-0" />
      <header className="relative z-10 border-b border-concrete/20 bg-ink/72 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-5 lg:flex-row lg:items-end lg:justify-between lg:gap-5 lg:px-8 lg:py-4">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-3 text-paper">
              <span className="inline-flex h-9 w-9 items-center justify-center border border-signal/65 bg-concrete/14 text-xs font-bold uppercase tracking-[0.22em] text-signal shadow-[inset_0_0_0_1px_rgba(242,244,239,0.08)]">
                TT
              </span>
              <span className="font-display text-xl uppercase tracking-[0.18em] sm:text-2xl">Territorio Tomado</span>
            </Link>
            <p className="max-w-2xl text-[11px] uppercase tracking-[0.22em] text-paper/55 sm:text-xs">
              Mapa Popular dos Imoveis da CSN em Volta Redonda
            </p>
          </div>

          <nav className="hidden flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper/70 sm:text-xs lg:flex">
            {desktopNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border px-3 py-2 transition",
                  isActive(item.href)
                    ? "border-signal/45 bg-concrete/14 text-paper shadow-[inset_0_0_0_1px_rgba(233,173,18,0.1)]"
                    : "border-concrete/14 bg-concrete/7 hover:border-glass/45 hover:bg-concrete/12 hover:text-paper",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 pb-24 lg:pb-0">{children}</main>

      <footer className="relative z-10 border-t border-concrete/18 bg-ink-alt/82 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs uppercase tracking-[0.16em] text-paper/45 sm:px-5 lg:flex-row lg:justify-between lg:px-8">
          <p>Observatorio popular urbano em construcao</p>
          <p>Tijolo 01: fundacao visual e estrutural</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-concrete/18 bg-ink/88 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5 px-2 py-2">
          {mobileNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition",
                  active ? "text-signal" : "text-paper/55 hover:text-paper",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center border transition",
                    active ? "border-signal/40 bg-concrete/14 shadow-[inset_0_0_0_1px_rgba(233,173,18,0.1)]" : "border-concrete/14 bg-concrete/7",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
