import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { t } from '../translations';

export default function Reservation() {
  const { language } = useOutletContext<any>();
  const lang = t[language as 'en' | 'my'];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    special_requests: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guests: parseInt(formData.guests)
        })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({
          name: '', email: '', phone: '', date: '', time: '', guests: '2', special_requests: ''
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">{lang.resTitle}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {lang.resSub}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Info Panel */}
            <div className="bg-slate-900 text-white p-12 md:col-span-2 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-serif mb-8">{lang.resInfo}</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Clock className="mr-4 mt-1 text-slate-400" size={20} />
                    <div>
                      <h4 className="font-bold tracking-widest uppercase text-xs text-slate-400 mb-1">{lang.hours}</h4>
                      <p className="text-sm leading-relaxed">Mon-Thu: 5pm - 10pm<br/>Fri-Sat: 5pm - 11pm<br/>Sun: 4pm - 9pm</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="mr-4 mt-1 text-slate-400" size={20} />
                    <div>
                      <h4 className="font-bold tracking-widest uppercase text-xs text-slate-400 mb-1">{lang.contact}</h4>
                      <p className="text-sm leading-relaxed">+1 (555) 123-4567<br/>reservations@lumina.com</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-12 border-t border-slate-800">
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang.resPolicy}
                </p>
              </div>
            </div>

            {/* Form Panel */}
            <div className="p-12 md:col-span-3">
              {status === 'success' ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-serif text-slate-900">{lang.resSuccess}</h3>
                  <p className="text-slate-600">{lang.resSuccessMsg}</p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm hover:bg-slate-800 transition-colors"
                  >
                    {lang.bookAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Date */}
                    <div className="relative">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.date}</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="date" 
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Time */}
                    <div className="relative">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.time}</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none"
                        >
                          <option value="">Select time</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="17:30">5:30 PM</option>
                          <option value="18:00">6:00 PM</option>
                          <option value="18:30">6:30 PM</option>
                          <option value="19:00">7:00 PM</option>
                          <option value="19:30">7:30 PM</option>
                          <option value="20:00">8:00 PM</option>
                          <option value="20:30">8:30 PM</option>
                          <option value="21:00">9:00 PM</option>
                        </select>
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="relative md:col-span-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.guests}</label>
                      <div className="relative">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select 
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all appearance-none"
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                          ))}
                          <option value="11">11+ People (Call us)</option>
                        </select>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="relative md:col-span-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.name}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.phone}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all" 
                        />
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div className="relative md:col-span-2">
                      <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2">{lang.specialReq}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-slate-400" size={18} />
                        <textarea 
                          name="special_requests"
                          rows={3}
                          value={formData.special_requests}
                          onChange={handleChange}
                          placeholder="Allergies, anniversaries, dietary requirements..."
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition-all resize-none" 
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                      An error occurred while submitting your reservation. Please try again or call us directly.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === 'submitting'}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Processing...' : lang.confirmRes}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
