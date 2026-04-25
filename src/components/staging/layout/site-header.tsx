import Link from "next/link";
import { siteContent } from "@/lib/data/mock-data";

const links = [
  { href: "/mapa", label: "Mapa" },
  { href: "/imoveis", label: "Imoveis" },
  { href: "/agir", label: "Agir" },
  { href: "/enviar", label: "Enviar relato" },
  { href: "/admin", label: "Admin" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-paper/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Link href="/" className="inline-block text-2xl font-black uppercase tracking-[0.18em] text-paper">
            {siteContent.name}
          </Link>
          <p className="max-w-2xl text-sm uppercase tracking-[0.16em] text-paper/60">{siteContent.subtitle}</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-paper/70">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="border border-paper/10 px-3 py-2 transition hover:border-signal/60 hover:text-paper">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}