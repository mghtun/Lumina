import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = () => {
    fetch('/api/reservations')
      .then(res => res.json())
      .then(data => setReservations(data));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/reservations/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchReservations();
  };

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Reservations</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <th className="p-4">Date & Time</th>
              <th className="p-4">Guest Info</th>
              <th className="p-4">Party Size</th>
              <th className="p-4">Status</th>
              <th className="p-4">Notes</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservations.map((res: any) => (
              <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{res.date}</div>
                  <div className="text-sm text-slate-500">{res.time}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{res.name}</div>
                  <div className="text-sm text-slate-500">{res.email}</div>
                  <div className="text-sm text-slate-500">{res.phone}</div>
                </td>
                <td className="p-4 font-medium text-slate-900">{res.guests}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600 max-w-xs truncate">{res.notes || '-'}</td>
                <td className="p-4 text-right space-x-2">
                  {res.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusChange(res.id, 'confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Confirm"><Check size={18} /></button>
                      <button onClick={() => handleStatusChange(res.id, 'cancelled')} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Cancel"><X size={18} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
