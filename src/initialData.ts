/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Review } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // --- STARTERS (6 items) ---
  {
    id: 'starter-1',
    name: 'Tandoori Paneer Tikka',
    price: 240,
    category: 'Starters',
    description: 'Fresh cottage cheese cubes marinated in spiced yogurt, skewered with bell peppers and onions, cooked in a traditional clay oven.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'starter-2',
    name: 'Hara Bhara Kabab',
    price: 180,
    category: 'Starters',
    description: 'Crispy fried patties made with minced spinach, green peas, mashed potatoes, and delicate authentic Indian spices.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'starter-3',
    name: 'Tandoori Chicken Tikka',
    price: 290,
    category: 'Starters',
    description: 'Succulent boneless chicken chunks marinated in mustard oil, tandoori spices, and hung curd, charred to perfection.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'starter-4',
    name: 'Samosa Chaat Feast',
    price: 120,
    category: 'Starters',
    description: 'Crushed spiced potato samosas topped with warm chickpeas curry, sweet sweet yogurt, tangy tamarind, and spicy mint chutneys.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'starter-5',
    name: 'Chilli Mushroom Dry',
    price: 210,
    category: 'Starters',
    description: 'Crispy batter-fried button mushrooms tossed in a delicious Indo-Chinese ginger, garlic, soy sauce, and chilli paste.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'starter-6',
    name: 'Gold-Dust Crispy Corn',
    price: 160,
    category: 'Starters',
    description: 'Sweet corn kernels lightly coated, deep-fried to a golden crunch, and seasoned with a house-special lemon-pepper spice mix.',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },

  // --- MAINS (8 items) ---
  {
    id: 'main-1',
    name: 'Spice & Soul Butter Chicken',
    price: 380,
    category: 'Regular Mains',
    description: 'Our signature dish. Tandoori-grilled chicken offsets a rich, velvet-smooth tomato, cashew, and butter gravy with dried fenugreek leaves.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'main-2',
    name: 'Shahi Paneer Butter Masala',
    price: 320,
    category: 'Regular Mains',
    description: 'Soft cottage cheese cubes simmered slowly in a rich, mildly sweet tomato-onion gravy, finished with heavy cream and aromatic spices.',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'main-3',
    name: 'Slow-Cooked Dal Makhani',
    price: 260,
    category: 'Regular Mains',
    description: 'Black lentils and red kidney beans simmered overnight on slow charcoal embers, rich with butter, cream, and smoky tomato tones.',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'main-4',
    name: 'Kadai Veg Melange',
    price: 280,
    category: 'Regular Mains',
    description: 'A vibrant assortment of garden-fresh vegetables tossed with bell peppers and fresh ground spices in a semi-dry, tangy onion-tomato masala.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'main-5',
    name: 'Aromatic Chicken Korma',
    price: 360,
    category: 'Regular Mains',
    description: 'Tender chicken braised in a luxurious, mildly spiced gravy enriched with caramelized onions, yogurt, almonds, and rose essence.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'main-6',
    name: 'Subz Jalfrezi',
    price: 270,
    category: 'Regular Mains',
    description: 'Stir-fried farm-fresh vegetables cooked with sliced bell peppers, tomatoes, and spiked with a refreshing chef-special touch of white vinegar.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'main-7',
    name: 'Royal Malai Kofta',
    price: 340,
    category: 'Regular Mains',
    description: 'Crispy fried dumplings stuffed with mashed cottage cheese and nuts, served floating in an ultra-luxurious, sweet onion-cardamom white sauce.',
    image: 'https://images.unsplash.com/photo-1626804475315-99449155514e?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'main-8',
    name: 'Dhaba Style Aloo Gobi',
    price: 220,
    category: 'Regular Mains',
    description: 'A robust dry-style preparation of tender potatoes and crisp cauliflower florets, pan-roasted with turmeric, ginger, and green chillies.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },

  // --- BIRYANIS (4 items) ---
  {
    id: 'biryani-1',
    name: 'Hyderabadi Dum Chicken Biryani',
    price: 390,
    category: 'Biryanis',
    description: 'Layers of long-grain Basmati rice and juicy marinated chicken slow-cooked on "dum" in a handi with saffron, mint, and pure ghee.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'biryani-2',
    name: 'Nawabi Paneer Tikka Biryani',
    price: 340,
    category: 'Biryanis',
    description: 'Fragrant saffron rice layered elegantly with tandoor-grilled cottage cheese cubes and a rich spiced masala base.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'biryani-3',
    name: 'Egg Dum Biryani',
    price: 290,
    category: 'Biryanis',
    description: 'Traditional slow-cooked spiced biryani rice layered with hard-boiled eggs that are fried with spices for a perfect golden exterior.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
    isVeg: false,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'biryani-4',
    name: 'Sufiyana Veg Dum Biryani',
    price: 310,
    category: 'Biryanis',
    description: 'An elegant white-herbed biryani loaded with beans, carrots, and sweet green peas, steeped in heavy cream, cashews, and spices.',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },

  // --- DESSERTS (4 items) ---
  {
    id: 'dessert-1',
    name: 'Shahi Gulab Jamun (2 Pcs)',
    price: 90,
    category: 'Desserts',
    description: 'Deep-fried milk dumplings soaked in a warm, fragrant sugar syrup infused with green cardamom pods and rose water.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'dessert-2',
    name: 'Kesar Rasmalai (2 Pcs)',
    price: 110,
    category: 'Desserts',
    description: 'Spongy, flattened cottage cheese disks soaked in a saffron-infused, thick chilled milk broth, heavily garnished with pistachios.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'dessert-3',
    name: 'Rich Gajar Ghee Halwa',
    price: 130,
    category: 'Desserts',
    description: 'Grated seasonal sweet red carrots slow-cooked in thick milk, heavy ghee, and solid khoya, finished with golden raisins and cashews.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'dessert-4',
    name: 'Traditional Malai Kulfi',
    price: 80,
    category: 'Desserts',
    description: 'No-churn Indian ice-cream made by heavily reducing creamy whole milk, infused with real cardamom, saffron thread, and crushed almond shards.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },

  // --- DRINKS (4 items) ---
  {
    id: 'drink-1',
    name: 'Classic Mango Lassi',
    price: 110,
    category: 'Drinks',
    description: 'Thick, creamy yogurt drink blended with sweet Alphonso mango pulp, a touch of cardamom, and served ice-cold with pistachios.',
    image: 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: true
  },
  {
    id: 'drink-2',
    name: 'Handcrafted Masala Chai',
    price: 80,
    category: 'Drinks',
    description: 'Freshly brewed milk tea infused with wild ginger root, green cardamom pods, crushed cloves, cinnamon bark, and fresh tea leaves.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'drink-3',
    name: 'Chilled Sweet Fresh Lime Soda',
    price: 90,
    category: 'Drinks',
    description: 'Squeezed fresh green lemon juice mixed in carbonated sparkling soda, with standard sweet sugar syrup and a pinch of black mineral salt.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  },
  {
    id: 'drink-4',
    name: 'Misty Mint & Lime Mojito',
    price: 140,
    category: 'Drinks',
    description: 'An elegant, extremely refreshing mocktail of muddled wild mint leaves, lemon rounds, cane sugar syrup, and iced club soda.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    isVeg: true,
    isAvailable: true,
    isBestseller: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Aishwarya Sen',
    rating: 5,
    comment: 'The Butter Chicken here is absolutely heavenly! Ordering directly through their website saved me at least ₹120 compared to Swiggy. The delivery was super fast and arrived piping hot!',
    dish: 'Spice & Soul Butter Chicken',
    date: 'May 12, 2026'
  },
  {
    id: 'rev-2',
    name: 'Rohan Deshmukh',
    rating: 5,
    comment: 'I love their loyalty program. I earned 39 points on a single biryani order and redeemed my previous points for a free Mango Lassi. Direct ordering is highly transparent and fair to the chef!',
    dish: 'Hyderabadi Dum Chicken Biryani',
    date: 'May 24, 2026'
  },
  {
    id: 'rev-3',
    name: 'Meera Krishnan',
    rating: 4.8,
    comment: 'Exceptional test and outstanding service. Their online tandoori paneer tikka remains soft and perfectly spiced, unlike rubbery tikkas delivered from other restaurants. Truly premium quality.',
    dish: 'Tandoori Paneer Tikka',
    date: 'May 28, 2026'
  }
];

export const COUPONS = [
  { code: 'DIRECTSAVE', discountPercent: 15, description: '15% Off - Thanks for supporting us directly!' },
  { code: 'SOULFEAST', discountPercent: 20, description: '20% Off on orders above ₹600' }
];
