import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Causa } from '../types'; 
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Trash2, ExternalLink, Plus, SearchX } from 'lucide-react';
import { toast } from 'sonner';
import StatsGrid from '../components/StatsGrid';
import ProximosVencimientos from '../components/ProximosVencimientos';

export default function DashboardPage() {
  const [causas, setCausas] = useState<Causa[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { cargarCausas(); }, []);

  const cargarCausas = async () => {
    try {
      const { data } = await api.get('/causas');
      setCausas(data);
    } catch (error) { 
      console.error(error);
      toast.error('Error al sincronizar expedientes');
    }
    finally { setLoading(false); }
  };

  // --- FUNCIÓN DE BORRADO BOUTIQUE ---
  const handleDelete = (id: string, caratula: string) => {
    toast(`¿Eliminar expediente "${caratula}"?`, {
      description: 'Esta acción eliminará permanentemente la causa y sus documentos.',
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            const promise = api.delete(`/causas/${id}`);
            
            toast.promise(promise, {
              loading: 'Eliminando de la base de datos...',
              success: () => {
                cargarCausas(); // Recargamos la lista
                return `Expediente borrado con éxito.`;
              },
              error: 'No se pudo eliminar la causa.'
            });
          } catch (error) { 
            console.error(error);
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => toast.dismiss(),
      },
    });
  };

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* 1. ESTADÍSTICAS (Ya son responsivas) */}
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
        
        {/* 2. TABLA DE EXPEDIENTES */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            
            <div className="p-6 lg:p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Expedientes Activos</h2>
                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Gestión de causas en tiempo real</p>
              </div>
              <button 
                onClick={() => navigate('/causas/nueva')}
                className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Nueva Causa
              </button>
            </div>

            {/* AQUÍ ESTÁ EL TRUCO DEL SCROLL: overflow-x-auto */}
            <div className="overflow-x-auto pb-2">
              {causas.length === 0 && !loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] mb-6">
                    <SearchX size={48} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No hay causas cargadas</h3>
                  <p className="text-sm text-slate-400 max-w-xs mt-2">
                    Parece que todavía no tenés expedientes en seguimiento. ¡Comenzá cargando el primero!
                  </p>
                </div>
              ) : (
                /* AGREGADO: min-w-[900px] para forzar el ancho y activar el scroll */
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="bg-slate-50/50 text-[10px] uppercase tracking-widest text-slate-400 font-black">
                    <tr>
                      <th className="px-8 py-5">Carátula & Identificación</th>
                      <th className="px-8 py-5">Estado</th>
                      <th className="px-8 py-5">Última Revisión</th>
                      <th className="px-8 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {causas.map((causa) => {
                      const fecha = new Date(causa.ultima_revision);
                      const hoy = new Date();
                      const diasInactiva = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 3600 * 24));

                      return (
                        <tr key={causa.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors text-sm">{causa.caratula}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1.5 font-bold uppercase tracking-tight">
                              <FileText size={12} className="text-blue-400" /> 
                              {causa.nro_expediente || 'S/N'} • {causa.fuero}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                              ${causa.estado === 'Sentencia' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                causa.estado === 'Inicio' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                'bg-slate-50 text-slate-500 border-slate-100'}
                            `}>
                              {causa.estado}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className={`flex items-center gap-2 text-xs font-bold ${diasInactiva > 15 ? 'text-red-400' : 'text-slate-500'}`}>
                              <Calendar size={14} className={diasInactiva > 15 ? 'animate-pulse' : ''} />
                              {fecha.toLocaleDateString('es-AR')}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => navigate(`/causas/${causa.id}`)}
                                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                title="Abrir Expediente"
                              >
                                <ExternalLink size={20} />
                              </button>
                              <button 
                                onClick={() => handleDelete(causa.id, causa.caratula)}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Eliminar"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* 3. WIDGET DERECHO (Agenda) */}
        <div className="lg:col-span-1">
          <ProximosVencimientos />
        </div>

      </div>
    </div>
  );
}