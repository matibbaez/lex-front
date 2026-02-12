import { Zap, Smartphone, Bell, ShieldCheck, FileText, Search } from 'lucide-react';

export default function AyudaPage() {
  const guias = [
    {
      title: "Búsqueda Inteligente",
      desc: "Usá la barra superior para encontrar cualquier expediente por nombre o número al instante.",
      icon: <Search className="text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Vencimientos Urgentes",
      desc: "En el inicio, los eventos de los próximos 7 días aparecen resaltados. ¡No se te pasa nada!",
      icon: <Zap className="text-amber-500" />,
      color: "bg-amber-50"
    },
    {
      title: "Contacto por WhatsApp",
      desc: "Dentro de cada causa, hacé clic en el botón verde para abrir un chat directo con el cliente.",
      icon: <Smartphone className="text-emerald-500" />,
      color: "bg-emerald-50"
    },
    {
      title: "Alertas Automáticas",
      desc: "Si no revisás una causa por 10 días, TuLex te enviará un recordatorio por email.",
      icon: <Bell className="text-red-500" />,
      color: "bg-red-50"
    },
    {
      title: "Expediente Digital",
      desc: "Podés subir PDF, fotos o documentos de Word en cada causa para tenerlos siempre a mano.",
      icon: <FileText className="text-indigo-600" />,
      color: "bg-indigo-50"
    },
    {
      title: "Privacidad Total",
      desc: "Tus datos están protegidos y solo vos podés acceder a la información del estudio.",
      icon: <ShieldCheck className="text-slate-600" />,
      color: "bg-slate-50"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Centro de Ayuda</h1>
        <p className="text-slate-400 font-medium mt-2">Todo lo que necesitás saber para sacarle el jugo a TuLex.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guias.map((guia, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className={`p-4 ${guia.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
              {guia.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{guia.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {guia.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-blue-600 rounded-[3rem] text-white text-center">
        <h3 className="text-xl font-bold mb-2">¿Necesitás algo más?</h3>
        <p className="text-blue-100 text-sm mb-6">Estamos acá para que tu estudio vuele.</p>
        <a 
          href="mailto:hello@wearevisionpath.com" 
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors"
        >
          Contactar a VisionPath
        </a>
      </div>
    </div>
  );
}