import { useEffect, useMemo, useState } from "react";
import { csvParse, csvParseRows } from "d3-dsv";
import type { DirectivaCsvRow, DirectivaItem } from "../types";
import { calculateDaysDifference, getDaysClass, normalizeText } from "../utils";

const URL_DATA =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQO7ej_2XDWLJjjU3IEpnWbqyIZ0rqEU5bxcgfeIeq-I04aHtpGHqCLDI0npgYkRFJgv9ciCVbVSYVo/pub?gid=1913014281&single=true&output=csv";
const URL_EXTRA =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQO7ej_2XDWLJjjU3IEpnWbqyIZ0rqEU5bxcgfeIeq-I04aHtpGHqCLDI0npgYkRFJgv9ciCVbVSYVo/pub?gid=1792225526&single=true&output=csv";
const URL_META =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDjBBwREsDHYRK2H6gqEWJn1_c_rqp9D_9ox_0V_bZsjr-VhrKTWRWWt7hjzmbKj4gnHw5ttb1dcL_/pub?gid=962291375&single=true&output=csv";

export function useDirectivasData() {
  const [items, setItems] = useState<DirectivaItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("Cargando…");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        // --- META: última actualización ---
        const metaText = await fetch(URL_META).then((r) => r.text());
        const rows = csvParseRows(metaText);
        if (!cancelled) {
          setLastUpdate(rows[1] && rows[1][0] ? rows[1][0] : "Sin dato");
        }

        // --- DATA: hoja principal ---
        const csvText = await fetch(URL_DATA).then((r) => r.text());
        const raw = csvParse(csvText) as unknown as DirectivaCsvRow[];

        // --- EXTRA: hoja con info adicional (incluye Iniciativa legislativa) ---
        const extraText = await fetch(URL_EXTRA).then((r) => r.text());
        const extraRows = csvParse(extraText) as any[];

        // Helper para leer un campo con posibles variantes de cabecera
        const pick = (r: any, ...keys: string[]) => {
          for (const k of keys) {
            if (r[k] != null && String(r[k]).trim() !== "") {
              return String(r[k]).trim();
            }
          }
          return "";
        };

        // Mapa normalizado: Directiva -> info extra
        // Incluye iniciativaLegislativa para "Adaptación nacional"
        const extraMap = new Map(
          extraRows.map((r) => {
            const key = normalizeText(pick(r, "Directiva", "directiva"));
            return [
              key,
              {
                tipoNorma: pick(
                  r,
                  "Tipo de norma",
                  "Tipo de Norma",
                  "tipo de norma",
                  "Tipo_de_norma",
                  "Tipo"
                ),
                categoriaExtra: pick(
                  r,
                  "Categoría",
                  "Categoria",
                  "categoría",
                  "categoria",
                  "CategoriaExtra",
                  "Categoría extra"
                ),
                estatus: pick(r, "Estatus", "estatus"),
                iniciativaLegislativa: pick(
                  r,
                  "Iniciativa legislativa",
                  "Iniciativa Legislativa",
                  "iniciativa legislativa",
                  "Iniciativa_legislativa"
                ),
              },
            ] as const;
          })
        );

        // Filtro: solo filas con Fecha_13 no vacía (tu regla actual)
        const filtered = raw.filter((d) => (d.Fecha_13 ?? "").trim() !== "");

        // Join + mapeo a DirectivaItem
        const mapped: DirectivaItem[] = filtered.map((d, index) => {
          const diasRestantes = calculateDaysDifference(d.Fecha_Limite);
          const className = getDaysClass(diasRestantes);

          const directivaKey = normalizeText(d.Directiva ?? "");
          const extra = extraMap.get(directivaKey);

          const iniciativaLegislativa = extra?.iniciativaLegislativa || "";

          return {
            id: `item-${index}`,
            titulo: d.Titulo,
            directiva: d.Directiva,
            fecha: d.Fecha_Limite,
            enlace: d.Enlace,
            nombre: d.Nombre,
            categoria: d.Categoria,
            foto: d.URL_imagen,
            diasRestantes,
            className,
            tipoNorma: extra?.tipoNorma || "",
            categoriaExtra: extra?.categoriaExtra || "",
            estatus: extra?.estatus || "",
            // Adaptación nacional muestra "Iniciativa legislativa" cuando hay match
            adaptacionNacional: iniciativaLegislativa || "—",
            iniciativaLegislativa: iniciativaLegislativa || undefined,
          };
        });

        if (!cancelled) {
          setItems(mapped);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error al cargar datos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.foto).filter(Boolean));
    return Array.from(set);
  }, [items]);

  return { items, lastUpdate, loading, error, categories };
}
