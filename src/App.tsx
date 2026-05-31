/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { Home } from './components/Home';
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { AccountPage } from './components/AccountPage';
import { TrackingPage } from './components/TrackingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactPage } from './components/ContactPage';
import { AuthGate } from './components/AuthGate';

function AppContent() {
  const { currentTab, currentUser, adminLoggedIn } = useAppState();

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'menu':
        return <MenuPage />;
      case 'cart':
        return <CartPage />;
      case 'account':
        return <AccountPage />;
      case 'tracking':
        return <TrackingPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'contact':
        return <ContactPage />;
      case 'home':
      default:
        return <Home />;
    }
  };

  // Force Login / Register on first-time visit unless admin logged in
  const showAuthGate = !currentUser && !adminLoggedIn;

  return (
    <div className="flex flex-col min-h-screen bg-cream text-stone-800 dark:bg-stone-950 dark:text-cream transition-colors duration-200">
      {/* Sticky Header */}
      <Header />
      
      {/* Primary Scrollable Screen Content */}
      <main className="flex-grow pt-8 px-2 sm:px-0">
        {renderActiveTab()}
      </main>

      {/* Auth Gate overlay */}
      {showAuthGate && <AuthGate />}
      
      {/* General Footer */}
      <Footer />
      
      {/* Floating Animated Toast Banner overlays */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StateProvider>
      <AppContent />
    </StateProvider>
  );
}
