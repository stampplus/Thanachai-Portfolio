# THANAT-CHA 🌸

> Premium Niche Perfume E-Commerce

A mobile-first, elegant e-commerce web application for THANAT-CHA, a Thai premium niche perfume brand.

## ✨ Features

- **Mobile-First Design** - Optimized for LINE in-app browser and mobile shopping
- **Dark/Light Mode** - Automatic theme switching with manual override
- **Guest Checkout** - No login required, fast purchase flow
- **Cart Management** - Persistent cart with localStorage
- **Mood-Based Discovery** - Shop by emotional state (Calm, Warm, Wild, Fresh, Deep)
- **Thai Payment Integration** - QR PromptPay and Bank Transfer ready
- **LINE Integration** - Floating chat button and share functionality

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
thanat-cha-shop/
├── index.html              # Main HTML entry
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── public/                 # Static assets
│   └── fonts/              # Custom fonts
└── src/
    ├── app.js              # App initialization & mock data
    ├── router.js           # Client-side routing
    ├── components/         # UI components
    │   ├── ui/             # Reusable UI elements
    │   ├── layout/         # Layout components
    │   └── product/        # Product-specific components
    ├── lib/                # Utilities
    │   ├── utils.js        # Helper functions
    │   └── cart.js         # Cart management
    ├── pages/              # Page components (future)
    └── styles/
        └── main.css        # Global styles
```

## 🎨 Design System

### Colors
- **Primary:** `#78350F` (Amber-brown) / `#D97706` (Dark mode)
- **Background:** `#FAFAF9` (Warm white) / `#0C0A09` (Dark)
- **Text:** `#1C1917` (Primary) / `#57534E` (Secondary)

### Typography
- **Display:** Cormorant Garamond (elegant serif)
- **Body:** Inter (clean sans-serif)

### Spacing
- Base unit: 4px
- Mobile-optimized touch targets: 44px minimum

## 📱 Pages

1. **Home (/)** - Hero, mood selector, featured products
2. **Products (/products)** - Product grid with mood filter
3. **Product Detail (/products/:slug)** - Full product info, size selector
4. **Cart (/cart)** - Cart items, quantity controls
5. **Checkout (/checkout)** - Customer info, payment selection
6. **Order Confirmation** - Thank you page with payment instructions
7. **About (/about)** - Brand story
8. **Contact (/contact)** - LINE chat, store locations, FAQ

## 🛒 Cart Flow

1. Browse products → Select size → Add to bag
2. Review cart → Adjust quantities
3. Checkout → Fill details → Select payment
4. Order confirmation → Payment instructions

## 💳 Payment Methods

- **QR PromptPay** - Instant scan-to-pay
- **Bank Transfer** - Manual bank transfer with confirmation

## 🔧 Configuration

### Environment Variables (Future)

Create `.env` file:

```env
# Supabase (when ready)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# LINE (when ready)
VITE_LINE_LIFF_ID=your_liff_id
```

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify

1. Push to GitHub
2. Connect repository in Netlify
3. Build settings auto-detected

### Static Hosting

```bash
npm run build
# Upload dist/ folder to your server
```

## 🔄 Future Enhancements

See [Architecture Document](./plans/thanat-cha-architecture.md) for:
- Database schema
- API structure
- Scaling roadmap
- Performance optimizations

## 📄 License

MIT License - See LICENSE file

## 🤝 Support

- LINE: @thanatcha
- Email: hello@thanatcha.com
- Instagram: @thanatcha

---

Crafted with intention in Bangkok 🌿
