import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center bg-bg-light px-6">
      <div className="text-center max-w-md">
        <img
          src="/not-found-plant.png"
          alt="Página no encontrada"
          className="w-48 h-48 object-contain mx-auto mb-8"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="text-8xl font-bold text-primary/20 mb-2">404</div>
        <h1 className="font-playfair text-2xl font-bold text-natura-dark mb-3">Página no encontrada</h1>
        <p className="text-gray-400 mb-8">
          La página que buscas no existe o fue movida. Vuelve al inicio para encontrar lo que necesitas.
        </p>
        <Link to="/" className="btn-primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
