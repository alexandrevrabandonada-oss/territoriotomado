import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils/cn";

interface EcosystemLinksProps {
  missionUrl?: string | null;
  communityUrl?: string | null;
  dossierUrl?: string | null;
  externalReferenceUrl?: string | null;
  title?: string;
  description?: string;
  layout?: "grid" | "inline";
  className?: string;
}

const links = [
  {
    key: "missionUrl",
    label: "Entrar na frente",
    description: "Abrir o ponto de ação ligado a este imóvel.",
    variant: "primary" as const,
    external: false,
  },
  {
    key: "dossierUrl",
    label: "Ver dossiê",
    description: "Consultar a base documental do caso.",
    variant: "secondary" as const,
    external: false,
  },
  {
    key: "communityUrl",
    label: "Ir para comunidade",
    description: "Sair do imóvel para a rede que o sustenta.",
    variant: "secondary" as const,
    external: false,
  },
  {
    key: "externalReferenceUrl",
    label: "Ver referência externa",
    description: "Abrir a referência ligada fora do produto.",
    variant: "ghost" as const,
    external: true,
  },
] as const;

export function EcosystemLinks({
  missionUrl,
  communityUrl,
  dossierUrl,
  externalReferenceUrl,
  title = "Ganchos de ecossistema",
  description = "Conexões opcionais para articular o imóvel com outros apps sem fundir as bases.",
  layout = "grid",
  className,
}: EcosystemLinksProps) {
  const urls = {
    missionUrl,
    communityUrl,
    dossierUrl,
    externalReferenceUrl,
  };

  const items = links
    .map((item) => ({
      ...item,
      href: urls[item.key as keyof typeof urls] ?? null,
    }))
    .filter((item): item is (typeof links)[number] & { href: string } => Boolean(item.href));

  if (items.length === 0) {
    return null;
  }

  if (layout === "inline") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {items.map((item) => (
          <ButtonLink
            key={item.key}
            href={item.href}
            variant={item.variant}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            className="text-xs"
          >
            {item.label}
          </ButtonLink>
        ))}
      </div>
    );
  }

  return (
    <section className={cn("border border-paper/10 bg-paper/5 p-5 sm:p-6", className)}>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-signal">{title}</p>
        <p className="text-sm leading-6 text-paper/65">{description}</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.key} className="border border-paper/10 bg-ink/35 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-paper">{item.label}</h3>
            <p className="mt-2 text-sm leading-6 text-paper/65">{item.description}</p>
            <ButtonLink
              href={item.href}
              variant={item.variant}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className="mt-4 w-full"
            >
              Abrir
            </ButtonLink>
          </article>
        ))}
      </div>
    </section>
  );
}
