import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Briefcase, Gavel, Users, ArrowUpRight } from 'lucide-react';

export default function StatsGrid() {
  const [stats, setStats] = useState({ total: 0, enSentencia: 0, audienciasMes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/causas/stats/general');
        setStats(data);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"></div>)}
    </div>
  );

  const cards = [
    { title: 'Total Expedientes', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'En Sentencia', value: stats.enSentencia, icon: Gavel, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Audiencias Mes', value: stats.audienciasMes, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${card.bg} ${card.color} transition-colors group-hover:bg-blue-600 group-hover:text-white`}>
              <card.icon size={24} />
            </div>
            <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}