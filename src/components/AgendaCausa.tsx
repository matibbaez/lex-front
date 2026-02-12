import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { Evento, TipoEvento } from '../types';
import { Calendar, Clock, Plus, Trash2, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  causaId: string;
  eventosIniciales: Evento[];
  onEventoCreado: () => void;
}

type FormularioEvento = {
  titulo: string;
  fecha: string;
  hora: string;
  tipo: TipoEvento;
  descripcion: string;
};

export default function AgendaCausa({ causaId, eventosIniciales, onEventoCreado }: Props) {
  const [mostrarForm, setMostrarForm] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<FormularioEvento>();

  const onSubmit = async (data: FormularioEvento) => {
    try {
      const fechaCompleta = new Date(`${data.fecha}T${data.hora}`).toISOString();
      await api.post(`/causas/${causaId}/eventos`, {
        titulo: data.titulo,
        fecha: fechaCompleta,
        tipo: data.tipo,
        descripcion: data.descripcion
      });
      
      reset();
      setMostrarForm(false);
      onEventoCreado();
      
      toast.success('Evento programado', {
        description: `${data.titulo} ya está en la agenda.`
      });
    } catch (error) {
      toast.error('No se pudo guardar el evento');
    }
  };

  // --- NUEVA FUNCIÓN DE BORRADO BOUTIQUE ---
  const handleBorrarEvento = (id: string) => {
    toast('¿Eliminar este recordatorio?', {
      description: 'Esta acción no se puede deshacer.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await api.delete(`/causas/eventos/${id}`);
            onEventoCreado();
            toast.success('Evento eliminado correctamente');
          } catch (error) {
            toast.error('Error al intentar eliminar');
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => toast.dismiss(),
      },
    });
  };

  const eventosOrdenados = [...eventosIniciales].sort((a, b) => 
    new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm h-full">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Agenda del Caso</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">Próximos hitos y vencimientos</p>
        </div>
        <button 
          onClick={() => setMostrarForm(!mostrarForm)}
          className={`p-2.5 rounded-2xl transition-all ${mostrarForm ? 'bg-red-50 text-red-500 rotate-45' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* FORMULARIO */}
      {mostrarForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-50 p-6 rounded-[2rem] mb-8 border border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Título del Evento</label>
              <input 
                {...register('titulo', { required: true })}
                placeholder="Ej: Audiencia de Vista de Causa"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo</label>
                <select {...register('tipo')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none">
                  <option value="Audiencia">Audiencia</option>
                  <option value="Vencimiento">Vencimiento</option>
                  <option value="Trámite">Trámite</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha</label>
                  <input type="date" {...register('fecha', { required: true })} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none" />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hora</label>
                  <input type="time" {...register('hora', { required: true })} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descripción corta</label>
              <input {...register('descripcion')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none" />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Programar Evento'}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE EVENTOS */}
      <div className="space-y-4 relative">
        {eventosOrdenados.length > 0 && (
          <div className="absolute left-[31px] top-4 bottom-4 w-px bg-slate-100 hidden sm:block"></div>
        )}

        {eventosOrdenados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-30 text-slate-400">
            <Calendar size={48} strokeWidth={1} />
            <p className="text-sm font-bold mt-4">Sin eventos programados</p>
          </div>
        ) : (
          eventosOrdenados.map((evento) => {
            const fecha = new Date(evento.fecha);
            const hoy = new Date();
            const esPasado = fecha < hoy;
            
            return (
              <div key={evento.id} className="group flex items-center gap-6 relative animate-in fade-in slide-in-from-left-4">
                
                <div className={`z-10 w-16 h-16 shrink-0 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                  esPasado 
                  ? 'bg-slate-50 border-slate-100 text-slate-400' 
                  : 'bg-white border-blue-100 text-blue-600 shadow-sm group-hover:border-blue-500'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-tighter">{fecha.toLocaleDateString('es-AR', { month: 'short' })}</span>
                  <span className="text-xl font-black leading-none">{fecha.getDate()}</span>
                </div>
                
                <div className={`flex-1 p-5 rounded-[1.5rem] border transition-all flex items-center justify-between ${
                  esPasado 
                  ? 'bg-slate-50/50 border-transparent opacity-60' 
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md group-hover:border-blue-200'
                }`}>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-sm truncate ${esPasado ? 'text-slate-500' : 'text-slate-800'}`}>
                        {evento.titulo}
                      </h4>
                      <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                        evento.tipo === 'Vencimiento' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {evento.tipo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} className="text-blue-400" />
                      {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                      {evento.descripcion && <span className="mx-1 truncate opacity-70">• {evento.descripcion}</span>}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleBorrarEvento(evento.id)}
                    className="ml-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}