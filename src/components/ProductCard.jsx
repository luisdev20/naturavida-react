import { Link } from 'react-router-dom';

export default function ProductCard({ producto, onAgregarCarrito }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 border border-primary/8 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,106,79,0.12)] group">
      <Link to={`/producto/${producto.id}`} className="relative block overflow-hidden h-[220px] no-underline">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
        />
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold capitalize bg-white/90 backdrop-blur-sm badge-${producto.categoria}`}>
          {producto.categoria}
        </span>
      </Link>
      <div className="p-5">
        <span className="text-[0.72rem] text-gray-400 uppercase tracking-[0.08em] font-semibold">{producto.marca}</span>
        <h4 className="text-[1rem] font-semibold text-natura-dark my-1.5 leading-snug">{producto.nombre}</h4>
        <p className="text-[0.82rem] text-gray-400 mb-3">{producto.detalle}</p>
        <div className="flex justify-between items-center">
          <span className="text-[1.15rem] font-bold text-primary">S/ {producto.precio.toFixed(2)}</span>
          <div className="flex gap-2">
            <Link
              to={`/producto/${producto.id}`}
              className="px-3 py-1.5 bg-primary/8 text-primary rounded-lg text-[0.82rem] font-semibold no-underline transition-all duration-200 hover:bg-primary hover:text-white"
            >
              Ver detalle
            </Link>
            {onAgregarCarrito && (
              <button
                onClick={(e) => onAgregarCarrito(producto, e)}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-[0.82rem] font-semibold border-none cursor-pointer font-poppins transition-all duration-200 hover:bg-primary-dark flex items-center gap-1"
                title="Añadir al carrito"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                Añadir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
