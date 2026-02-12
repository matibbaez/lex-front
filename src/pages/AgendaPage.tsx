import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

// Tipos
type EventoAgenda = {
  id: string;
  titulo: string;
  fecha: string;
  tipo: string;
  causa: { id: string; caratula: string };
};

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function AgendaPage() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<EventoAgenda[]>([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const { data } = await api.get('/causas/eventos/todos');
        setEventos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  // Lógica del Calendario
  const year = fechaActual.getFullYear();
  const month = fechaActual.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay(); 

  const emptySlots = Array(startDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getEventosDelDia = (dia: number) => {
    return eventos.filter(e => {
      const fechaEvento = new Date(e.fecha);
      return (
        fechaEvento.getDate() === dia &&
        fechaEvento.getMonth() === month &&
        fechaEvento.getFullYear() === year
      );
    });
  };

  const cambiarMes = (delta: number) => {
    setFechaActual(new Date(year, month + delta, 1));
  };

  if (loading) return <div className="p-10 text-center text-slate-400 font-medium">Sincronizando agenda...</div>;

  return (
    <div className="max-w-7xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition-colors">Panel</button>
            <ChevronRightIcon size={10} />
            <span className="text-blue-600">Agenda Global</span>
          </nav>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Calendario de Actuaciones</h1>
        </div>

        {/* SELECTOR DE MES PRO */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-100">
          <button 
            onClick={() => cambiarMes(-1)} 
            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="px-6 py-1 text-center min-w-[160px]">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">{year}</p>
            <p className="text-lg font-bold text-slate-800 leading-none">{MESES[month]}</p>
          </div>

          <button 
            onClick={() => cambiarMes(1)} 
            className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* GRILLA CALENDARIO BOUTIQUE */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
          {['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {d}
            </div>
          ))}
        </div>

        {/* Celdas del mes */}
        <div className="grid grid-cols-7">
          
          {/* Espacios vacíos */}
          {emptySlots.map((_, i) => (
            <div key={`empty-${i}`} className="bg-slate-50/20 border-b border-r border-slate-50 min-h-[140px]"></div>
          ))}

          {/* Días con contenido */}
          {days.map(dia => {
            const eventosDelDia = getEventosDelDia(dia);
            const esHoy = 
              dia === new Date().getDate() && 
              month === new Date().getMonth() && 
              year === new Date().getFullYear();

            return (
              <div 
                key={dia} 
                className={`group border-b border-r border-slate-50 p-3 min-h-[140px] transition-all hover:bg-blue-50/20 ${esHoy ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-black w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    esHoy 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                    : 'text-slate-400 group-hover:text-blue-600'
                  }`}>
                    {dia}
                  </span>
                  {eventosDelDia.length > 0 && !esHoy && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  )}
                </div>

                <div className="space-y-2">
                  {eventosDelDia.map(ev => (
                    <div 
                      key={ev.id}
                      onClick={() => navigate(`/causas/${ev.causa.id}`)}
                      className="cursor-pointer p-2 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all transform hover:-translate-y-0.5 group/ev"
                    >
                      <p className="text-[10px] font-bold text-slate-700 leading-tight mb-1 group-hover/ev:text-blue-600 truncate">
                        {ev.titulo}
                      </p>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Clock size={10} className="text-blue-400" />
                        {new Date(ev.fecha).toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PIE DE AGENDA */}
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Día Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white border border-slate-200 shadow-sm"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vencimiento / Audiencia</span>
        </div>
      </div>

    </div>
  );
}