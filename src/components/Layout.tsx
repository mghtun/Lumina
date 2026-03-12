import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Mail, Instagram, Facebook, Twitter, Globe } from 'lucide-react';
import { t } from '../translations';

export default function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<any>({});
  const [language, setLanguage] = useState<'en' | 'my'>('en');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'my' : 'en');
  };

  const lang = t[language];

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className={`text-2xl font-serif tracking-tight font-bold ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            {settings.restaurant_name || 'Lumina'}
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-sm tracking-wide uppercase font-medium hover:opacity-70 transition-opacity ${isScrolled ? 'text-slate-900' : 'text-white'}`}>{lang.home}</Link>
            <Link to="/menu" className={`text-sm tracking-wide uppercase font-medium hover:opacity-70 transition-opacity ${isScrolled ? 'text-slate-900' : 'text-white'}`}>{lang.menu}</Link>
            <Link to="/reservation" className={`px-6 py-2 border rounded-full text-sm tracking-wide uppercase font-medium transition-colors ${
              isScrolled 
                ? 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white' 
                : 'border-white text-white hover:bg-white hover:text-slate-900'
            }`}>
              {lang.bookTable}
            </Link>
            <button 
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 text-sm font-medium hover:opacity-70 transition-opacity ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'မြန်မာ' : 'EN'}</span>
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 text-sm font-medium ${isScrolled ? 'text-slate-900' : 'text-white'}`}
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'မြန်မာ' : 'EN'}</span>
            </button>
            <button 
              className={`${isScrolled ? 'text-slate-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900 text-white flex flex-col items-center justify-center space-y-8">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">{lang.home}</Link>
          <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">{lang.menu}</Link>
          <Link to="/reservation" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-serif">{lang.bookTable}</Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet context={{ settings, language }} />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif text-white mb-6">{settings.restaurant_name || 'Lumina'}</h3>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              {settings.tagline || 'A Culinary Journey Through Light and Flavor'}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">{lang.contactUs}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 flex-shrink-0" />
                <span>{settings.address || '123 Culinary Ave, NY 10001'}</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 flex-shrink-0" />
                <span>{settings.phone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 flex-shrink-0" />
                <span>{settings.email || 'reservations@luminarestaurant.com'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">{lang.openingHours}</h4>
            <ul className="space-y-3 text-sm">
              {settings.opening_hours ? JSON.parse(settings.opening_hours).map((h: any, i: number) => (
                <li key={i} className="flex justify-between border-b border-slate-800 pb-2">
                  <span>{h.day}</span>
                  <span>{h.hours}</span>
                </li>
              )) : (
                <li>Check back soon for our hours.</li>
              )}
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} {settings.restaurant_name || 'Lumina'}. {lang.allRights}
        </div>
      </footer>
    </div>
  );
}
