import { Info, CheckCircle2, Zap, Smartphone } from 'lucide-react';

export default function GuiaUsuario() {
  const pasos = [
    {
      title: "Controlá lo Urgente",
      desc: "Mirá tu 'Agenda Urgente' en el inicio para no perder ningún vencimiento hoy.",
      icon: <Zap className="text-amber-500" size={20} />
    },
    {
      title: "Mantené el Movimiento",
      desc: "El sistema te avisará por mail si una causa lleva más de 10 días sin ser revisada.",
      icon: <CheckCircle2 className="text-emerald-500" size={20} />
    },
    {
      title: "Contacto Directo",
      desc: "Dentro de cada causa, tenés el botón verde para hablar con el cliente al instante.",
      icon: <Smartphone className="text-blue-500" size={20} />
    }
  ];

  return (
    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 mb-10 relative overflow-hidden">
      {/* Decoración sutil */}
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <Info size={120} />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-black mb-6 tracking-tight">¡Hola Mariana! Bienvenida a TuLex 2.0</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pasos.map((paso, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10">
              <div className="bg-white p-2 rounded-xl w-fit mb-4">
                {paso.icon}
              </div>
              <h3 className="font-bold text-sm mb-1">{paso.title}</h3>
              <p className="text-[11px] text-blue-50 leading-relaxed font-medium">
                {paso.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}