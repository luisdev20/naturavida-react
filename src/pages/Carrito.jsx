import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

export default function Carrito() {
  const { items, totalItems, totalPrecio, actualizarCantidad, quitarItem, limpiarCarrito } = useCarrito();
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const handleCambiarCantidad = async (item, delta) => {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;
    try { await actualizarCantidad(item, nuevaCantidad); } catch {}
  };

  const handleQuitarItem = async (item) => {
    try { await quitarItem(item.id); } catch {}
  };

  const confirmarPedido = () => {
    limpiarCarrito();
    setPedidoConfirmado(true);
  };

  if (pedidoConfirmado) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center bg-bg-light">
        <div className="text-center bg-white rounded-3xl p-12 shadow-[0_4px_24px_rgba(0,0,0,0.08)] max-w-md mx-auto">
          <div className="text-6xl mb-4"></div>
          <h2 className="font-playfair text-3xl font-bold text-natura-dark mb-3">¡Pedido confirmado!</h2>
          <p className="text-gray-500 mb-8">Gracias por tu compra. Pronto recibirás tu pedido.</p>
          <Link to="/" className="btn-primary">Seguir comprando</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="font-playfair text-[2rem] font-bold text-natura-dark mb-8">Tu Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-400 mb-8">Agrega algunos de nuestros productos naturales</p>
            <Link to="/catalogo" className="btn-primary">Ver productos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-primary/8">
                  <img src={item.imagen} alt={item.nombre} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-natura-dark text-sm leading-snug">{item.nombre}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.detalle}</p>
                    <p className="text-xs text-gray-400">S/ {item.precio.toFixed(2)} c/u</p>
                  </div>

                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => handleCambiarCantidad(item, -1)} className="px-3 py-1.5 text-gray-500 border-none bg-white cursor-pointer hover:bg-gray-50 text-base">−</button>
                    <span className="px-3 py-1.5 font-semibold text-sm border-x border-gray-200">{item.cantidad}</span>
                    <button onClick={() => handleCambiarCantidad(item, 1)} className="px-3 py-1.5 text-gray-500 border-none bg-white cursor-pointer hover:bg-gray-50 text-base">+</button>
                  </div>

                  <span className="font-bold text-primary text-base w-20 text-right">S/ {(item.precio * item.cantidad).toFixed(2)}</span>

                  <button
                    onClick={() => handleQuitarItem(item)}
                    className="text-gray-300 border-none bg-none cursor-pointer p-1.5 rounded-lg hover:text-red-400 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>


            <div>
              <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-primary/8 sticky top-24">
                <h3 className="font-semibold text-natura-dark text-lg mb-5">Resumen del pedido</h3>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Productos ({totalItems})</span>
                    <span>S/ {totalPrecio.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-500 font-semibold">Gratis</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-natura-dark border-t border-gray-100 pt-4 mb-6">
                  <span>Total</span>
                  <span className="text-primary text-xl">S/ {totalPrecio.toFixed(2)}</span>
                </div>
                <button
                  onClick={confirmarPedido}
                  className="w-full py-3 bg-primary text-white rounded-xl font-semibold border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark mb-3"
                  style={{ boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}
                >
                  Confirmar pedido
                </button>
                <Link to="/catalogo" className="block text-center text-sm text-primary no-underline hover:underline">
                  ← Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
