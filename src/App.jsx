import MisPedidos from './pages/MisPedidos';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CarritoProvider } from './context/CarritoContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Ofertas from './pages/Ofertas';
import Detalle from './pages/Detalle';
import Carrito from './pages/Carrito';
import Nosotros from './pages/Nosotros';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Admin from './pages/Admin';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import { useCarrito } from './context/CarritoContext';
import { useAuth } from './context/AuthContext';

function CarritoLoader() {
  const { cargarCarrito, getCartUserId } = useCarrito();
  const { currentUser } = useAuth();
  useEffect(() => {
    cargarCarrito(getCartUserId());
  }, [currentUser]);
  return null;
}

function AppContent() {
  return (
    <BrowserRouter>
      <CarritoLoader />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/producto/:id" element={<Detalle />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <AppContent />
      </CarritoProvider>
    </AuthProvider>
  );
}
