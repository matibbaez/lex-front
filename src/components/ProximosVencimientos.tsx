import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, ArrowRight, CalendarDays, ChevronRight } from 'lucide-react';

type EventoDashboard = {
  id: string;
  titulo: string;
  fecha: string;
  tipo: string;
  causa: {
    id: string;
    caratula: string;
  };
};

export default function ProximosVencimientos() {
  const [eventos, setEventos] = useState<EventoDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const { data } = await api.get('/causas/eventos/proximos');
        setEventos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  if (loading) return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-full space-y-4">
      <div className="h-6 w-32 bg-slate-100 rounded-full animate-pulse"></div>
      {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>)}
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      
      {/* HEADER DEL WIDGET */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-500 rounded-xl">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none">Urgente</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Próximos 7 días</p>
          </div>
        </div>
      </div>

      {/* LISTA DE EVENTOS */}
      <div className="space-y-4 flex-1">
        {eventos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40 text-center">
            <CalendarDays size={40} strokeWidth={1} />
            <p className="text-xs font-bold mt-3 uppercase tracking-wider">Sin urgencias</p>
          </div>
        ) : (
          eventos.map((evt) => {
            const fecha = new Date(evt.fecha);
            const esVencimiento = evt.tipo.toLowerCase().includes('vencimiento');

            return (
              <div 
                key={evt.id} 
                onClick={() => navigate(`/causas/${evt.causa.id}`)}
                className="group cursor-pointer bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 p-4 rounded-2xl transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    esVencimiento 
                    ? 'bg-red-50 text-red-500 border-red-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {evt.tipo}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock size={12} className="text-blue-400" />
                    {fecha.getHours()}:{fecha.getMinutes().toString().padStart(2, '0')} hs
                  </div>
                </div>
                
                <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {evt.titulo}
                </h4>
                
                <div className="flex items-center justify-between mt-2">
                   <p className="text-[10px] text-slate-400 font-medium italic truncate max-w-[150px]">
                     Exp: {evt.causa.caratula}
                   </p>
                   <p className="text-[10px] font-black text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                     {fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                   </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER: VER MÁS */}
      {eventos.length > 0 && (
        <button 
          onClick={() => navigate('/agenda')}
          className="w-full mt-8 group flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
        >
          Agenda Completa
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}