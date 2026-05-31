/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Send, ShieldCheck, Heart, ThumbsUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast, restaurantInfo } = useAppState();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMsg.trim()) {
      addToast('Please fill out all fields first!', 'error');
      return;
    }

    addToast(`Thanks ${contactName}! Your note has been securely dispatched to Chef's desk.`, 'success');
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const chefs = [
    {
      name: 'Chef Amritpal Singh',
      role: 'Founding Chef & Culinary Director',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80',
      bio: 'Deeply passionate about slow-charcoal cooking. Trained in traditional clay-handi tandoor practices over 18 years across North India.'
    },
    {
      name: 'Sous-Chef Meera Krishnan',
      role: 'Master of Spices & Herb Procurement',
      image: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=400&auto=format&fit=crop&q=80',
      bio: 'Enforces accurate ratios of cardamom, cinnamon, and Kashmiri chillies. Oversees relationships with regional micro-farms.'
    },
    {
      name: 'Pastry Chef Rohan Deshmukh',
      role: 'Director of Traditional Sweet Dumplings',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80',
      bio: 'Dedicated to perfect reduction parameters for sweet thickened Kesari milk, cardamom Gulab Jamuns, and saffron-soaked Rasmalais.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
      
      {/* 1. DIRECT PIECE STORY HEADER */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-5">
          <span className="text-xs uppercase tracking-widest text-burgundy dark:text-gold font-bold font-mono block">Our Heritage Story</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-stone-900 dark:text-cream leading-tight">
            {restaurantInfo.name}: Cooking with Integrity
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-305 leading-relaxed font-sans">
            Founded in early 2024, <span className="font-bold text-burgundy dark:text-gold">{restaurantInfo.name}</span> was born out of frustration. We watched as heavy aggregator apps forced neighboring kitchens to inflate prices by charging severe 25% commissions, while delivery times dragged and food quality suffered.
          </p>
          <p className="text-sm text-stone-600 dark:text-stone-305 leading-relaxed font-sans">
            We chose a different route. We built our own online ordering system and support framework. By dealing with patrons directly, we protect our food and pay delivery riders fair wages. Those same exact aggregator commission savings are poured right back into buying organic stone-ground whole spices, hand-churned treading ghee, and cold-pressed mustard oils.
          </p>

          <div className="grid grid-cols-2 gap-4 border-t pt-5 text-xs text-stone-500 font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-gold shrink-0" size={16} />
              <span>100% Direct support</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="text-gold shrink-0" size={16} />
              <span>Made with neighborhood love</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="text-gold shrink-0" size={16} />
              <span>Fresh clay oven cooking</span>
            </div>
          </div>
        </div>

        {/* Story Illustration image */}
        <div className="md:col-span-5 overflow-hidden rounded-2xl shadow-xl border relative h-96">
          <img 
            src={restaurantInfo.bannerImage || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80"} 
            alt={`${restaurantInfo.name} spices assembly`} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-burgundy/15 mix-blend-multiply" />
        </div>
      </section>

      {/* 2. THE CULINARY LEADER TEAM CHASSIS */}
      <section className="space-y-10">
        <div className="text-center space-y-2 select-none">
          <span className="text-xs uppercase tracking-widest text-burgundy dark:text-gold font-bold font-mono">Our Team</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-850 dark:text-cream leading-none">The Custodians of Taste</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((c, index) => (
            <div key={index} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="h-60 bg-stone-100 overflow-hidden shrink-0">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-103" referrerPolicy="no-referrer" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-bold text-lg text-burgundy dark:text-gold font-serif leading-none">{c.name}</h4>
                  <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold block mt-1.5">{c.role}</span>
                  <p className="text-xs text-stone-550 dark:text-stone-400 leading-relaxed font-sans mt-3 italic">"{c.bio}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CONTACT FORM + HOURS INFO GRIDS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact credentials */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-855 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="space-y-1 select-none">
            <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold leading-none">Direct Connection Channels</h3>
            <p className="text-[11px] text-stone-450 leading-relaxed font-sans">Have bulk dining inquiries, feedback on your direct order, or want to say hello? Get in touch immediately.</p>
          </div>

          <div className="space-y-4 text-xs font-sans text-stone-600 dark:text-stone-300 select-all">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-burgundy/5 dark:bg-stone-950 rounded-lg text-burgundy dark:text-gold shrink-0">
                <MapPin size={16} />
              </div>
              <span>{restaurantInfo.address}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-burgundy/5 dark:bg-stone-950 rounded-lg text-burgundy dark:text-gold shrink-0">
                <Phone size={16} />
              </div>
              <span className="font-mono">{restaurantInfo.phone}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-burgundy/5 dark:bg-stone-950 rounded-lg text-burgundy dark:text-gold shrink-0">
                <Mail size={16} />
              </div>
              <span>{restaurantInfo.email}</span>
            </div>
          </div>

          <div className="border-t border-dashed pt-4 space-y-2 select-none">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Connect on Socials</h4>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-lg bg-stone-105 hover:bg-gold dark:bg-stone-95s dark:hover:bg-stone-800 text-stone-701 dark:text-stone-300 font-semibold text-xs flex items-center gap-1">
                <Instagram size={14} className="text-burgundy dark:text-gold" />
                <span>Instagram Profile</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="px-3.5 py-1.5 rounded-lg bg-stone-105 hover:bg-gold dark:bg-stone-95s dark:hover:bg-stone-800 text-stone-750 dark:text-stone-300 font-semibold text-xs flex items-center gap-1">
                <Facebook size={14} className="text-burgundy dark:text-gold" />
                <span>Facebook Page</span>
              </a>
            </div>
          </div>
        </div>

        {/* Integrated interactive contact forms */}
        <form onSubmit={handleContactSubmit} className="lg:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold border-b pb-2">Drop Chef a message</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-stone-405">Your Name</label>
              <input
                type="text"
                required
                placeholder="Enter full name..."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-xs text-stone-800 dark:text-cream"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-stone-405">Your Email</label>
              <input
                type="email"
                required
                placeholder="E.g. patron@gmail.com..."
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-xs text-stone-800 dark:text-cream"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-stone-405">Write message details</label>
            <textarea
              required
              placeholder="What details would you like to inquire about? Add them here..."
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              className="w-full h-32 p-3.5 rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-xs text-stone-800 dark:text-cream resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Send size={13} />
            <span>Submit Chef message</span>
          </button>
        </form>

      </section>

    </div>
  );
};
