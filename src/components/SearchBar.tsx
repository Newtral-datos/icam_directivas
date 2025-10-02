// src/components/SearchBar.tsx
import CategoryDropdown from "./CategoryDropdown";

type FilterType = "todas" | "retrasadas" | "poco-tiempo" | "con-margen";

interface CategoryOption {
  url: string;
  texto: string;
  icon: string;
}

interface Props {
  query: string;
  onQueryChange: (q: string) => void;

  filterType: FilterType;
  onFilterTypeChange: (t: FilterType) => void;

  onSortAsc: () => void;
  onSortDesc: () => void;

  /** Selector de categorías (usa tu CategoryDropdown) */
  categoryOptions: CategoryOption[];
  categoryUrl: string;
  onCategoryChange: (c: string) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  filterType,
  onFilterTypeChange,
  onSortAsc,
  onSortDesc,
  categoryOptions,
  categoryUrl,
  onCategoryChange,
}: Props) {
  return (
    <div className="search-bar">
      {/* Fila 1: buscador centrado */}
      <div className="search-row">
        <input
          type="text"
          placeholder="Buscar por título, directiva o fecha..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Buscar"
        />
      </div>

      {/* Fila 2: filtro tiempo + selector de categorías + botones ordenar */}
      <div className="controls-row">
        <select
          aria-label="Filtrar tarjetas"
          value={filterType}
          onChange={(e) =>
            onFilterTypeChange(e.target.value as FilterType)
          }
        >
          <option value="todas">Todas las tarjetas</option>
          <option value="retrasadas">Caducadas</option>
          <option value="poco-tiempo">Poco tiempo</option>
          <option value="con-margen">Con margen</option>
        </select>

        <CategoryDropdown
          options={categoryOptions}
          value={categoryUrl}
          onChange={onCategoryChange}
        />

        <button className="sort-button" type="button" onClick={onSortAsc}>
          Días restantes ↑
        </button>
        <button className="sort-button" type="button" onClick={onSortDesc}>
          Días restantes ↓
        </button>
      </div>
    </div>
  );
}
