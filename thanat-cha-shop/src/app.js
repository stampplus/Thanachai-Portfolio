/**
 * THANAT-CHA - Main Application
 * Entry point for the e-commerce application
 */

// ========================================
// MOCK DATA (Replace with API calls in production)
// ========================================

const productsData = [
  {
    id: 'prod-001',
    slug: 'after-rain',
    name: 'After Rain',
    tagline: 'The quiet after the storm',
    description: 'The quiet after the storm. Petrichor rising from warm earth. A window left open. For moments of clarity, stillness, and new beginnings.',
    mood: 'calm',
    topNotes: ['Bergamot', 'Ozonic Accord'],
    middleNotes: ['Wet Soil', 'Violet Leaf'],
    baseNotes: ['Cedar', 'White Musk'],
    images: [],
    isBestseller: true,
    variants: [
      { id: 'var-001-10', size: '10ml', price: 49000 },
      { id: 'var-001-30', size: '30ml', price: 129000 },
      { id: 'var-001-50', size: '50ml', price: 189000 },
    ],
  },
  {
    id: 'prod-002',
    slug: 'midnight-tea',
    name: 'Midnight Tea',
    tagline: 'Conversations that lasted until dawn',
    description: 'A cup forgotten on the windowsill. Moonlight through steam. Conversations that lasted until dawn. For moments of intimacy, warmth, and quiet luxury.',
    mood: 'warm',
    topNotes: ['Black Tea', 'Cardamom'],
    middleNotes: ['Jasmine', 'Honey'],
    baseNotes: ['Sandalwood', 'Vanilla'],
    images: [],
    isBestseller: true,
    variants: [
      { id: 'var-002-10', size: '10ml', price: 49000 },
      { id: 'var-002-30', size: '30ml', price: 129000 },
      { id: 'var-002-50', size: '50ml', price: 189000 },
    ],
  },
  {
    id: 'prod-003',
    slug: 'wild-orchid',
    name: 'Wild Orchid',
    tagline: 'Untamed beauty in the jungle mist',
    description: 'Dewdrops on petals at dawn. The hum of insects in the undergrowth. Nature unrestrained. For moments of adventure, sensuality, and wild freedom.',
    mood: 'wild',
    topNotes: ['Pink Pepper', 'Lychee'],
    middleNotes: ['Orchid', 'Peony'],
    baseNotes: ['Patchouli', 'Amber'],
    images: [],
    isBestseller: false,
    variants: [
      { id: 'var-003-10', size: '10ml', price: 49000 },
      { id: 'var-003-30', size: '30ml', price: 129000 },
      { id: 'var-003-50', size: '50ml', price: 189000 },
    ],
  },
  {
    id: 'prod-004',
    slug: 'morning-dew',
    name: 'Morning Dew',
    tagline: 'First light on fresh leaves',
    description: 'The world waking up. Cool air warming. Possibility in every breath. For moments of freshness, optimism, and new starts.',
    mood: 'fresh',
    topNotes: ['Lemon', 'Mint'],
    middleNotes: ['Green Tea', 'Bamboo'],
    baseNotes: ['Oakmoss', 'White Woods'],
    images: [],
    isBestseller: false,
    variants: [
      { id: 'var-004-10', size: '10ml', price: 49000 },
      { id: 'var-004-30', size: '30ml', price: 129000 },
      { id: 'var-004-50', size: '50ml', price: 189000 },
    ],
  },
  {
    id: 'prod-005',
    slug: 'old-library',
    name: 'Old Library',
    tagline: 'Wisdom bound in leather and time',
    description: 'Dust motes in sunbeams. Pages yellowed with age. Stories waiting to be discovered. For moments of contemplation, depth, and timeless elegance.',
    mood: 'deep',
    topNotes: ['Papyrus', 'Elemi'],
    middleNotes: ['Leather', 'Vetiver'],
    baseNotes: ['Oud', 'Incense'],
    images: [],
    isBestseller: false,
    variants: [
      { id: 'var-005-10', size: '10ml', price: 59000 },
      { id: 'var-005-30', size: '30ml', price: 149000 },
      { id: 'var-005-50', size: '50ml', price: 219000 },
    ],
  },
  {
    id: 'prod-006',
    slug: 'sunset-ritual',
    name: 'Sunset Ritual',
    tagline: 'Golden hour in a bottle',
    description: 'The day surrendering to night. Warmth lingering on skin. A moment of gratitude. For moments of reflection, peace, and gentle closure.',
    mood: 'warm',
    topNotes: ['Orange Blossom', 'Saffron'],
    middleNotes: ['Rose', 'Nutmeg'],
    baseNotes: ['Tonka Bean', 'Labdanum'],
    images: [],
    isBestseller: false,
    variants: [
      { id: 'var-006-10', size: '10ml', price: 49000 },
      { id: 'var-006-30', size: '30ml', price: 129000 },
      { id: 'var-006-50', size: '50ml', price: 189000 },
    ],
  },
];

// ========================================
// DATA ACCESS FUNCTIONS
// ========================================

/**
 * Get all products
 * @returns {Array}
 */
function getAllProducts() {
  return [...productsData];
}

/**
 * Get featured products (bestsellers first, then first 4)
 * @returns {Array}
 */
function getFeaturedProducts() {
  const bestsellers = productsData.filter(p => p.isBestseller);
  const others = productsData.filter(p => !p.isBestseller).slice(0, 4 - bestsellers.length);
  return [...bestsellers, ...others];
}

/**
 * Get product by slug
 * @param {string} slug - Product slug
 * @returns {Object|null}
 */
function getProductBySlug(slug) {
  return productsData.find(p => p.slug === slug) || null;
}

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Object|null}
 */
function getProductById(id) {
  return productsData.find(p => p.id === id) || null;
}

/**
 * Get products by mood
 * @param {string} mood - Mood filter
 * @returns {Array}
 */
function getProductsByMood(mood) {
  return productsData.filter(p => p.mood === mood);
}

// ========================================
// APP INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Initialize cart
  initCart();
  
  // Initialize router
  initRouter();
  
  // Handle system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = getStorage('theme');
    if (!savedTheme) {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
  
  // Handle visibility change (refresh cart when returning to page)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      initCart();
    }
  });
  
  // Log app ready
  console.log('🌸 THANAT-CHA ready');
});

// ========================================
// SERVICE WORKER REGISTRATION (Optional)
// ========================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => {
    //     console.log('SW registered:', registration);
    //   })
    //   .catch(error => {
    //     console.log('SW registration failed:', error);
    //   });
  });
}

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
  console.error('App error:', e.error);
  // Could send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // Could send to error tracking service
});
