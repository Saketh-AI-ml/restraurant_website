/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { MenuItem } from '../types';
import { Search, ToggleLeft, ToggleRight, Plus, Minus, ShoppingBag, Leaf, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MenuPage: React.FC = () => {
  const {
    menuItems,
    cart,
    addToCart,
    updateCartQuantity,
    adminLoggedIn,
    toggleMenuItemAvailability,
    addToast
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hardcoded typical categories for consistent tab ordering
  const categoriesList = ['All', 'Starters', 'Regular Mains', 'Biryanis', 'Desserts', 'Drinks'];

  // Simulate skeleton screen triggers on category switch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory, vegOnly]);

  // Filter items matching category, search query, and veg-only toggles
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  const getCartQuantity = (itemId: string): number => {
    const found = cart.find((c) => c.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      {/* Search and Navigation filters */}
      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search dishes (e.g. Butter Chicken, Paneer, Lassi)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-50/50 dark:bg-stone-950 focus:outline-none focus:ring-2 focus:ring-burgundy dark:focus:ring-gold text-sm text-stone-800 dark:text-cream placeholder-stone-400"
              id="menu-search-input"
            />
          </div>

          <div className="flex items-center space-x-6 shrink-0 select-none">
            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className="flex items-center space-x-2 text-sm font-semibold cursor-pointer text-stone-600 dark:text-stone-300"
              id="veg-toggle-btn"
            >
              <span className="flex items-center gap-1.1 text-emerald-600 dark:text-emerald-500 font-bold">
                <Leaf size={16} className="fill-emerald-500/10" /> Veg Only
              </span>
              {vegOnly ? (
                <ToggleRight size={28} className="text-emerald-505 shrink-0" />
              ) : (
                <ToggleLeft size={28} className="text-stone-400 shrink-0" />
              )}
            </button>
            
            {adminLoggedIn && (
              <span className="text-[10px] font-mono font-bold px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded">
                ⚙️ Admin Mode Active
              </span>
            )}
          </div>
        </div>

        {/* Categories Tab scrolling */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none" id="categories-tabs">
          {categoriesList.map((catName) => (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeCategory === catName
                  ? 'bg-burgundy text-cream dark:bg-gold dark:text-stone-900 shadow-sm'
                  : 'bg-stone-105 hover:bg-stone-200/50 dark:bg-stone-950 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-300'
              }`}
            >
              {catName === 'Regular Mains' ? '🥘 Mains' : catName === 'Starters' ? '🥗 Starters' : catName === 'Biryanis' ? '🍚 Biryanis' : catName === 'Desserts' ? '🍨 Desserts' : catName === 'Drinks' ? '🍹 Drinks' : catName}
            </button>
          ))}
        </div>
      </section>

      {/* MENU RESULTS GRID */}
      <div className="min-h-96">
        {isLoading ? (
          /* SKELETON SCREENS FOR LOADING SIMULATION */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="menu-skeletons">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850/60 rounded-2xl overflow-hidden shadow-sm p-4 space-y-4">
                <div className="skeleton-box h-48 rounded-xl w-full" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="skeleton-box h-5 w-1/2 rounded" />
                    <div className="skeleton-box h-5 w-1/6 rounded" />
                  </div>
                  <div className="skeleton-box h-3 w-4/5 rounded" />
                  <div className="skeleton-box h-3 w-3/4 rounded" />
                </div>
                <div className="skeleton-box h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-100/50 dark:bg-stone-950/20 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 space-y-3">
            <AlertTriangle className="mx-auto text-amber-500" size={36} />
            <p className="text-base text-stone-550 dark:text-stone-300 font-semibold font-serif">No recipes match current selections</p>
            <p className="text-xs text-stone-450 dark:text-stone-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="menu-cards-grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                const qtyInCart = getCartQuantity(item.id);
                const showItemState = item.isAvailable || adminLoggedIn;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={item.id}
                    className={`bg-white dark:bg-stone-900 border overflow-hidden rounded-2xl shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md ${
                      !item.isAvailable ? 'opacity-70 dark:opacity-55 border-stone-200 bg-stone-50 dark:border-stone-900' : 'border-stone-200 dark:border-stone-850/60'
                    }`}
                  >
                    <div className="relative h-52 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                          !item.isAvailable ? 'grayscale font-mono text-[10px]' : ''
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider shadow-sm font-semibold border ${
                          item.isVeg 
                            ? 'bg-emerald-550 text-emerald-700 bg-emerald-50 dark:bg-emerald-950 border-emerald-300' 
                            : 'bg-rose-550 text-rose-750 bg-rose-50 dark:bg-rose-950 border-rose-300'
                        }`}>
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </span>
                        
                        {item.isBestseller && (
                          <span className="px-2 py-0.5 bg-gold text-burgundy font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm">
                            🔥 Chef Specialty
                          </span>
                        )}
                        
                        {!item.isAvailable && (
                          <span className="px-2.5 py-0.5 bg-stone-700 text-stone-200 font-bold text-[9px] uppercase tracking-wider rounded-md shadow-sm">
                            Sold out
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-bold text-lg text-burgundy dark:text-gold font-serif leading-snug line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-base font-bold font-mono text-stone-800 dark:text-cream">
                            ₹{item.price}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed h-8 font-sans">
                          {item.description}
                        </p>
                      </div>

                      {/* Controls Section */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-850 space-y-3">
                        {/* Admin triggers overlaying customer views */}
                        {adminLoggedIn && (
                          <div className="p-2 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/15 rounded-lg flex items-center justify-between text-xs">
                            <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              {item.isAvailable ? <Eye size={12} /> : <EyeOff size={12} />} 
                              {item.isAvailable ? 'Visible to guest' : 'Disabled'}
                            </span>
                            <button
                              onClick={() => {
                                toggleMenuItemAvailability(item.id);
                                addToast(`Toggled ${item.name} availability`, 'info');
                              }}
                              className="px-2.5 py-1 bg-amber-500 text-stone-900 hover:bg-amber-400 font-bold tracking-tight uppercase rounded text-[10px] cursor-pointer"
                            >
                              Toggle Availability
                            </button>
                          </div>
                        )}

                        {/* Customer Add/Adjust CTA panel */}
                        {item.isAvailable ? (
                          qtyInCart > 0 ? (
                            <div className="flex items-center justify-between bg-burgundy/5 dark:bg-stone-950 p-1 border border-burgundy/20 rounded-xl">
                              <button
                                onClick={() => updateCartQuantity(item.id, qtyInCart - 1)}
                                className="p-2 bg-burgundy text-cream hover:bg-burgundy-light rounded-lg transition-transform hover:scale-102 cursor-pointer grow-0 shrink-0"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold text-burgundy dark:text-gold font-mono px-4">
                                {qtyInCart} in cart
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, qtyInCart + 1)}
                                className="p-2 bg-burgundy text-cream hover:bg-burgundy-light rounded-lg transition-transform hover:scale-102 cursor-pointer grow-0 shrink-0"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item, 1)}
                              className="w-full py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                            >
                              <ShoppingBag size={14} /> Add to Cart
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className="w-full py-2.5 bg-stone-200 dark:bg-stone-850 text-stone-400 dark:text-stone-600 font-bold text-xs uppercase tracking-wider rounded-xl cursor-not-allowed text-center border"
                          >
                            Out of stock
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
