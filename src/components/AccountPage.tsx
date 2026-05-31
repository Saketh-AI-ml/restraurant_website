/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { Gift, Award, LogOut, CheckCircle2, ShoppingBag, Edit3, MapPin, Phone, Mail, RotateCcw, Lock, ArrowRight, UserPlus } from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    addToCart,
    loginCustomer,
    registerCustomer,
    logoutCustomer,
    updateUserProfile,
    navigateTo,
    addToast
  } = useAppState();

  // Login & Registration state toggles
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('');
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');

  // Profile editing state toggles
  const [editMode, setEditMode] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>(currentUser ? currentUser.name : '');
  const [profilePhone, setProfilePhone] = useState<string>(currentUser ? currentUser.phone : '');
  const [profileAddress, setProfileAddress] = useState<string>('');

  // Handle Login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    if (isRegistering) {
      if (!nameInput.trim() || !phoneInput.trim()) {
        addToast('Please fill out all registration fields!', 'error');
        return;
      }
      const success = registerCustomer(nameInput, emailInput, phoneInput);
      if (success) {
        // Reset inputs
        setEmailInput('');
        setNameInput('');
        setPhoneInput('');
      }
    } else {
      const success = loginCustomer(emailInput);
      if (success) {
        setEmailInput('');
      }
    }
  };

  // Reorder Past Order Action
  const handleReorder = (pastOrder: any) => {
    if (pastOrder.items.length === 0) return;
    
    // Attempt to match each item to current menu to carry over details
    pastOrder.items.forEach((item: any) => {
      // Find matching item in menu state
      const foundMenuItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        isAvailable: true, // assume available for demo reorders
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300',
        description: 'Previously ordered recipe',
        category: 'Main Course',
        isBestseller: false
      };
      
      addToCart(foundMenuItem, item.quantity);
    });

    addToast('Reordered items successfully copied to your active cart!', 'success');
    navigateTo('cart');
  };

  // Profile save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim() || !profilePhone.trim()) {
      addToast('Profile details must be fully filled!', 'error');
      return;
    }
    updateUserProfile(profileName, profilePhone, profileAddress);
    setEditMode(false);
    setProfileAddress('');
  };

  // Filter orders made by the currently logged-in user
  const loggedInUserOrders = currentUser
    ? orders.filter((o) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  // Determine Loyalty tier
  const getLoyaltyTier = (pts: number) => {
    if (pts >= 300) return { name: '🏅 Gold Member', desc: '10% more bonus points per order, priority premium packaging!', color: 'text-amber-500 bg-amber-500/10 border-amber-500/25' };
    if (pts >= 150) return { name: '🥈 Silver Member', desc: '5% more bonus benefits!', color: 'text-stone-400 bg-stone-500/10 border-stone-500/25' };
    return { name: '🥉 Bronze Foodie', desc: 'Accumulate points to unlock tasty credit benefits.', color: 'text-amber-700 bg-amber-700/10 border-amber-700/25' };
  };

  const currentTier = currentUser ? getLoyaltyTier(currentUser.loyaltyPoints) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {currentUser ? (
        /* ACC PANEL IF LOGGED IN */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PROFILE CARD & LOYALTY BALANCE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm text-center relative overflow-hidden space-y-5">
              
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-burgundy via-gold to-burgundy" />

              <div className="w-20 h-20 bg-burgundy/5 dark:bg-burgundy/15 text-burgundy dark:text-gold rounded-full flex items-center justify-center text-3xl font-bold font-serif mx-auto border border-burgundy/10 shadow-sm mt-3 uppercase">
                {currentUser.name.charAt(0)}
              </div>

              <div>
                <h3 className="text-xl font-bold font-serif text-stone-800 dark:text-cream leading-tight">{currentUser.name}</h3>
                <span className="text-xs text-stone-450 font-mono block mt-1">{currentUser.email}</span>
              </div>

              {/* Loyalty showcase */}
              <div className="p-4 rounded-xl bg-cream-dark/30 dark:bg-stone-950/40 border border-stone-200/50 dark:border-stone-850 text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-stone-500">Tier Status:</span>
                  <span className={`px-2.5 py-0.5 rounded border text-[10px] font-extrabold uppercase font-sans ${currentTier?.color}`}>
                    {currentTier?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center leading-none border-t border-dashed pt-2.5">
                  <span className="text-xs font-semibold text-stone-500">Loyalty Balance:</span>
                  <span className="text-lg font-black font-serif text-gold flex items-center gap-0.5">⭐ {currentUser.loyaltyPoints} Pts</span>
                </div>
                <p className="text-[10px] text-stone-450 italic leading-snug font-sans mt-1">
                  Active value: <span className="font-bold text-stone-605">₹{currentUser.loyaltyPoints * 0.5} cashback credit</span>. {currentTier?.desc}
                </p>
              </div>

              {/* Utility actions */}
              <div className="pt-4 border-t flex flex-col gap-2 font-semibold">
                <button
                  onClick={() => {
                    setProfileName(currentUser.name);
                    setProfilePhone(currentUser.phone);
                    setEditMode(!editMode);
                  }}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs flex items-center justify-center gap-1 border border-stone-300/40"
                >
                  <Edit3 size={13} /> {editMode ? 'Close profile editor' : 'Edit profile / phone'}
                </button>

                <button
                  onClick={logoutCustomer}
                  className="w-full py-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer font-bold border border-rose-500/10"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>

            {/* Profile editor panel */}
            {editMode && (
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4 animate-in slide-in-from-top-3 duration-200">
                <h4 className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest border-b pb-1">Edit Account Profile</h4>
                
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-400">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-cream placeholder-stone-400 text-xs focus:ring-1 focus:ring-burgundy"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-400">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-cream placeholder-stone-400 text-xs focus:ring-1 focus:ring-burgundy"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-400">New Saved Address (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g., Skyview Apartment, Madhapur..."
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-cream placeholder-stone-400 text-xs focus:ring-1 focus:ring-burgundy"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-burgundy hover:bg-burgundy-light text-cream text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer text-center shadow-sm"
                >
                  Save Profile Modifications
                </button>
              </form>
            )}
          </div>

          {/* PAST MOUNTS & HISTORIC ORDERS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold border-b pb-3 mb-5 flex items-center gap-1.5">
                <ShoppingBag size={20} /> My Historic Ordering logs ({loggedInUserOrders.length} orders)
              </h3>

              {loggedInUserOrders.length === 0 ? (
                <div className="text-center py-16 bg-cream-dark/10 rounded-xl border border-dashed border-stone-200 flex flex-col justify-center items-center space-y-4">
                  <p className="text-xs text-stone-500 font-sans">You haven't placed any orders directly with us yet!</p>
                  <button
                    onClick={() => navigateTo('menu')}
                    className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-transform hover:-translate-y-0.5 cursor-pointer shadow"
                  >
                    Place Your First Order
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {loggedInUserOrders.map((ord) => (
                    <div key={ord.id} className="p-5 border border-stone-150 dark:border-stone-850 bg-stone-50/50 dark:bg-stone-950/20 rounded-xl space-y-4 flex flex-col justify-between">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed pb-3 text-xs font-mono select-none">
                        <div className="space-y-1">
                          <span className="block font-bold mt-1 text-stone-855 dark:text-stone-300">ID: {ord.id}</span>
                          <span className="block text-[10px] text-stone-400">{new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {/* Order status banners */}
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded font-extrabold text-[10px] uppercase font-sans tracking-wide ${
                            ord.status === 'delivered' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : ord.status === 'out_for_delivery'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-705 border border-amber-205'
                          }`}>
                            ⚡ {ord.status.replace(/_/g, ' ')}
                          </span>
                          
                          <button
                            onClick={() => navigateTo('tracking', ord.id)}
                            className="p-1 px-2.5 bg-zinc-200/50 hover:bg-zinc-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300 rounded font-bold text-[10px] hover:underline whitespace-nowrap"
                          >
                            Live track
                          </button>
                        </div>
                      </div>

                      {/* Purchased recipe list */}
                      <div className="space-y-2 text-xs">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-stone-400 block font-mono">Dishes Ordered</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700 dark:text-stone-305">
                          {ord.items.map((it: any, index: number) => (
                            <div key={index} className="flex justify-between p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-850/60 leading-none">
                              <span className="truncate">{it.name} <strong className="font-mono">x {it.quantity}</strong></span>
                              <span className="font-mono text-stone-500 shrink-0">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reorder and Accounting section */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-105 dark:border-stone-850">
                        <div className="text-xs">
                          <span className="text-stone-400">Settled Grand Total:</span>
                          <span className="block font-bold text-sm font-mono text-burgundy dark:text-gold">₹{ord.total}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {ord.pointsEarned > 0 && (
                            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">
                              ⭐ +{ord.pointsEarned} Pts Earned
                            </span>
                          )}
                          
                          {/* Reorder Button */}
                          <button
                            onClick={() => handleReorder(ord)}
                            className="px-4 py-2 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw size={13} /> Reorder Meal
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ACC PANEL AUTH INTERFACE */
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-md relative overflow-hidden space-y-6">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-burgundy" />

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif text-burgundy dark:text-gold leading-none">Spice & Soul Member</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isRegistering ? 'Create a loyalty portal profile below and unlock point rewards.' : 'Log in to view saved addresses and repeat order details.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Conditional input fields based on Register vs Login toggle */}
            {isRegistering && (
              <>
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter first and last name..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Your Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g., +91 98765 43210..."
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-850 dark:text-cream text-xs"
                  />
                </div>
              </>
            )}

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Your Email Account</label>
              <input
                type="email"
                required
                placeholder="E.g., customer@gmail.com..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-850 dark:text-cream text-xs"
              />
            </div>

            <div className="space-y-1 text-xs select-none">
              <label className="font-bold text-stone-450 uppercase font-mono tracking-wider">Passcode Verification</label>
              <div className="p-3 rounded-lg border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-[11px] text-stone-450 leading-snug flex items-start gap-1.5">
                <Lock size={12} className="shrink-0 mt-0.5 text-stone-400" />
                <span>Passcodes are simulated for templates. Setting your email initiates session immediately. Demo user: <strong className="font-semibold text-stone-600 dark:text-stone-300 select-all">customer@gmail.com</strong> (preloaded with 340 loyalty points!).</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1 cursor-pointer"
            >
              {isRegistering ? <UserPlus size={14} /> : <Lock size={14} />}
              <span>{isRegistering ? 'Submit Register Application' : 'Secure Member Login'}</span>
            </button>
          </form>

          {/* Toggle registration */}
          <div className="border-t border-stone-150 dark:border-stone-850 pt-4 text-center select-none">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-semibold text-burgundy dark:text-gold hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <span>{isRegistering ? 'Already have an direct dining account? Log In' : 'New direct patron? Register here (+100 BONUS pts)'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
