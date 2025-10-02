import type { DirectivaItem } from "../types";
import { formatNumber } from "../utils";

interface Props {
  item: DirectivaItem;
  onHover: (payload: {x:number;y:number;content:string;border:'positivo'|'cercano'|'negativo'|'default'}) => void;
  onLeave: () => void;
}

export default function Card({ item, onHover, onLeave }: Props) {
  const diasTexto = item.diasRestantes < 0 ? "días caducada" : "días de margen";

  return (
    <div
      className={`card ${item.className}`}
      data-nombre={item.nombre}
      data-foto={item.foto}
      onMouseMove={(e) =>
        onHover({
          x: e.pageX,
          y: e.pageY,
          content: item.nombre,
          border: item.className ?? "default"
        })
      }
      onMouseLeave={onLeave}
    >
      <div className="card-img-container">
        <img src={item.foto} alt="Imagen" className="card-img" />
      </div>

      <div className="dias-restantes">
        <span className="numero-dias">{formatNumber(Math.abs(item.diasRestantes))}</span>
        <div className="texto-dias">{diasTexto}</div>
      </div>

      <div className="contenido">
        <div className="titulo">{item.titulo}</div>

        <div className="directiva">
          Directiva:{" "}
          <a href={item.enlace} target="_blank" rel="noreferrer">
            {item.directiva}
          </a>
        </div>

        {/* ---- Datos de la segunda hoja (solo si existen) ---- */}
        {item.tipoNorma && (
          <div className="meta"><strong>Tipo de norma:</strong> {item.tipoNorma}</div>
        )}
        {item.categoriaExtra && (
          <div className="meta"><strong>Categoría:</strong> {item.categoriaExtra}</div>
        )}
        {item.estatus && (
          <div className="meta"><strong>Estatus:</strong> {item.estatus}</div>
        )}
        <div className="fecha">Fecha límite de transposición: {item.fecha}</div>
      </div>
    </div>
  );
}
