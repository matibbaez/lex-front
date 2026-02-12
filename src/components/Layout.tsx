import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, Calendar, User, LogOut, Search, Bell, Briefcase, ChevronRight, HelpCircle } from 'lucide-react';
import api from '../api/axios';

export default function Layout() {
  // --- ESTADOS ---
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // --- 1. VERIFICACIÓN DE USUARIO (Al cargar) ---
  // Dentro de Layout.tsx

  useEffect(() => {
    const checkUser = async () => {
      // 1. Guardamos el momento en que empezamos a cargar
      const start = Date.now();

      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch (error) {
        console.error("Error de autenticación", error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        // 2. Calculamos cuánto tiempo pasó
        const end = Date.now();
        const elapsed = end - start;
        const delayMinimo = 1500; // 1.5 segundos para que se aprecie el diseño

        // 3. Si cargó muy rápido, esperamos lo que falte
        if (elapsed < delayMinimo) {
          setTimeout(() => {
            setLoading(false);
          }, delayMinimo - elapsed);
        } else {
          setLoading(false);
        }
      }
    };

    checkUser();
  }, [navigate]);

  // --- 2. LÓGICA DE BÚSQUEDA GLOBAL ---
  useEffect(() => {
    const buscarCausas = async () => {
      if (query.trim().length < 2) {
        setResultados([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await api.get(`/causas/search?q=${query}`);
        setResultados(data);
      } catch (error) {
        console.error("Error en búsqueda:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(buscarCausas, 300); // Debounce de 300ms
    return () => clearTimeout(timer);
  }, [query]);

  // --- 3. CERRAR BUSCADOR AL CLICKEAR AFUERA ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResultados([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Pantalla de carga inicial
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] relative overflow-hidden">
        
        {/* Esferas de fondo para coherencia con el Login */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 rounded-full blur-[120px]"></div>

        <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-700">
          {/* Logo con pulso sutil */}
          <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-white mb-8 animate-pulse">
            <Briefcase className="text-blue-600" size={48} />
          </div>

          {/* Spinner Moderno */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute w-16 h-16 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          {/* Textos de Branding */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter mb-1">
              Tu<span className="text-blue-600">Lex</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] animate-pulse">
              Sincronizando Expedientes
            </p>
          </div>
        </div>

        {/* Footer de la Agencia */}
        <div className="absolute bottom-10 text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
          <div className="h-px w-8 bg-slate-200"></div>
          Powered by VisionPath
          <div className="h-px w-8 bg-slate-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-600 overflow-hidden">
      
      {/* --- SIDEBAR IZQUIERDO --- */}
      <aside className="w-72 bg-white flex flex-col border-r border-slate-100 z-20 shrink-0">
        <div className="h-24 flex items-center px-8">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-100">
            <Briefcase className="text-white" size={24} />
          </div>
          <div>
            <span className="block text-lg font-bold text-slate-800 tracking-tight">TuLex</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Management</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 py-4">
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/dashboard') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
            <Home size={20} />
            <span className="font-semibold text-sm">Inicio</span>
          </Link>

          <Link to="/causas/nueva" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/causas/nueva') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
            <Plus size={20} />
            <span className="font-semibold text-sm">Nueva Causa</span>
          </Link>

          <Link to="/agenda" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/agenda') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
            <Calendar size={20} />
            <span className="font-semibold text-sm">Agenda</span>
          </Link>

          <div className="pt-6 border-t border-slate-50 mt-4">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ajustes</p>
            <Link to="/perfil" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/perfil') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
              <User size={20} />
              <span className="font-semibold text-sm">Mi Perfil</span>
            </Link>

            <Link to="/ayuda" className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive('/ayuda') ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'hover:bg-blue-50 hover:text-blue-600'}`}>
              <HelpCircle size={20} />
              <span className="font-semibold text-sm">Cómo usar TuLex</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- ÁREA PRINCIPAL --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER SUPERIOR */}
        <header className="h-20 flex items-center justify-between px-10 shrink-0">
          
          {/* BUSCADOR CON DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded-full px-5 py-2.5 shadow-sm border border-slate-100 w-96 focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:border-blue-400 transition-all">
              <Search size={18} className={isSearching ? "text-blue-500 animate-pulse" : "text-slate-300"} />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar carátula o expediente..." 
                className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-600 placeholder:text-slate-300" 
              />
            </div>

            {/* RESULTADOS DE BÚSQUEDA */}
            {resultados.length > 0 && (
              <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2">
                  {resultados.map((causa: any) => (
                    <button
                      key={causa.id}
                      onClick={() => {
                        navigate(`/causas/${causa.id}`);
                        setQuery('');
                        setResultados([]);
                      }}
                      className="w-full text-left px-5 py-4 hover:bg-blue-50 rounded-2xl transition-colors group flex justify-between items-center"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors">{causa.caratula}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{causa.nro_expediente || 'Sin Nro'}</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-500 ml-3 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* PERFIL & NOTIFICACIONES */}
          {/* PERFIL & NOTIFICACIONES */}
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                {/* CAMBIO ACÁ: Quitamos 'Mariana' y ponemos 'Usuario' como fallback */}
                <p className="text-xs font-bold text-slate-800">{user?.nombre || 'Usuario'}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase">Socio Titular</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-black shadow-lg shadow-blue-100 uppercase border-2 border-white">
                {/* CAMBIO ACÁ: Fallback 'U' de Usuario */}
                {user?.nombre?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENIDO SCROLLABLE */}
        <main className="flex-1 overflow-y-auto p-10 scroll-smooth">
           <div className="max-w-6xl mx-auto">
             <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}