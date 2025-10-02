import { useMemo, useState } from "react";
import "./styles.css";
import { useDirectivasData } from "./hooks/useDirectivasData";
import SearchBar from "./components/SearchBar";
import CardGrid from "./components/CardGrid";
import LoadingScreen from "./components/LoadingScreen";
import icamLogo from "./assets/icam_logo.png";
import newtralLogo from "./assets/newtral_ancho.png";

type FilterType = "todas" | "retrasadas" | "poco-tiempo" | "con-margen";
type SortOrder = "asc" | "desc";

const CATEGORY_OPTIONS = [
  { url: "todas", texto: "Mostrar todas las categorías", icon: "https://cdn.parlamentia.newtral.es/images/categories/otros.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/educacion.svg", texto: "Educación", icon: "https://cdn.parlamentia.newtral.es/images/categories/educacion.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/transicion-ecologica.svg", texto: "Transición Ecológica", icon: "https://cdn.parlamentia.newtral.es/images/categories/transicion-ecologica.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/interior-y-defensa.svg", texto: "Interior y Defensa", icon: "https://cdn.parlamentia.newtral.es/images/categories/interior-y-defensa.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/derechos-fundamentales-y-regeneracion-democratica.svg", texto: "Derechos fundamentales y Regeneración democrática", icon: "https://cdn.parlamentia.newtral.es/images/categories/derechos-fundamentales-y-regeneracion-democratica.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/igualdad.svg", texto: "Igualdad", icon: "https://cdn.parlamentia.newtral.es/images/categories/igualdad.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/economia.svg", texto: "Economía", icon: "https://cdn.parlamentia.newtral.es/images/categories/economia.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/agricultura-pesca-y-alimentacion.svg", texto: "Agricultura, Pesca y Alimentación", icon: "https://cdn.parlamentia.newtral.es/images/categories/agricultura-pesca-y-alimentacion.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/politica-territorial-y-administracion-publica.svg", texto: "Política Territorial y Administración Pública", icon: "https://cdn.parlamentia.newtral.es/images/categories/politica-territorial-y-administracion-publica.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/trabajo-inclusion-y-migraciones.svg", texto: "Trabajo, Inclusión y Migraciones", icon: "https://cdn.parlamentia.newtral.es/images/categories/trabajo-inclusion-y-migraciones.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/internacional-y-politica-exterior.svg", texto: "Internacional y Política Exterior", icon: "https://cdn.parlamentia.newtral.es/images/categories/internacional-y-politica-exterior.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/hacienda.svg", texto: "Hacienda", icon: "https://cdn.parlamentia.newtral.es/images/categories/hacienda.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/movilidad-y-vivienda.svg", texto: "Movilidad y Vivienda", icon: "https://cdn.parlamentia.newtral.es/images/categories/movilidad-y-vivienda.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/sanidad-y-consumo.svg", texto: "Sanidad y Consumo", icon: "https://cdn.parlamentia.newtral.es/images/categories/sanidad-y-consumo.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/ciencia-y-tecnologia.svg", texto: "Ciencia y Tecnología", icon: "https://cdn.parlamentia.newtral.es/images/categories/ciencia-y-tecnologia.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/politica-social.svg", texto: "Política Social", icon: "https://cdn.parlamentia.newtral.es/images/categories/politica-social.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/cultura-y-deporte.svg", texto: "Cultura y Deporte", icon: "https://cdn.parlamentia.newtral.es/images/categories/cultura-y-deporte.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/industria-turismo-y-comercio.svg", texto: "Industria, Turismo y Comercio", icon: "https://cdn.parlamentia.newtral.es/images/categories/industria-turismo-y-comercio.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/justicia.svg", texto: "Justicia", icon: "https://cdn.parlamentia.newtral.es/images/categories/justicia.svg" },
  { url: "https://cdn.parlamentia.newtral.es/images/categories/otros.svg", texto: "Otros", icon: "https://cdn.parlamentia.newtral.es/images/categories/otros.svg" }
];

export default function App() {
  const { items, lastUpdate, loading, error } = useDirectivasData();

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("todas");
  const [categoryUrl, setCategoryUrl] = useState<string>("todas");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const categoryOptions = useMemo(() => CATEGORY_OPTIONS, []);

  // === BLOQUEA la UI mientras carga ===
  if (loading) {
    return <LoadingScreen />;
  }  

  if (error) {
    return (
      <div className="page">
        <p style={{ textAlign: "center", color: "#b00020" }}>
          Error al cargar datos: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Logos arriba */}
      <header className="app-header">
        <img src={icamLogo} alt="ICAM" className="logo left" />
        <img src={newtralLogo} alt="Newtral" className="logo right" />
      </header>

      {/* Textos debajo */}
      <div className="last-update">Aplicación en proceso</div>
      <div className="last-update">Desarrollado con React y TypeScript</div>
      <div className="last-update">Datos de: {lastUpdate}</div>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        onSortAsc={() => setSortOrder("asc")}
        onSortDesc={() => setSortOrder("desc")}
        categoryOptions={categoryOptions}
        categoryUrl={categoryUrl}
        onCategoryChange={setCategoryUrl}
      />

      <CardGrid
        items={items}
        query={query}
        filterType={filterType}
        categoryUrl={categoryUrl}
        sortOrder={sortOrder}
      />
    </div>
  );
}
