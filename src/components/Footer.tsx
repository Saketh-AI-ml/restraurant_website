/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppState } from '../context/StateContext';
import { ChefHat, Phone, MapPin, Mail, Instagram, Facebook, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, restaurantInfo } = useAppState();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-stone-900 text-stone-300 border-t-4 border-burgundy pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-burgundy text-gold">
              <ChefHat size={22} />
            </div>
            <span className="text-xl font-bold font-serif text-cream">{restaurantInfo.name}</span>
          </div>
          <p className="text-xs text-stone-400 font-serif italic">
            "Real food. Zero middlemen commission. Delivered hot and fresh with care and direct community love."
          </p>
          <div className="p-3.5 rounded-lg bg-burgundy/10 border border-burgundy/20">
            <h5 className="text-xs text-gold font-bold uppercase tracking-wider mb-1">Direct Ordering Guarantee</h5>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Skip third-party giants. Direct ordering ensures 100% of your money goes directly to our local kitchen and delivery riders.
            </p>
          </div>
        </div>

        {/* Action Direct Links */}
        <div>
          <h4 className="text-sm font-bold text-cream uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            Explore Menu
          </h4>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <button onClick={() => navigateTo('menu')} className="hover:text-gold hover:underline transition-colors block text-left">
                🥗 Appetizing Starters
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('menu')} className="hover:text-gold hover:underline transition-colors block text-left">
                🍲 Rich Indian Mains
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('menu')} className="hover:text-gold hover:underline transition-colors block text-left">
                🍚 Hyderabadi Biryanis
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('menu')} className="hover:text-gold hover:underline transition-colors block text-left">
                🍨 Authentic Desserts
              </button>
            </li>
          </ul>
        </div>

        {/* Hours & Schedule */}
        <div>
          <h4 className="text-sm font-bold text-cream uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            Chef Hours
          </h4>
          <table className="w-full text-xs space-y-2 text-stone-450 border-collapse">
            <tbody>
              <tr className="border-b border-stone-800/10">
                <td className="py-1.5 font-semibold text-stone-300">Mon - Fri:</td>
                <td className="py-1.5 text-right font-mono">11:00 AM - 11:00 PM</td>
              </tr>
              <tr className="border-b border-stone-800/10">
                <td className="py-1.5 font-semibold text-stone-300">Sat - Sun:</td>
                <td className="py-1.5 text-right font-mono">11:00 AM - Midnight</td>
              </tr>
              <tr>
                <td className="py-2 text-gold font-semibold" colSpan={2}>
                  🟢 Now Accepting Orders Directly
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Neighborhood Contact info */}
        <div>
          <h4 className="text-sm font-bold text-cream uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
            {restaurantInfo.name} Base
          </h4>
          <ul className="space-y-3.5 text-xs text-stone-400">
            <li className="flex items-start space-x-2">
              <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
              <span>{restaurantInfo.address}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={16} className="text-gold shrink-0" />
              <span className="font-mono">{restaurantInfo.phone}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={16} className="text-gold shrink-0" />
              <span>{restaurantInfo.email}</span>
            </li>
            <li className="flex items-center space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-stone-800 hover:bg-gold hover:text-stone-900 transition-colors">
                <Instagram size={14} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-stone-800 hover:bg-gold hover:text-stone-900 transition-colors">
                <Facebook size={14} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Attribution & Legal disclaimer */}
      <div className="max-w-7xl mx-auto border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500">
        <p>© {currentYear} {restaurantInfo.name} Kitchen (Direct ordering template by AI Studio). All rights reserved.</p>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0 font-semibold text-stone-400">
          <button 
            onClick={() => navigateTo('admin')} 
            className="hover:text-gold transition-colors underline decoration-stone-700 decoration-wavy"
          >
            Portal Entry (Chef Admin@123)
          </button>
          <span>•</span>
          <span className="flex items-center">
            Made with <Heart size={10} className="mx-1 text-burgundy fill-burgundy" /> in Hyderabad
          </span>
        </div>
      </div>
    </footer>
  );
};
