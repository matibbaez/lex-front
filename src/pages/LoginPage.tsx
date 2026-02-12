import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Mail, Lock, Scale, ShieldCheck, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    try {
      setError('');
      const response = await api.post('/auth/login', data);
      
      // CAMBIÁ ESTA LÍNEA:
      localStorage.setItem('token', response.data.access_token); // <--- Usamos access_token
      
      navigate('/dashboard');
    } catch (err: any) {
      setError('Credenciales incorrectas. Revisá tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans">
      
      {/* 1. ELEMENTOS DE FONDO (Para el toque "Boutique") */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]"></div>

      <div className="relative z-10 w-full max-w-md p-6">
        
        {/* LOGO & TEXTO */}
        <div className="text-center mb-10 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex p-4 bg-white rounded-[2rem] shadow-xl shadow-blue-100 border border-slate-50 mb-6">
            <Scale className="text-blue-600" size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">
            Tu<span className="text-blue-600">Lex</span>
          </h1>
          <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">Gestión Jurídica Inteligente</p>
        </div>

        {/* TARJETA DE LOGIN */}
        <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-white animate-in slide-in-from-bottom-8 duration-700">
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">Bienvenida,</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Ingresá tus credenciales para continuar.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email del Estudio</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="admin@estudio.com"
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  {...register('password', { required: true })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/50 border border-slate-200 rounded-2xl p-4 pl-12 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium placeholder:text-slate-300"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs font-bold animate-shake">
                {error}
              </div>
            )}

            <button 
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl hover:bg-blue-700 font-bold text-sm shadow-xl shadow-blue-100 transition-all flex justify-center items-center gap-2 active:scale-95 disabled:opacity-50 group"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Verificando...</span>
              ) : (
                <>
                  Entrar al Panel
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* FOOTER LOGIN */}
        <div className="mt-10 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck size={14} className="text-emerald-500" />
            Conexión Segura Encriptada
          </div>
          <p className="text-slate-300 text-[10px]">© 2026 Estudio Jurídico M&M. Todos los derechos reservados.</p>
        </div>

      </div>
    </div>
  );
}