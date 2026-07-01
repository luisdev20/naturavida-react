import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !password) { setError('Completa todos los campos.'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setCargando(true);
    setError('');
    try {
      await registro({ nombre, email, password });
      navigate('/');
    } catch {
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="pt-[70px] min-h-screen flex items-center justify-center bg-bg-light px-4">
      <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(45,106,79,0.1)] p-10 w-full max-w-md border border-primary/8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3"></div>
          <h1 className="font-playfair text-2xl font-bold text-natura-dark mb-1">Crea tu cuenta</h1>
          <p className="text-gray-400 text-sm">Únete a la comunidad NaturaVida</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="nombre">
              Nombre completo
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark disabled:opacity-60"
            style={{ boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}
          >
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-medium no-underline hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
