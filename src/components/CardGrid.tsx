import { useMemo, useState } from "react";
import type { DirectivaItem } from "../types";
import { normalizeText, formatNumber, getDaysClass } from "../utils";
import Tooltip from "./Tooltip";

type SortOrder = "asc" | "desc";

interface Props {
  items: DirectivaItem[];
  query: string;
  filterType: "todas" | "retrasadas" | "poco-tiempo" | "con-margen";
  categoryUrl: string;
  sortOrder: SortOrder;
}

type TooltipState = {
  x: number;
  y: number;
  visible: boolean;
  border: "positivo" | "cercano" | "negativo" | "default";
  content: string;
  label?: string;
};

export default function CardGrid({
  items,
  query,
  filterType,
  categoryUrl,
  sortOrder,
}: Props) {
  // filas abiertas (pueden ser varias)
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // filtro + orden
  const filtered = useMemo(() => {
    const q = normalizeText(query || "");
    const byText = (i: DirectivaItem) => {
      const t = normalizeText(i.titulo || "");
      const d = normalizeText(i.directiva || "");
      const f = normalizeText(i.fecha || "");
      return t.includes(q) || d.includes(q) || f.includes(q);
    };
    const byType = (i: DirectivaItem) => {
      if (filterType === "todas") return true;
      if (filterType === "retrasadas") return i.className === "negativo";
      if (filterType === "poco-tiempo") return i.className === "cercano";
      if (filterType === "con-margen") return i.className === "positivo";
      return true;
    };
    const byCategory = (i: DirectivaItem) =>
      categoryUrl === "todas" ? true : i.foto === categoryUrl;

    return items.filter((i) => byText(i) && byType(i) && byCategory(i));
  }, [items, query, filterType, categoryUrl]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const A = a.diasRestantes ?? 0;
      const B = b.diasRestantes ?? 0;
      return sortOrder === "asc" ? A - B : B - A;
    });
    return arr;
  }, [filtered, sortOrder]);

  // tooltip
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
    border: "default",
    content: "",
    label: "",
  });

  const showTip = (
    e: React.MouseEvent<HTMLElement>,
    content: string,
    clase: "positivo" | "cercano" | "negativo" | "default",
    label?: string
  ) => {
    setTooltip({
      x: e.pageX,
      y: e.pageY,
      visible: true,
      border: clase,
      content,
      label,
    });
  };
  const hideTip = () => setTooltip((t) => ({ ...t, visible: false }));

  // toggle fila expandida
  const toggleRow = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <section className="table-wrap" aria-label="Listado de directivas">
        <table className="data-table">
          <thead>
            <tr>
              <th className="col-estado" aria-label="Estado" />
              <th>Título</th>
              <th>Directiva</th>
              <th>Categoría</th>
              <th>Adaptación nacional</th>
              <th>Fecha límite</th>
              <th className="col-dias">Días</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((it) => {
              const key =
                (it as any).id ?? it.directiva ?? it.titulo ?? it.nombre;
              const dias = it.diasRestantes ?? 0;
              const clase = it.className ?? getDaysClass(dias);
              const estadoLabel =
                clase === "positivo"
                  ? "con margen"
                  : clase === "cercano"
                  ? "poco tiempo"
                  : "retrasada";
              const isOpen = expanded.has(String(key));

              return (
                <>
                  <tr key={key} className={`row ${clase}`}>
                    {/* Estado + botón mini (absoluto, no altera el layout) */}
                    <td className="col-estado">
                      <button
                        className="row-toggle"
                        onClick={() => toggleRow(String(key))}
                        aria-label={isOpen ? "Cerrar detalles" : "Ver detalles"}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                      <span
                        className={`dot ${clase}`}
                        aria-label={estadoLabel}
                        title={estadoLabel}
                      />
                    </td>

                    {/* Título (tooltip = Nombre) */}
                    <td
                      className="col-titulo"
                      onMouseMove={(e) =>
                        showTip(e, it.nombre || "", clase, "Directiva")
                      }
                      onMouseLeave={hideTip}
                    >
                      <div className="title">{it.titulo}</div>
                      {it.nombre && <div className="subtitle">{it.nombre}</div>}
                    </td>

                    {/* Directiva */}
                    <td className="col-codigo">
                      {it.enlace ? (
                        <a href={it.enlace} target="_blank" rel="noreferrer">
                          {it.directiva}
                        </a>
                      ) : (
                        <span>{it.directiva}</span>
                      )}
                    </td>

                    {/* Categoría */}
                    <td className="col-categoria">
                      {it.categoriaExtra || it.categoria || "—"}
                    </td>

                    {/* Adaptación nacional (tooltip = Iniciativa legislativa) */}
                    <td
                      className="col-adaptacion"
                      onMouseMove={(e) =>
                        it.iniciativaLegislativa
                          ? showTip(
                              e,
                              it.iniciativaLegislativa,
                              clase,
                              "Adaptación nacional"
                            )
                          : undefined
                      }
                      onMouseLeave={hideTip}
                    >
                      {it.adaptacionNacional || "—"}
                    </td>

                    {/* Fecha */}
                    <td className="col-fecha">{it.fecha || "—"}</td>

                    {/* Días */}
                    <td className="col-dias">
                      <span className={`pill ${clase}`}>
                        {formatNumber(dias)}
                      </span>
                      <div className="dias-label">
                        {dias < 0 ? "de retraso" : "de margen"}
                      </div>
                    </td>
                  </tr>

                  {/* Fila expandida (no modifica altura de la fila principal) */}
                  {isOpen && (
                    <tr className="expanded-row">
                      <td colSpan={7}>
                        <div className="expanded-content">
                          <h4>{it.titulo}</h4>
                          {it.nombre && (
                            <p>
                              <strong>Nombre:</strong> {it.nombre}
                            </p>
                          )}
                          <p>
                            <strong>Directiva:</strong> {it.directiva}
                          </p>
                          <p>
                            <strong>Categoría:</strong>{" "}
                            {it.categoriaExtra || it.categoria || "—"}
                          </p>
                          <p>
                            <strong>Tipo norma:</strong>{" "}
                            {it.tipoNorma || "—"}
                          </p>
                          <p>
                            <strong>Iniciativa legislativa:</strong>{" "}
                            {it.iniciativaLegislativa || "—"}
                          </p>
                          <p>
                            <strong>Fecha límite:</strong> {it.fecha || "—"}
                          </p>
                          <p>
                            <strong>Días restantes:</strong> {dias}
                          </p>
                          {it.enlace && (
                            <p>
                              <a
                                href={it.enlace}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Ver documento completo
                              </a>
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  No hay resultados con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <Tooltip
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
        border={tooltip.border}
        content={tooltip.content}
        label={tooltip.label}
      />
    </>
  );
}