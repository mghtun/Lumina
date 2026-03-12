import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export default function MenuManager() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = () => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/menu').then(res => res.json())
    ]).then(([cats, menuItems]) => {
      setCategories(cats);
      setItems(menuItems);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setEditForm(item);
  };

  const handleSave = async (id: number) => {
    await fetch(`/api/menu/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setIsEditing(null);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const handleAdd = async () => {
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    });
    setIsAdding(false);
    setEditForm({});
    fetchData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Menu Manager</h1>
        <button 
          onClick={() => { setIsAdding(true); setEditForm({ category_id: categories[0]?.id, is_popular: false }); }}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-slate-800"
        >
          <Plus size={20} />
          <span>Add Item</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500 uppercase tracking-wider">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Popular</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isAdding && (
              <tr className="bg-blue-50/50">
                <td className="p-4">
                  <input type="text" placeholder="Image URL" value={editForm.image_url || ''} onChange={e => setEditForm({...editForm, image_url: e.target.value})} className="w-full p-2 border rounded" />
                </td>
                <td className="p-4">
                  <input type="text" placeholder="Name" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded mb-2" />
                  <textarea placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2 border rounded text-sm" rows={2} />
                </td>
                <td className="p-4">
                  <select value={editForm.category_id || ''} onChange={e => setEditForm({...editForm, category_id: parseInt(e.target.value)})} className="w-full p-2 border rounded">
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </td>
                <td className="p-4">
                  <input type="number" step="0.01" placeholder="Price" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} className="w-24 p-2 border rounded" />
                </td>
                <td className="p-4">
                  <input type="checkbox" checked={editForm.is_popular || false} onChange={e => setEditForm({...editForm, is_popular: e.target.checked})} className="w-5 h-5" />
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={handleAdd} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={20} /></button>
                  <button onClick={() => setIsAdding(false)} className="p-2 text-red-600 hover:bg-red-50 rounded"><X size={20} /></button>
                </td>
              </tr>
            )}
            
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                {isEditing === item.id ? (
                  <>
                    <td className="p-4">
                      <input type="text" value={editForm.image_url || ''} onChange={e => setEditForm({...editForm, image_url: e.target.value})} className="w-full p-2 border rounded" />
                    </td>
                    <td className="p-4">
                      <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded mb-2" />
                      <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full p-2 border rounded text-sm" rows={2} />
                    </td>
                    <td className="p-4">
                      <select value={editForm.category_id || ''} onChange={e => setEditForm({...editForm, category_id: parseInt(e.target.value)})} className="w-full p-2 border rounded">
                        {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </td>
                    <td className="p-4">
                      <input type="number" step="0.01" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} className="w-24 p-2 border rounded" />
                    </td>
                    <td className="p-4">
                      <input type="checkbox" checked={editForm.is_popular || false} onChange={e => setEditForm({...editForm, is_popular: e.target.checked})} className="w-5 h-5" />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleSave(item.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={20} /></button>
                      <button onClick={() => setIsEditing(null)} className="p-2 text-slate-600 hover:bg-slate-100 rounded"><X size={20} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs">No img</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="p-4 text-slate-600">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">{item.category_name}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-900">${item.price.toFixed(2)}</td>
                    <td className="p-4">
                      {item.is_popular ? (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase tracking-wider">Star</span>
                      ) : null}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={18} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
