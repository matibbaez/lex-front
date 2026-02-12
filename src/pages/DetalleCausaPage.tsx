import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import type { Causa, Documento } from '../types';
import { 
  FileText, PlusCircle, Download, Paperclip, 
  Edit, X, MessageCircle, Clock, Scale, ChevronRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import AgendaCausa from '../components/AgendaCausa';

type FormularioEdicion = {
  caratula: string; 
  nro_expediente: string; 
  juzgado: string;
  estado: string; 
  observaciones: string; 
  telefono_cliente: string;
};

export default function DetalleCausaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [causa, setCausa] = useState<Causa | null>(null);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [editando, setEditando] = useState(false);

  const { register, handleSubmit, setValue } = useForm<FormularioEdicion>();

  useEffect(() => { cargarDetalle(); }, [id]);

  const cargarDetalle = async () => {
    try {
      const { data } = await api.get(`/causas/${id}`);
      setCausa(data);
    } catch (error) { 
      console.error(error);
      toast.error('No se pudo cargar el expediente');
      navigate('/dashboard'); 
    }
    finally { setLoading(false); }
  };

  const abrirEdicion = () => {
    if (!causa) return;
    setValue('caratula', causa.caratula);
    setValue('nro_expediente', causa.nro_expediente);
    setValue('juzgado', causa.juzgado);
    setValue('estado', causa.estado);
    setValue('observaciones', causa.observaciones || '');
    setValue('telefono_cliente', causa.telefono_cliente || '');
    setEditando(true);
  };

  const onEditar = async (data: FormularioEdicion) => {
    try {
      await api.patch(`/causas/${id}`, data);
      setEditando(false);
      await cargarDetalle();
      toast.success('Expediente actualizado correctamente');
    } catch (error) { 
      toast.error('Error al guardar los cambios');
    }
  };

  const linkWhatsApp = () => {
    if (!causa?.telefono_cliente) return null;
    const tel = causa.telefono_cliente.replace(/\D/g, '');
    return `https://wa.me/${tel}?text=${encodeURIComponent(`Hola! Te contacto del Estudio Jurídico por la causa: ${causa.caratula}`)}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    try {
      setSubiendo(true);
      const promise = api.post(`/causas/${id}/documentos`, formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });

      toast.promise(promise, {
        loading: 'Subiendo archivo al expediente...',
        success: 'Documento adjuntado con éxito',
        error: 'Error al subir el archivo'
      });

      await promise;
      await cargarDetalle();
    } catch (error) {
      console.error(error);
    } finally { 
      setSubiendo(false); 
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const descargarDoc = async (doc: Documento) => {
    try {
        const { data } = await api.get(`/causas/documentos/${doc.id}/url`);
        window.open(data.url, '_blank');
        toast.info('Iniciando descarga...');
    } catch (error) {
        toast.error("No se pudo generar el enlace de descarga");
    }
  };

  if (loading) return (
    <div className="h-96 w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Abriendo Expediente...</p>
      </div>
    </div>
  );

  if (!causa) return null;

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. BREADCRUMBS & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition-colors">Expedientes</button>
            <ChevronRight size={10} />
            <span className="text-blue-600">Detalle de Causa</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{causa.caratula}</h1>
            <button 
                onClick={abrirEdicion} 
                className="p-2.5 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-100/50 transition-all active:scale-90"
            >
              <Edit size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {causa.telefono_cliente && (
            <a 
                href={linkWhatsApp() || '#'} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-emerald-500 text-white px-7 py-3.5 rounded-[1.25rem] font-bold text-sm shadow-lg shadow-emerald-100 hover:bg-emerald-600 hover:shadow-emerald-200 transition-all active:scale-95"
            >
              <MessageCircle size={18} /> WhatsApp Cliente
            </a>
          )}
        </div>
      </div>

      {/* 2. INFO CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
             <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Scale size={20}/></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuero & Juzgado</p>
          </div>
          <p className="text-lg font-bold text-slate-800">{causa.fuero}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">{causa.juzgado || 'Juzgado no asignado'}</p>
        </div>

        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
             <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Paperclip size={20}/></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificación</p>
          </div>
          <p className="text-lg font-bold text-slate-800">{causa.nro_expediente || 'S/N'}</p>
          <div className="mt-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100">
                {causa.estado}
            </span>
          </div>
        </div>

        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
             <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Clock size={20}/></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronización</p>
          </div>
          <p className="text-lg font-bold text-slate-800">{new Date(causa.ultima_revision).toLocaleDateString('es-AR')}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Última revisión profesional</p>
        </div>
      </div>

      {/* 3. OBSERVACIONES (Si existen) */}
      {causa.observaciones && (
        <div className="mb-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-4 items-start">
          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notas del Profesional</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {causa.observaciones}
            </p>
          </div>
        </div>
      )}

      {/* 4. SECCIONES INFERIORES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* AGENDA */}
        <section className="h-full">
          <AgendaCausa 
            causaId={causa.id} 
            eventosIniciales={causa.eventos || []} 
            onEventoCreado={cargarDetalle} 
          />
        </section>

        {/* DOCUMENTOS */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Expediente Digital</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Acervo documental cargado</p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={subiendo} 
              className="bg-blue-50 text-blue-600 p-3 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm"
              title="Subir documento"
            >
              <PlusCircle size={24} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
          </div>

          <div className="space-y-3 flex-1">
            {causa.documentos?.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-blue-50 transition-colors">
                    <FileText size={20} className="text-blue-500"/>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{doc.nombre_archivo}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Date(doc.fecha_carga).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                    onClick={() => descargarDoc(doc)} 
                    className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <Download size={20} />
                </button>
              </div>
            ))}
            {(!causa.documentos || causa.documentos.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full py-10 opacity-30 text-slate-400">
                <FileText size={48} strokeWidth={1} /> 
                <p className="text-xs font-bold mt-4 uppercase tracking-widest">Sin documentos adjuntos</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* --- MODAL DE EDICIÓN BOUTIQUE --- */}
      {editando && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
            
            <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-800 tracking-tight">Editar Expediente</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Sincronización de datos</p>
              </div>
              <button onClick={() => setEditando(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onEditar)} className="p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Carátula</label>
                <input 
                  {...register('caratula', { required: true })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Expediente</label>
                  <input 
                    {...register('nro_expediente')} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Estado</label>
                  <select 
                    {...register('estado')} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="Inicio">Inicio</option>
                    <option value="Etapa Probatoria">Etapa Probatoria</option>
                    <option value="Alegatos">Alegatos</option>
                    <option value="Sentencia">Sentencia</option>
                    <option value="Apelación">Apelación</option>
                    <option value="Archivada">Archivada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">WhatsApp Cliente</label>
                <input 
                    {...register('telefono_cliente')} 
                    placeholder="Ej: 54911..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Observaciones</label>
                <textarea 
                  {...register('observaciones')} 
                  rows={3} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium resize-none" 
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setEditando(false)}
                  className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold text-sm transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}