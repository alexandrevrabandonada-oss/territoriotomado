"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Compass, LogIn, Map, Megaphone, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const desktopNavigation = [
  { href: "/mapa", label: "Mapa" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/bairros", label: "Bairros" },
  { href: "/circulacao", label: "Circulacao" },
  { href: "/agir", label: "Agir" },
  { href: "/enviar", label: "Enviar" },
  { href: "/admin", label: "Admin" },
];

const mobileNavigation = [
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/imoveis", label: "Imoveis", icon: Building2 },
  { href: "/bairros", label: "Bairros", icon: Compass },
  { href: "/circulacao", label: "Cards", icon: Megaphone },
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

    if (href === "/mapa" && pathname === "/") {
      return true;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#07090a]">
      <div className="tt-shell pointer-events-none absolute inset-0" />
      <header className="relative z-10 border-b border-white/14 bg-[linear-gradient(135deg,rgba(22,27,28,0.78),rgba(9,12,13,0.6))] shadow-[0_1px_0_rgba(255,255,255,0.08),0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6 lg:px-10 lg:py-0">
          <div className="flex items-center py-1.5 lg:py-2.5">
            <Link href="/" className="inline-flex items-center gap-3 text-paper">
              <span className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-signal/55 bg-[linear-gradient(145deg,rgba(255,215,106,0.12),rgba(255,255,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(233,173,18,0.1)] backdrop-blur-xl">
                <Image
                  src="/brand/territorio-symbol.png"
                  alt=""
                  width={56}
                  height={58}
                  priority
                  sizes="56px"
                  className="h-full w-full object-cover object-[50%_42%]"
                />
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
                  "flex min-w-24 items-center justify-center border-l border-white/10 px-5 transition last:border-r",
                  isActive(item.href)
                    ? "border-b-2 border-b-signal bg-white/8 text-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                    : "hover:bg-white/7 hover:text-paper",
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
