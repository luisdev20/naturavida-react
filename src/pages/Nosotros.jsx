import { Link } from 'react-router-dom';

const valores = [
  { titulo: 'Naturalidad', desc: 'Cada ingrediente es cuidadosamente seleccionado por su pureza y origen natural.' },
  { titulo: 'Transparencia', desc: 'Publicamos todos nuestros ingredientes y procesos de elaboración.' },
  { titulo: 'Ética', desc: 'Cruelty-free, sin parabenos ni sulfatos agresivos en ningún producto.' },
  { titulo: 'Comunidad', desc: 'Apoyamos a pequeños productores y emprendedores de la región.' },
];

export default function Nosotros() {
  return (
    <div className="pt-[70px]">


      <section style={{ background: 'linear-gradient(135deg, #f0faf4 0%, #fefae0 50%, #f0faf4 100%)' }} className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[0.82rem] font-semibold tracking-wide mb-6">
            Nuestra Historia
          </div>
          <h1 className="font-playfair text-[clamp(2.2rem,5vw,3.5rem)] font-bold text-natura-dark leading-tight mb-4">
            Cosmética Natural<br />
            <span className="text-primary">para un mundo mejor</span>
          </h1>
          <p className="text-[#4a6b57] text-lg">Desde 2020 acercamos la belleza natural y sostenible a cada hogar peruano.</p>
        </div>
      </section>


      <section className="bg-white py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(45,106,79,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80"
                alt="Nuestra historia"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div>
              <h2 className="font-playfair text-3xl font-bold text-natura-dark mb-4">¿Cómo empezó todo?</h2>
              <p className="text-primary font-medium leading-relaxed mb-4">
                NaturaVida nació en 2020 con un sueño: acercar la cosmética natural y sostenible a todos los hogares.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fundada por un grupo de amantes de la naturaleza y el cuidado personal, nuestra marca se ha convertido en un referente de productos libres de químicos agresivos, cruelty-free y respetuosos con el medio ambiente.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Creemos que la belleza real viene de adentro hacia afuera, y por eso cada uno de nuestros productos está formulado con ingredientes puros, orgánicos y de origen ético.
              </p>
              <Link to="/catalogo" className="btn-primary">Conoce nuestros productos</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-bg-light py-16 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 text-2xl"></div>
              <h3 className="font-playfair text-2xl font-bold text-natura-dark mb-3">Misión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ofrecer productos de cosmética natural de alta calidad que promuevan el bienestar integral, cuidando el planeta y apoyando a comunidades locales.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-primary/10 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center mb-5 text-2xl"></div>
              <h3 className="font-playfair text-2xl font-bold text-natura-dark mb-3">Visión</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser la marca líder en cosmética natural sostenible de Latinoamérica, inspirando un estilo de vida consciente y respetuoso con el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-natura-dark mb-2">Nuestros Valores</h2>
            <p className="text-natura-muted">Los principios que guían cada decisión que tomamos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map(({ titulo, desc }) => (
              <div key={titulo} className="p-6 rounded-2xl border border-primary/10 hover:border-primary/25 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(45,106,79,0.1)] transition-all duration-300">
                <h4 className="font-semibold text-natura-dark mb-2">{titulo}</h4>
                <p className="text-[0.85rem] text-natura-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
