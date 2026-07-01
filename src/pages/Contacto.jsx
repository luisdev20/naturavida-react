import { useState } from 'react';

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      setEnviado(true);
      setEnviando(false);
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' });
    }, 1200);
  };

  return (
    <div className="pt-[70px] min-h-screen bg-bg-light">


      <section style={{ background: 'linear-gradient(135deg, #f0faf4 0%, #fefae0 50%, #f0faf4 100%)' }} className="py-20 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[0.82rem] font-semibold tracking-wide mb-6">
            Estamos aquí para ayudarte
          </div>
          <h1 className="font-playfair text-[clamp(2rem,4vw,3rem)] font-bold text-natura-dark mb-3">Contáctanos</h1>
          <p className="text-[#4a6b57]">Escríbenos y te responderemos en menos de 24 horas</p>
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">


        <div className="space-y-6">
          <h2 className="font-playfair text-2xl font-bold text-natura-dark">Información de contacto</h2>
          <p className="text-gray-500 leading-relaxed">
            Tienes dudas sobre nuestros productos, quieres hacer un pedido especial o simplemente quieres saludarnos. Estamos aquí.
          </p>

          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              label: 'WhatsApp', value: '+51 929 877 999'
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              ),
              label: 'Email', value: 'hola@naturavida.com'
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              label: 'Horario', value: 'Lun–Sáb, 9:00 AM – 6:00 PM'
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-primary/10 shadow-sm">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-natura-dark">{value}</p>
              </div>
            </div>
          ))}
        </div>


        <div>
          {enviado ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-primary/8">
              <div className="text-5xl mb-4"></div>
              <h3 className="font-playfair text-2xl font-bold text-natura-dark mb-2">¡Mensaje enviado!</h3>
              <p className="text-gray-500">Gracias por contactarnos. Te responderemos pronto.</p>
              <button
                onClick={() => setEnviado(false)}
                className="mt-6 btn-primary"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-primary/8 space-y-5">
              <h2 className="font-playfair text-xl font-bold text-natura-dark">Envíanos un mensaje</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                  <input name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Asunto</label>
                <input name="asunto" type="text" value={form.asunto} onChange={handleChange} placeholder="¿En qué podemos ayudarte?"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensaje</label>
                <textarea name="mensaje" rows={5} value={form.mensaje} onChange={handleChange} placeholder="Escribe tu mensaje aquí..." required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none" />
              </div>
              <button type="submit" disabled={enviando}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm border-none cursor-pointer font-poppins transition-all hover:bg-primary-dark disabled:opacity-60"
                style={{ boxShadow: '0 4px 16px rgba(45,106,79,0.25)' }}>
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
