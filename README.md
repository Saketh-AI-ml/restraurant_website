# Spice & Soul Kitchen — 105% Commission-Free Restaurant Template (SaaS-Ready)

Welcome to **Spice & Soul Kitchen**, a high-performance, production-ready, full-featured online menu and direct ordering template. This system is designed specifically to solve the biggest existential threat local independent restaurants face: **losing 15% to 30% of their top-line revenues to greedy third-party delivery aggregates (Uber Eats, DoorDash, Zomato, Swiggy)**.

By deploying this template, a local restaurant secures their own direct pipeline, owns 100% of their customer contact data, offers a modern loyalty credit program, and processes orders directly via WhatsApp alerts or active admin desks—all with standard **0% transaction middleman commissions**.

---

## 🚀 Key Features Implemented

1. **Elegant Editorial Branding**: A distinct, high-contrast appetizing color scheme featuring deep burgundy (`#7B1D1D`), warm mustard gold (`#F5A623`), and vintage cream white (`#FFF8F0`) configured natively with Tailwind v4.
2. **Category-Switching Menu**: Smooth category filters (Starters, Mains, Biryanis, Desserts, Drinks) integrated alongside full-text Search bars and clean **Vegetarian-Only** toggles.
3. **Advanced Cart & Checkout**:
   - Supports **Dine-In**, **Self Takeaway**, and **Home Delivery** routing.
   - Built-in conditional delivery fee waivers (Free for orders above ₹500).
   - Standard coupon validators (matching `DIRECTSAVE` and `SOULFEAST`).
4. **Member Loyalty Points Engine**: Gives 1 point for every ₹10 spent, tradeable directly at checkout (100 points = ₹50 off!). Demarked by shiny Bronze, Silver, and Gold member tiers.
5. **Printer-Friendly Receipts & Receipts Modals**: Generates immediate local billing summaries with instant, clean print hooks.
6. **Outbound WhatsApp Notification Bridges**: Auto-compiles order details, customer contact tags, notes to chef, and grand totals into a pre-formatted link allowing owners to capture live text confirmations on WhatsApp.
7. **Complete Admin Dashboard Panel**:
   - Protected by a secret passcode gate (`Admin@123`).
   - Displays real-time daily order ticket indices and gross revenues.
   - Outputs instant client-side CSV downloads of all transactions.
   - Menu CRUD controls: edit pricing, write description blocks, upload image links, delete recipes, and toggle chef availability (Sold out badges).

---

## 💻 Tech Stack Summary

- **UI Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS v4 (pre-compiled variables block)
- **Animations Module**: Framer Motion (imported from `motion/react`)
- **Icons Library**: Lucide React
- **Storage Engine**: Shared client-side `localStorage` wrappers (synchronizes cart entries, custom menu updates, login profiles, and order status updates seamlessly in real-time across multiple open browser tabs!).

---

## 🛠️ Step-by-Step Setup Instructions

### 1. Installation & Environment boot
To load and run this template locally:

```bash
# Clone the repository and navigate to root
cd restaurant-website

# Install all preinstalled base dependencies
npm install

# Live boot development server on http://localhost:3000
npm run dev
```

### 2. Sandbox Testing Credentials
To help you immediately explore the full depth of active features, we preloaded two test sessions:
- **Test Customer Login**: Enter `customer@gmail.com` under the **My Account** page. This session instantly boots up as **Gold Tier** preloaded with **340 Loyalty Points** (worth ₹170 of checkout credit) to easily test sliders!
- **Test Chef Admin Dashboard**: Read or trigger the **Admin Panel** tab on the navigation header. Use passcode: `Admin@123`.

---

## 🎨 How to Customize for Any Restaurant Brand

This template is configured to allow complete white-label custom overrides inside 3 tiny locations:

### 1. Update Core Metadata (`/metadata.json`)
Alter the search title tags and OG descriptions:
```json
{
  "name": "My Custom Diner Name",
  "description": "Premium local wood-fired recipes delivered hot."
}
```

### 2. Overwrite Brand Styling Constants (`/src/index.css`)
To change the color palette (for example, to adapt for a pizza lounge or sushi hub), simply modify the CSS variables inside the `@theme` block:
```css
@theme {
  --color-burgundy: #133B2E; /* Forest Green for dynamic organic vibes */
  --color-gold: #E6AA68;     /* Bright Peach gold accents */
  --color-cream: #FAF9F6;    /* Soft Clean White background */
}
```

### 3. Update Preloaded Dishes & Coupons (`/src/initialData.ts`)
Simply swap titles, description paragraphs, prices, and Unsplash photography URLs inside `INITIAL_MENU_ITEMS` to instantly adapt the layout to serve American sliders, Italian pastas, or Japanese sushi!

---

## 💳 Integrating Payment Gateways (Razorpay & Stripe)

This template simulates payments out of the box. To convert this into a live transactional commerce platform, integrate Razorpay/Stripe securely using backend routes. Let's outline the recommended API handler blueprints:

### Blueprint 1: Razorpay Integration (India)
1. Install the official SDK on your server side: `npm install razorpay`
2. Create an Express POST route client controller (`/api/payments/razorpay/order`):

```javascript
// Server controller proxy
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/payments/razorpay/order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
```

3. Call the order endpoint on the React checkout frontend and open the Razorpay JS Checkout Widget inside the browser.

### Blueprint 2: Stripe Integration (International)
1. Install Stripe: `npm install stripe`
2. Create an Express billing intent route (`/api/payments/stripe/intent`):

```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/api/payments/stripe/intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100, // in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 📲 Integrating Automated WhatsApp Business Cloud APIs

While our template leverages standard **WhatsApp Public Links** (`api.whatsapp.com/send`) which perfectly fits zero-fee, zero-setup setups for small diners, expanding into the official **Meta WhatsApp Cloud API** allows sending automated, background, system-triggered status notifications.

### 1. Setup Meta Developer App
- Go to [Meta Developers](https://developers.facebook.com/) and register a WhatsApp Business App.
- Secure your temporary Access Token, Phone Number ID, and verified Business Account credentials.

### 2. Node.js backend POST Alert Endpoint (`/api/notifications/whatsapp`)
Create an Express route to automatically trigger when an order status shifts inside the Admin panel:

```javascript
import axios from 'axios';

app.post('/api/notifications/whatsapp', async (req, res) => {
  const { recipientPhone, customerName, orderId, newStatus } = req.body;
  const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;
  const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: {
        messaging_product: "whatsapp",
        to: recipientPhone, // E.g., '919876543210'
        type: "template",
        template: {
          name: "order_status_update", // Registered Template name on Meta Panel
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: customerName },
                { type: "text", text: orderId },
                { type: "text", text: newStatus }
              ]
            }
          ]
        }
      }
    });
    res.json({ success: true, apiData: response.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.response?.data || err.message });
  }
});
```
