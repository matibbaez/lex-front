import { useNavigate } from 'react-router-dom';
import { Home, SearchX, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        {/* ICONO */}
        <div className="inline-flex p-5 bg-blue-50 text-blue-600 rounded-[2rem] mb-8">
          <SearchX size={48} strokeWidth={1.5} />
        </div>

        {/* TEXTO */}
        <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-4">404</h1>
        <h2 className="text-xl font-bold text-slate-700 mb-4">¡Expediente no encontrado!</h2>
        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
          La página que estás buscando no existe o fue movida. No te preocupes, volvamos al panel central.
        </p>

        {/* BOTONES */}
        <div className="space-y-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Volver al Inicio
          </button>
          
          <button 
            onClick={() => navigate(-1)}
            className="w-full text-slate-400 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Regresar
          </button>
        </div>

      </div>
    </div>
  );
}