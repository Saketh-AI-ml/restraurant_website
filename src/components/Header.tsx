/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { ShoppingBag, Menu as MenuIcon, X, Sun, Moon, ChefHat, User } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentTab,
    navigateTo,
    cart,
    theme,
    toggleTheme,
    currentUser,
    adminLoggedIn,
    logoutAdmin,
    logoutCustomer,
    restaurantInfo
  } = useAppState();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Order Menu' },
    { id: 'contact', label: 'About & Contact' },
  ];

  const handleNav = (tabId: string) => {
    navigateTo(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-shadow duration-200 border-b border-burgundy/10 dark:border-stone-800 bg-cream/90 dark:bg-stone-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-burgundy dark:bg-burgundy text-gold transition-transform group-hover:rotate-12">
              <ChefHat size={26} />
            </div>
            <div>
              <span className="block text-2xl font-bold font-serif leading-none tracking-tight text-burgundy dark:text-gold">
                {restaurantInfo.name}
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-450 font-semibold font-mono mt-0.5">
                {restaurantInfo.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" id="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  currentTab === item.id
                    ? 'text-burgundy dark:text-gold border-b-2 border-burgundy dark:border-gold pb-1'
                    : 'text-stone-600 dark:text-stone-300 hover:text-burgundy dark:hover:text-gold'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}

            {/* Account / Admin tab */}
            <button
              onClick={() => handleNav('account')}
              className={`text-sm font-semibold tracking-wide flex items-center space-x-1.5 transition-colors ${
                currentTab === 'account'
                  ? 'text-burgundy dark:text-gold border-b-2 border-burgundy dark:border-gold pb-1'
                  : 'text-stone-600 dark:text-stone-300 hover:text-burgundy dark:hover:text-gold'
              }`}
              id="nav-account"
            >
              <User size={16} />
              <span>{currentUser ? currentUser.name.split(' ')[0] : 'My Account'}</span>
            </button>

            {adminLoggedIn && (
              <button
                onClick={() => handleNav('admin')}
                className={`text-xs uppercase tracking-wider font-mono font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded transition-transform hover:scale-105 ${
                  currentTab === 'admin' ? 'ring-2 ring-amber-500/55' : ''
                }`}
                id="nav-admin-dash"
              >
                Admin Panel
              </button>
            )}
          </nav>

          {/* Right utility buttons: Cart, Theme, Mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Switch */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-stone-600 dark:text-stone-300 hover:text-burgundy dark:hover:text-gold rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-850 transition-colors"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              id="theme-toggle-btn"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2.5 text-cream bg-burgundy hover:bg-burgundy-light rounded-full transition-transform hover:scale-105 cursor-pointer shadow-md dark:bg-burgundy dark:hover:bg-burgundy-light"
              id="cart-toggle-btn"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 bg-gold text-[10px] font-bold text-burgundy dark:text-stone-900 rounded-full animate-bounce"
                  id="cart-badge"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Trigger btn */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-stone-600 dark:text-stone-300 rounded hover:bg-stone-200/50 dark:hover:bg-stone-850 transition-colors"
              id="mobile-drawer-btn"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation side menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-in fade-in slide-in-from-top-4 duration-200 bg-cream-dark dark:bg-stone-950 border-b border-burgundy/10 dark:border-stone-850 px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${
                currentTab === item.id
                  ? 'bg-burgundy text-cream dark:bg-gold dark:text-stone-900 shadow-sm'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-900/50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => handleNav('account')}
            className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-semibold transition-colors ${
              currentTab === 'account'
                ? 'bg-burgundy text-cream dark:bg-gold dark:text-stone-900 shadow-sm'
                : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-900/50'
            }`}
          >
            My Account {currentUser ? `(${currentUser.name.split(' ')[0]})` : ''}
          </button>

          {adminLoggedIn && (
            <button
              onClick={() => handleNav('admin')}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-base font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 transition-colors`}
            >
              🛠️ Admin Control Dashboard
            </button>
          )}

          {/* Quick status summaries */}
          <div className="pt-2 border-t border-burgundy/10 dark:border-stone-800 flex items-center justify-between text-xs font-mono text-stone-500">
            <span>Direct Orders Template v2026</span>
            {currentUser && (
              <span className="text-gold font-bold">⭐ {currentUser.loyaltyPoints} Loyalty Pts</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
