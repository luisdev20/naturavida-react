import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MisPedidos() {
  const { currentUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPedidos([
        { id: 1, fecha: '2024-06-28', total: 85.50, estado: 'Entregado', items: 3 },
        { id: 2, fecha: '2024-06-20', total: 45.00, estado: 'En camino', items: 2 },
        { id: 3, fecha: '2024-06-10', total: 120.00, estado: 'Procesando', items: 4 },
      ]);
      setCargando(false);
    }, 1000);
  }, []);

  if (!currentUser) {
    return (
      <div className="pt-[70px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Inicia sesión para ver tus pedidos</h2>
          <Link to="/login" className="btn-primary">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-bold text-natura-dark mb-8">Mis Pedidos</h1>
        
        {cargando ? (
          <div className="text-center py-10">Cargando pedidos...</div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No tienes pedidos aún</p>
            <Link to="/catalogo" className="btn-primary">Hacer mi primer pedido</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-2xl p-6 shadow-sm border border-primary/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-natura-dark">Pedido #{pedido.id}</p>
                    <p className="text-sm text-gray-400">{pedido.fecha}</p>
                    <p className="text-sm text-gray-400">{pedido.items} productos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">S/ {pedido.total.toFixed(2)}</p>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                      ${pedido.estado === 'Entregado' ? 'bg-green-100 text-green-600' : 
                        pedido.estado === 'En camino' ? 'bg-blue-100 text-blue-600' : 
                        'bg-yellow-100 text-yellow-600'}`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}