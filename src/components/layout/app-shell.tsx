"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Compass, LogIn, Map, Send, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const desktopNavigation = [
  { href: "/mapa", label: "Mapa" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/bairros", label: "Bairros" },
  { href: "/agir", label: "Agir" },
  { href: "/enviar", label: "Enviar" },
  { href: "/admin", label: "Admin" },
];

const mobileNavigation = [
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/imoveis", label: "Imoveis", icon: Building2 },
  { href: "/bairros", label: "Bairros", icon: Compass },
  { href: "/agir", label: "Agir", icon: Shield },
  { href: "/enviar", label: "Enviar", icon: Send },
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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#080a0b]">
      <div className="tt-shell pointer-events-none absolute inset-0" />
      <header className="relative z-10 border-b border-concrete/16 bg-[#111516]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6 lg:px-8 lg:py-0">
          <div className="flex items-center py-2 lg:py-3">
            <Link href="/" className="inline-flex items-center gap-3 text-paper">
              <span className="inline-flex h-12 w-12 items-center justify-center border border-signal/75 bg-black/25 text-xs font-black uppercase tracking-[0.22em] text-signal shadow-[inset_0_0_0_1px_rgba(242,244,239,0.08)]">
                TT
              </span>
              <span>
                <span className="block font-display text-2xl uppercase leading-none tracking-[0.14em] sm:text-3xl">Territorio Tomado</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-paper/60 sm:text-[11px]">
                  Mapa Popular dos Imoveis da CSN em Volta Redonda
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden text-[11px] font-black uppercase tracking-[0.18em] text-paper/70 lg:flex">
            {desktopNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-w-24 items-center justify-center border-l border-concrete/12 px-5 transition last:border-r",
                  isActive(item.href)
                    ? "border-b-2 border-b-signal bg-concrete/7 text-signal"
                    : "hover:bg-concrete/7 hover:text-paper",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" className="ml-6 inline-flex items-center gap-2 text-paper/72 hover:text-signal">
              <LogIn className="h-4 w-4" />
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 pb-24 lg:pb-0">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-concrete/18 bg-[#111516]/94 backdrop-blur-md lg:hidden">
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
