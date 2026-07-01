import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductoById } from '../services/productoService';
import { useCarrito } from '../context/CarritoContext';

const categoriaLabels = { capilar: 'Cuidado Capilar', piel: 'Cuidado de la Piel', insumos: 'Insumos Naturales' };

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tabActiva, setTabActiva] = useState('descripcion');
  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState({ visible: false, mensaje: '' });
  const { agregarItem } = useCarrito();

  useEffect(() => {
    setCargando(true);
    getProductoById(id)
      .then((res) => {
        setProducto(res.data);
        setCargando(false);
      })
      .catch(() => {
        setProducto(null);
        setCargando(false);
      });
  }, [id]);

  const cambiarCantidad = (delta) => {
    setCantidad((prev) => Math.max(1, prev + delta));
  };

  const mostrarToast = (msg) => {
    setToast({ visible: true, mensaje: msg });
    setTimeout(() => setToast({ visible: false, mensaje: '' }), 2500);
  };

  const handleAgregarCarrito = async () => {
    if (!producto) return;
    try {
      await agregarItem(producto, cantidad);
      mostrarToast(`"${producto.nombre}" agregado al carrito ✓`);
    } catch {
      mostrarToast('Error al agregar al carrito');
    }
  };

  const tabs = [
    { key: 'descripcion', label: 'Descripción' },
    { key: 'modo', label: 'Modo de uso' },
    { key: 'ingredientes', label: 'Ingredientes' },
  ];

  const tabContent = {
    descripcion: producto?.descripcion,
    modo: producto?.modoUso,
    ingredientes: producto?.ingredientes,
  };

  return (
    <>
      {toast.visible && <div className="toast-msg">{toast.mensaje}</div>}
      <div className="pt-[70px] min-h-screen bg-bg-light">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <Link to="/catalogo" className="inline-flex items-center gap-2 text-primary text-sm no-underline hover:underline mb-8">
            ← Volver al catálogo
          </Link>

          {cargando ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-gray-500">Cargando producto...</p>
            </div>
          ) : !producto ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">Producto no encontrado</h3>
              <Link to="/catalogo" className="btn-primary">Ver catálogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">

              <div>
                <div className="rounded-2xl overflow-hidden border border-primary/10 mb-4 bg-gray-50" style={{ aspectRatio: '1' }}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-contain p-6"
                  />
                </div>
                <div className="flex gap-2">
                  {['Natural', 'Cruelty-Free', 'Eco'].map((b) => (
                    <span key={b} className="px-3 py-1.5 bg-primary/8 text-primary text-xs font-semibold rounded-full border border-primary/20">
                      {b}
                    </span>
                  ))}
                </div>
              </div>


              <div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                  <Link to="/catalogo" className="no-underline text-gray-400 hover:text-primary">Productos</Link>
                  <span>/</span>
                  <Link to={`/catalogo?categoria=${producto.categoria}`} className="no-underline text-gray-400 hover:text-primary">
                    {categoriaLabels[producto.categoria] || producto.categoria}
                  </Link>
                  <span>/</span>
                  <span className="text-gray-600">{producto.nombre}</span>
                </div>

                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{producto.marca}</span>
                <h1 className="font-playfair text-3xl font-bold text-natura-dark mt-1 mb-1">{producto.nombre}</h1>
                <p className="text-gray-400 text-sm mb-5">{producto.detalle}</p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-primary">S/ {producto.precio.toFixed(2)}</span>
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full border border-green-100">En stock</span>
                </div>


                <div className="flex gap-1 border-b border-gray-100 mb-4">
                  {tabs.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setTabActiva(key)}
                      className={`px-4 py-2 text-sm font-medium border-none cursor-pointer bg-none font-poppins transition-all duration-200 border-b-2 -mb-px
                        ${tabActiva === key
                          ? 'text-primary border-primary'
                          : 'text-gray-400 border-transparent hover:text-gray-600'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 min-h-[60px]">
                  {tabContent[tabActiva]}
                </p>


                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-600">Cantidad</span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => cambiarCantidad(-1)}
                      className="px-4 py-2 text-lg text-gray-500 border-none bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    >−</button>
                    <span className="px-5 py-2 font-semibold text-natura-dark border-x border-gray-200">{cantidad}</span>
                    <button
                      onClick={() => cambiarCantidad(1)}
                      className="px-4 py-2 text-lg text-gray-500 border-none bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                    >+</button>
                  </div>
                </div>


                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={handleAgregarCarrito}
                    className="flex-1 min-w-[180px] flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-semibold text-sm border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark hover:-translate-y-0.5"
                    style={{ boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    Añadir al carrito
                  </button>
                  <Link
                    to="/carrito"
                    className="px-6 py-3 border-2 border-primary text-primary rounded-xl font-semibold text-sm no-underline text-center transition-all hover:bg-primary hover:text-white"
                  >
                    Ver carrito →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
