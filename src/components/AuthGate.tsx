/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { ChefHat, Mail, Phone, User, Lock, ArrowRight, UserPlus, Sparkles, Shield, Bookmark } from 'lucide-react';

export const AuthGate: React.FC = () => {
  const {
    loginCustomer,
    registerCustomer,
    loginAdmin,
    addToast,
    restaurantInfo
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'login') {
      if (!email.trim()) {
        addToast('Please enter your email address!', 'error');
        return;
      }
      loginCustomer(email.trim());
    } else if (activeTab === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        addToast('Please fill out all registration fields!', 'error');
        return;
      }
      
      // Basic phone format check for standard 10-digit format
      const digitCount = phone.replace(/\D/g, '').length;
      if (digitCount < 10) {
        addToast('Mobile phone number must be at least 10 digits!', 'error');
        return;
      }

      registerCustomer(name.trim(), email.trim(), phone.trim());
    } else if (activeTab === 'admin') {
      if (!adminPassword.trim()) {
        addToast('Please enter the admin passcode!', 'error');
        return;
      }
      loginAdmin(adminPassword);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 dark:bg-stone-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-[2rem] shadow-2xl overflow-hidden relative"
        id="auth-gate-modal"
      >
        {/* Aesthetic top accent accent line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-burgundy via-gold to-burgundy" />

        <div className="p-8 sm:p-10 space-y-8">
          {/* Header section with beautifully styled Logo details */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-burgundy dark:bg-burgundy text-gold border border-gold/20 shadow-md">
              <ChefHat size={32} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-serif tracking-tight text-burgundy dark:text-gold leading-none">
                {restaurantInfo.name}
              </h1>
              <p className="text-xs uppercase tracking-widest font-mono font-bold text-stone-500 dark:text-stone-400 mt-1">
                {restaurantInfo.tagline}
              </p>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Order directly to bypass aggregator platform inflation fees, unlock double loyalty cashback points, and receive live SMS/Email notifications of active cooks!
            </p>
          </div>

          {/* Navigation controller tabs */}
          <div className="grid grid-cols-3 gap-1 bg-stone-105 dark:bg-stone-950 p-1.5 rounded-2xl border border-stone-200/50 dark:border-stone-850/80">
            <button
              onClick={() => {
                setActiveTab('login');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-stone-800 text-burgundy dark:text-gold shadow border border-stone-100 dark:border-stone-750'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-stone-800 text-burgundy dark:text-gold shadow border border-stone-100 dark:border-stone-750'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
              }}
              className={`py-2 text-xs font-bold uppercase tracking-tight rounded-xl transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-stone-800 text-burgundy dark:text-gold shadow border border-stone-100 dark:border-stone-750'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              Manager Console
            </button>
          </div>

          {/* Master Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-extrabold tracking-wider text-stone-500 dark:text-stone-400">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saketh Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy dark:focus:ring-gold text-stone-850 dark:text-cream text-xs transition-shadow"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase font-mono font-extrabold tracking-wider text-stone-500 dark:text-stone-400">
                    Mobile Phone Number (Required for Alerts)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 rounded-xl border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy dark:focus:ring-gold text-stone-850 dark:text-cream text-xs transition-shadow"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab !== 'admin' ? (
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono font-extrabold tracking-wider text-stone-500 dark:text-stone-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. customer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy dark:focus:ring-gold text-stone-850 dark:text-cream text-xs transition-shadow"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono font-extrabold tracking-wider text-stone-500 dark:text-stone-400">
                  Chef Admin Passcode
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter security code..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy dark:focus:ring-gold text-stone-850 dark:text-cream text-xs transition-shadow"
                  />
                </div>
              </div>
            )}

            {/* Informational Verification banner card */}
            <div className="p-3 bg-stone-50 dark:bg-stone-950 border border-dashed border-stone-200 dark:border-stone-850 rounded-2xl flex gap-2 text-[11px] leading-relaxed text-stone-450 select-none">
              <Shield size={16} className="text-stone-400 shrink-0 mt-0.5" />
              <span>
                {activeTab === 'login' && (
                  <span>
                    Setting your email initiates session immediately. Use demo user: <strong className="font-mono text-stone-600 dark:text-stone-300 font-bold">customer@gmail.com</strong> (loaded with 340 loyalty points!).
                  </span>
                )}
                {activeTab === 'register' && (
                  <span>
                    Get a welcome reward of <strong className="text-burgundy dark:text-gold font-bold">⭐ +100 bonus loyalty points</strong> instantly upon registering your phone and email.
                  </span>
                )}
                {activeTab === 'admin' && (
                  <span>
                    Enter key <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold select-all">Admin@123</strong> to audit active checkouts, add bestsellers, and modify custom tax parameters dynamically.
                  </span>
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-burgundy hover:bg-burgundy-light text-cream font-extrabold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {activeTab === 'register' ? (
                <>
                  <UserPlus size={14} />
                  <span>Submit Register Application</span>
                </>
              ) : activeTab === 'admin' ? (
                <>
                  <Shield size={14} />
                  <span>Access Manager Deck</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Secure Member Login</span>
                </>
              )}
            </button>
          </form>

          {/* Support disclaimer footer */}
          <div className="text-center">
            <span className="text-[10px] text-stone-450 uppercase tracking-wider font-mono">
              🤝 Protected direct-to-home transaction
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
