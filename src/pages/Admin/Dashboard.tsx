import { useEffect, useState } from 'react';
import { Users, CalendarDays, UtensilsCrossed, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    reservations: 0,
    menuItems: 0,
    contacts: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/reservations').then(res => res.json()),
      fetch('/api/menu').then(res => res.json()),
      fetch('/api/contacts').then(res => res.json())
    ]).then(([resData, menuData, contactData]) => {
      setStats({
        reservations: resData.length,
        menuItems: menuData.length,
        contacts: contactData.length
      });
    });
  }, []);

  const statCards = [
    { title: 'Total Reservations', value: stats.reservations, icon: CalendarDays, color: 'bg-blue-500' },
    { title: 'Menu Items', value: stats.menuItems, icon: UtensilsCrossed, color: 'bg-emerald-500' },
    { title: 'Inquiries', value: stats.contacts, icon: Users, color: 'bg-purple-500' },
    { title: 'Revenue (Est)', value: '$0', icon: TrendingUp, color: 'bg-amber-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
              <div className={`p-4 rounded-lg text-white ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">Recent Activity</h2>
        <p className="text-slate-500">Select a section from the sidebar to manage your restaurant.</p>
      </div>
    </div>
  );
}
