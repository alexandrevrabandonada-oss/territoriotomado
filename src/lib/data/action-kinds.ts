import type { PropertyActionKind } from "@/types/domain";

export const actionKindLabels: Record<PropertyActionKind, string> = {
  campanha: "Campanha",
  plenaria: "Plenaria",
  mutirao: "Mutirao",
  "abaixo-assinado": "Abaixo-assinado",
  "protocolo-requerimento": "Protocolo / requerimento",
  "reuniao-territorial": "Reuniao territorial",
  ato: "Ato",
  oficina: "Oficina",
};

export function getActionKindLabel(kind: string) {
  return actionKindLabels[kind as PropertyActionKind] ?? kind;
}
