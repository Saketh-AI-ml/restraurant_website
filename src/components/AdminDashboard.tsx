/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { MenuItem, Order, Coupon, Review, StoreConfig } from '../types';
import { Landmark, ChefHat, ToggleLeft, ToggleRight, Trash2, Edit, PlusCircle, CheckCircle, Smartphone, LogOut, ArrowDownToLine, Users, ListFilter, Leaf, Layers, Store, MapPin, Mail, Phone, Image, Settings, Gift, Quote, Percent } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    menuItems,
    orders,
    adminLoggedIn,
    loginAdmin,
    logoutAdmin,
    updateOrderStatus,
    toggleMenuItemAvailability,
    addMenuItem,
    editMenuItem,
    deleteMenuItem,
    addToast,
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
    updateStoreConfig
  } = useAppState();

  const [passcodeInput, setPasscodeInput] = useState<string>('');
  
  // Create / Edit states
  const [showItemForm, setShowItemForm] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Restaurant Profile settings state
  const [showBrandSettings, setShowBrandSettings] = useState<boolean>(false);
  const [restName, setRestName] = useState<string>(restaurantInfo.name);
  const [restTagline, setRestTagline] = useState<string>(restaurantInfo.tagline);
  const [restAddress, setRestAddress] = useState<string>(restaurantInfo.address);
  const [restPhone, setRestPhone] = useState<string>(restaurantInfo.phone);
  const [restEmail, setRestEmail] = useState<string>(restaurantInfo.email);
  const [restBanner, setRestBanner] = useState<string>(restaurantInfo.bannerImage);
  
  // Payee owner credentials
  const [restUpiId, setRestUpiId] = useState<string>(restaurantInfo.upiId || 'spiceandsoul@okaxis');
  const [restPaymentNumber, setRestPaymentNumber] = useState<string>(restaurantInfo.paymentNumber || '+91 98765 43215');
  const [restBankName, setRestBankName] = useState<string>(restaurantInfo.bankName || 'HDFC Bank');
  const [restBankAccount, setRestBankAccount] = useState<string>(restaurantInfo.bankAccount || '50100482791003');
  const [restBankIfsc, setRestBankIfsc] = useState<string>(restaurantInfo.bankIfsc || 'HDFC0000021');

  // Sync brand inputs when restaurantInfo changes
  React.useEffect(() => {
    setRestName(restaurantInfo.name);
    setRestTagline(restaurantInfo.tagline);
    setRestAddress(restaurantInfo.address);
    setRestPhone(restaurantInfo.phone);
    setRestEmail(restaurantInfo.email);
    setRestBanner(restaurantInfo.bannerImage);
    setRestUpiId(restaurantInfo.upiId || 'spiceandsoul@okaxis');
    setRestPaymentNumber(restaurantInfo.paymentNumber || '+91 98765 43215');
    setRestBankName(restaurantInfo.bankName || 'HDFC Bank');
    setRestBankAccount(restaurantInfo.bankAccount || '50100482791555');
    setRestBankIfsc(restaurantInfo.bankIfsc || 'HDFC0000021');
  }, [restaurantInfo]);

  // Form Fields for Recipes
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Starters');
  const [itemDesc, setItemDesc] = useState('');
  const [itemImg, setItemImg] = useState('');
  const [itemVeg, setItemVeg] = useState(true);
  const [itemSpecial, setItemSpecial] = useState(false);

  // Forms & States for Coupons
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponPercentInput, setCouponPercentInput] = useState('');
  const [couponDescInput, setCouponDescInput] = useState('');

  // Forms & States for Reviews
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [reviewAuthorInput, setReviewAuthorInput] = useState('');
  const [reviewCommentInput, setReviewCommentInput] = useState('');
  const [reviewRatingInput, setReviewRatingInput] = useState('5');
  const [reviewDishInput, setReviewDishInput] = useState('');

  // States for store coefficients
  const [cfgGst, setCfgGst] = useState(storeConfig.gstPercent.toString());
  const [cfgDelivery, setCfgDelivery] = useState(storeConfig.deliveryFeeUnder500.toString());
  const [cfgLoyaltyVal, setCfgLoyaltyVal] = useState(storeConfig.loyaltyPointValue.toString());

  // Sync store coefficients on load or config update
  React.useEffect(() => {
    setCfgGst(storeConfig.gstPercent.toString());
    setCfgDelivery(storeConfig.deliveryFeeUnder500.toString());
    setCfgLoyaltyVal(storeConfig.loyaltyPointValue.toString());
  }, [storeConfig]);

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === 'Admin@123') {
      loginAdmin(passcodeInput);
      setPasscodeInput('');
    } else {
      addToast('Invalid admin password! Try "Admin@123"', 'error');
    }
  };

  // Finance Aggregators
  const dailyOrdersCount = orders.length;
  // sum only delivered/paid orders or all logged mock orders
  const dailyRevenue = orders.reduce((acc, ord) => acc + ord.total, 0);

  // Form submission: Create or Edit recipe item
  const handleItemFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice || !itemDesc) {
      addToast('Please complete all menu item fields!', 'error');
      return;
    }

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast('Please supply a valid price amount!', 'error');
      return;
    }

    // Default image if empty
    const finalImage = itemImg.trim() || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600';

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: itemName,
        price: priceNum,
        category: itemCategory,
        description: itemDesc,
        image: finalImage,
        isVeg: itemVeg,
        isBestseller: itemSpecial
      };
      editMenuItem(updated);
      setEditingItem(null);
    } else {
      const createdObj = {
        name: itemName,
        price: priceNum,
        category: itemCategory,
        description: itemDesc,
        image: finalImage,
        isVeg: itemVeg,
        isAvailable: true,
        isBestseller: itemSpecial
      };
      addMenuItem(createdObj);
    }

    // Reset Form
    setItemName('');
    setItemPrice('');
    setItemDesc('');
    setItemImg('');
    setItemVeg(true);
    setItemSpecial(false);
    setShowItemForm(false);
  };

  const handleTriggerEdit = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemDesc(item.description);
    setItemImg(item.image);
    setItemVeg(item.isVeg);
    setItemSpecial(item.isBestseller);
    setShowItemForm(true);

    // Scroll smoothly to form view
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  // Generate CSV data from JavaScript Array and download
  const handleExportCSV = () => {
    if (orders.length === 0) {
      addToast('No order datasets exist to compile!', 'error');
      return;
    }

    // Prepare CSV header
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order ID,Customer Name,Customer Email,Customer Phone,Fulfilment Type,Basket Subtotal,Discount,Tax,Grand Total,Payment,Status,Date\n';

    orders.forEach((ord) => {
      const row = [
        ord.id,
        `"${ord.customerName.replace(/"/g, '""')}"`,
        ord.customerEmail,
        ord.customerPhone,
        ord.type.toUpperCase(),
        ord.subtotal,
        ord.discount,
        ord.tax,
        ord.total,
        ord.paymentMethod.toUpperCase(),
        ord.status.toUpperCase(),
        `"${new Date(ord.createdAt).toLocaleDateString()}"`
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Spice_Soul_Orders_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Orders CSV datasheet compiled and downloaded successfully!', 'success');
  };

  // Trigger outbound dispatcher for customized status updates
  const getOutboundStatusWhatsAppURL = (ord: Order) => {
    let friendlyStatus = 'is RECEIVED and is cooking in our clay pans.';
    if (ord.status === 'preparing') {
      friendlyStatus = 'is in the PREPARATION stage! Our chefs are infusing secret saffron and spices.';
    } else if (ord.status === 'out_for_delivery') {
      friendlyStatus = 'is OUT FOR DELIVERY! Our dedicated insulated rider is zooming in your direction.';
    } else if (ord.status === 'delivered') {
      friendlyStatus = 'has been DELIVERED safely! Thank you for ordering direct and bypassing commissions.';
    }

    const payload = `Greetings ${ord.customerName}, your ${restaurantInfo.name} order ${ord.id} ${friendlyStatus} Track progress anytime at our link. Enjoy your meal!`;
    return `https://api.whatsapp.com/send?phone=${ord.customerPhone.replace(/[\s+]/g, '')}&text=${encodeURIComponent(payload)}`;
  };

  const handleSaveBrandSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restName.trim() || !restAddress.trim() || !restPhone.trim() || !restEmail.trim() || !restUpiId.trim() || !restPaymentNumber.trim()) {
      addToast('Please input all necessary restaurant master coordinates!', 'error');
      return;
    }
    updateRestaurantInfo({
      name: restName,
      tagline: restTagline,
      address: restAddress,
      phone: restPhone,
      email: restEmail,
      bannerImage: restBanner || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200',
      upiId: restUpiId,
      paymentNumber: restPaymentNumber,
      bankName: restBankName,
      bankAccount: restBankAccount,
      bankIfsc: restBankIfsc
    });
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim() || !couponPercentInput.trim() || !couponDescInput.trim()) {
      addToast('Please satisfy all coupon fields!', 'error');
      return;
    }
    const percent = parseInt(couponPercentInput);
    if (isNaN(percent) || percent <= 0 || percent > 100) {
      addToast('Please insert a valid percentage scale (1 to 100)!', 'error');
      return;
    }

    if (editingCoupon) {
      editCoupon({
        ...editingCoupon,
        code: couponCodeInput.toUpperCase().trim(),
        discountPercent: percent,
        description: couponDescInput.trim()
      });
      setEditingCoupon(null);
    } else {
      addCoupon({
        code: couponCodeInput.toUpperCase().trim(),
        discountPercent: percent,
        description: couponDescInput.trim()
      });
    }

    setCouponCodeInput('');
    setCouponPercentInput('');
    setCouponDescInput('');
    setShowCouponForm(false);
  };

  const handleTriggerEditCoupon = (cp: Coupon) => {
    setEditingCoupon(cp);
    setCouponCodeInput(cp.code);
    setCouponPercentInput(cp.discountPercent.toString());
    setCouponDescInput(cp.description);
    setShowCouponForm(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthorInput.trim() || !reviewCommentInput.trim()) {
      addToast('Please complete standard author and comment details!', 'error');
      return;
    }
    const rating = parseFloat(reviewRatingInput);

    if (editingReview) {
      editReview({
        ...editingReview,
        name: reviewAuthorInput.trim(),
        rating,
        comment: reviewCommentInput.trim(),
        dish: reviewDishInput.trim() || 'General Dining EXPERIENCE'
      });
      setEditingReview(null);
    } else {
      addReview({
        name: reviewAuthorInput.trim(),
        rating,
        comment: reviewCommentInput.trim(),
        dish: reviewDishInput.trim() || 'General Dining EXPERIENCE'
      });
    }

    setReviewAuthorInput('');
    setReviewCommentInput('');
    setReviewRatingInput('5');
    setReviewDishInput('');
    setShowReviewForm(false);
  };

  const handleTriggerEditReview = (rev: Review) => {
    setEditingReview(rev);
    setReviewAuthorInput(rev.name);
    setReviewRatingInput(rev.rating.toString());
    setReviewCommentInput(rev.comment);
    setReviewDishInput(rev.dish);
    setShowReviewForm(true);
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const gst = parseInt(cfgGst);
    const del = parseInt(cfgDelivery);
    const loyalty = parseFloat(cfgLoyaltyVal);

    if (isNaN(gst) || gst < 0 || gst > 100) {
      addToast('Please supply a valid GST percentage (0 to 100)!', 'error');
      return;
    }
    if (isNaN(del) || del < 0) {
      addToast('Please supply a valid delivery fee rate!', 'error');
      return;
    }
    if (isNaN(loyalty) || loyalty <= 0) {
      addToast('Loyalty point conversion metrics must be greater than zero!', 'error');
      return;
    }

    updateStoreConfig({
      gstPercent: gst,
      deliveryFeeUnder500: del,
      loyaltyPointValue: loyalty
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
      {!adminLoggedIn ? (
        /* PASSCODE VERIFICATION GATING */
        <div className="max-w-md mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-md relative overflow-hidden space-y-6">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-500" />
          
          <div className="text-center space-y-2">
            <ChefHat className="text-amber-500 mx-auto" size={36} />
            <h2 className="text-3xl font-serif text-stone-800 dark:text-cream leading-tight">Chef Admin Gate</h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">Please enter kitchen credentials to unlock admin operations, order logs, data trackers, and CRUD.</p>
          </div>

          <form onSubmit={handleAdminVerify} className="space-y-4">
            <div className="space-y-1.5 text-xs select-none">
              <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Default email</label>
              <input type="text" readOnly value="admin@spiceandsoul.com" className="w-full px-3 py-2 border rounded-xl bg-stone-105/50 text-stone-500 select-all" />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Secret Admin Passcode</label>
              <input
                type="password"
                required
                placeholder="Enter passphrase..."
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 text-stone-850 dark:text-cream focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold uppercase text-xs tracking-widest rounded-xl transition-all shadow cursor-pointer"
            >
              Verify Passcode Gate
            </button>
          </form>

          <p className="text-[10px] text-center text-stone-400">💡 Secret standard passcode is: <span className="font-bold text-stone-600">Admin@123</span></p>
        </div>
      ) : (
        /* ACTUAL LOGGED ADMIN DASHBOARD ACTIVE PANEL */
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Header & stats summary block */}
          <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-850 pb-5">
            <div className="space-y-1 select-none">
              <h2 className="text-3xl font-black font-serif text-stone-850 dark:text-gold leading-none">Kitchen Management Deck</h2>
              <p className="text-xs text-stone-450 font-sans">Active template dashboard for Spice & Soul Kitchen administrators.</p>
            </div>

            <button
              onClick={logoutAdmin}
              className="px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-450 border border-rose-500/10 font-bold rounded-xl text-xs uppercase cursor-pointer flex items-center gap-1 shadow-sm mt-1 shrink-0"
            >
              <LogOut size={13} /> Exit Admin Dashboard
            </button>
          </section>

          {/* FINANCIAL DASH PANELS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-850 rounded-2xl flex items-center justify-between shadow-sm select-none">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-stone-400 font-bold">Total Daily Orders</span>
                <p className="text-3xl font-black font-serif text-burgundy dark:text-gold leading-none">{dailyOrdersCount}</p>
              </div>
              <div className="p-3 bg-zinc-100 dark:bg-stone-950 text-stone-600 dark:text-zinc-400 rounded-full">
                <Layers size={22} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-850 rounded-2xl flex items-center justify-between shadow-sm select-none">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono text-stone-400 font-bold">Daily gross Revenue</span>
                <p className="text-3xl font-black font-serif text-burgundy dark:text-gold leading-none">₹{dailyRevenue}</p>
              </div>
              <div className="p-3 bg-zinc-105 dark:bg-stone-950 text-stone-600 dark:text-zinc-400 rounded-full">
                <Landmark size={22} />
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 border border-stone-250 dark:border-stone-850 rounded-2xl flex items-center justify-between shadow-sm select-none">
              <div className="space-y-0.5 font-sans">
                <span className="text-[10px] uppercase font-mono text-stone-400 font-bold">Middlemen Fees Saved</span>
                <p className="text-3xl font-black font-serif text-emerald-600 leading-none">₹{Math.round(dailyRevenue * 0.22)}</p>
                <span className="text-[8px] text-stone-450 block pt-0.5">Based on typical 22% aggregator commission cut!</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-605 rounded-full">
                <Users size={22} />
              </div>
            </div>
          </section>

          {/* BRAND AND LOCATION CONFIGURATION CARD */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-stone-105 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Restaurant Config Settings</span>
                <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold flex items-center gap-1.5 leading-none">
                  <Store size={18} /> Brand Identity & Location Settings
                </h3>
              </div>
              <button
                onClick={() => setShowBrandSettings(!showBrandSettings)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Settings size={13} /> {showBrandSettings ? 'Collapse Profile Form' : 'Update Profile & Address'}
              </button>
            </div>

            {showBrandSettings ? (
              <form onSubmit={handleSaveBrandSettings} className="space-y-4 animate-in slide-in-from-top-3 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase font-mono">Restaurant Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Spice & Soul"
                      value={restName}
                      onChange={(e) => setRestName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase font-mono">Brand Slogan / Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Gourmet Clay Kitchen • 0% Middlemen Fees"
                      value={restTagline}
                      onChange={(e) => setRestTagline(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase font-mono">Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 40 4827 9100"
                      value={restPhone}
                      onChange={(e) => setRestPhone(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500 uppercase font-mono">Contact Email Coordinates</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. chef@spiceandsoul.com"
                      value={restEmail}
                      onChange={(e) => setRestEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase font-mono">Physical Store Address (Saves to database, receipts, maps & contact pages)</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Enter physical addresscoords..."
                    value={restAddress}
                    onChange={(e) => setRestAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-500 uppercase font-mono">Master Cover / Banner Image URL</label>
                  <input
                    type="text"
                    placeholder="Enter Unsplash or web image URL..."
                    value={restBanner}
                    onChange={(e) => setRestBanner(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                  />
                </div>

                {/* OWNER SETTLEMENT & UPI PAYMENTS SCANNER SETTINGS */}
                <div className="border-t border-dashed border-stone-200 dark:border-stone-800 pt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-burgundy dark:text-gold uppercase tracking-wide">Owner Settlement & Payment Scanner Settings</h4>
                    <p className="text-[10px] text-stone-450">Set where checkout transactions deposit. This configures live scanner coordinates at client billing checkout modules.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 uppercase font-mono">Owner UPI VPA ID (For Instant QR Code Generation)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. owner@okhdfcbank"
                        value={restUpiId}
                        onChange={(e) => setRestUpiId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 uppercase font-mono">GPay / PhonePe Recipient Mobile</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={restPaymentNumber}
                        onChange={(e) => setRestPaymentNumber(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500 uppercase font-mono">Settlement Bank Name</label>
                      <input
                        type="text"
                        placeholder="e.g. HDFC Bank"
                        value={restBankName}
                        onChange={(e) => setRestBankName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase font-mono">Account Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 5010048279110"
                          value={restBankAccount}
                          onChange={(e) => setRestBankAccount(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-500 uppercase font-mono">Bank IFSC Code</label>
                        <input
                          type="text"
                          placeholder="e.g. HDFC0000001"
                          value={restBankIfsc}
                          onChange={(e) => setRestBankIfsc(e.target.value)}
                          className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow transition-all hover:scale-102"
                  >
                    Commit Settings & Live Update Website
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-stone-600 dark:text-stone-300">
                <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl space-y-1 border border-stone-105 dark:border-stone-850">
                  <span className="text-[10px] text-stone-400 font-mono font-bold block uppercase tracking-wide">Brand & Logo Profile</span>
                  <p className="font-bold text-burgundy dark:text-gold text-sm">{restaurantInfo.name}</p>
                  <p className="italic text-stone-500 dark:text-stone-400">{restaurantInfo.tagline}</p>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl space-y-1 border border-stone-105 dark:border-stone-850">
                  <span className="text-[10px] text-stone-400 font-mono font-bold block uppercase tracking-wide">GPRS Store Location Address</span>
                  <p className="font-medium text-stone-700 dark:text-stone-300">{restaurantInfo.address}</p>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-950/40 rounded-xl space-y-2 border border-stone-105 dark:border-stone-850">
                  <span className="text-[10px] text-stone-400 font-mono font-bold block uppercase tracking-wide font-mono">Contact Identity Coordinates</span>
                  <div className="space-y-0.5 text-stone-600 dark:text-stone-400">
                    <p className="flex items-center gap-1">📞 Phone: <span className="font-semibold">{restaurantInfo.phone}</span></p>
                    <p className="flex items-center gap-1">✉️ Email: <span className="font-semibold truncate">{restaurantInfo.email}</span></p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* MANAGING CUSTOM MENU ITEMS (Form + List) */}
          <section className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold flex items-center gap-1.5 leading-none">
                <Layers size={18} /> Culinary Menu CRUD Manager
              </h3>
              
              <button
                onClick={() => {
                  setEditingItem(null);
                  setItemName('');
                  setItemPrice('');
                  setItemDesc('');
                  setItemImg('');
                  setItemVeg(true);
                  setItemSpecial(false);
                  setShowItemForm(!showItemForm);
                }}
                className="px-4 py-2 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <PlusCircle size={13} /> {showItemForm ? 'Collapse Form' : 'Add Recipe dish'}
              </button>
            </div>

            {/* Crud submission form */}
            {showItemForm && (
              <form onSubmit={handleItemFormSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 animate-in slide-in-from-top-3 duration-200">
                <h4 className="md:col-span-12 font-bold font-serif text-base text-stone-705 border-b pb-1">
                  {editingItem ? 'Edit Culinary Recipe details' : 'Draft New Recipe into Active Menu'}
                </h4>

                <div className="md:col-span-4 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Recipe Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Peshawari Naan, Saag..."
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-2 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="E.g., 180..."
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-3 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Dish Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs h-[38px] cursor-pointer"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Regular Mains">Mains</option>
                    <option value="Biryanis">Biryanis</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1 text-xs select-none h-[42px] mt-6 flex gap-4">
                  <label className="flex items-center space-x-1.5 font-semibold text-emerald-600 dark:text-emerald-500 cursor-pointer">
                    <input type="checkbox" checked={itemVeg} onChange={(e) => setItemVeg(e.target.checked)} className="rounded accent-emerald-550" />
                    <span>🥬 Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-1.5 font-semibold text-amber-500 cursor-pointer">
                    <input type="checkbox" checked={itemSpecial} onChange={(e) => setItemSpecial(e.target.checked)} className="rounded accent-amber-550" />
                    <span>🔥 Bestseller</span>
                  </label>
                </div>

                <div className="md:col-span-12 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Recipe description</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Crispy tandoori cooked naan brushed with homemade garlic butter..."
                    value={itemDesc}
                    onChange={(e) => setItemDesc(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-12 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Unsplash image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={itemImg}
                    onChange={(e) => setItemImg(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setShowItemForm(false);
                    }}
                    className="px-4 py-2 bg-stone-105 hover:bg-stone-200 text-stone-605 border rounded-lg text-xs font-semibold"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold uppercase rounded-lg text-xs cursor-pointer shadow-sm"
                  >
                    {editingItem ? 'Save recipe edits' : 'Publish to live portal'}
                  </button>
                </div>
              </form>
            )}

            {/* Dynamic visual menu item edits / list deletes */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-xs text-stone-400 font-mono">Dishes listed on client portal ({menuItems.length} recipe items)</h4>
              
              <div className="divide-y divide-stone-100 dark:divide-stone-850/60 max-h-96 overflow-y-auto pr-1">
                {menuItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <img src={item.image} alt={item.name} className="w-11 h-11 object-cover bg-stone-100 rounded shrink-0" referrerPolicy="no-referrer" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] px-1 font-bold rounded border uppercase shrink-0 ${item.isVeg ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          {item.isVeg ? 'Veg' : 'NV'}
                        </span>
                        <h5 className="font-semibold text-xs font-sans truncate text-stone-800 dark:text-cream">{item.name}</h5>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono">{item.category} • ₹{item.price}</span>
                    </div>

                    <div className="flex items-center gap-2 select-none">
                      {/* Availability status */}
                      <button
                        onClick={() => {
                          toggleMenuItemAvailability(item.id);
                        }}
                        className={`text-xs flex items-center gap-1 hover:underline font-mono ${item.isAvailable ? 'text-emerald-600' : 'text-stone-400'}`}
                      >
                        {item.isAvailable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        <span className="text-[10px] hidden sm:inline">{item.isAvailable ? 'In stock' : 'Out of stock'}</span>
                      </button>

                      <button
                        onClick={() => handleTriggerEdit(item)}
                        className="p-1 px-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 text-stone-600 dark:text-stone-300 rounded hover:text-burgundy"
                        title="Edit Item Details"
                      >
                        <Edit size={12} />
                      </button>

                      <button
                        onClick={() => {
                          deleteMenuItem(item.id);
                        }}
                        className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded"
                        title="Delete Recipe"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SYSTEM RATES, FEES & LOYALTY LIFECYCLE CONFIGURATOR */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-stone-105 dark:border-stone-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold block">Live Financial Parameters</span>
                <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold flex items-center gap-1.5 leading-none">
                  <Percent size={18} /> Rates, Taxes & Loyalty Configurator
                </h3>
              </div>
            </div>

            <form onSubmit={handleSaveStoreConfig} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-550 uppercase font-mono tracking-wider">GST Sales Tax Rate (%)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={cfgGst}
                    onChange={(e) => setCfgGst(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-cream text-xs"
                    placeholder="e.g. 5"
                  />
                  <span className="px-3 py-2 bg-stone-100 dark:bg-stone-800 border rounded-xl font-mono text-xs flex items-center">%</span>
                </div>
                <p className="text-[10px] text-stone-405">Standard GST calculations are computed on live user carts.</p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-550 uppercase font-mono tracking-wider">Base Delivery Charge (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    required
                    value={cfgDelivery}
                    onChange={(e) => setCfgDelivery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-805 text-stone-800 dark:text-cream text-xs"
                    placeholder="e.g. 40"
                  />
                  <span className="px-3 py-2 bg-stone-100 dark:bg-stone-800 border rounded-xl font-mono text-xs flex items-center">₹</span>
                </div>
                <p className="text-[10px] text-stone-405">Delivery rates applicable for delivery orders under the ₹500 threshold.</p>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-stone-550 uppercase font-mono tracking-wider">Loyalty Point Conversion (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.01"
                    required
                    value={cfgLoyaltyVal}
                    onChange={(e) => setCfgLoyaltyVal(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-805 text-stone-800 dark:text-cream text-xs"
                    placeholder="e.g. 0.5"
                  />
                  <span className="px-3 py-2 bg-stone-100 dark:bg-stone-800 border rounded-xl font-mono text-xs flex items-center">₹/Pt</span>
                </div>
                <p className="text-[10px] text-stone-405">The rupee discount received by users per redeemed loyalty point.</p>
              </div>

              <div className="md:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all hover:scale-102"
                >
                  Apply Live Coefficients
                </button>
              </div>
            </form>
          </section>

          {/* REGISTERED COUPONS & CODES MANAGER (CRUD) */}
          <section className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold flex items-center gap-1.5 leading-none">
                <Gift size={18} /> Promotions & Coupon Manager
              </h3>
              
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setCouponCodeInput('');
                  setCouponPercentInput('');
                  setCouponDescInput('');
                  setShowCouponForm(!showCouponForm);
                }}
                className="px-4 py-2 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <PlusCircle size={13} /> {showCouponForm ? 'Collapse Form' : 'Insert Coupon Code'}
              </button>
            </div>

            {showCouponForm && (
              <form onSubmit={handleCouponSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 animate-in slide-in-from-top-3 duration-200">
                <h4 className="md:col-span-12 font-bold font-serif text-base text-stone-705 border-b pb-1">
                  {editingCoupon ? 'Modify Active Promotion Parameters' : 'Draft New Checkout Promo Code Coupon'}
                </h4>

                <div className="md:col-span-4 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. MATCHDAY..."
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-3 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Discount Percent (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    placeholder="E.g. 15..."
                    value={couponPercentInput}
                    onChange={(e) => setCouponPercentInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-5 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Slogan / Description Details</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Get 15% discount on checkout orders!"
                    value={couponDescInput}
                    onChange={(e) => setCouponDescInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCoupon(null);
                      setShowCouponForm(false);
                    }}
                    className="px-4 py-2 bg-stone-105 hover:bg-stone-200 text-stone-605 border rounded-lg text-xs font-semibold"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold uppercase rounded-lg text-xs cursor-pointer shadow-sm"
                  >
                    {editingCoupon ? 'Save Coupon' : 'Publish Coupon Code'}
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-xs text-stone-400 font-mono">Database Promo Codes ({coupons.length} codes online)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1 text-stone-800 dark:text-stone-100">
                {coupons.map((cp) => (
                  <div key={cp.id} className="p-4 border rounded-xl bg-stone-50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-850 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded uppercase">{cp.code}</span>
                        <span className="text-xs font-bold text-burgundy dark:text-gold">{cp.discountPercent}% OFF</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1">{cp.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 select-none">
                      <button
                        onClick={() => handleTriggerEditCoupon(cp)}
                        className="p-1 px-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 text-stone-600 dark:text-stone-300 rounded"
                        title="Edit Promo Campaign"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => deleteCoupon(cp.id)}
                        className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded"
                        title="Delete Promo Campaign"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TESTIMONIALS & FEEDBACK REVIEWS CRUD MANAGER */}
          <section className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-4 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold flex items-center gap-1.5 leading-none">
                <Quote size={18} /> Testimonial Reviews Manager
              </h3>
              
              <button
                onClick={() => {
                  setEditingReview(null);
                  setReviewAuthorInput('');
                  setReviewCommentInput('');
                  setReviewRatingInput('5');
                  setReviewDishInput('');
                  setShowReviewForm(!showReviewForm);
                }}
                className="px-4 py-2 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <PlusCircle size={13} /> {showReviewForm ? 'Collapse Form' : 'Insert Review Testimonial'}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-12 gap-5 animate-in slide-in-from-top-3 duration-200">
                <h4 className="md:col-span-12 font-bold font-serif text-base text-stone-705 border-b pb-1">
                  {editingReview ? 'Modify Portal Testimonial' : 'Draft New Portal Review / Testimonial'}
                </h4>

                <div className="md:col-span-4 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Patron Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Shreya Saxena..."
                    value={reviewAuthorInput}
                    onChange={(e) => setReviewAuthorInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-2 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Rating Score</label>
                  <select
                    value={reviewRatingInput}
                    onChange={(e) => setReviewRatingInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream h-[38px] cursor-pointer text-xs"
                  >
                    <option value="5">5 Stars ★★★★★</option>
                    <option value="4">4 Stars ★★★★</option>
                    <option value="3">3 Stars ★★★</option>
                    <option value="2">2 Stars ★★</option>
                    <option value="1">1 Star ★</option>
                  </select>
                </div>

                <div className="md:col-span-6 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Dish/Service Experience Accolade</label>
                  <input
                    type="text"
                    placeholder="E.g. Paneer Lababdar & Garlic Butter Naan..."
                    value={reviewDishInput}
                    onChange={(e) => setReviewDishInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-12 space-y-1 text-xs">
                  <label className="font-bold text-stone-400 uppercase font-mono tracking-wider">Review Comments</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="E.g. Absolutely delicious experience! Bypassing delivery apps saved me ₹200 and custom hand crafted recipes were hot..."
                    value={reviewCommentInput}
                    onChange={(e) => setReviewCommentInput(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-stone-50 dark:bg-stone-950 text-stone-850 dark:text-cream text-xs"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingReview(null);
                      setShowReviewForm(false);
                    }}
                    className="px-4 py-2 bg-stone-105 hover:bg-stone-200 text-stone-605 border rounded-lg text-xs font-semibold"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold uppercase rounded-lg text-xs cursor-pointer shadow-sm"
                  >
                    {editingReview ? 'Save Testimonial' : 'Publish Testimonial Review'}
                  </button>
                </div>
              </form>
            )}

            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-4">
              <h4 className="font-bold uppercase tracking-wider text-xs text-stone-400 font-mono">Live Portal Feedback & Testimonials ({reviews.length} reviews published)</h4>
              
              <div className="divide-y divide-stone-100 dark:divide-stone-850/60 max-h-96 overflow-y-auto pr-1 text-stone-800 dark:text-stone-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-xs text-stone-800 dark:text-cream truncate">{rev.name}</h5>
                        <span className="text-[10px] text-amber-500 font-bold font-mono">{'★'.repeat(Math.round(rev.rating))}</span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5">Dish: <strong className="font-medium text-stone-500">{rev.dish}</strong> • {rev.date}</p>
                      <p className="text-[11px] text-stone-650 dark:text-stone-350 italic mt-1 leading-relaxed">"{rev.comment}"</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 select-none">
                      <button
                        onClick={() => handleTriggerEditReview(rev)}
                        className="p-1 px-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 text-stone-600 dark:text-stone-300 rounded"
                        title="Edit Review Details"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="p-1 px-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded"
                        title="Delete Review"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* INCOMING ACTIVE ORDERS LIST */}
          <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 font-bold">Chef Queued Tickets</span>
                <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold leading-none">Incoming Orders Feed</h3>
              </div>

              {/* CSV download */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-stone-300/50 mt-1"
                id="export-csv-btn"
              >
                <ArrowDownToLine size={13} /> Export orders as CSV
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-cream-dark/5 border border-dashed rounded-xl text-stone-400 text-xs">
                No orders have been submitted to the kitchen queue yet. Try checking out an order from the front-end cart page.
              </div>
            ) : (
              <div className="space-y-6" id="admin-orders-list">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-5 border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/20 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed pb-3 text-xs select-none">
                      <div className="space-y-1">
                        <strong className="block text-sm text-stone-850 dark:text-cream">ID: {ord.id}</strong>
                        <span className="block text-[10px] text-stone-450 font-mono">{new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Dropdown status update triggers */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-mono text-stone-400 font-bold hidden sm:inline">Set Status:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => {
                            updateOrderStatus(ord.id, e.target.value as any);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-50 dark:bg-stone-950 text-xs font-semibold focus:outline-none"
                        >
                          <option value="received">Order Received</option>
                          <option value="preparing">Preparing Cook</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered Spot</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-stone-400 block uppercase font-mono text-[9px] font-bold">Patron details</span>
                        <p className="font-semibold text-stone-700 dark:text-stone-250 truncate ...">{ord.customerName}</p>
                        <p className="text-stone-500 font-mono text-[10px]">{ord.customerEmail}</p>
                        <p className="text-stone-500 font-mono text-[10px]">{ord.customerPhone}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block uppercase font-mono text-[9px] font-bold">Fulfilment Spot</span>
                        <p className="text-stone-600 dark:text-stone-300 font-medium font-sans leading-snug line-clamp-2">{ord.address}</p>
                      </div>
                      <div>
                        <span className="text-stone-400 block uppercase font-mono text-[9px] font-bold">Payment & Financials</span>
                        <p className="text-stone-708 dark:text-stone-200">Mode: <strong className="font-mono">{ord.paymentMethod.toUpperCase()}</strong></p>
                        <p className="font-black text-sm text-burgundy dark:text-gold font-mono pt-0.5">₹{ord.total}</p>
                      </div>
                    </div>

                    {/* Cook specific instructions */}
                    {ord.instructions && (
                      <div className="p-2.5 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/10 rounded text-xs italic text-amber-800 dark:text-amber-400 font-sans leading-relaxed">
                        🧑‍🍳 Special instructions: "{ord.instructions}"
                      </div>
                    )}

                    {/* Recipe lists */}
                    <div className="space-y-1 text-xs">
                      <span className="text-stone-400 uppercase font-mono text-[9px] font-bold block pb-1 border-b">Dishes Compiled</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ord.items.map((it: any, index: number) => (
                          <div key={index} className="p-2 bg-white dark:bg-stone-900 border rounded flex justify-between leading-none text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                            <span>{it.name} (x{it.quantity})</span>
                            <span className="text-stone-405">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Support builders */}
                    <div className="pt-3 border-t border-dashed flex justify-end gap-3 select-none">
                      <a
                        href={getOutboundStatusWhatsAppURL(ord)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-650 text-cream font-bold text-xs uppercase tracking-tight rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                        onClick={() => {
                          addToast('Dispatched formatted WhatsApp update alerts!', 'info');
                        }}
                      >
                        <Smartphone size={13} />
                        <span>Send WhatsApp Status update Alert</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}
    </div>
  );
};
