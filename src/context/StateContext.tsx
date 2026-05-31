/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, UserAccount, Review, OrderItem, RestaurantInfo, Coupon, StoreConfig } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_REVIEWS, COUPONS } from '../initialData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StateContextProps {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  currentUser: UserAccount | null;
  users: UserAccount[];
  currentTab: string;
  trackingOrderId: string | null;
  theme: 'light' | 'dark';
  toasts: Toast[];
  reviews: Review[];
  adminLoggedIn: boolean;
  restaurantInfo: RestaurantInfo;
  updateRestaurantInfo: (info: RestaurantInfo) => void;
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  editCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  editReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  storeConfig: StoreConfig;
  updateStoreConfig: (config: StoreConfig) => void;
  
  // Navigation
  navigateTo: (tab: string, trackingId?: string) => void;
  
  // Cart Actions
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  
  // Theme Action
  toggleTheme: () => void;
  
  // Auth Actions
  loginCustomer: (email: string, name?: string) => boolean; // Simplistic login for simulation
  logoutCustomer: () => void;
  updateUserProfile: (name: string, phone: string, address: string) => void;
  registerCustomer: (name: string, email: string, phone: string) => boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  
  // Order Actions
  placeOrder: (
    type: 'delivery' | 'takeaway' | 'dinein',
    address: string,
    instructions: string,
    couponCode: string,
    discountAmount: number,
    deliveryFee: number,
    tax: number,
    pointsToRedeem: number,
    paymentMethod?: string,
    customCustomerName?: string,
    customCustomerPhone?: string
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  // Menu Management (Admin)
  toggleMenuItemAvailability: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  editMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  
  // Toast System
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Initialize States from localStorage or Defaults ---
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('spice_soul_menu');
    const parsed: MenuItem[] = saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
    const seen = new Set<string>();
    return parsed.filter((item) => {
      if (!item.id || seen.has(item.id)) {
        item.id = 'menu-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
      }
      seen.add(item.id);
      return true;
    });
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('spice_soul_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('spice_soul_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('spice_soul_users');
    if (saved) return JSON.parse(saved);
    
    // Default demo user preinstalled so they can explore loyalty balance immediately
    return [
      {
        email: 'customer@gmail.com',
        name: 'Saketh Reddy',
        phone: '+91 98765 43210',
        loyaltyPoints: 340, // ₹170 off equivalent
        addresses: ['Apartment 4B, Signature Towers, Madhapur, Hyderabad, TS - 500081']
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('spice_soul_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('spice_soul_admin_logged') === 'true';
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('spice_soul_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem('spice_soul_restaurant_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        upiId: parsed.upiId || 'spiceandsoul@okaxis',
        paymentNumber: parsed.paymentNumber || '+91 98765 43210',
        bankName: parsed.bankName || 'HDFC Bank',
        bankAccount: parsed.bankAccount || '50100482791003',
        bankIfsc: parsed.bankIfsc || 'HDFC0000021'
      };
    }
    return {
      name: 'Spice & Soul',
      tagline: 'Kitchen • Direct Delivery',
      address: 'Plot 22, Road No. 36, Jubilee Hills, Hyderabad - 500033',
      phone: '+91 40 4827 9100',
      email: 'chef@spiceandsoul.com',
      bannerImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200',
      upiId: 'spiceandsoul@okaxis',
      paymentNumber: '+91 98765 43210',
      bankName: 'HDFC Bank',
      bankAccount: '50100482791003',
      bankIfsc: 'HDFC0000021'
    };
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('spice_soul_reviews');
    const parsed: Review[] = saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    const seen = new Set<string>();
    return parsed.filter((r) => {
      if (!r.id || seen.has(r.id)) {
        r.id = 'review-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
      }
      seen.add(r.id);
      return true;
    });
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('spice_soul_coupons');
    let parsed: Coupon[];
    if (saved) {
      parsed = JSON.parse(saved);
    } else {
      parsed = COUPONS.map((c, i) => ({
        id: 'coupon-' + i,
        code: c.code,
        discountPercent: c.discountPercent,
        description: c.description
      }));
    }
    const seen = new Set<string>();
    return parsed.filter((c) => {
      if (!c.id || seen.has(c.id)) {
        c.id = 'coupon-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
      }
      seen.add(c.id);
      return true;
    });
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('spice_soul_store_config');
    return saved ? JSON.parse(saved) : {
      gstPercent: 5,
      deliveryFeeUnder500: 40,
      loyaltyPointValue: 0.5
    };
  });

  // --- Sync to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('spice_soul_restaurant_info', JSON.stringify(restaurantInfo));
  }, [restaurantInfo]);

  useEffect(() => {
    localStorage.setItem('spice_soul_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('spice_soul_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('spice_soul_store_config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('spice_soul_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('spice_soul_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('spice_soul_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('spice_soul_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('spice_soul_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('spice_soul_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('spice_soul_admin_logged', adminLoggedIn.toString());
  }, [adminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('spice_soul_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // --- Toast Functions ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 2500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Navigation ---
  const navigateTo = (tab: string, trackingId?: string) => {
    setCurrentTab(tab);
    if (trackingId) {
      setTrackingOrderId(trackingId);
    }
    // Scroll to top cleanly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Cart Actions ---
  const addToCart = (item: MenuItem, quantity: number) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        // limit quantity if too high, otherwise increase
        const newQty = existing.quantity + quantity;
        addToast(`Updated ${item.name} quantity to ${newQty}!`, 'success');
        return prevCart.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: newQty } : c
        );
      }
      addToast(`Added ${item.name} to your cart!`, 'success');
      return [...prevCart, { menuItem: item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((c) => c.menuItem.id === itemId);
    if (item) {
      addToast(`Removed ${item.menuItem.name} from cart`, 'info');
    }
    setCart((prevCart) => prevCart.filter((c) => c.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((c) =>
        c.menuItem.id === itemId ? { ...c, quantity: qty } : c
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // --- Admin/Customer Auth ---
  const loginAdmin = (password: string): boolean => {
    if (password === 'Admin@123') {
      setAdminLoggedIn(true);
      addToast('Welcome back, Admin Chef!', 'success');
      return true;
    }
    addToast('Invalid admin password!', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setAdminLoggedIn(false);
    addToast('Admin logged out successfully', 'info');
  };

  const loginCustomer = (email: string, name?: string): boolean => {
    // Look up user
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      addToast(`Welcome back, ${existing.name}!`, 'success');
      return true;
    } else if (name) {
      // Auto-register if typing name (flexible customer flow in restaurant)
      return registerCustomer(name, email, '+91 99999 88888');
    }
    addToast(`No account found under ${email}. Please register!`, 'error');
    return false;
  };

  const registerCustomer = (name: string, email: string, phone: string): boolean => {
    const normalisedEmail = email.toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalisedEmail);
    if (existing) {
      addToast('Email already registered! Logging you in.', 'info');
      setCurrentUser(existing);
      return true;
    }
    
    const newUser: UserAccount = {
      email: normalisedEmail,
      name,
      phone,
      loyaltyPoints: 100, // 100 Welcome points! Equals ₹50 discount
      addresses: []
    };
    
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addToast(`Account created! Welcome bonus +100 points added!`, 'success');
    return true;
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    addToast('Signed out successfully', 'info');
  };

  const updateUserProfile = (name: string, phone: string, address: string) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      name,
      phone,
      addresses: address ? Array.from(new Set([address, ...currentUser.addresses])) : currentUser.addresses
    };
    
    // update current user
    setCurrentUser(updatedUser);
    
    // update in database list
    setUsers((prevList) =>
      prevList.map((u) => (u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u))
    );
    
    addToast('Profile details updated successfully!', 'success');
  };

  // --- Place Order ---
  const placeOrder = (
    type: 'delivery' | 'takeaway' | 'dinein',
    address: string,
    instructions: string,
    couponCode: string,
    discountAmount: number,
    deliveryFee: number,
    tax: number,
    pointsToRedeem: number,
    customPaymentMethod?: string,
    customCustomerName?: string,
    customCustomerPhone?: string
  ): Order | null => {
    if (cart.length === 0) {
      addToast('No items in checkout cart!', 'error');
      return null;
    }

    const orderId = 'SSK-' + Math.floor(100000 + Math.random() * 900000).toString();
    const subtotal = cart.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0);
    const total = subtotal - discountAmount + deliveryFee + tax - (pointsToRedeem * 0.5); // 100 pts = ₹50 off (1 point = ₹0.5)
    const ptsEarned = Math.floor(total / 10); // 1 point per ₹10 spent

    const orderItems: OrderItem[] = cart.map((c) => ({
      id: c.menuItem.id,
      name: c.menuItem.name,
      price: c.menuItem.price,
      quantity: c.quantity,
      isVeg: c.menuItem.isVeg
    }));

    // Detect payment details
    const methodLiteral = customPaymentMethod || (type === 'dinein' ? 'cod' : 'online');
    const statusLiteral = (methodLiteral.toLowerCase().includes('cod') || methodLiteral.toLowerCase().includes('cash') || type === 'dinein') ? 'pending' : 'paid';

    const details: Order = {
      id: orderId,
      customerEmail: currentUser ? currentUser.email : 'guest@spiceandsoul.com',
      customerName: customCustomerName || (currentUser ? currentUser.name : 'Guest Customer'),
      customerPhone: customCustomerPhone || (currentUser ? currentUser.phone : '+91 99999 88888'),
      items: orderItems,
      type,
      address: type === 'delivery' ? address : type === 'takeaway' ? 'Self Pick-Up at Restaurant Counter' : 'Table #14 Dine-in',
      instructions,
      couponCode,
      subtotal,
      deliveryFee,
      tax,
      discount: discountAmount + (pointsToRedeem * 0.5),
      total: Math.max(0, parseFloat(total.toFixed(2))),
      paymentMethod: methodLiteral,
      paymentStatus: statusLiteral,
      status: 'received',
      createdAt: new Date().toISOString(),
      pointsEarned: ptsEarned,
      pointsRedeemed: pointsToRedeem
    };

    // 1. Save order to list
    setOrders((prev) => [details, ...prev]);

    // 2. Adjust loyalty points and saved address for logged-in users
    if (currentUser) {
      const updatedPoints = currentUser.loyaltyPoints - pointsToRedeem + ptsEarned;
      const updatedAddresses = type === 'delivery' && address && !currentUser.addresses.includes(address)
        ? [...currentUser.addresses, address]
        : currentUser.addresses;

      const updatedUser: UserAccount = {
        ...currentUser,
        loyaltyPoints: updatedPoints,
        addresses: updatedAddresses
      };

      setCurrentUser(updatedUser);
      setUsers((prevList) =>
        prevList.map((u) => (u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u))
      );
    }

    // 3. Clear customer cart
    setCart([]);
    addToast(`Order placed successfully! ID: ${orderId}`, 'success');
    
    // Navigates customer to live order tracking page directly
    navigateTo('tracking', orderId);
    return details;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    addToast(`Order ${orderId} updated to ${status.replace(/_/g, ' ').toUpperCase()}`, 'info');
  };

  // --- Menu Management ---
  const toggleMenuItemAvailability = (itemId: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    addToast('Item availability updated!', 'info');
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: 'custom-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9)
    };
    setMenuItems((prev) => [newItem, ...prev]);
    addToast(`Added item "${item.name}" directly to the menu!`, 'success');
  };

  const editMenuItem = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    addToast(`Updated details for "${updatedItem.name}"`, 'success');
  };

  const deleteMenuItem = (itemId: string) => {
    const item = menuItems.find((i) => i.id === itemId);
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    addToast(`Deleted "${item?.name || 'item'}" from menu`, 'info');
  };

  const updateRestaurantInfo = (info: RestaurantInfo) => {
    setRestaurantInfo(info);
    addToast('Restaurant profile details updated!', 'success');
  };

  const addCoupon = (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: 'coupon-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9)
    };
    setCoupons((prev) => [...prev, newCoupon]);
    addToast(`Coupon "${coupon.code}" created!`, 'success');
  };

  const editCoupon = (updated: Coupon) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    addToast(`Coupon "${updated.code}" updated!`, 'success');
  };

  const deleteCoupon = (id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    addToast(`Deleted coupon "${coupon?.code || 'item'}"`, 'info');
  };

  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: 'review-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setReviews((prev) => [newReview, ...prev]);
    addToast('Review submitted successfully!', 'success');
  };

  const editReview = (updated: Review) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    addToast('Review updated successfully!', 'success');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast('Review removed from website!', 'info');
  };

  const updateStoreConfig = (config: StoreConfig) => {
    setStoreConfig(config);
    addToast('Store-wide coefficients live committed!', 'success');
  };

  return (
    <StateContext.Provider
      value={{
        menuItems,
        cart,
        orders,
        currentUser,
        users,
        currentTab,
        trackingOrderId,
        theme,
        restaurantInfo,
        updateRestaurantInfo,
        coupons,
        addCoupon,
        editCoupon,
        deleteCoupon,
        reviews,
        addReview,
        editReview,
        deleteReview,
        storeConfig,
        updateStoreConfig,
        toasts,
        adminLoggedIn,
        navigateTo,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleTheme,
        loginCustomer,
        logoutCustomer,
        registerCustomer,
        updateUserProfile,
        loginAdmin,
        logoutAdmin,
        placeOrder,
        updateOrderStatus,
        toggleMenuItemAvailability,
        addMenuItem,
        editMenuItem,
        deleteMenuItem,
        addToast,
        removeToast
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
