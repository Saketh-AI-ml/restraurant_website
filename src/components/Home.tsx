/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppState } from '../context/StateContext';
import { ArrowRight, ShoppingCart, Percent, Clock, ThumbsUp, HeartHandshake, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { menuItems, reviews, navigateTo, addToCart, restaurantInfo } = useAppState();

  // Dynamically filter bestsellers for showcase
  const bestsellers = menuItems.filter((i) => i.isBestseller && i.isAvailable).slice(0, 3);

  // Inject Google JSON-LD schema on mount to optimize local SEO
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      'name': restaurantInfo.name,
      'image': restaurantInfo.bannerImage || 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800',
      '@id': 'https://direct-order-website.com',
      'url': 'https://direct-order-website.com',
      'telephone': restaurantInfo.phone,
      'priceRange': '₹80 - ₹450',
      'menu': 'https://direct-order-website.com/menu',
      'servesCuisine': 'Indian, Biryani, Mughlai',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': restaurantInfo.address,
        'addressLocality': 'Hyderabad',
        'addressRegion': 'TS',
        'postalCode': '500033',
        'addressCountry': 'IN'
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          'opens': '11:00',
          'closes': '23:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Saturday', 'Sunday'],
          'opens': '11:00',
          'closes': '23:59'
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'restaurant-jsonld-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('restaurant-jsonld-schema');
      if (existing) {
        document.head.removeChild(existing);
      }
    };
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6">
        {/* Background image & gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={restaurantInfo.bannerImage || "https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&auto=format&fit=crop&q=80"} 
            alt={`${restaurantInfo.name} banner`} 
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
        </div>

        {/* Content canvas */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy text-gold border border-burgundy/40 text-xs font-bold font-mono tracking-wider uppercase rounded-full">
              <Percent size={14} /> Skip Aggregators Save 15-30%
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold font-serif leading-tight text-cream">
              Real Food.<br />
              <span className="text-gold">Zero Middlemen.</span><br />
              Delivered Hot.
            </h1>

            <p className="text-base text-stone-300 leading-relaxed max-w-md font-sans">
              Welcome to <span className="text-gold font-semibold">{restaurantInfo.name}</span>. By ordering directly on our portal, you bypass tech conglomerates and support authentic chefs directly. Enjoy fresher plating, massive coupon specials, and double loyalty points with every transaction.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => navigateTo('menu')}
                className="px-8 py-4 bg-gold hover:bg-gold-light text-burgundy font-bold uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                id="hero-cta-btn"
              >
                <span>View Menu & Order</span>
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={() => navigateTo('contact')}
                className="px-6 py-4 bg-stone-800 hover:bg-stone-700 text-cream font-semibold rounded-xl border border-stone-700/60 transition-colors block text-center"
              >
                Our Heritage Story
              </button>
            </div>

            {/* Quick stats panel */}
            <div className="grid grid-cols-3 gap-4 border-t border-stone-800 pt-6 text-stone-400">
              <div>
                <span className="block text-2xl font-bold text-cream font-serif">4.9 ★</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">Customer Care</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-cream font-serif">35 Mins</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">Fast Delivery</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-cream font-serif">100% Direct</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">0% App Markup</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Banner item */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:flex justify-center hidden"
          >
            <div className="relative p-2.5 bg-stone-800/80 border border-stone-700/50 rounded-2xl shadow-2xl max-w-sm overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80" 
                alt="Spice & Soul famous Butter Chicken" 
                className="rounded-xl w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-5 right-5 px-3 py-1 bg-burgundy text-gold font-bold text-xs uppercase tracking-widest rounded-md shadow-md">
                🔥 Bestseller
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-cream">Spice & Soul Butter Chicken</h4>
                  <span className="text-gold font-mono font-bold text-lg">₹380</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed font-sans">
                  Slow-cooked charcoal chicken roasted in our specialized clay tandoor, integrated into our award-winning velvet buttery gravy.
                </p>
                <button
                  onClick={() => {
                    const item = menuItems.find(i => i.id === 'main-1');
                    if (item) addToCart(item, 1);
                  }}
                  className="w-full py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wide rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShoppingCart size={14} /> Quick Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. THE PROBLEM COMPARISON (Commission savings showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif text-burgundy dark:text-gold leading-tight">
            Stop Subsidizing Giant Tech Conglomerates
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            When you order via Swiggy/Zomato, you and the restaurant pay hefty commissions. Directly ordering gives you direct access, priority fresh cooking, and transparent fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Third party apps */}
          <div className="p-8 rounded-2xl border border-stone-300 bg-white/50 dark:bg-stone-900/30 dark:border-stone-850/60 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold font-mono">Third-Party Platforms (App Giants)</span>
              <h3 className="text-2xl font-bold font-serif text-stone-700 dark:text-stone-350">The Markup Trap</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✖</span>
                  <span><strong>15% - 25% price inflation</strong> added on almost all native menu items to offset hefty commissions.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✖</span>
                  <span><strong>Hefty platform surcharges</strong> (Rain fee, packaging fee, service tax, platform fee) of up to ₹40 per check.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✖</span>
                  <span><strong>Cold, pooled delivery delays</strong> while drivers wait for multiple distinct apps/restaurants at once.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-600 dark:text-stone-400">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✖</span>
                  <span>Mock robot interfaces. Zero relationship with the chef if anything goes wrong.</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-850">
              <span className="text-xs font-bold text-rose-500/80">Average markup per meal: +₹110 to ₹180</span>
            </div>
          </div>

          {/* Direct order model */}
          <div className="p-8 rounded-2xl border-2 border-gold bg-cream-dark/45 dark:bg-stone-900/60 dark:border-gold/50 flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <span className="inline-flex items-center px-2 py-0.5 bg-burgundy text-gold text-[10px] font-bold font-mono uppercase rounded-md tracking-wider">
                Support Local
              </span>
              <h3 className="text-2xl font-bold font-serif text-burgundy dark:text-gold">Ordering Direct</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 text-sm text-stone-800 dark:text-stone-200">
                  <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">✔</span>
                  <span><strong>Guaranteed Base Menu Prices</strong>. Absolutely no markups on our tandoori paneer or slow-cooked dal.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-800 dark:text-stone-200">
                  <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">✔</span>
                  <span><strong>Earn 1 Loyalty Point for every ₹10 spent</strong>. Trade points directly for complimentary starters or ₹50/100 value cashbacks.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-800 dark:text-stone-200">
                  <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">✔</span>
                  <span><strong>Priority Delivery Routing</strong> using our dedicated restaurant riders, reaching you 5-10 minutes faster.</span>
                </li>
                <li className="flex items-start space-x-3 text-sm text-stone-800 dark:text-stone-200">
                  <span className="text-emerald-500 font-extrabold shrink-0 mt-0.5">✔</span>
                  <span>Instant real-time WhatsApp order tracking with a direct feedback link straight to our main WhatsApp panel!</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-605">Average markup: ₹0.00</span>
              <span className="text-xs font-mono font-bold text-burgundy dark:text-gold">Average Loyalty Cashback: 10% back</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-burgundy dark:text-gold font-bold font-mono">Handchecked Favorites</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-stone-850 dark:text-cream leading-none">
              Featured Daily Bestsellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo('menu')}
            className="group flex items-center space-x-1.5 text-sm font-bold text-burgundy dark:text-gold hover:underline"
          >
            <span>Explore full menu</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map((item) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850/70 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-56 bg-stone-100 overflow-hidden shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider ${item.isVeg ? 'bg-emerald-50 text-emerald-700 border border-emerald-205' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                  </span>
                  <span className="px-2 py-0.5 bg-gold text-burgundy font-bold text-[9px] uppercase tracking-wider rounded-md">
                    ⭐ Must Try
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-burgundy dark:text-gold font-serif line-clamp-1">{item.name}</h3>
                    <span className="text-base font-bold font-mono text-stone-800 dark:text-cream whitespace-nowrap">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1.5 leading-relaxed font-sans">{item.description}</p>
                </div>
                
                <button
                  onClick={() => addToCart(item, 1)}
                  className="w-full py-2.5 bg-burgundy hover:bg-burgundy-light text-cream font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHIEF CHEF ABOUT US SUMMARY */}
      <section className="bg-stone-900 text-stone-200 rounded-3xl mx-4 sm:mx-6 lg:mx-8 py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 relative group overflow-hidden rounded-2xl shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop&q=80" 
              alt="Chef Amritpal Singh" 
              className="w-full h-80 object-cover transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 font-sans text-xs">
              <span className="block font-bold text-cream text-lg font-serif">Chef Amritpal Singh</span>
              <span className="text-gold/90 font-mono tracking-widest uppercase font-semibold">Director & Core Chef Culinary</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <span className="text-xs font-bold font-mono text-gold uppercase tracking-widest block">Crafted Flavours</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-cream">Cooking With Honor</h2>
            <p className="text-sm font-sans text-stone-300 leading-relaxed">
              "Cooking is not just a commercial venture of feeding; it is a sacred transfer of culture, memory, and passion. When we cook, we want that transfer to be direct. We created Spice & Soul Kitchen to establish a direct pipeline from our stoves to your dining table."
            </p>
            <p className="text-xs font-serif text-stone-400 italic">
              "When you order directly, you support fair wages for waitstaff, organic procurement of premium cold-pressed oils, and help us maintain culinary authenticity without selling out to high-volume algorithms. We pledge to deliver restaurant-fresh plating every single time."
            </p>
            <div className="pt-4 flex items-center space-x-6 text-stone-450 border-t border-stone-800">
              <div className="flex items-center space-x-2 text-xs">
                <ThumbsUp className="text-gold" size={16} />
                <span>100% Traditional Handi</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Clock className="text-gold" size={16} />
                <span>Made fresh to order</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. STAR TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase tracking-widest text-burgundy dark:text-gold font-bold font-mono">Neighborhood Love</span>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-850 dark:text-cream">
            What Our Regulars Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex text-gold font-bold">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={14} className="fill-gold text-gold mr-0.5" />
                  ))}
                  <span className="text-[11px] font-bold text-stone-500 font-mono ml-2">{rev.rating}</span>
                </div>
                
                <p className="text-xs font-sans text-stone-600 dark:text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 dark:border-stone-850 text-xs flex justify-between items-center text-stone-450 mt-4 font-sans">
                <div>
                  <strong className="block text-stone-700 dark:text-stone-200 font-semibold">{rev.name}</strong>
                  <span className="text-[10px] text-zinc-500 font-mono">Fave: {rev.dish}</span>
                </div>
                <span className="text-[10px] font-normal font-mono">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOURS, CONTACTS, GOOGLE MAPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-burgundy dark:text-gold border-b pb-2">Hours & Location</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              Come pay us a visit or trigger a takeaway. We are centrally located in the premium high-street dining district of Jubilee Hills, Hyderabad.
            </p>

            <div className="space-y-2 text-xs font-serif pt-2">
              <div className="flex justify-between border-b pb-1">
                <span>Monday - Friday</span>
                <span className="font-mono text-stone-600 dark:text-stone-300">11:00 AM - 11:00 PM</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Saturday - Sunday</span>
                <span className="font-mono text-stone-600 dark:text-stone-300">11:00 AM - 12:00 Midnight</span>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-4 text-xs">
            <div className="p-3 bg-cream-dark/20 dark:bg-stone-850 rounded-lg flex items-start gap-2 border border-burgundy/10">
              <ShieldCheck className="text-burgundy dark:text-gold shrink-0" size={16} />
              <div className="space-y-1 font-sans">
                <strong className="block text-burgundy dark:text-gold font-bold">Hygiene Certified</strong>
                <p className="text-[10px] text-stone-500 leading-normal">Our kitchen goes through daily deep sanitation runs and holds active ISO 22000 hygiene and FSSAI standards.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Iframe Mapping simulation */}
        <div className="md:col-span-7 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl p-2.5 h-80 md:h-auto min-h-64 shadow-sm overflow-hidden select-none">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.827289568981!2d78.39958371536762!3d17.420072188059032!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90cd7ff4e007%3A0x6eac20b5f1cdbcd!2sRoad%20No.%2036%2C%20Jubilee%20Hills%2C%20Hyderabad%2C%20Telangana%20500033!5e0!3m2!1sen!2sin!4v1654060000000!5m2!1sen!2sin" 
            className="w-full h-full border-0 rounded-xl"
            allowFullScreen={false} 
            loading="lazy" 
            title="Spice & Soul Kitchen Base Location Map"
          />
        </div>
      </section>
    </div>
  );
};
