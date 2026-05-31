/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Search, Compass, Clock, MapPin, PhoneCall, HelpCircle, CheckCircle, PackageOpen, Truck, Landmark } from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { orders, trackingOrderId, navigateTo, addToast, restaurantInfo } = useAppState();

  const [searchInput, setSearchInput] = useState<string>('');

  // Determine active order to display tracking steps
  // If a trackingOrderId is stored on checkout transition, prefer that. Otherwise let them manually search or display their latest order.
  const activeTrackId = trackingOrderId || searchInput;

  const order = orders.find(
    (o) => o.id.toLowerCase() === activeTrackId.trim().toLowerCase()
  ) || (orders.length > 0 && !activeTrackId ? orders[0] : null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = orders.find((o) => o.id.toLowerCase() === searchInput.trim().toLowerCase());
    if (found) {
      addToast(`Order ${searchInput.toUpperCase()} found!`, 'success');
    } else {
      addToast(`Unable to find any direct order matching ID "${searchInput}"`, 'error');
    }
  };

  // Status mapping logic
  const stepsList = [
    { key: 'received', label: 'Order Received', desc: 'Sautéing kitchen fires. Chef has confirmed receipt.', icon: <CheckCircle size={18} /> },
    { key: 'preparing', label: 'In Preparation', desc: 'Ingredients chopped, cooking in traditional handi.', icon: <PackageOpen size={18} /> },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider is zooming with hot insulated bags.', icon: <Truck size={18} /> },
    { key: 'delivered', label: 'Delivered', desc: 'Plated hot and fresh. Bon appétit!', icon: <Landmark size={18} /> }
  ];

  // Helper to determine status step indexes
  const getStatusIndex = (statCode: string): number => {
    switch (statCode) {
      case 'delivered': return 3;
      case 'out_for_delivery': return 2;
      case 'preparing': return 1;
      case 'received':
      default:
        return 0;
    }
  };

  const activeIndex = order ? getStatusIndex(order.status) : 0;

  // Calculate realistic ETA time
  const getETAString = (createdAt: string): string => {
    const orderDate = new Date(createdAt);
    // Add exactly 35 minutes for delivery ETA
    const etaDate = new Date(orderDate.getTime() + 35 * 60 * 1000);
    return etaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      {/* Search Order bar */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="text-center space-y-1 select-none">
            <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold leading-none">Track Direct Order</h3>
            <p className="text-[11px] text-stone-450">Input your direct Order ID below (E.g. SSK-123456) to view active cook parameters.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-stone-400" size={16} />
              <input
                type="text"
                placeholder="E.g., SSK-123456..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-50/50 dark:bg-stone-950 text-stone-850 dark:text-cream focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm text-center"
            >
              Verify Tracking
            </button>
          </div>
        </form>
      </section>

      {order ? (
        /* TRACKER GRID CONTAINER */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-4xl mx-auto items-start">
          
          {/* Timeline tracker */}
          <div className="md:col-span-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b pb-4 select-none">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400">Arriving status timeline</span>
                <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold leading-none">Order Tracking</h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-burgundy/5 text-burgundy dark:bg-gold/10 dark:text-gold border rounded leading-none">
                ID: {order.id}
              </span>
            </div>

            {/* Steps tracker map */}
            <div className="relative pl-10 space-y-8">
              {/* Vertical bridge line */}
              <div className="absolute left-4 top-2 bottom-2 w-1.5 bg-stone-105 dark:bg-stone-950 rounded-full overflow-hidden">
                <div 
                  className="bg-burgundy dark:bg-gold transition-all duration-500 ease-out" 
                  style={{ height: `${(activeIndex / 3) * 100}%` }}
                />
              </div>

              {stepsList.map((step, idx) => {
                const isPassed = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Ring Badge */}
                    <div className={`absolute -left-10 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                      isCurrent 
                        ? 'bg-burgundy text-gold dark:bg-gold dark:text-stone-900 ring-4 ring-burgundy/10 scale-108'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-450 border border-emerald-300'
                        : 'bg-stone-50 text-stone-400 dark:bg-stone-905 border'
                    }`}>
                      {step.icon}
                    </div>

                    {/* Meta descriptions */}
                    <div className="space-y-0.5">
                      <h4 className={`text-sm font-bold font-sans ${isCurrent ? 'text-burgundy dark:text-gold text-base' : isPassed ? 'text-stone-800 dark:text-stone-200 font-semibold' : 'text-stone-400'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs ${isCurrent ? 'text-stone-600 dark:text-stone-300 font-medium' : 'text-stone-450 dark:text-stone-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick contact / ETA sidebar */}
          <div className="md:col-span-4 space-y-6">
            
            {/* ETA Clock panel wrapper */}
            {order.status !== 'delivered' && (
              <div className="bg-stone-900 text-cream p-5 rounded-2xl shadow text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-burgundy" />
                <Clock className="mx-auto text-gold animate-spin" size={28} />
                <div className="space-y-0.5 select-none">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400">Estimated Delivery Time</span>
                  <p className="text-3xl font-black font-serif text-cream">{getETAString(order.createdAt)}</p>
                </div>
                <p className="text-[10px] text-stone-400 font-sans leading-relaxed">Made fresh to your custom instructions, and zooming in modern food insulated containers.</p>
              </div>
            )}

            {/* Address tracker panel */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 rounded-2xl shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Arriving at address</h4>
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="text-burgundy dark:text-gold shrink-0 mt-0.5" size={14} />
                <span className="leading-snug text-stone-700 dark:text-stone-300 font-sans">{order.address}</span>
              </div>
            </div>

            {/* Support desk builder triggers */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-5 rounded-2xl shadow-sm text-center space-y-4">
              <HelpCircle className="mx-auto text-burgundy dark:text-gold" size={24} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-serif text-stone-800 dark:text-cream leading-tight">Need assistance?</h4>
                <p className="text-[10px] text-stone-450 leading-relaxed font-sans">Contact our hotline directly or click below to launch a direct desk helpline on WhatsApp support.</p>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(restaurantInfo.phone)}&text=${encodeURIComponent(`Greetings ${restaurantInfo.name} team, checking in on order ${order.id}. Could you kindly give me a status update? Thank you!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-colors inline-flex items-center justify-center gap-1 cursor-pointer shadow-sm"
              >
                <PhoneCall size={13} /> Contact Kitchen desk
              </a>
            </div>

          </div>

        </div>
      ) : (
        /* NO ORDER SELECTED SHOWCASE */
        <div className="text-center py-20 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 max-w-xl mx-auto rounded-3xl p-8 space-y-4">
          <Compass className="mx-auto text-stone-300 animate-pulse" size={40} />
          <h3 className="text-xl font-bold font-serif text-stone-850 dark:text-cream">No order currently tracked</h3>
          <p className="text-xs text-stone-450 max-w-sm mx-auto leading-relaxed">
            Please search for an order above using your ID, or proceed to the Menu to place your food request. Direct transactions immediately auto-load active trackers.
          </p>
          <button
            onClick={() => navigateTo('menu')}
            className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow"
          >
            Explore Menu & Place Order
          </button>
        </div>
      )}
    </div>
  );
};
