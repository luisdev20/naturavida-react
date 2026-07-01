import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/productoService';
import { useCarrito } from '../context/CarritoContext';

export default function Ofertas() {
  const [productosOferta, setProductosOferta] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ visible: false, mensaje: '' });
  const { agregarItem } = useCarrito();
  const fechaActual = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    setCargando(true);
    getProductos()
      .then((res) => {
        const ofertados = res.data
          .filter((_, i) => i % 3 === 0 || i % 5 === 0)
          .slice(0, 6)
          .map((p) => ({ ...p, descuento: 30, precioOriginal: p.precio }));
        setProductosOferta(ofertados);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const calcularPrecioConDescuento = (precio, descuento) =>
    (precio * (1 - descuento / 100)).toFixed(2);

  const mostrarToast = (msg) => {
    setToast({ visible: true, mensaje: msg });
    setTimeout(() => setToast({ visible: false, mensaje: '' }), 2500);
  };

  const handleAgregarCarrito = async (producto, e) => {
    e.preventDefault();
    try {
      await agregarItem(producto, 1);
      mostrarToast(`"${producto.nombre}" agregado al carrito ✓`);
    } catch {
      mostrarToast('Error al agregar');
    }
  };

  return (
    <>
      {toast.visible && <div className="toast-msg">{toast.mensaje}</div>}
      <div className="pt-[70px] min-h-screen bg-bg-light">


        <section style={{ background: 'linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)' }} className="text-white text-center py-20 px-6">
          <h1 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold mb-3">Ofertas Especiales</h1>
          <p className="text-white/80 text-lg mb-2">¡Aprovecha nuestros descuentos por tiempo limitado!</p>
          <p className="text-accent text-sm font-medium">Válido hasta: {fechaActual}</p>
        </section>

        <div className="max-w-[1200px] mx-auto px-6 py-12">
          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-[20px] overflow-hidden">
                  <div className="skeleton h-[240px]" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-3 w-1/3 rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : productosOferta.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-4">No hay ofertas disponibles en este momento.</p>
              <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productosOferta.map((producto) => (
                <div key={producto.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-primary/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,106,79,0.12)] group">

                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      -{producto.descuento}%
                    </div>
                    <Link to={`/producto/${producto.id}`} className="block overflow-hidden h-[240px]">
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                      />
                    </Link>
                  </div>
                  <div className="p-5">
                    <span className="text-[0.72rem] text-gray-400 uppercase tracking-[0.08em] font-semibold">{producto.marca}</span>
                    <h3 className="text-base font-semibold text-natura-dark mt-1 mb-1">{producto.nombre}</h3>
                    <p className="text-[0.82rem] text-gray-400 mb-3">{producto.detalle}</p>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm text-gray-400 line-through">S/ {producto.precioOriginal.toFixed(2)}</span>
                      <span className="text-xl font-bold text-primary">
                        S/ {calcularPrecioConDescuento(producto.precioOriginal, producto.descuento)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAgregarCarrito(producto, e)}
                      className="w-full py-2.5 bg-primary text-white rounded-xl font-semibold text-sm border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark"
                    >
                      Añadir al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
