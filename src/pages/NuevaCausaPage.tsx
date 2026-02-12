import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Save, MessageCircle, Briefcase, Gavel, Info, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

type FormularioCausa = {
  caratula: string;
  nro_expediente: string;
  juzgado: string;
  fuero: string;
  observaciones: string;
  telefono_cliente: string;
};

export default function NuevaCausaPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormularioCausa>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormularioCausa) => {
    try {
      await api.post('/causas', data);
      
      // Notificación Boutique - Sin nombres fijos
      toast.success('¡Causa creada con éxito!', {
        description: 'El expediente ya está disponible en tu tablero.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando causa:', error);
      toast.error('Error al guardar', {
        description: 'Por favor, revisá que todos los campos obligatorios estén completos.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DE PÁGINA */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
          <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition-colors">Expedientes</button>
          <ChevronRight size={10} />
          <span className="text-blue-600">Alta de Nueva Causa</span>
        </nav>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Iniciar Nuevo Expediente</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Completá la información base para comenzar el seguimiento.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* SECCIÓN 1: DATOS PRINCIPALES */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={20}/></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Información de la Causa</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Carátula del Caso *</label>
              <input 
                {...register('caratula', { required: true })} 
                placeholder="Ej: Gomez c/ Perez s/ Despido"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">N° de Expediente</label>
                <input 
                  {...register('nro_expediente')} 
                  placeholder="Ej: 12345/2023"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Fuero *</label>
                <select 
                  {...register('fuero', { required: true })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar fuero...</option>
                  <option value="Laboral">Laboral</option>
                  <option value="Civil">Civil</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Familia">Familia</option>
                  <option value="Penal">Penal</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: RADICACIÓN Y CONTACTO */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Gavel size={20}/></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Radicación y Contacto</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Juzgado / Fiscalía</label>
              <input 
                {...register('juzgado')} 
                placeholder="Ej: Juzgado Laboral N° 4"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">WhatsApp del Cliente</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <MessageCircle size={18} />
                </div>
                <input 
                  {...register('telefono_cliente')} 
                  placeholder="Ej: 5491122334455"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: NOTAS ADICIONALES */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Info size={20}/></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Observaciones</h2>
          </div>

          <textarea 
            {...register('observaciones')} 
            rows={4}
            placeholder="Escribí aquí cualquier detalle relevante para el inicio de la causa..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium resize-none placeholder:text-slate-300"
          />
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="pt-4">
          <button 
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] hover:bg-blue-700 font-bold text-lg shadow-xl shadow-blue-100 transition-all flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse italic">Iniciando expediente...</span>
            ) : (
              <>
                <Save size={22} />
                Confirmar y Crear Causa
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}