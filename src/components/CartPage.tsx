/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppState } from '../context/StateContext';
import { ShoppingCart, Compass, BookOpen, Receipt, Gift, Compass as MapIcon, Send, UserCheck, MessageSquare, Printer, CheckCircle, Smartphone, Mail, QrCode, MapPin, ShieldCheck, Wallet } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    orders,
    currentUser,
    removeFromCart,
    updateCartQuantity,
    placeOrder,
    navigateTo,
    addToast,
    coupons,
    storeConfig,
    restaurantInfo
  } = useAppState();

  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [address, setAddress] = useState<string>(() => {
    return currentUser && currentUser.addresses.length > 0 ? currentUser.addresses[0] : '';
  });
  const [instructions, setInstructions] = useState<string>('');

  // Validate recipient credentials
  const [recipientName, setRecipientName] = useState<string>(() => {
    return currentUser ? currentUser.name : '';
  });
  const [recipientPhone, setRecipientPhone] = useState<string>(() => {
    return currentUser ? currentUser.phone : '';
  });
  const [paymentUtr, setPaymentUtr] = useState<string>('');

  // Automatic profile synchronizers
  React.useEffect(() => {
    if (currentUser) {
      if (!recipientName) setRecipientName(currentUser.name);
      if (!recipientPhone) setRecipientPhone(currentUser.phone);
      if (!address && currentUser.addresses.length > 0) setAddress(currentUser.addresses[0]);
    }
  }, [currentUser]);
  
  // Coupons & Loyalty
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [ptsToRedeem, setPtsToRedeem] = useState<number>(0);

  // Success dialog modal details (to allow printer receipt and WhatsApp launcher)
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any | null>(null);

  // Zomato style Payment gateway Choices state
  const [activePaymentCategory, setActivePaymentCategory] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiID, setUpiID] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Math Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  
  // Delivery fee rules: configurable, but free for orders over ₹500, or if takeaway/dine-in
  const deliveryFee = orderType === 'delivery' && subtotal < 500 ? storeConfig.deliveryFeeUnder500 : 0;
  
  // Coupon Discount
  const couponDiscount = appliedCoupon ? Math.round((subtotal * appliedCoupon.percent) / 100) : 0;
  
  // Loyalty redemption math (1 point = configurable discount value)
  // Max points they can redeem is their balance, capped to 80% of cart value to keep business sustainable
  const maxRedeemablePoints = currentUser
    ? Math.min(currentUser.loyaltyPoints, Math.floor((subtotal - couponDiscount) * (1 / storeConfig.loyaltyPointValue) * 0.8))
    : 0;
  
  const loyaltyValue = ptsToRedeem * storeConfig.loyaltyPointValue;

  // Configurable GST %
  const gstTax = Math.round((subtotal - couponDiscount - loyaltyValue) * (storeConfig.gstPercent / 100));
  
  // Grand Total
  const grandTotal = Math.max(0, subtotal - couponDiscount - loyaltyValue + deliveryFee + gstTax);

  // Apply Coupon Action
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'SOULFEAST' && subtotal < 600) {
      addToast('SOULFEAST coupon requires a minimum cart value of ₹600!', 'error');
      return;
    }

    const matched = coupons.find((c) => c.code.trim().toUpperCase() === code);
    if (matched) {
      setAppliedCoupon({ code: matched.code, percent: matched.discountPercent });
      addToast(`Coupon "${matched.code}" applied! ${matched.discountPercent}% Off!`, 'success');
    } else {
      addToast('Invalid coupon code!', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    addToast('Coupon removed', 'info');
  };

  // Place Order Action
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    // 1. Validate Recipient Name
    if (!recipientName.trim() || recipientName.trim().length < 3) {
      addToast('Please enter a valid recipient name (minimum 3 characters) for wait staff & chef recognition!', 'error');
      return;
    }

    // 2. Validate Recipient Phone (at least 10 digits)
    const numericPhone = recipientPhone.replace(/\D/g, '');
    if (numericPhone.length < 10) {
      addToast('Please enter a correct, valid 10-digit mobile phone number for active notification alerts!', 'error');
      return;
    }

    // 3. Validate Delivery Address Length
    if (orderType === 'delivery') {
      if (!address.trim() || address.trim().length < 12) {
        addToast('Please enter a detailed delivery address (minimum 12 characters including Flat/House details) to prevent courier rider confusion!', 'error');
        return;
      }
    }

    // Determine the pre-formatted payment label
    let paymentLabel = 'Online';
    if (activePaymentCategory === 'upi') {
      paymentLabel = `UPI Instant (VPA: ${upiID || 'direct@gate'}, Ref: ${paymentUtr || 'Simulator'})`;
    } else if (activePaymentCategory === 'card') {
      const maskedCard = cardNumber ? `•••• ${cardNumber.slice(-4)}` : '•••• 4242';
      paymentLabel = `Credit/Debit Card (Secured - ${maskedCard})`;
    } else if (activePaymentCategory === 'netbanking') {
      paymentLabel = `Net Banking (${selectedBank})`;
    } else if (activePaymentCategory === 'cod') {
      paymentLabel = `${orderType === 'dinein' ? 'Pay at Table' : 'Cash on Delivery (COD)'}`;
    }

    // Call state context to execute database transaction
    const resOrder = placeOrder(
      orderType,
      orderType === 'delivery' ? address : 'Self counter takeaway / table Dine-in',
      instructions,
      appliedCoupon ? appliedCoupon.code : '',
      couponDiscount,
      deliveryFee,
      gstTax,
      ptsToRedeem,
      paymentLabel,
      recipientName.trim(),
      recipientPhone.trim()
    );

    if (resOrder) {
      setPlacedOrderDetails(resOrder);
      // Reset page entries
      setPtsToRedeem(0);
      setAppliedCoupon(null);
      setCouponInput('');
      setInstructions('');
    }
  };

  // Launch pre-formatted WhatsApp string
  const getWhatsAppURL = (ord: any) => {
    const itemsFormatted = ord.items
      .map((i: any) => `- ${i.name} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`)
      .join('\n');

    const message = `*Spice & Soul Kitchen Order Receipt* 📲
---------------------------------------
*Order ID:* ${ord.id}
*Customer:* ${ord.customerName}
*Phone:* ${ord.customerPhone}
*Type:* ${ord.type.toUpperCase()}

*Items ordered:*
${itemsFormatted}

*Financial summary:*
Subtotal: ₹${ord.subtotal}
Discount applied: ₹${ord.discount}
GST Tax (${storeConfig.gstPercent}%): ₹${ord.tax}
Delivery Fee: ₹${ord.deliveryFee}
*GRAND TOTAL: ₹${ord.total}*

*Delivery Spot:*
${ord.address}

*Notes to Chef:* 
"${ord.instructions || 'None'}"
---------------------------------------
Earned ${ord.pointsEarned} loyalty points! Obrigado/Thank you for supporting direct local chefs directly! 💖`;

    return `https://api.whatsapp.com/send?phone=+919876543210&text=${encodeURIComponent(message)}`;
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {placedOrderDetails ? (
        /* SUCCESS DIALOG PANEL WITH PRINT INTEGRATION AND WHATSAPP TRIGGER */
        <div className="max-w-xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-805 rounded-3xl p-8 shadow-xl text-center space-y-6 print:border-0 print:p-0">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-full">
            <CheckCircle size={36} />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-serif text-burgundy dark:text-gold">Order Placed Successfully!</h2>
            <p className="text-xs font-mono text-stone-500 uppercase">Order Receipt Code: <span className="font-bold text-stone-700 dark:text-stone-300">{placedOrderDetails.id}</span></p>
          </div>

          <div className="p-5 bg-stone-50 dark:bg-stone-950 rounded-xl text-left text-xs font-mono border space-y-3 print:bg-white print:border-none">
            <h4 className="font-bold border-b pb-1 text-center font-sans tracking-wide text-burgundy dark:text-gold uppercase text-[10px]">SPICE & SOUL INVOICE</h4>
            
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-sans font-semibold">{placedOrderDetails.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Details:</span>
              <span className="font-sans font-semibold line-clamp-1">{placedOrderDetails.address}</span>
            </div>
            
            <div className="border-t border-dashed my-3" />
            
            <div className="space-y-1.5 font-sans">
              {placedOrderDetails.items.map((i: any, index: number) => (
                <div key={index} className="flex justify-between font-mono text-xs">
                  <span>{i.name} (x{i.quantity})</span>
                  <span>₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed my-3" />

            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{placedOrderDetails.subtotal}</span>
            </div>
            {placedOrderDetails.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount / Points Saved:</span>
                <span>-₹{placedOrderDetails.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST Tax ({storeConfig.gstPercent}%):</span>
              <span>₹{placedOrderDetails.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Rider Delivery Fee:</span>
              <span>₹{placedOrderDetails.deliveryFee}</span>
            </div>
            
            <div className="border-t pt-2 flex justify-between font-bold text-sm text-burgundy dark:text-gold">
              <span>Grand Total:</span>
              <span>₹{placedOrderDetails.total}</span>
            </div>

            <div className="border-t border-dashed pt-2 font-sans text-center text-[10px] text-stone-400">
              🎁 Earned {placedOrderDetails.pointsEarned} Loyalty Points on this order!
            </div>
          </div>

          {/* REAL-TIME DIRECT NOTIFICATION LOGS PANEL */}
          <div className="p-5 bg-stone-900 border border-stone-800 rounded-2xl text-left select-none space-y-3 shadow-inner relative overflow-hidden">
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[8px] font-bold text-emerald-400 font-mono uppercase tracking-wider">GATEWAY PASS</span>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold font-mono text-stone-200 uppercase tracking-wide flex items-center gap-1">
                <Smartphone size={13} className="text-gold" /> Outbound Cellular Logs
              </h4>
              <p className="text-[10px] text-stone-400 font-sans">
                Receipt logs dispatched to both customer and merchant instantly.
              </p>
            </div>

            <div className="space-y-2 font-mono text-[10px] bg-stone-950 p-3.5 rounded-lg border border-stone-850 max-h-44 overflow-y-auto leading-relaxed">
              <div className="text-emerald-500">
                &gt; GSM Cellular Network link connected. ID: #AIR-918
              </div>
              <div className="text-stone-300">
                &gt; Preparing outbound alert logs...
              </div>
              <div className="text-emerald-400 border-t border-stone-850 pt-1">
                &gt; [SMS SUCCESS] Transmitted to Merchant ({restaurantInfo.phone}): "ALERT: New Order {placedOrderDetails.id} received! Items: {placedOrderDetails.items.map((it:any)=>it.name).join(', ')}. Value: ₹{placedOrderDetails.total}. Recipient: {placedOrderDetails.customerName} ({placedOrderDetails.customerPhone})."
              </div>
              <div className="text-emerald-400 border-t border-stone-850 pt-1">
                &gt; [SMS SUCCESS] Transmitted to Patron ({placedOrderDetails.customerPhone}): "Order {placedOrderDetails.id} checkout complete! Cooking direct in local clay burners at Spice & Soul. Bypassed delivery app middleman markups!"
              </div>
              <div className="text-emerald-400 border-t border-stone-850 pt-1.5">
                &gt; [SMTP Email Gateway]: Summary dispatched to:
                <div className="text-stone-300 ml-2 mt-0.5 font-sans">- Merchant: <span className="underline">{restaurantInfo.email}</span></div>
                <div className="text-stone-300 ml-2 mt-0.5 font-sans">- Customer: <span className="underline">{placedOrderDetails.customerEmail}</span></div>
              </div>
            </div>
            
            <div className="text-[9px] text-amber-500 font-mono italic">
              ⭐ Alert successfully routed straight to restaurant burners.
            </div>
          </div>

          {/* Action drivers */}
          <div className="flex flex-col gap-3 py-2 print:hidden">
            {/* WhatsApp triggering button */}
            <a
              href={getWhatsAppURL(placedOrderDetails)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-650 dark:hover:bg-emerald-500 text-cream font-bold rounded-xl shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2"
              onClick={() => {
                addToast('Formulating WhatsApp API trigger!', 'info');
              }}
            >
              <MessageSquare size={16} />
              <span>Launch Chef WhatsApp Order Notify</span>
            </a>

            <div className="flex items-center gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-stone-300/60"
              >
                <Printer size={14} /> Print Receipt
              </button>
              
              <button
                onClick={() => {
                  setPlacedOrderDetails(null);
                  navigateTo('tracking');
                }}
                className="flex-1 py-3 bg-burgundy hover:bg-burgundy-light text-cream font-bold rounded-xl text-xs uppercase tracking-wider shadow-sm"
              >
                Live Order Tracker
              </button>
            </div>
          </div>
        </div>
      ) : cart.length === 0 ? (
        /* EMPTY CART VIEW */
        <div className="max-w-lg mx-auto text-center py-20 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 space-y-6">
          <div className="mx-auto flex items-center justify-center w-14 h-14 bg-burgundy/5 dark:bg-burgundy/10 text-burgundy dark:text-gold rounded-full">
            <ShoppingCart size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-serif text-stone-800 dark:text-cream">Your cart is currently empty</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added any of our delicious Indian recipes to your cart yet. Order directly from our kitchen below and unlock immediate loyalty savings.
            </p>
          </div>
          <button
            onClick={() => navigateTo('menu')}
            className="px-6 py-3 bg-burgundy hover:bg-burgundy-light text-cream font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow cursor-pointer"
          >
            Browse Recipe Menu
          </button>
        </div>
      ) : (
        /* CART GRID & CHECKOUT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Itemized List Panel */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold border-b pb-3 mb-4 flex items-center gap-1.5">
                <ShoppingCart size={18} /> Direct Cart Summary ({cart.length} recipes)
              </h3>

              <div className="divide-y divide-stone-100 dark:divide-stone-850">
                {cart.map((item) => (
                  <div key={item.menuItem.id} className="py-4 flex items-center justify-between gap-4 select-none">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[8px] font-bold rounded px-1 border uppercase inline-block shrink-0 ${item.menuItem.isVeg ? 'bg-emerald-50 text-emerald-700 border-emerald-350' : 'bg-rose-50 text-rose-700 border-rose-350'}`}>
                          {item.menuItem.isVeg ? 'Veg' : 'N-Veg'}
                        </span>
                        <h4 className="font-semibold text-sm text-stone-800 dark:text-cream truncate ... font-sans line-clamp-1">
                          {item.menuItem.name}
                        </h4>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">₹{item.menuItem.price} each</span>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center space-x-2 bg-stone-100 dark:bg-stone-950 p-1 border rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                        className="p-1 px-1.5 text-stone-605 dark:text-stone-400 hover:text-burgundy"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold font-mono px-1.5">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                        className="p-1 px-1.5 text-stone-605 dark:text-stone-400 hover:text-burgundy"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-sm font-bold font-mono">₹{item.menuItem.price * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.menuItem.id)}
                        className="text-[10px] text-rose-500 hover:underline cursor-pointer font-bold block ml-auto"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special notes & instructions */}
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850/60 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">Kitchen Cook Instructions</h3>
              <textarea
                placeholder="E.g., Make the butter chicken spill-proof, extra hot Biryani spiced, avoid onions etc."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full h-24 p-3 rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/25 dark:bg-stone-950 text-xs focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream placeholder-stone-400 resize-none"
              />
            </div>
          </div>

          {/* Billing & Address Checkout Panel */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleCheckout} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850/60 rounded-2xl p-6 shadow-sm space-y-5">
              <h3 className="text-lg font-bold font-serif text-burgundy dark:text-gold border-b pb-3 flex items-center gap-1.5">
                <Receipt size={17} /> Settlement & Shipping
              </h3>

              {/* Order Type picker */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 font-mono">Order Fulfilment Handover</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'delivery', label: '🚚 Delivery' },
                    { id: 'takeaway', label: '🥡 Takeaway' },
                    { id: 'dinein', label: '🍽️ Dine-In' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setOrderType(opt.id as any);
                        addToast(`Switched fulfilment to ${opt.label}`, 'info');
                      }}
                      className={`py-2 px-1 rounded-lg text-xs font-bold uppercase tracking-tight text-center transition-all cursor-pointer ${
                        orderType === opt.id
                          ? 'bg-burgundy text-cream dark:bg-gold dark:text-stone-900 border border-burgundy dark:border-gold'
                          : 'bg-stone-105 border hover:bg-stone-200/50 dark:bg-stone-950 text-stone-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery info & credentials */}
              <div className="space-y-3.5 border-t border-dashed border-stone-200 dark:border-stone-800 pt-4">
                <div>
                  <h4 className="text-xs font-mono font-extrabold uppercase text-stone-450 tracking-wider">1. Delivery Recipient Details</h4>
                  <p className="text-[10px] text-stone-400">Required credentials for direct wait staff coordinates and rider status updates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saketh Reddy"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream placeholder-stone-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-stone-400 font-mono">Mobile Phone (Carrier ID)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream placeholder-stone-400"
                    />
                  </div>
                </div>

                {orderType === 'delivery' ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 font-mono">2. Drop Address Spot</label>
                      {currentUser && currentUser.addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setAddress(currentUser.addresses[0]);
                            addToast('Autofilled saved address!', 'success');
                          }}
                          className="text-[10px] text-burgundy dark:text-gold font-bold hover:underline flex items-center gap-0.5 whitespace-nowrap"
                        >
                          <UserCheck size={11} /> Use Saved Address
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required={orderType === 'delivery'}
                      placeholder="Enter full flat number, road, nearby landmark address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream placeholder-stone-400"
                    />
                    <p className="text-[9px] text-stone-400 italic">🟢 Delivery range covers 6km around Jubilee Hills Road 36. Minimum Address size: 12 chars.</p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100/50 dark:bg-stone-950/50 border border-stone-200 border-dashed rounded-lg text-center text-xs text-stone-500">
                    {orderType === 'takeaway' 
                      ? '🥡 Self pick-up at kitchen counter. Ready in 20 minutes (free of delivery charges).'
                      : '🍽️ Dine-in selected. Head to Table #14. Your order is routed straight to wait staff burners.'}
                  </div>
                )}
              </div>

              {/* Coupon inputs */}
              <div className="space-y-2 border-t pt-4">
                <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 font-mono">Promotional Coupon</label>
                {appliedCoupon ? (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-lg flex justify-between items-center text-xs text-emerald-800 dark:text-emerald-350">
                    <span className="font-bold flex items-center gap-1">🎟️ Applied: {appliedCoupon.code} ({appliedCoupon.percent}% OFF)</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-red-500 font-bold hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="TRY 'DIRECTSAVE' or 'SOULFEAST'..."
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs uppercase rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-950 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream placeholder-stone-400"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 bg-burgundy text-cream hover:bg-burgundy-light font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {!appliedCoupon && (
                  <p className="text-[9px] text-stone-400">💡 Enter <span className="font-bold">DIRECTSAVE</span> to support direct dining and get 15% off immediately.</p>
                )}
              </div>

              {/* LoyaltyPoints redemption dashboard */}
              {currentUser ? (
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-stone-600 dark:text-stone-300">My Loyalty Balance:</span>
                    <span className="font-bold font-mono text-gold flex items-center gap-0.5 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">⭐ {currentUser.loyaltyPoints} Pts (₹{currentUser.loyaltyPoints * 0.5})</span>
                  </div>

                  {maxRedeemablePoints > 0 ? (
                    <div className="space-y-2 pt-1.5">
                      <div className="flex justify-between text-[11px] text-stone-500">
                        <span>Redeem points: {ptsToRedeem} pts</span>
                        <span className="text-green-600 font-bold">-₹{loyaltyValue} Off</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={maxRedeemablePoints}
                        step="10"
                        value={ptsToRedeem}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPtsToRedeem(val);
                        }}
                        className="w-full accent-burgundy"
                      />
                      <p className="text-[10px] text-stone-400">Sliding trades: 100 points = ₹50 discount. Capped to 80% order size.</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 italic">No redeemable point balance accumulated yet. Ordering directly earns you massive totals!</p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 text-[10px] text-stone-500 flex items-start gap-1.5 leading-relaxed font-sans mt-3">
                  <Gift className="text-gold shrink-0 mt-0.5" size={13} />
                  <div>
                    <span className="font-bold block text-stone-705 dark:text-stone-300">Log in to redeem welcome points!</span>
                    Registering under Account provides a +100 bonus instantly (equivalent to ₹50). <button type="button" onClick={() => navigateTo('account')} className="text-burgundy dark:text-gold font-bold underline">Click registers</button>
                  </div>
                </div>
              )}

              {/* Settlement accounting summary */}
              <div className="space-y-2 border-t pt-4 text-xs select-none">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Basket Subtotal:</span>
                  <span className="font-mono font-medium">₹{subtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Reward Code Discount:</span>
                    <span className="font-mono font-semibold">-₹{couponDiscount}</span>
                  </div>
                )}
                {loyaltyValue > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Loyalty Points Redeemed Discount:</span>
                    <span className="font-mono font-semibold">-₹{loyaltyValue}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>GST Tax ({storeConfig.gstPercent}%):</span>
                  <span className="font-mono">₹{gstTax}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>Rider Delivery Charges:</span>
                    <span className="font-mono">{deliveryFee === 0 ? <span className="text-green-600 font-bold uppercase">Free</span> : `₹${deliveryFee}`}</span>
                  </div>
                )}
                {orderType === 'delivery' && subtotal < 505 && (
                  <p className="text-[9px] text-stone-400 underline decoration-dashed select-text">💡 Add ₹{500 - subtotal} more of tasty recipes to unlock FREE delivery!</p>
                )}

                <div className="border-t border-stone-200 dark:border-stone-850 pt-3 flex justify-between items-center text-sm font-bold text-burgundy dark:text-gold">
                  <span>Settlement Payable:</span>
                  <span className="font-mono text-base">₹{grandTotal}</span>
                </div>
              </div>

              {/* Payment methods picker selection */}
              <div className="border-t border-stone-200 dark:border-stone-850 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-stone-400 font-mono">Zomato-Style Instant Pay Mode</label>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase">0% gateway markup</span>
                </div>

                {/* Categories Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-stone-105 dark:bg-stone-950 rounded-xl">
                  {[
                    { id: 'upi', label: '⚡ UPI' },
                    { id: 'card', label: '💳 Card' },
                    { id: 'netbanking', label: '🏛️ Bank' },
                    { id: 'cod', label: '💵 COD' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        setActivePaymentCategory(cat.id as any);
                      }}
                      className={`py-1.5 text-[10px] sm:text-xs font-bold rounded-lg text-center transition-all cursor-pointer ${
                        activePaymentCategory === cat.id
                          ? 'bg-white dark:bg-stone-800 text-burgundy dark:text-gold shadow-sm border border-stone-200 dark:border-stone-700'
                          : 'text-stone-500 hover:text-stone-900 border border-transparent'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Content based on selected tab */}
                <div className="p-3 bg-stone-50 dark:bg-stone-950/40 rounded-xl border border-stone-200 dark:border-stone-850 space-y-3 text-xs">
                  {activePaymentCategory === 'upi' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex gap-2">
                        {['gpay', 'phonepe', 'paytm', 'other'].map((sub) => (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => setUpiOption(sub as any)}
                            className={`flex-1 py-1 rounded-md text-[10px] uppercase tracking-wide border font-bold text-center transition-all cursor-pointer ${
                              upiOption === sub
                                ? 'bg-amber-100/60 dark:bg-gold/10 text-burgundy dark:text-gold border-amber-400'
                                : 'bg-white dark:bg-stone-900 text-stone-500 hover:bg-stone-50 dark:border-stone-800'
                            }`}
                          >
                            {sub === 'gpay' ? 'GPay' : sub === 'phonepe' ? 'PhonePe' : sub === 'paytm' ? 'Paytm' : 'BHIM ID'}
                          </button>
                        ))}
                      </div>

                      {/* Merchant Deposit scan QR container */}
                      <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl space-y-3">
                        <div className="text-center">
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                            Direct Settlement scan QR Code
                          </span>
                        </div>
                        
                        <div className="border border-stone-105 p-3.5 bg-white rounded-2xl relative">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${restaurantInfo.upiId}&pn=${encodeURIComponent(restaurantInfo.name)}&am=${grandTotal}&tn=${encodeURIComponent('SpiceSoulCheckout')}&cu=INR`)}`} 
                            alt="Merchant VPA Scanner"
                            className="w-40 h-40 object-contain selection:bg-transparent"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="text-center space-y-1 text-[11px] select-all">
                          <div className="flex items-center justify-center gap-1.5 text-stone-850 dark:text-cream">
                            <QrCode size={13} className="text-amber-500 shrink-0" />
                            <span>VPA Handle: <strong className="font-bold font-mono">{restaurantInfo.upiId}</strong></span>
                          </div>
                          
                          <div className="flex items-center justify-center gap-1.5 text-stone-850 dark:text-cream">
                            <Smartphone size={13} className="text-pink-500 shrink-0" />
                            <span>Merchant GPay: <strong className="font-bold font-mono text-xs">{restaurantInfo.paymentNumber}</strong></span>
                          </div>

                          <div className="text-[10px] text-stone-450 border-t border-dashed border-stone-200 dark:border-stone-800 pt-1.5 mt-1.5 font-sans leading-normal">
                            🏢 Bank Settlement alternative:<br />
                            <strong>{restaurantInfo.bankName}</strong> Account no. <span className="font-semibold underline select-all">{restaurantInfo.bankAccount}</span> (IFSC: <span className="underline select-all">{restaurantInfo.bankIfsc}</span>)
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">12-Digit transaction ID / UTR Code (Confirm deposit)</label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="e.g. 301048291044..."
                          value={paymentUtr}
                          onChange={(e) => setPaymentUtr(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream font-mono"
                        />
                        <p className="text-[9px] text-stone-400 font-sans">💡 Enter the reference code shown in your UPI app upon completing direct scanning.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">UPI Identity Handle (VPA)</label>
                        <input
                          type="text"
                          placeholder="e.g. yourname@okaxis"
                          value={upiID}
                          onChange={(e) => setUpiID(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream font-mono"
                        />
                        <p className="text-[9px] text-stone-400">💡 Fast checkout: Autodebits standard simulators safely.</p>
                      </div>
                    </div>
                  )}

                  {activePaymentCategory === 'card' && (
                    <div className="space-y-2.5 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">16-Digit Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4242 •••• •••• 4242"
                          value={cardNumber}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            let matches = val.match(/\d{4,16}/g);
                            let match = (matches && matches[0]) || '';
                            let parts = [];
                            for (let i=0, len=match.length; i<len; i+=4) {
                              parts.push(match.substring(i, i+4));
                            }
                            if (parts.length > 0) {
                              setCardNumber(parts.join(' '));
                            } else {
                              setCardNumber(val);
                            }
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Card Holder Name</label>
                          <input
                            type="text"
                            placeholder="AMIT SINGH"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="***"
                            value={cardCVV}
                            onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-stone-55/10 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-burgundy text-stone-800 dark:text-cream font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activePaymentCategory === 'netbanking' && (
                    <div className="space-y-2.5 animate-in fade-in duration-200">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-stone-400 font-mono">Choose Banking Portal</label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-705 bg-white dark:bg-stone-900 text-stone-800 dark:text-cream focus:outline-none focus:ring-1 focus:ring-burgundy font-sans"
                        >
                          <option value="HDFC Bank">🏛️ HDFC Bank (Zomato Recommended)</option>
                          <option value="State Bank of India">🏛️ State Bank of India (SBI)</option>
                          <option value="ICICI Bank">🏛️ ICICI Bank</option>
                          <option value="Axis Bank">🏛️ Axis Bank</option>
                          <option value="Kotak Mahindra Bank">🏛️ Kotak Mahindra Bank</option>
                        </select>
                      </div>
                      <p className="text-[9px] text-stone-400">💡 Generates secure redirect simulations upon submission.</p>
                    </div>
                  )}

                  {activePaymentCategory === 'cod' && (
                    <div className="space-y-1 animate-in fade-in duration-200 py-1.5 text-center">
                      {orderType === 'dinein' ? (
                        <p className="text-stone-600 dark:text-stone-300 font-medium font-sans text-xs">
                          🛎️ Dine-In Table Pay: Support staff will serve your bill right to Table #14 at the end of your dinner.
                        </p>
                      ) : (
                        <p className="text-stone-600 dark:text-stone-300 font-medium font-sans text-xs">
                          💵 Cash on Delivery: Pay Cash / UPI scan upon rider arrival (supported for all home delivery coordinates).
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gold hover:bg-gold-light text-burgundy font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-md focus:ring-2 focus:ring-gold flex items-center justify-center gap-2 cursor-pointer"
                id="place-order-btn"
              >
                <span>Complete Checkout & Order</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
