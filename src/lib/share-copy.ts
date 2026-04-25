import type { Criticality, PropertyActionKind, PropertyStatus } from "@/types/domain";

export function getPropertySharePhrase(status: PropertyStatus, criticality: Criticality) {
  const statusLine: Record<PropertyStatus, string> = {
    ocupado: "O uso nao apaga o conflito.",
    vazio: "O vazio tambem e disputa.",
    "em-disputa": "A disputa ja esta aberta.",
    "uso-institucional": "O publico precisa voltar ao publico.",
  };

  const criticalityLine: Record<Criticality, string> = {
    alta: "Prioridade maxima para leitura e acao.",
    media: "Recorte de atencao territorial.",
    baixa: "Manter o radar ligado.",
  };

  return `${statusLine[status]} ${criticalityLine[criticality]}`;
}

export function getActionSharePhrase(kind: PropertyActionKind, propertyTitle: string) {
  const kindLine: Record<PropertyActionKind, string> = {
    campanha: "Pressao publica para empurrar o processo.",
    plenaria: "Decisao coletiva antes do proximo passo.",
    mutirao: "Organizacao direta no territorio.",
    "abaixo-assinado": "Assinatura como forca politica.",
    "protocolo-requerimento": "Papel e protocolo para sair do impasse.",
    "reuniao-territorial": "Alinhamento do territorio em campo.",
    ato: "Presenca publica para marcar posição.",
    oficina: "Leitura compartilhada do problema.",
  };

  return `${kindLine[kind]} Frente ligada a ${propertyTitle}.`;
}

