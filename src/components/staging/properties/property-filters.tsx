import { neighborhoods } from "@/lib/data/mock-data";
import type { Criticality, PropertyStatus } from "@/types/domain";

interface PropertyFiltersProps {
  currentStatus?: string;
  currentNeighborhood?: string;
  currentCriticality?: string;
}

const statuses: Array<PropertyStatus | "todos"> = ["todos", "ocupado", "vazio", "em-disputa", "uso-institucional"];
const criticalities: Array<Criticality | "todos"> = ["todos", "alta", "media", "baixa"];

export function PropertyFilters({ currentStatus, currentNeighborhood, currentCriticality }: PropertyFiltersProps) {
  return (
    <form className="grid gap-4 border border-paper/10 bg-paper/5 p-5 md:grid-cols-3">
      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
        Status
        <select
          name="status"
          defaultValue={currentStatus ?? "todos"}
          className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
        Bairro
        <select
          name="bairro"
          defaultValue={currentNeighborhood ?? "todos"}
          className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
        >
          <option value="todos">todos</option>
          {neighborhoods.map((neighborhood) => (
            <option key={neighborhood.id} value={neighborhood.id}>
              {neighborhood.name}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper/65">
        Criticidade
        <select
          name="criticidade"
          defaultValue={currentCriticality ?? "todos"}
          className="w-full border border-paper/10 bg-ink px-4 py-3 text-sm text-paper outline-none transition focus:border-signal"
        >
          {criticalities.map((criticality) => (
            <option key={criticality} value={criticality}>
              {criticality}
            </option>
          ))}
        </select>
      </label>
      <div className="md:col-span-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-none bg-signal px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-signal/85"
        >
          Aplicar leitura territorial
        </button>
      </div>
    </form>
  );
}