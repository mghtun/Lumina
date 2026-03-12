import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { t } from '../translations';

export default function Menu() {
  const { language } = useOutletContext<any>();
  const lang = t[language as 'en' | 'my'];
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/menu').then(res => res.json())
    ]).then(([cats, items]) => {
      setCategories(cats);
      setMenuItems(items);
      if (cats.length > 0) {
        setActiveCategory(cats[0].name);
      }
    });
  }, []);

  const filteredItems = menuItems.filter((item: any) => item.category_name === activeCategory);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">{lang.menuTitle}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {lang.menuSub}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-2 rounded-full text-sm tracking-widest uppercase font-bold transition-colors ${
                activeCategory === cat.name
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <motion.div 
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {filteredItems.map((item: any) => (
            <div key={item.id} className="flex gap-6 group">
              {item.image_url && (
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}
              <div className="flex-grow">
                <div className="flex justify-between items-baseline mb-2 border-b border-slate-200 pb-2">
                  <h3 className="text-xl font-serif font-bold text-slate-900">{item.name}</h3>
                  <span className="text-lg font-medium text-slate-900 ml-4">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
