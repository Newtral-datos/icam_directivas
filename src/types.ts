export type ClaseDias = "positivo" | "cercano" | "negativo";

export interface DirectivaCsvRow {
  Titulo: string;
  Directiva: string;
  Fecha_Limite: string; // dd/mm/yyyy
  DIAS?: string;
  Enlace: string;
  Nombre: string;
  Categoria: string;
  URL_imagen: string;
  Fecha_13?: string;
}

export interface DirectivaItem {
  id: string;
  titulo: string;                 // título principal
  directiva: string;              // código/número de directiva
  fecha: string;                  // dd/mm/yyyy
  enlace: string;                 // enlace al DOUE
  nombre: string;                 // <- usado en tooltip de la columna Título
  categoria: string;
  foto: string;                   // URL de la categoría
  diasRestantes: number;
  className: ClaseDias;
  tipoNorma?: string;             // tipo de norma (opcional)
  categoriaExtra?: string;        // categoría extendida (opcional)
  estatus?: string;               // (si lo necesitas en otro lado)
  adaptacionNacional?: string;    // valor mostrado en la columna Adaptación nacional
  iniciativaLegislativa?: string; // <- usado en tooltip de Adaptación nacional
}
