import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductos } from '../services/productoService';
import ProductCard from '../components/ProductCard';
import { useCarrito } from '../context/CarritoContext';


const categorias = [
  {
    slug: 'capilar',
    titulo: 'Cuidado Capilar',
    descripcion: 'Shampoos, acondicionadores y tónicos con ingredientes naturales para un cabello sano y brillante.',
    color: '#52b788',
  },
  {
    slug: 'piel',
    titulo: 'Cuidado de la Piel',
    descripcion: 'Jabones artesanales, aceites y desodorantes que nutren y protegen tu piel de forma natural.',
    color: '#2d6a4f',
  },
  {
    slug: 'insumos',
    titulo: 'Insumos Naturales',
    descripcion: 'Bases, aceites esenciales y principios activos para formular tus propios cosméticos naturales.',
    color: '#1b4332',
  },
];

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const { agregarItem } = useCarrito();
  const [toast, setToast] = useState({ visible: false, mensaje: '' });

  useEffect(() => {
    getProductos()
      .then((res) => {
        const shuffled = [...res.data].sort(() => 0.5 - Math.random());
        setDestacados(shuffled.slice(0, 3));
      })
      .catch(() => {});
  }, []);

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
      mostrarToast('Error al agregar al carrito');
    }
  };

  return (
    <>
      {toast.visible && <div className="toast-msg">{toast.mensaje}</div>}


      <section
        className="min-h-screen grid lg:grid-cols-2 items-center gap-16 px-[6vw] pt-28 pb-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f0faf4 0%, #fefae0 50%, #f0faf4 100%)' }}
      >

        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(74,196,131,0.15) 0%, transparent 70%)' }} />


        <div>
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[0.82rem] font-semibold tracking-wide mb-6">
            Cosmética Natural &amp; Sostenible
          </div>
          <h1 className="font-playfair text-[clamp(2.5rem,5vw,3.8rem)] font-bold text-natura-dark leading-[1.15] mb-5">
            Abraza la Pureza<br />
            <span className="text-primary relative after:content-[''] after:absolute after:bottom-0.5 after:left-0 after:right-0 after:h-[3px] after:bg-accent after:rounded-sm">
              Natural
            </span>{' '}
            en tu Piel
          </h1>
          <p className="text-[1.05rem] text-[#4a6b57] leading-[1.75] max-w-[520px] mb-8">
            Descubre nuestra selección premium de productos naturales, orgánicos y sostenibles
            para tu bienestar. Sin químicos agresivos, con ingredientes que respetan tu piel y el planeta.
          </p>
          <div className="flex gap-4 flex-wrap mb-8">
            <Link to="/catalogo" className="btn-primary">Ver Colección Completa →</Link>
            <Link to="/nosotros" className="btn-ghost">Conoce nuestra historia</Link>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Cruelty-Free' },
              { label: 'Ingredientes Organicos' },
              { label: 'Envio Rapido' },
            ].map(({ label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 text-[0.82rem] text-[#5a7a68] bg-white/70 px-3 py-1.5 rounded-lg border border-primary/15">
                {label}
              </span>
            ))}
          </div>
        </div>


        <div className="hidden lg:flex justify-center items-center">
          <div className="relative max-w-[480px] w-full">
            <img
              src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&q=80"
              alt="Productos naturales premium"
              loading="eager"
              className="w-full rounded-3xl object-cover h-[500px]"
              style={{ boxShadow: '0 30px 80px rgba(45,106,79,0.2)' }}
            />
            <div
              className="absolute bottom-8 -left-8 bg-white rounded-2xl px-5 py-3 flex items-center gap-3 animate-float"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }}
            >
              <div className="flex flex-col">
                <strong className="text-natura-dark text-base">4.9/5</strong>
                <span className="text-gray-400 text-[0.78rem]">+2,400 reseñas</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] text-natura-dark mb-2">Categorías Destacadas</h2>
            <p className="text-natura-muted text-base">Encuentra exactamente lo que necesitas</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria=${cat.slug}`}
                className="flex flex-col gap-4 p-8 rounded-[20px] border border-primary/10 no-underline text-inherit transition-all duration-300 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,106,79,0.12)] hover:border-primary/20"
              >
                <div>
                  <h3 className="text-[1.1rem] font-semibold text-natura-dark mb-1.5">{cat.titulo}</h3>
                  <p className="text-[0.88rem] text-natura-muted leading-relaxed mb-3">{cat.descripcion}</p>
                  <span className="text-[0.88rem] font-semibold" style={{ color: cat.color }}>Explorar →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-bg-light">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.5rem)] text-natura-dark mb-2">Productos Más Vendidos</h2>
            <p className="text-natura-muted text-base">Los favoritos de nuestra comunidad</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} onAgregarCarrito={handleAgregarCarrito} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/catalogo" className="btn-primary">Ver todos los productos</Link>
          </div>
        </div>
      </section>


      <section style={{ background: 'linear-gradient(135deg, #1a3d2b 0%, #2d6a4f 100%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { titulo: '100% Natural', desc: 'Ingredientes de origen vegetal, sin químicos agresivos' },
              { titulo: 'Cruelty-Free', desc: 'Nunca testado en animales, siempre ético' },
              { titulo: 'Sostenible', desc: 'Empaque eco-friendly y procesos responsables' },
              { titulo: 'Comercio Justo', desc: 'Apoyamos a productores locales peruanos' },
            ].map(({ titulo, desc }) => (
              <div key={titulo} className="text-center text-white">
                <h4 className="text-base font-semibold mb-1.5">{titulo}</h4>
                <p className="text-[0.85rem] text-white/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
