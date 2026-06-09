"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  Compass,
  Database,
  Hand,
  MapPinned,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const entryPoints = [
  {
    title: "Ver no mapa",
    href: "/mapa",
    description: "Comece pela distribuicao territorial dos imoveis ja localizados.",
    action: "Abrir mapa",
    icon: MapPinned,
    tone: "signal",
    stat: "31 pontos",
    note: "geocodificados OK",
  },
  {
    title: "Ver por bairro",
    href: "/bairros",
    description: "Entenda concentracao, leitura territorial e bairros mais pressionados.",
    action: "Abrir bairros",
    icon: Compass,
    tone: "glass",
    stat: "ranking",
    note: "por registros e IPTU",
  },
  {
    title: "Imoveis prioritarios",
    href: "/imoveis",
    description: "Veja o que merece revisao, checagem publica ou aprofundamento.",
    action: "Ver imoveis",
    icon: Building2,
    tone: "rust",
    stat: "197 registros",
    note: "base consolidada",
  },
  {
    title: "Agir",
    href: "/agir",
    description: "Saia da leitura para apoio, memoria, denuncia e mobilizacao.",
    action: "Ver acoes",
    icon: Hand,
    tone: "paper",
    stat: "acao",
    note: "quando houver caminho",
  },
];

const dataStatus = [
  {
    title: "Dado oficial",
    description: "Inscricao, endereco e IPTU 2025 observados em arquivos e planilhas de origem.",
    icon: ShieldCheck,
    value: "190 IPTUs",
    tone: "text-signal",
  },
  {
    title: "Dado estimado",
    description: "Valor venal calculado por regra de estimativa quando a fonte direta nao esta completa.",
    icon: Database,
    value: "valor venal",
    tone: "text-glass",
  },
  {
    title: "Dado em revisao",
    description: "Geocodificacao ambigua, OCR manual ou endereco que precisa de checagem humana.",
    icon: AlertTriangle,
    value: "166 revisar",
    tone: "text-rust-light",
  },
];

function toneClass(tone: string) {
  return cn(
    tone === "signal" && "border-signal/55 text-signal hover:border-signal hover:bg-signal/10",
    tone === "glass" && "border-glass/45 text-glass hover:border-glass hover:bg-glass/10",
    tone === "rust" && "border-rust-light/50 text-rust-light hover:border-rust-light hover:bg-rust/10",
    tone === "paper" && "border-paper/28 text-paper hover:border-paper/55 hover:bg-white/10",
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-[1500px] px-3 pb-0 sm:px-5 lg:px-8">
      <section className="grid overflow-hidden border-x border-line bg-[linear-gradient(135deg,rgba(144,164,174,0.08),rgba(18,24,28,0.55))] shadow-panel backdrop-blur-xl lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
        <div className="relative min-h-[270px] overflow-hidden border-b border-line lg:min-h-[365px] lg:border-r lg:border-b-0">
          <Image src="/csn-central.jpg" alt="Escritorio central da CSN em Volta Redonda" fill priority className="object-cover object-[62%_52%] saturate-[0.82] contrast-[1.06]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,15,18,0.92)_0%,rgba(18,24,28,0.78)_48%,rgba(20,31,36,0.22)_100%)]" />
          <div className="absolute inset-0 tt-noise opacity-65" />
          <Image
            src="/brand/territorio-symbol.png"
            alt=""
            width={150}
            height={155}
            className="pointer-events-none absolute bottom-5 right-5 hidden opacity-35 mix-blend-screen drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:block"
          />

          <div className="relative z-10 flex min-h-[270px] max-w-2xl flex-col justify-center px-6 py-7 sm:px-10 lg:min-h-[365px] lg:px-12">
            <h1 className="font-display text-[2.25rem] uppercase leading-[0.98] tracking-[0.04em] text-paper drop-shadow-[0_6px_18px_rgba(0,0,0,0.42)] sm:text-[3.35rem] sm:tracking-[0.07em] lg:text-[3.1rem]">
              Territorio Tomado
            </h1>
            <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-paper/86 sm:text-lg">
              Um mapa publico para localizar, comparar e disputar o destino dos imoveis ligados a CSN em Volta Redonda.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/mapa" className="tt-button tt-button-primary min-w-40 text-xs">
                Ver no mapa
              </Link>
              <Link href="/bairros" className="tt-button tt-button-secondary min-w-40 text-xs">
                Comecar por bairro
              </Link>
              <Link href="/circulacao" className="tt-button tt-button-ghost min-w-40 text-xs">
                Cards publicos
              </Link>
            </div>
          </div>
        </div>

        <aside className="tt-rule-grid hidden bg-[linear-gradient(135deg,rgba(144,164,174,0.05),rgba(18,24,28,0.72))] px-6 py-6 backdrop-blur-xl lg:block lg:px-7">
          <div className="flex h-full flex-col justify-between gap-7">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-signal">Por onde comecar</p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-none tracking-[0.08em] text-paper sm:text-5xl">
                Escolha uma porta.
              </h2>
              <p className="mt-4 text-sm leading-6 text-paper/68">
                Se voce quer localizar, comparar, priorizar ou agir, a entrada certa esta abaixo. Menos discurso, mais caminho.
              </p>
            </div>
            <div className="grid grid-cols-3 border border-line bg-[rgba(18,24,28,0.45)]">
              {[
                ["197", "registros"],
                ["31", "no mapa"],
                ["166", "em revisao"],
              ].map(([value, label], index) => (
                <div key={label} className={cn("px-4 py-4", index > 0 && "border-l border-line")}>
                  <p className="font-display text-4xl leading-none tracking-[0.08em] text-paper">{value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-paper/55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid border-x border-t border-line bg-[linear-gradient(180deg,rgba(18,24,28,0.8),rgba(12,15,18,0.92))] md:grid-cols-2 xl:grid-cols-4">
        {entryPoints.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "group flex min-h-[250px] flex-col justify-between border-line p-5 transition hover:bg-white/[0.075] md:min-h-[270px]",
                index % 2 === 0 ? "md:border-r" : "",
                index < 2 ? "border-b xl:border-b-0" : "",
                index > 0 ? "xl:border-l" : "",
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <span className={cn("inline-flex h-12 w-12 items-center justify-center border bg-black/24 transition", toneClass(item.tone))}>
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-paper/35 transition group-hover:text-signal" />
                </div>
                <h2 className="mt-5 font-display text-3xl uppercase leading-8 tracking-[0.08em] text-paper">{item.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-5 text-paper/66">{item.description}</p>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-4">
                <div>
                  <p className="font-display text-2xl uppercase tracking-[0.08em] text-paper">{item.stat}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-paper/48">{item.note}</p>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-signal">{item.action}</span>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid border-x border-t border-line bg-[linear-gradient(135deg,rgba(144,164,174,0.06),rgba(18,24,28,0.88))] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-line px-6 py-6 lg:border-r lg:border-b-0">
          <div className="flex items-center gap-3 text-signal">
            <SearchCheck className="h-6 w-6" strokeWidth={1.8} />
            <p className="text-[11px] font-black uppercase tracking-[0.24em]">Como ler os dados</p>
          </div>
          <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.08em] text-paper">
            Nem todo ponto tem o mesmo peso.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-paper/68">
            A base vem de arquivos consolidados em data/output. O app separa o que foi observado, o que foi estimado e o que ainda precisa revisao.
          </p>
        </div>

        <div className="grid md:grid-cols-3">
          {dataStatus.map((item, index) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className={cn("min-h-48 px-5 py-6", index > 0 && "border-t border-line md:border-t-0 md:border-l")}>
                <Icon className={cn("h-7 w-7", item.tone)} strokeWidth={1.8} />
                <p className="mt-5 font-display text-2xl uppercase leading-7 tracking-[0.08em] text-paper">{item.title}</p>
                <p className={cn("mt-2 text-[11px] font-black uppercase tracking-[0.16em]", item.tone)}>{item.value}</p>
                <p className="mt-3 text-sm leading-5 text-paper/62">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid border-x border-t border-line bg-[var(--background-alt)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="px-6 py-6">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-signal">Clique agora</p>
          <h2 className="mt-3 font-display text-3xl uppercase leading-8 tracking-[0.08em] text-paper">
            Quer uma resposta rapida? Abra o mapa. Quer contexto? Entre por bairro.
          </h2>
        </div>
        <div className="grid gap-3 border-t border-line px-6 py-6 sm:grid-cols-2 lg:border-t-0 lg:border-l lg:grid-cols-1">
          <Link href="/mapa" className="tt-button tt-button-primary justify-center text-xs">
            Abrir mapa
          </Link>
          <Link href="/agir" className="tt-button tt-button-secondary justify-center text-xs">
            Ver acoes
          </Link>
        </div>
      </section>

      <footer className="grid items-center gap-4 border border-line bg-[linear-gradient(135deg,rgba(144,164,174,0.06),rgba(18,24,28,0.45))] px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-paper/54 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:grid-cols-[auto_1fr_auto]">
        <Link href="/" className="relative block h-16 w-44 overflow-hidden border border-signal/35 bg-black/30">
          <Image src="/brand/territorio-lockup.png" alt="Territorio Tomado" fill sizes="176px" className="object-contain" />
        </Link>
        <p>
          <strong className="block text-paper/70">Mapa publico dos imoveis ligados a CSN</strong>
          dado oficial · estimativa declarada · revisao aberta
        </p>
        <div className="flex flex-wrap gap-5 text-paper/58">
          <Link href="/bairros">Bairros</Link>
          <Link href="/circulacao">Circulacao</Link>
          <Link href="/imoveis">Imoveis</Link>
          <Link href="/enviar">Enviar</Link>
        </div>
      </footer>
    </div>
  );
}
