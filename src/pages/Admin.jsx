import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getProductos,
  addProducto,
  updateProducto,
  deleteProducto,
} from '../services/productoService';
import { getCarritoAll, getUsuarios } from '../services/carritoService';

const categorias = ['capilar', 'piel', 'insumos'];
const marcasDisp = ['AlmaVerde', 'BioNatur', 'TerraVital'];

const formInicial = {
  nombre: '', detalle: '', precio: 0, categoria: 'capilar',
  marca: 'AlmaVerde', imagen: '', descripcion: '', modoUso: '', ingredientes: '',
};

export default function Admin() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState('overview');

  // Overview
  const [productos, setProductos] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [cargandoCarritos, setCargandoCarritos] = useState(false);

  // Form
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState(formInicial);

  // Toast
  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' });

  const adminNombre = currentUser?.nombre || 'Admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargandoMetricas(true);
    try {
      const [pRes, cRes, uRes] = await Promise.all([
        getProductos(),
        getCarritoAll(),
        getUsuarios(),
      ]);
      setProductos(pRes.data);
      setCarritos(cRes.data);
      setUsuarios(uRes.data);
    } catch {}
    setCargandoMetricas(false);
  };

  const mostrarToast = (msg, tipo = 'success') => {
    setToast({ visible: true, mensaje: msg, tipo });
    setTimeout(() => setToast({ visible: false, mensaje: '', tipo: 'success' }), 3000);
  };

  // Métricas
  const totalProductos = productos.length;
  const totalUsuarios = usuarios.length;
  const totalItemsCarrito = carritos.reduce((acc, i) => acc + (i.cantidad || 0), 0);
  const valorInventario = productos.reduce((acc, p) => acc + p.precio, 0);
  const productoMasCaro = productos.length ? productos.reduce((a, b) => a.precio > b.precio ? a : b) : null;
  const productoMasBarato = productos.length ? productos.reduce((a, b) => a.precio < b.precio ? a : b) : null;

  // Carritos agrupados
  const carritosAgrupados = Object.values(
    carritos.reduce((acc, item) => {
      const uid = item.usuarioId;
      if (!acc[uid]) acc[uid] = { usuarioId: uid, items: [], total: 0 };
      acc[uid].items.push(item);
      acc[uid].total += item.precio * item.cantidad;
      return acc;
    }, {})
  );
  const carritoMasGrande = carritosAgrupados.length
    ? carritosAgrupados.reduce((a, b) => a.items.length > b.items.length ? a : b)
    : null;

  // Distribución categorías
  const distribucionCategorias = categorias.map((nombre) => {
    const cantidad = productos.filter((p) => p.categoria === nombre).length;
    const porcentaje = totalProductos ? Math.round((cantidad / totalProductos) * 100) : 0;
    return { nombre, cantidad, porcentaje };
  });

  // CRUD
  const abrirNuevo = () => { setForm(formInicial); setEditando(false); setEditandoId(null); setMostrarFormulario(true); };
  const editarProducto = (p) => { setForm({ ...p }); setEditando(true); setEditandoId(p.id); setMostrarFormulario(true); };
  const cancelar = () => { setMostrarFormulario(false); setForm(formInicial); };

  const guardar = async () => {
    if (!form.nombre || !form.precio) { mostrarToast('Nombre y precio son requeridos', 'error'); return; }
    try {
      if (editando && editandoId) {
        await updateProducto(editandoId, form);
        mostrarToast('Producto actualizado correctamente');
      } else {
        await addProducto(form);
        mostrarToast('Producto creado correctamente');
      }
      cancelar();
      await cargarDatos();
    } catch {
      mostrarToast('Error al guardar el producto', 'error');
    }
  };

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"?`)) return;
    try {
      await deleteProducto(p.id);
      mostrarToast('Producto eliminado');
      await cargarDatos();
    } catch {
      mostrarToast('Error al eliminar', 'error');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { key: 'overview', label: 'Resumen', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { key: 'productos', label: 'Productos', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
    { key: 'carritos', label: 'Carritos', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg> },
  ];

  return (
    <>
      {toast.visible && (
        <div className={`toast-msg ${toast.tipo === 'error' ? 'toast-error' : ''}`}>{toast.mensaje}</div>
      )}
      <div className="pt-[70px] flex min-h-screen bg-gray-50">


        <aside className="w-64 bg-[#1a3d2b] text-white flex flex-col flex-shrink-0 hidden md:flex">
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="font-semibold text-sm">NaturaVida Admin</span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <p className="text-white/40 text-xs uppercase tracking-wider px-3 mb-3">Menú</p>
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setVistaActual(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border-none cursor-pointer font-poppins transition-all duration-200
                  ${vistaActual === key
                    ? 'bg-white/15 text-white'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
              >
                {icon}{label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {adminNombre[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{adminNombre}</p>
                <p className="text-xs text-white/40">Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-white/50 text-xs py-2 px-2 rounded-lg border-none bg-none cursor-pointer hover:text-white hover:bg-white/10 transition-colors font-poppins"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>


        <main className="flex-1 p-6 overflow-auto">


          {vistaActual === 'overview' && (
            <div>
              <div className="mb-8">
                <h1 className="font-playfair text-2xl font-bold text-natura-dark">Resumen General</h1>
                <p className="text-gray-400 text-sm">Métricas actuales del sistema</p>
              </div>

              {cargandoMetricas ? (
                <div className="flex items-center gap-3 py-10 text-gray-400">
                  <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  Cargando métricas...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                    {[
                      { label: 'Productos en catálogo', value: totalProductos, color: 'from-primary to-primary-light' },
                      { label: 'Usuarios registrados', value: totalUsuarios, color: 'from-teal-600 to-teal-400' },
                      { label: 'Ítems en carritos', value: totalItemsCarrito, color: 'from-amber-600 to-amber-400' },
                      { label: 'Valor del inventario', value: `S/ ${valorInventario.toFixed(2)}`, color: 'from-emerald-600 to-emerald-400' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.1)]`}>
                        <p className="text-2xl font-bold mb-1">{value}</p>
                        <p className="text-sm text-white/80">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-natura-dark mb-4">Destacados de precios</h3>
                      <div className="space-y-3">
                        {productoMasCaro && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div>
                              <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Más caro</span>
                              <p className="text-sm font-medium text-natura-dark mt-1">{productoMasCaro.nombre}</p>
                            </div>
                            <span className="font-bold text-primary">S/ {productoMasCaro.precio.toFixed(2)}</span>
                          </div>
                        )}
                        {productoMasBarato && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div>
                              <span className="text-xs font-semibold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">Más barato</span>
                              <p className="text-sm font-medium text-natura-dark mt-1">{productoMasBarato.nombre}</p>
                            </div>
                            <span className="font-bold text-primary">S/ {productoMasBarato.precio.toFixed(2)}</span>
                          </div>
                        )}
                        {carritoMasGrande && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                            <div>
                              <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Carrito mayor</span>
                              <p className="text-sm font-medium text-natura-dark mt-1">Usuario #{carritoMasGrande.usuarioId}</p>
                            </div>
                            <span className="font-bold text-primary">{carritoMasGrande.items.length} ítems</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="font-semibold text-natura-dark mb-4">Distribución por categoría</h3>
                      <div className="space-y-4">
                        {distribucionCategorias.map(({ nombre, cantidad, porcentaje }) => (
                          <div key={nombre}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium text-gray-600 capitalize">{nombre}</span>
                              <span className="text-gray-400">{cantidad} prods ({porcentaje}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${porcentaje}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}


          {vistaActual === 'productos' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-playfair text-2xl font-bold text-natura-dark">Gestión de Productos</h1>
                  <p className="text-gray-400 text-sm">{totalProductos} productos en el catálogo</p>
                </div>
                <button
                  onClick={abrirNuevo}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Nuevo producto
                </button>
              </div>


              {mostrarFormulario && (
                <div className="bg-white rounded-2xl p-6 border border-primary/10 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="font-semibold text-natura-dark">{editando ? 'Editar producto' : 'Nuevo producto'}</h3>
                    <button onClick={cancelar} className="text-gray-400 hover:text-gray-600 text-xl border-none bg-none cursor-pointer">×</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { label: 'Nombre *', field: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
                      { label: 'Detalle (ej: 100ml)', field: 'detalle', type: 'text', placeholder: '250ml, 100g...' },
                      { label: 'Precio (S/) *', field: 'precio', type: 'number', placeholder: '' },
                    ].map(({ label, field, type, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                        <input
                          type={type}
                          value={form[field]}
                          onChange={(e) => setForm({ ...form, [field]: type === 'number' ? +e.target.value : e.target.value })}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Categoría</label>
                      <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary">
                        {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Marca</label>
                      <select value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary">
                        {marcasDisp.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">URL de imagen</label>
                      <input type="url" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="https://..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
                    </div>
                    {[
                      { label: 'Descripción', field: 'descripcion', placeholder: 'Descripción del producto' },
                      { label: 'Modo de uso', field: 'modoUso', placeholder: 'Instrucciones de uso' },
                      { label: 'Ingredientes', field: 'ingredientes', placeholder: 'Lista de ingredientes' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field} className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                        <textarea value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} rows={2}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary resize-none" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={guardar} className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-semibold border-none cursor-pointer font-poppins hover:bg-primary-dark transition-all">
                      {editando ? 'Actualizar' : 'Guardar producto'}
                    </button>
                    <button onClick={cancelar} className="px-6 py-2 border border-gray-200 text-gray-500 rounded-xl text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors bg-white font-poppins">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}


              {cargandoProductos ? (
                <div className="flex items-center gap-3 py-10 text-gray-400">
                  <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  Cargando...
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Imagen', 'Nombre', 'Categoría', 'Marca', 'Precio', 'Acciones'].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {productos.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3">
                              <img src={p.imagen} alt={p.nombre} className="w-12 h-12 object-cover rounded-xl" />
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-sm text-natura-dark">{p.nombre}</p>
                              <p className="text-xs text-gray-400">{p.detalle}</p>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize badge-${p.categoria} bg-primary/8`}>
                                {p.categoria}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{p.marca}</td>
                            <td className="px-4 py-3 font-bold text-primary text-sm">S/ {p.precio.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => editarProducto(p)}
                                  className="p-1.5 text-blue-500 bg-blue-50 rounded-lg border-none cursor-pointer hover:bg-blue-100 transition-colors"
                                  title="Editar">
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                  </svg>
                                </button>
                                <button onClick={() => eliminar(p)}
                                  className="p-1.5 text-red-400 bg-red-50 rounded-lg border-none cursor-pointer hover:bg-red-100 transition-colors"
                                  title="Eliminar">
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}


          {vistaActual === 'carritos' && (
            <div>
              <div className="mb-6">
                <h1 className="font-playfair text-2xl font-bold text-natura-dark">Gestión de Carritos</h1>
                <p className="text-gray-400 text-sm">
                  {carritosAgrupados.length} carritos activos · {totalItemsCarrito} ítems en total
                </p>
              </div>

              {cargandoCarritos ? (
                <div className="flex items-center gap-3 py-10 text-gray-400">
                  <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  Cargando...
                </div>
              ) : carritosAgrupados.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" className="mx-auto mb-4">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                  </svg>
                  <p>No hay ítems en ningún carrito actualmente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carritosAgrupados.map((grupo) => (
                    <div key={grupo.usuarioId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                            U{grupo.usuarioId > 0 ? grupo.usuarioId : '?'}
                          </div>
                          <div>
                            <p className="font-medium text-natura-dark text-sm">Usuario #{grupo.usuarioId}</p>
                            <p className="text-xs text-gray-400">{grupo.items.length} producto(s)</p>
                          </div>
                        </div>
                        <span className="font-bold text-primary">S/ {grupo.total.toFixed(2)}</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {grupo.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 px-6 py-3">
                            <img src={item.imagen} alt={item.nombre} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-natura-dark truncate">{item.nombre}</p>
                              <p className="text-xs text-gray-400">{item.detalle}</p>
                            </div>
                            <span className="text-sm text-gray-400">× {item.cantidad}</span>
                            <span className="text-sm font-bold text-primary">S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
