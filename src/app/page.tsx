"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Eye,
  FileText,
  Hand,
  MapPinned,
  MessageCircle,
  ShieldAlert,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { neighborhoods, properties, propertyReports } from "@/lib/data/mock-data";

const stats = [
  { label: "Imoveis mapeados", value: "56", note: "+3 este mes", icon: Building2 },
  { label: "Bairros em leitura", value: "12", note: "3 novos bairros", icon: MapPinned },
  { label: "Acoes abertas", value: "7", note: "2 em mobilizacao", icon: Hand },
  { label: "Relatos recebidos", value: "18", note: "+5 esta semana", icon: FileText },
  { label: "Pessoas envolvidas", value: "324", note: "na rede territorial", icon: UsersRound },
];

const situation = [
  { label: "Imoveis mapeados", value: "56", icon: Building2 },
  { label: "Relatos em circulacao", value: "18", icon: ShieldAlert },
  { label: "Bairros em leitura", value: "12", icon: MapPinned },
  { label: "Acoes abertas", value: "7", icon: Hand, alert: true },
];

const mapPins = [
  { label: "Vila Santa Cecilia", left: "39%", top: "26%", tone: "yellow" },
  { label: "Bela Vista", left: "47%", top: "45%", tone: "rust" },
  { label: "Monte Castelo", left: "57%", top: "66%", tone: "blue" },
  { label: "Aterrado", left: "73%", top: "43%", tone: "rust" },
];

const featured = [
  {
    title: "Antigo Clube CSN Santa Cecilia",
    place: "Vila Santa Cecilia",
    tag: "Criticidade alta",
    tone: "rust",
    comments: 3,
    actions: 2,
  },
  {
    title: "Area da California",
    place: "Aterrado",
    tag: "Criticidade media",
    tone: "orange",
    comments: 2,
    actions: 1,
  },
  {
    title: "Predio administrativo antigo",
    place: "Bairro 249",
    tag: "Em disputa",
    tone: "yellow",
    comments: 1,
    actions: 0,
  },
  {
    title: "Terreno Rua 90",
    place: "Monte Castelo",
    tag: "Criticidade baixa",
    tone: "blue",
    comments: 0,
    actions: 0,
  },
];

const quickFilters = ["Imoveis publicos", "Imoveis ocupados", "Acao em andamento", "Prioridade de leitura"];

export default function HomePage() {
  const [criticality, setCriticality] = useState("todos");
  const [bairro, setBairro] = useState("todos");
  const [status, setStatus] = useState("todos");
  const [checkedFilters, setCheckedFilters] = useState<string[]>(["Prioridade de leitura"]);

  const activeFilterCount = useMemo(() => {
    return [criticality, bairro, status].filter((item) => item !== "todos").length + checkedFilters.length;
  }, [bairro, checkedFilters, criticality, status]);

  function toggleQuickFilter(filter: string) {
    setCheckedFilters((current) => (current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]));
  }

  function clearFilters() {
    setCriticality("todos");
    setBairro("todos");
    setStatus("todos");
    setCheckedFilters([]);
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 pb-0 sm:px-6 lg:px-8">
      <section className="grid border-x border-concrete/14 bg-ink-deep/88 lg:grid-cols-[minmax(0,2.18fr)_minmax(330px,0.96fr)]">
        <div className="relative min-h-[360px] overflow-hidden border-b border-concrete/18 lg:border-r lg:border-b-0">
          <Image src="/csn-central.jpg" alt="Escritorio central da CSN em Volta Redonda" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,12,14,0.92)_0%,rgba(12,16,18,0.68)_42%,rgba(13,18,22,0.16)_100%)]" />
          <div className="absolute inset-0 tt-noise opacity-60" />
          <div className="relative z-10 flex min-h-[360px] max-w-3xl flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-signal">Observatorio popular urbano</p>
            <h1 className="font-display text-[3.05rem] uppercase leading-[0.98] tracking-[0.07em] text-paper sm:text-[3.55rem] lg:text-[3.65rem] xl:text-[3.85rem]">
              Mapear. Documentar. Agir.
              <span className="block">O territorio e nosso.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-6 text-paper/82 sm:text-base">
              Mapeamos, documentamos e ativamos a disputa social sobre os imoveis ligados a CSN em Volta Redonda. Memoria, prova
              documental, leitura territorial e acao coletiva.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/mapa" className="tt-button tt-button-primary min-w-40 text-xs">
                Abrir mapa
              </Link>
              <Link href="/imoveis" className="tt-button tt-button-secondary min-w-40 text-xs">
                Ver imoveis
              </Link>
            </div>
          </div>
        </div>

        <aside className="tt-rule-grid bg-ink-alt/42">
          <div className="border-b border-concrete/14 px-6 py-6 lg:px-7">
            <p className="mb-5 text-[11px] font-black uppercase tracking-[0.24em] text-signal">Situacao geral</p>
            <div className="grid grid-cols-2 border border-concrete/10">
              {situation.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className={cn("min-h-24 border-concrete/10 p-5", index % 2 === 0 ? "border-r" : "", index < 2 ? "border-b" : "")}>
                    <div className="flex items-center gap-4">
                      <Icon className={cn("h-8 w-8", item.alert ? "text-rust-light" : "text-glass/78")} strokeWidth={1.8} />
                      <div>
                        <p className="font-display text-4xl leading-none tracking-[0.08em] text-paper">{item.value}</p>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-paper/62">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link href="/bairros" className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-paper/78 hover:text-signal">
              Ver observatorio completo <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </section>

      <section className="grid border-x border-t border-concrete/14 bg-ink-deep/92 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <div className="flex flex-wrap items-center gap-3 border-b border-concrete/14 px-5 py-4">
            <button
              type="button"
              onClick={clearFilters}
              className={cn("h-9 border px-4 text-[11px] font-black uppercase tracking-[0.16em] transition", activeFilterCount ? "border-signal bg-signal text-ink-deep" : "border-signal/70 text-signal")}
            >
              Todos
            </button>
            <select value={criticality} onChange={(event) => setCriticality(event.target.value)} className="tt-filter">
              <option value="todos">Criticidade: todos</option>
              <option value="alta">Criticidade: alta</option>
              <option value="media">Criticidade: media</option>
              <option value="baixa">Criticidade: baixa</option>
            </select>
            <select value={bairro} onChange={(event) => setBairro(event.target.value)} className="tt-filter">
              <option value="todos">Bairro: todos</option>
              {neighborhoods.map((item) => (
                <option key={item.id} value={item.slug}>
                  Bairro: {item.name}
                </option>
              ))}
            </select>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="tt-filter">
              <option value="todos">Status: todos</option>
              <option value="vazio">Vazio</option>
              <option value="em-disputa">Em disputa</option>
              <option value="uso-institucional">Uso institucional</option>
            </select>
            <button type="button" onClick={clearFilters} className="h-9 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-paper/50 hover:text-paper">
              X limpar filtros
            </button>
          </div>

          <div className="relative min-h-[270px] overflow-hidden border-b border-concrete/14 bg-[#111719]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_43%_50%,rgba(47,79,89,0.42),transparent_15%),linear-gradient(35deg,transparent_0_48%,rgba(130,140,134,0.18)_49%_50%,transparent_51%),linear-gradient(150deg,transparent_0_58%,rgba(130,140,134,0.14)_59%_60%,transparent_61%)]" />
            <div className="absolute inset-0 tt-map-grid opacity-80" />
            <div className="absolute left-5 top-24 z-10 grid border border-concrete/22 bg-black/55 text-paper">
              <button className="h-7 w-7 border-b border-concrete/20 text-lg">+</button>
              <button className="h-7 w-7 text-lg">-</button>
            </div>
            {mapPins.map((pin) => (
              <div key={pin.label} className="absolute z-10" style={{ left: pin.left, top: pin.top }}>
                <div
                  className={cn(
                    "h-4 w-4 rotate-45 border-2 bg-ink-deep/85",
                    pin.tone === "yellow" && "border-signal",
                    pin.tone === "rust" && "border-rust-light",
                    pin.tone === "blue" && "border-glass",
                  )}
                />
              </div>
            ))}
            {["Vila Santa Cecilia", "Bela Vista", "Monte Castelo", "Santa Rita do Zarur", "Aterrado"].map((label, index) => (
              <span
                key={label}
                className="absolute z-10 max-w-28 text-[11px] font-black uppercase leading-4 tracking-[0.12em] text-paper drop-shadow"
                style={{
                  left: ["24%", "35%", "54%", "70%", "78%"][index],
                  top: ["32%", "43%", "55%", "24%", "49%"][index],
                }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid border-b border-concrete/14 bg-concrete/10 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex min-h-24 items-center gap-4 border-r border-concrete/12 px-5 py-4 last:border-r-0">
                  <Icon className="h-8 w-8 text-paper/52" strokeWidth={1.7} />
                  <div>
                    <p className="font-display text-4xl leading-none tracking-[0.08em] text-paper">{item.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-paper/78">{item.label}</p>
                    <p className="text-[10px] text-paper/48">{item.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="border-l border-concrete/14 bg-[#181b1c]/94 px-6 py-5">
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-signal">Legenda de criticidade</p>
          <div className="space-y-3 border-b border-concrete/12 pb-5">
            {[
              ["Criticidade alta", "border-rust-light"],
              ["Criticidade media", "border-rust"],
              ["Em disputa", "border-signal"],
              ["Criticidade baixa", "border-glass"],
              ["Sem dados", "border-paper/50"],
            ].map(([label, tone]) => (
              <div key={label} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.14em] text-paper/64">
                <span className={cn("h-3 w-3 rotate-45 border-2", tone)} />
                {label}
              </div>
            ))}
          </div>
          <p className="mb-4 mt-5 text-[11px] font-black uppercase tracking-[0.24em] text-signal">Filtros rapidos</p>
          <div className="space-y-3">
            {quickFilters.map((filter) => (
              <label key={filter} className="flex cursor-pointer items-center gap-3 text-[11px] font-bold uppercase tracking-[0.13em] text-paper/62">
                <input
                  type="checkbox"
                  checked={checkedFilters.includes(filter)}
                  onChange={() => toggleQuickFilter(filter)}
                  className="h-3.5 w-3.5 appearance-none border border-paper/60 bg-transparent checked:border-signal checked:bg-signal"
                />
                {filter}
              </label>
            ))}
          </div>
          <Link href="/mapa" className="mt-14 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-paper/70 hover:text-signal">
            X ver mapa completo <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </section>

      <section className="grid border-x border-t border-concrete/14 bg-[#121516] lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.9fr)]">
        <div className="border-b border-concrete/14 px-5 py-5 lg:border-r lg:border-b-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-signal">Imoveis em destaque</p>
            <Link href="/imoveis" className="text-[10px] font-black uppercase tracking-[0.2em] text-paper/70 hover:text-signal">
              Ver todos <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((item, index) => (
              <article key={item.title} className="border border-concrete/14 bg-ink-deep/80">
                <div className="relative h-32 overflow-hidden">
                  <Image src="/csn-central.jpg" alt="" fill className="object-cover" sizes="(min-width: 1280px) 25vw, 50vw" />
                  <div className="absolute inset-0 bg-black/35 grayscale" />
                </div>
                <div className="p-3">
                  <span
                    className={cn(
                      "inline-flex border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em]",
                      item.tone === "rust" && "border-rust-light text-rust-light",
                      item.tone === "orange" && "border-rust text-rust-light",
                      item.tone === "yellow" && "border-signal text-signal",
                      item.tone === "blue" && "border-glass text-glass",
                    )}
                  >
                    {item.tag}
                  </span>
                  <h2 className="mt-2 min-h-12 font-display text-xl uppercase leading-6 tracking-[0.08em] text-paper">{item.title}</h2>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-paper/56">{item.place}</p>
                  <div className="mt-4 flex gap-4 text-paper/52">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <MessageCircle className="h-4 w-4" /> {item.comments}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Hand className="h-4 w-4" /> {item.actions + index}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[12px] font-black uppercase tracking-[0.24em] text-signal">Agir agora</p>
            <Link href="/agir" className="text-[10px] font-black uppercase tracking-[0.2em] text-paper/70 hover:text-signal">
              Ver todas as acoes <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-4">
            <article className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="relative min-h-36 overflow-hidden border border-concrete/14">
                <Image src="/csn-central.jpg" alt="" fill className="object-cover" sizes="160px" />
                <div className="absolute inset-0 bg-ink-deep/28" />
                <p className="absolute left-3 top-3 max-w-28 font-display text-xl uppercase leading-5 tracking-[0.05em] text-paper">
                  Reabertura Clube CSN Santa Cecilia
                </p>
              </div>
              <div className="border-b border-concrete/12 pb-4">
                <span className="border border-signal px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-signal">Campanha</span>
                <h3 className="mt-2 font-display text-2xl uppercase leading-6 tracking-[0.08em] text-paper">Reabertura popular do Clube CSN Santa Cecilia</h3>
                <p className="mt-2 text-sm leading-5 text-paper/66">Pressao publica para transformar abandono em pauta coletiva e abrir caminho para uso social do espaco.</p>
                <div className="mt-4 h-1 bg-concrete/16">
                  <div className="h-full w-[78%] bg-signal" />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-paper/52">
                  <span>127 apoiam</span>
                  <span className="font-black text-signal">78%</span>
                </div>
              </div>
            </article>
            <article className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <div className="relative min-h-28 overflow-hidden border border-concrete/14">
                <Image src="/csn-central.jpg" alt="" fill className="object-cover object-left" sizes="160px" />
                <div className="absolute inset-0 bg-black/45" />
              </div>
              <div>
                <span className="border border-rust-light px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-rust-light">Mutirao</span>
                <h3 className="mt-2 font-display text-xl uppercase leading-6 tracking-[0.08em] text-paper">Mutirao de memoria e prova</h3>
                <p className="mt-1 text-sm leading-5 text-paper/66">Chamado para reunir fotos, relatos e documentos sobre os imoveis da CSN.</p>
                <p className="mt-3 text-[11px] text-paper/52">{propertyReports.length * properties.length + 15} participantes</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <footer className="grid items-center gap-4 border border-concrete/14 bg-concrete/10 px-6 py-5 text-[11px] uppercase tracking-[0.16em] text-paper/54 sm:grid-cols-[auto_1fr_auto]">
        <span className="inline-flex h-11 w-16 items-center justify-center border border-signal/65 text-signal">
          <Eye className="h-5 w-5" />
        </span>
        <p>
          <strong className="block text-paper/70">Observatorio popular urbano independente</strong>
          Mapeamento colaborativo · memoria coletiva · acao territorial
        </p>
        <div className="flex flex-wrap gap-5 text-paper/58">
          <Link href="/bairros">Sobre</Link>
          <Link href="/mapa">Dados</Link>
          <Link href="/enviar">Contato</Link>
        </div>
      </footer>
    </div>
  );
}
