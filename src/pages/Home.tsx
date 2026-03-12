import { useOutletContext, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, ChevronRight } from 'lucide-react';
import { t } from '../translations';

export default function Home() {
  const { settings, language } = useOutletContext<any>();
  const [popularItems, setPopularItems] = useState([]);
  const lang = t[language as 'en' | 'my'];

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setPopularItems(data.filter((item: any) => item.is_popular).slice(0, 3)));
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={settings.hero_image || 'https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=1920&auto=format&fit=crop'} 
            alt="Restaurant Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 tracking-tight"
          >
            {settings.restaurant_name || 'Lumina'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-slate-100 mb-10 font-medium tracking-wide drop-shadow-md"
          >
            {settings.tagline || lang.storyTitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link 
              to="/reservation" 
              className="inline-block bg-white text-slate-900 px-8 py-4 rounded-full text-sm tracking-widest uppercase font-bold hover:bg-slate-100 transition-colors shadow-lg"
            >
              {lang.bookTable}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">{lang.story}</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-8 leading-tight">
                {lang.storyTitle}
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {settings.about_text || 'Lumina is a modern fine-dining experience where culinary artistry meets contemporary elegance.'}
              </p>
              
              <div className="border-l-4 border-slate-900 pl-6 mt-12">
                <h4 className="text-xl font-serif font-bold text-slate-900 mb-2">{lang.meetChef} {settings.chef_name || 'Chef Elena'}</h4>
                <p className="text-slate-600 italic">
                  "{settings.chef_bio || 'With over 15 years of experience...'}"
                </p>
              </div>
            </div>
            <div className="relative h-[600px]">
              <img 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1000&auto=format&fit=crop" 
                alt="Chef plating a dish" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">{lang.chefRecs}</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-slate-900">{lang.signatureDishes}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {popularItems.map((item: any) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative h-80 mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-serif font-bold text-slate-900">{item.name}</h4>
                  <span className="text-lg font-medium text-slate-900">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/menu" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-slate-600 transition-colors">
              {lang.viewMenu} <ChevronRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Star className="mx-auto text-yellow-500 mb-8" size={32} />
          <h3 className="text-3xl md:text-4xl font-serif mb-12 leading-relaxed">
            "An unforgettable dining experience. The attention to detail in every dish is simply extraordinary. A true culinary gem in the heart of the city."
          </h3>
          <p className="text-sm tracking-widest uppercase font-bold text-slate-400">
            — The New York Times
          </p>
        </div>
      </section>

      {/* FAQ & Contact */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* FAQ */}
            <div>
              <div className="mb-12">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">{lang.info}</h2>
                <h3 className="text-4xl font-serif text-slate-900">{lang.faq}</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{lang.dietaryQ}</h4>
                  <p className="text-slate-600">{lang.dietaryA}</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{lang.dressQ}</h4>
                  <p className="text-slate-600">{lang.dressA}</p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{lang.parkQ}</h4>
                  <p className="text-slate-600">{lang.parkA}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-10 rounded-2xl shadow-xl">
              <h3 className="text-3xl font-serif text-slate-900 mb-6">{lang.sendInquiry}</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                await fetch('/api/contacts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(Object.fromEntries(data.entries()))
                });
                form.reset();
                alert(lang.successMsg);
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{lang.name}</label>
                  <input type="text" name="name" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{lang.email}</label>
                  <input type="email" name="email" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{lang.message}</label>
                  <textarea name="message" rows={4} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold tracking-widest uppercase text-sm hover:bg-slate-800 transition-colors">
                  {lang.sendMsg}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
