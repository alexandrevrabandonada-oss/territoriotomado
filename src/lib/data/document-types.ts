export const documentTypeOptions = [
  { value: "inventario", label: "Inventario" },
  { value: "memoria", label: "Memoria" },
  { value: "fundiario", label: "Fundiario" },
  { value: "analise territorial", label: "Analise territorial" },
  { value: "oficio", label: "Oficio" },
  { value: "projeto", label: "Projeto" },
  { value: "foto", label: "Foto" },
  { value: "outro", label: "Outro" },
] as const;

export function getDocumentTypeLabel(value: string) {
  return documentTypeOptions.find((option) => option.value === value)?.label ?? value;
}
