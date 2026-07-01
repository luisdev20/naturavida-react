import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductos } from '../services/productoService';
import { useCarrito } from '../context/CarritoContext';

const categoriasConfig = [
  { slug: 'todas', label: 'Todas' },
  { slug: 'capilar', label: 'Capilar' },
  { slug: 'piel', label: 'Piel' },
  { slug: 'insumos', label: 'Insumos' },
];

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [categoriaActual, setCategoriaActual] = useState(searchParams.get('categoria') || 'todas');
  const [precioMaximo, setPrecioMaximo] = useState(60);
  const [marcasSeleccionadas, setMarcasSeleccionadas] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [toast, setToast] = useState({ visible: false, mensaje: '' });
  const { agregarItem } = useCarrito();

  useEffect(() => {
    setCargando(true);
    getProductos()
      .then((res) => {
        setProductos(res.data);
        const ms = [...new Set(res.data.map((p) => p.marca))];
        setMarcas(ms);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get('categoria') || 'todas';
    setCategoriaActual(cat);
  }, [searchParams]);

  useEffect(() => {
    filtrar();
  }, [productos, textoBusqueda, categoriaActual, precioMaximo, marcasSeleccionadas]);

  const filtrar = () => {
    let result = [...productos];
    if (categoriaActual && categoriaActual !== 'todas') {
      result = result.filter((p) => p.categoria === categoriaActual);
    }
    if (textoBusqueda.trim()) {
      const q = textoBusqueda.toLowerCase();
      result = result.filter((p) => p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q));
    }
    result = result.filter((p) => p.precio <= precioMaximo);
    if (marcasSeleccionadas.length > 0) {
      result = result.filter((p) => marcasSeleccionadas.includes(p.marca));
    }
    setProductosFiltrados(result);
  };

  const seleccionarCategoria = (slug) => {
    setCategoriaActual(slug);
    if (slug === 'todas') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: slug });
    }
  };

  const toggleMarca = (marca) => {
    setMarcasSeleccionadas((prev) =>
      prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca]
    );
  };

  const limpiarFiltros = () => {
    setTextoBusqueda('');
    setCategoriaActual('todas');
    setPrecioMaximo(60);
    setMarcasSeleccionadas([]);
    setSearchParams({});
  };

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
      <div className="pt-[70px] min-h-screen flex">


        <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white hidden lg:block">
          <div className="p-6 sticky top-[70px]">
            <h3 className="text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorías</h3>
            <ul className="list-none p-0 m-0 mb-6 space-y-1">
              {categoriasConfig.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => seleccionarCategoria(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border-none cursor-pointer font-poppins
                      ${categoriaActual === cat.slug || (cat.slug === 'todas' && (categoriaActual === 'todas' || !categoriaActual))
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-primary/8 hover:text-primary'
                      }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Filtro de precio */}
<div className="mb-6">
  <h3 className="text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider mb-3">
    Precio máximo
  </h3>
  <div className="px-2">
    <input
      type="range"
      min="0"
      max="60"
      step="5"
      value={precioMaximo}
      onChange={(e) => setPrecioMaximo(Number(e.target.value))}
      className="w-full accent-primary"
    />
    <div className="flex justify-between text-sm text-gray-500 mt-1">
      <span>S/ 0</span>
      <span>S/ {precioMaximo}</span>
    </div>
  </div>
</div>

            <h3 className="text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider mb-3">Precio máximo</h3>
            <div className="mb-6">
              <input
                type="range"
                min="0" max="60" step="5"
                value={precioMaximo}
                onChange={(e) => setPrecioMaximo(+e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>S/ 0</span>
                <span>S/ {precioMaximo}</span>
              </div>
            </div>

            <h3 className="text-[0.78rem] font-semibold text-gray-500 uppercase tracking-wider mb-3">Marca</h3>
            <div className="space-y-2 mb-6">
              {marcas.map((marca) => (
                <label key={marca} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marcasSeleccionadas.includes(marca)}
                    onChange={() => toggleMarca(marca)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-gray-600">{marca}</span>
                </label>
              ))}
            </div>

            <button
              onClick={limpiarFiltros}
              className="w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors cursor-pointer font-poppins bg-white"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>


        <main className="flex-1 p-6">

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap">
              {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>


          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 lg:hidden">
            {categoriasConfig.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => seleccionarCategoria(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border-none cursor-pointer font-poppins transition-all
                  ${categoriaActual === cat.slug || (cat.slug === 'todas' && (categoriaActual === 'todas' || !categoriaActual))
                    ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>


          {cargando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-[20px] overflow-hidden border border-primary/8">
                  <div className="skeleton h-[220px]" />
                  <div className="p-5 space-y-3">
                    <div className="skeleton h-3 w-1/3 rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
              <p className="text-gray-400 mb-6">Intenta ajustar los filtros</p>
              <button onClick={limpiarFiltros} className="btn-primary">Ver todos</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosFiltrados.map((p) => (
                <div key={p.id} className="bg-white rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] transition-all duration-300 border border-primary/8 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(45,106,79,0.12)] group">
                  <a href={`/producto/${p.id}`} className="relative block overflow-hidden h-[220px] no-underline" onClick={(e) => { e.preventDefault(); window.location.href = `/producto/${p.id}`; }}>
                    <img src={p.imagen} alt={p.nombre} loading="lazy" className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105" />
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold capitalize bg-white/90 backdrop-blur-sm badge-${p.categoria}`}>
                      {p.categoria}
                    </span>
                  </a>
                  <div className="p-5">
                    <span className="text-[0.72rem] text-gray-400 uppercase tracking-[0.08em] font-semibold">{p.marca}</span>
                    <h4 className="text-[1rem] font-semibold text-natura-dark my-1.5 leading-snug">{p.nombre}</h4>
                    <p className="text-[0.82rem] text-gray-400 mb-3">{p.detalle}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[1.15rem] font-bold text-primary">S/ {p.precio.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <a href={`/producto/${p.id}`} className="p-2 bg-primary/8 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                          </svg>
                        </a>
                        <button onClick={(e) => handleAgregarCarrito(p, e)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-[0.82rem] font-semibold border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                          </svg>
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
