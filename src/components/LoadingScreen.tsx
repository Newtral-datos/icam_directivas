import logo from "../assets/icam_logo.png";


export default function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <img
          src={logo}
          alt="Ilustre Colegio de la Abogacía de Madrid"
          className="loading-logo"
        />
        <div className="spinner" aria-hidden="true" />
        <div className="loading-text">Cargando datos…</div>
      </div>
    </div>
  );
}