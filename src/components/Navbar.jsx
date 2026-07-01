import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { currentUser, isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCarrito();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-[1200px] mx-auto px-6 h-[70px] flex items-center gap-8">


        <Link to="/" className="flex items-center gap-2 no-underline text-primary text-xl flex-shrink-0" onClick={closeMenu}>
          <span className="text-gray-700 font-poppins">
            Natura<strong className="text-primary">Vida</strong>
          </span>
        </Link>


        <button
          className="md:hidden flex flex-col gap-[5px] bg-none border-none cursor-pointer p-1 ml-auto"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-500 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>


        <div className={`
          flex-1 flex items-center gap-1 justify-center
          md:flex md:relative md:top-auto md:left-auto md:right-auto md:flex-row md:bg-transparent md:border-0 md:shadow-none md:p-0
          ${menuOpen
            ? 'flex absolute top-[70px] left-0 right-0 flex-col bg-white border-b border-primary/10 shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-4 gap-1'
            : 'hidden md:flex'
          }
        `}>
          {[
            { to: '/', label: 'Inicio', exact: true },
            { to: '/catalogo', label: 'Productos' },
            { to: '/ofertas', label: 'Ofertas' },
            { to: '/nosotros', label: 'Nosotros' },
            { to: '/contacto', label: 'Contacto' },
          ].map(({ to, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[0.92rem] font-medium no-underline transition-all duration-200 md:w-auto w-full text-center
                ${isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-gray-500 hover:bg-primary/8 hover:text-primary'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn && (
            <NavLink
              to="/admin"
              onClick={closeMenu}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[0.92rem] font-medium no-underline transition-all duration-200 md:w-auto w-full text-center
                ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-500 hover:bg-primary/8 hover:text-primary'}`
              }
            >
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/carrito"
            className="relative flex items-center justify-center w-10 h-10 rounded-[10px] text-gray-500 no-underline transition-all duration-200 hover:bg-primary/8 hover:text-primary"
            title="Carrito"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[0.65rem] font-bold min-w-[18px] h-[18px] rounded-[9px] flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </Link>


          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 border-none rounded-lg cursor-pointer text-primary text-[0.85rem] font-medium font-poppins transition-colors duration-200 hover:bg-primary/15">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap hidden sm:inline">
                  {currentUser?.nombre}
                </span>
              </button>
              <div className="hidden group-hover:block absolute top-full right-0 pt-2 min-w-[160px] z-50">
  <div className="bg-white border border-primary/15 rounded-[10px] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.1)]">
    {isAdmin && (
      <Link
        to="/admin"
        onClick={closeMenu}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-[0.85rem] text-gray-700 no-underline cursor-pointer hover:bg-primary/6 hover:text-primary transition-colors"
      >
        Panel Admin
      </Link>
    )}
    <Link
      to="/mis-pedidos"
      onClick={closeMenu}
      className="flex items-center gap-2 w-full px-4 py-2.5 text-[0.85rem] text-gray-700 no-underline cursor-pointer hover:bg-primary/6 hover:text-primary transition-colors"
    >
      Mis Pedidos
    </Link>
    
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 w-full px-4 py-2.5 text-[0.85rem] text-red-500 bg-none border-none cursor-pointer font-poppins transition-colors hover:bg-red-50"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Cerrar sesión
    </button>
  </div>
</div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white no-underline rounded-[10px] text-[0.88rem] font-medium transition-all duration-200 hover:bg-primary-dark hover:-translate-y-px"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
