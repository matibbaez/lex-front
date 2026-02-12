import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // 1. Importar
import { User, Lock, Save, ShieldCheck, AlertCircle, ChevronRight, Mail, BadgeCheck } from 'lucide-react';

export default function PerfilPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Formulario Datos Personales
  const { register: registerData, handleSubmit: submitData } = useForm();
  
  // Formulario Password
  const { register: registerPass, handleSubmit: submitPass, reset: resetPass, setError, formState: { errors } } = useForm();

  // Cargar datos al inicio
  useEffect(() => {
    api.get('/users/me')
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => navigate('/dashboard'));
  }, [navigate]);

  // Guardar Datos
  const onUpdateProfile = async (data: any) => {
    try {
      await api.patch('/users/me', data);
      toast.success('¡Perfil actualizado con éxito!', {
        description: 'Los cambios ya están reflejados en tu cuenta.'
      });
    } catch (error) {
      toast.error('No se pudieron guardar los cambios.');
    }
  };

  // Cambiar Password
  const onChangePassword = async (data: any) => {
    if (data.newPass !== data.confirmPass) {
      setError('confirmPass', { type: 'manual', message: 'Las contraseñas no coinciden' });
      return;
    }

    try {
      await api.post('/users/me/password', {
        currentPass: data.currentPass,
        newPass: data.newPass
      });
      toast.success('Contraseña actualizada', {
        icon: '🔒'
      });
      resetPass();
    } catch (error: any) {
      toast.error('La contraseña actual es incorrecta.');
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Cargando perfil...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. BREADCRUMBS & HEADER */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
          <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition-colors">Panel</button>
          <ChevronRight size={10} />
          <span className="text-blue-600">Configuración de Perfil</span>
        </nav>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mi Cuenta</h1>
      </div>

      {/* 2. PERFIL HEADER CARD */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <User size={180} />
        </div>
        
        <div className="relative">
          <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-100 border-4 border-white">
            {user.nombre?.charAt(0) || 'U'}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white shadow-sm">
            <BadgeCheck size={16} />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.nombre}</h2>
          <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
            <Mail size={14} className="text-blue-400" />
            {user.email}
          </p>
          <div className="mt-4 flex gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full border border-blue-100">
              {user.role}
            </span>
            <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-full border border-slate-100">
              ID: {user.id.slice(0,8)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 3: DATOS PERSONALES */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><User size={20}/></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Información Personal</h2>
          </div>
          
          <form onSubmit={submitData(onUpdateProfile)} className="space-y-6 flex-1">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nombre Completo</label>
              <input 
                {...registerData('nombre')} 
                defaultValue={user.nombre}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Correo Electrónico</label>
              <div className="relative opacity-60">
                <input 
                  value={user.email}
                  readOnly
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl p-4 outline-none font-medium cursor-not-allowed"
                />
                <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-[9px] text-slate-400 mt-2 px-1 italic">* El email no puede ser modificado por seguridad.</p>
            </div>

            <div className="pt-4">
              <button className="w-full bg-slate-800 text-white py-4 rounded-2xl hover:bg-black transition-all flex justify-center items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95">
                <Save size={18} />
                Actualizar Datos
              </button>
            </div>
          </form>
        </div>

        {/* TARJETA 4: SEGURIDAD */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><ShieldCheck size={20}/></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Seguridad de la Cuenta</h2>
          </div>
          
          <form onSubmit={submitPass(onChangePassword)} className="space-y-5 flex-1">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Contraseña Actual</label>
              <input 
                type="password"
                {...registerPass('currentPass', { required: true })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div className="pt-2 border-t border-slate-50">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1 mt-2">Nueva Contraseña</label>
              <input 
                type="password"
                {...registerPass('newPass', { required: true, minLength: 6 })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Repetir Nueva Contraseña</label>
              <input 
                type="password"
                {...registerPass('confirmPass', { required: true })} 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
              {errors.confirmPass && (
                <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 px-1">
                  <AlertCircle size={12} /> Las contraseñas no coinciden
                </p>
              )}
            </div>

            <div className="pt-4">
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95">
                <ShieldCheck size={18} />
                Cambiar Contraseña
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}