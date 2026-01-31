/**
 * THANAT-CHA - Simple Router
 * Client-side routing for single-page application
 */

// ========================================
// ROUTE DEFINITIONS
// ========================================

const routes = {
  '/': {
    title: 'THANAT-CHA | Premium Niche Perfume',
    render: renderHome,
  },
  '/products': {
    title: 'Our Scents | THANAT-CHA',
    render: renderProductList,
  },
  '/products/:slug': {
    title: 'Product | THANAT-CHA',
    render: renderProductDetail,
  },
  '/cart': {
    title: 'Your Bag | THANAT-CHA',
    render: renderCart,
  },
  '/checkout': {
    title: 'Checkout | THANAT-CHA',
    render: renderCheckout,
  },
  '/order-confirmation': {
    title: 'Thank You | THANAT-CHA',
    render: renderOrderConfirmation,
  },
  '/about': {
    title: 'About | THANAT-CHA',
    render: renderAbout,
  },
  '/contact': {
    title: 'Contact | THANAT-CHA',
    render: renderContact,
  },
  '/admin': {
    title: 'Admin | THANAT-CHA',
    render: renderAdminHome,
  },
  '/admin/products': {
    title: 'Products | THANAT-CHA Admin',
    render: renderProductsAdmin,
  },
  '/admin/orders': {
    title: 'Orders | THANAT-CHA Admin',
    render: renderOrdersAdmin,
  },
  '/admin/inventory': {
    title: 'Inventory | THANAT-CHA Admin',
    render: renderInventoryAdmin,
  },
  '/admin/analytics': {
    title: 'Analytics | THANAT-CHA Admin',
    render: renderAnalyticsAdmin,
  },
};

// ========================================
// ROUTER STATE
// ========================================

let currentRoute = null;
let currentParams = {};

// ========================================
// ROUTER FUNCTIONS
// ========================================

/**
 * Initialize router
 */
function initRouter() {
  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    handleRoute(window.location.pathname);
  });
  
  // Handle link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-nav]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    }
  });
  
  // Handle initial route
  handleRoute(window.location.pathname);
}

/**
 * Navigate to a route
 * @param {string} path - Path to navigate to
 * @param {Object} params - Query parameters
 */
function navigateTo(path, params = {}) {
  // Update URL
  const url = new URL(window.location.href);
  url.pathname = path;
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  window.history.pushState({}, '', url);
  handleRoute(path);
}

/**
 * Handle route change
 * @param {string} path - Current path
 */
function handleRoute(path) {
  // Match route
  const { route, params } = matchRoute(path);
  
  if (!route) {
    // 404 - redirect to home
    navigateTo('/');
    return;
  }
  
  // Update state
  currentRoute = route;
  currentParams = params;
  
  // Update page title
  document.title = route.title;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Show/hide back button
  updateBackButton(path);
  
  // Hide sticky cart bar
  hideStickyCartBar();
  
  // Render page
  const mainContent = $('#main-content');
  if (mainContent) {
    // Add loading state
    mainContent.innerHTML = `
      <div class="flex items-center justify-center min-h-[60vh]">
        <div class="animate-pulse flex flex-col items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800"></div>
          <div class="w-32 h-4 rounded bg-stone-200 dark:bg-stone-800"></div>
        </div>
      </div>
    `;
    
    // Small delay for smooth transition
    setTimeout(() => {
      route.render(mainContent, params);
      lucide.createIcons();
    }, 100);
  }
}

/**
 * Match URL path to route
 * @param {string} path - URL path
 * @returns {Object} Matched route and params
 */
function matchRoute(path) {
  // Exact match first
  if (routes[path]) {
    return { route: routes[path], params: {} };
  }
  
  // Try pattern matching
  for (const [pattern, route] of Object.entries(routes)) {
    if (pattern.includes(':')) {
      const regex = new RegExp('^' + pattern.replace(/:([^/]+)/g, '([^/]+)') + '$');
      const match = path.match(regex);
      
      if (match) {
        const paramNames = pattern.match(/:([^/]+)/g)?.map(p => p.slice(1)) || [];
        const params = {};
        paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { route, params };
      }
    }
  }
  
  return { route: null, params: {} };
}

/**
 * Update back button visibility
 * @param {string} path - Current path
 */
function updateBackButton(path) {
  const backBtn = $('#back-btn');
  if (!backBtn) return;
  
  if (path === '/') {
    backBtn.classList.add('opacity-0', 'pointer-events-none');
  } else {
    backBtn.classList.remove('opacity-0', 'pointer-events-none');
    backBtn.onclick = () => window.history.back();
  }
}

// ========================================
// PAGE RENDERERS
// ========================================

/**
 * Render Home page
 * @param {HTMLElement} container - Container element
 */
async function renderHome(container) {
  // Show loading state
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="min-h-[85vh] flex flex-col justify-center items-center px-5 py-16 text-center animate-fade-in">
      <div class="max-w-sm mx-auto">
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-6 tracking-widest">
          PREMIUM NICHE PERFUME
        </p>
        <h1 class="font-display text-hero mb-6 leading-tight">
          Scents that whisper<br>stories
        </h1>
        <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-10 max-w-xs mx-auto">
          Handcrafted in Thailand. Each fragrance captures a moment, a memory, a feeling.
        </p>
        <a href="/products" class="btn btn-primary btn-full" data-nav>
          Explore Collection
        </a>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <i data-lucide="chevron-down" class="w-6 h-6 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
      </div>
    </section>
    
    <!-- Mood Selector -->
    <section class="px-5 py-8 border-t border-border-light dark:border-border-dark">
      <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
        SHOP BY MOOD
      </p>
      <div class="mood-scroll">
        <a href="/products?mood=calm" class="mood-badge mood-calm whitespace-nowrap" data-nav>Calm</a>
        <a href="/products?mood=warm" class="mood-badge mood-warm whitespace-nowrap" data-nav>Warm</a>
        <a href="/products?mood=wild" class="mood-badge mood-wild whitespace-nowrap" data-nav>Wild</a>
        <a href="/products?mood=fresh" class="mood-badge mood-fresh whitespace-nowrap" data-nav>Fresh</a>
        <a href="/products?mood=deep" class="mood-badge mood-deep whitespace-nowrap" data-nav>Deep</a>
      </div>
    </section>
    
    <!-- Featured Products -->
    <section class="px-5 py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-subtitle">Featured</h2>
        <a href="/products" class="text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-accent-light dark:hover:text-accent-dark transition-colors" data-nav>
          View all
        </a>
      </div>
      
      <div id="featured-products-grid" class="product-grid">
        <div class="col-span-full flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light dark:border-accent-dark"></div>
        </div>
      </div>
    </section>
    
    <!-- Discovery Set CTA -->
    <section class="px-5 py-16 bg-stone-100 dark:bg-stone-900">
      <div class="max-w-sm mx-auto text-center">
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
          NOT SURE YET?
        </p>
        <h2 class="font-display text-title mb-4">Discovery Set</h2>
        <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-6">
          Five moments. One journey.<br>Find your signature scent.
        </p>
        <div class="flex items-center justify-center gap-4 mb-8">
          <span class="text-3xl font-display font-semibold">฿599</span>
          <span class="text-text-tertiary-light dark:text-text-tertiary-dark line-through">฿750</span>
        </div>
        <button class="btn btn-primary btn-full" onclick="showToast('Coming soon')">
          Shop Discovery Set
        </button>
      </div>
    </section>
    
    <!-- About Teaser -->
    <section class="px-5 py-16">
      <div class="max-w-sm mx-auto text-center">
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
          OUR STORY
        </p>
        <h2 class="font-display text-title mb-4">Crafted with Intention</h2>
        <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-8">
          Each THANAT-CHA fragrance is a meditation on memory and emotion, blended in small batches using the finest ingredients.
        </p>
        <a href="/about" class="btn btn-secondary" data-nav>
          Read Our Story
        </a>
      </div>
    </section>
  `;

  // Fetch products from Supabase
  try {
    const supabase = getSupabase();
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const gridContainer = container.querySelector('#featured-products-grid');
    
    if (!products || products.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <p class="text-text-secondary-light dark:text-text-secondary-dark">No products available</p>
        </div>
      `;
      return;
    }

    // Map product_variants to variants for consistency
    const mappedProducts = products.map(product => ({
      ...product,
      variants: product.product_variants || []
    }));

    // Get featured products (bestsellers first, then first 4)
    const bestsellers = mappedProducts.filter(p => p.is_bestseller);
    const others = mappedProducts.filter(p => !p.is_bestseller).slice(0, 4 - bestsellers.length);
    const featuredProducts = [...bestsellers, ...others];

    gridContainer.innerHTML = featuredProducts.map(product => renderProductCard(product)).join('');
  } catch (err) {
    const gridContainer = container.querySelector('#featured-products-grid');
    gridContainer.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">Unable to load products</p>
        <button onclick="window.location.reload()" class="btn btn-secondary">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render Product List page
 * @param {HTMLElement} container - Container element
 * @param {Object} params - Route params
 */
async function renderProductList(container, params) {
  const urlParams = getUrlParams();
  const selectedMood = urlParams.get('mood');
  
  // Show loading state
  container.innerHTML = `
    <div class="px-5 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="font-display text-title mb-2">
          ${selectedMood ? capitalize(selectedMood) : 'All'} Scents
        </h1>
        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark" id="product-count">
          Loading...
        </p>
      </div>
      
      <!-- Mood Filter -->
      <div class="mood-scroll mb-8">
        <a href="/products" class="mood-badge ${!selectedMood ? 'ring-2 ring-accent-light dark:ring-accent-dark' : 'opacity-60'} whitespace-nowrap" data-nav>
          All
        </a>
        ${['calm', 'warm', 'wild', 'fresh', 'deep'].map(mood => `
          <a href="/products?mood=${mood}" 
             class="mood-badge mood-${mood} ${selectedMood === mood ? 'ring-2 ring-offset-2 ring-accent-light dark:ring-accent-dark' : ''} whitespace-nowrap" 
             data-nav>
            ${capitalize(mood)}
          </a>
        `).join('')}
      </div>
      
      <!-- Product Grid -->
      <div id="products-grid" class="product-grid">
        <div class="col-span-full flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light dark:border-accent-dark"></div>
        </div>
      </div>
    </div>
    
    <!-- Discovery Set Banner -->
    <div class="mx-5 mt-8 p-6 bg-stone-100 dark:bg-stone-900 rounded-2xl">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center flex-shrink-0">
          <i data-lucide="gift" class="w-7 h-7 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
        </div>
        <div class="flex-1">
          <h3 class="font-display text-lg mb-1">Discovery Set</h3>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Try 5 scents for ฿599
          </p>
        </div>
        <button class="btn btn-primary py-2 px-4 text-sm" onclick="showToast('Coming soon')">
          Shop
        </button>
      </div>
    </div>
  `;

  // Fetch products from Supabase
  try {
    const supabase = getSupabase();
    let query = supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (selectedMood) {
      query = query.eq('mood', selectedMood);
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    const countEl = container.querySelector('#product-count');
    const gridContainer = container.querySelector('#products-grid');
    
    if (!products || products.length === 0) {
      countEl.textContent = '0 fragrances';
      gridContainer.innerHTML = `
        <div class="col-span-full text-center py-16">
          <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            ${selectedMood ? 'No scents found for this mood.' : 'No products available.'}
          </p>
          ${selectedMood ? `
            <a href="/products" class="btn btn-secondary" data-nav>
              View all scents
            </a>
          ` : ''}
        </div>
      `;
      return;
    }

    countEl.textContent = `${products.length} fragrance${products.length !== 1 ? 's' : ''}`;

    // Map product_variants to variants for consistency
    const mappedProducts = products.map(product => ({
      ...product,
      variants: product.product_variants || []
    }));

    gridContainer.innerHTML = mappedProducts.map(product => renderProductCard(product)).join('');
  } catch (err) {
    const countEl = container.querySelector('#product-count');
    const gridContainer = container.querySelector('#products-grid');
    
    countEl.textContent = 'Error loading products';
    gridContainer.innerHTML = `
      <div class="col-span-full text-center py-16">
        <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">Unable to load products</p>
        <button onclick="window.location.reload()" class="btn btn-secondary">Try Again</button>
      </div>
    `;
  }
}

/**
 * Render Product Detail page
 * @param {HTMLElement} container - Container element
 * @param {Object} params - Route params
 */
function renderProductDetail(container, params) {
  const product = getProductBySlug(params.slug);
  
  if (!product) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] px-5">
        <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
          Product not found
        </p>
        <a href="/products" class="btn btn-primary" data-nav>
          Back to scents
        </a>
      </div>
    `;
    return;
  }
  
  // Default to first variant
  let selectedVariant = product.variants[0];
  
  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Product Image -->
      <div class="relative aspect-[4/5] bg-stone-100 dark:bg-stone-900">
        <img 
          src="${product.images?.[0] || getPlaceholderImage(400, 500, product.name)}"
          alt="${product.name}"
          class="w-full h-full object-cover"
        >
        ${product.isBestseller ? `
          <span class="absolute top-4 left-4 px-3 py-1 bg-accent-light dark:bg-accent-dark text-white text-xs font-medium rounded-full">
            Bestseller
          </span>
        ` : ''}
      </div>
      
      <!-- Product Info -->
      <div class="px-5 py-6">
        <!-- Mood Badge -->
        <span class="mood-badge mood-${product.mood} mb-4">
          ${capitalize(product.mood)}
        </span>
        
        <!-- Name & Tagline -->
        <h1 class="font-display text-title mb-2">${product.name}</h1>
        <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-6 italic">
          "${product.tagline}"
        </p>
        
        <!-- Story -->
        <div class="mb-8">
          <p class="text-body text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
            ${product.description}
          </p>
        </div>
        
        <!-- Notes Pyramid -->
        <div class="mb-8">
          <h3 class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            FRAGRANCE NOTES
          </h3>
          <div class="notes-pyramid">
            <div class="note-row">
              <span class="note-label">Top</span>
              <div class="note-tags">
                ${product.topNotes.map(note => `<span class="note-tag">${note}</span>`).join('')}
              </div>
            </div>
            <div class="note-row">
              <span class="note-label">Heart</span>
              <div class="note-tags">
                ${product.middleNotes.map(note => `<span class="note-tag">${note}</span>`).join('')}
              </div>
            </div>
            <div class="note-row">
              <span class="note-label">Base</span>
              <div class="note-tags">
                ${product.baseNotes.map(note => `<span class="note-tag">${note}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Size Selector -->
        <div class="mb-8">
          <h3 class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            SELECT SIZE
          </h3>
          <div class="size-selector" id="size-selector">
            ${product.variants.map((variant, index) => `
              <label class="size-option">
                <input type="radio" name="size" value="${variant.id}" 
                       ${index === 0 ? 'checked' : ''} 
                       data-price="${variant.price}"
                       data-size="${variant.size}">
                <span class="size-label">
                  <span class="size-value">${variant.size}</span>
                  <span class="size-price">${formatPrice(variant.price)}</span>
                </span>
              </label>
            `).join('')}
          </div>
        </div>
        
        <!-- Additional Info -->
        <div class="space-y-4 pt-6 border-t border-border-light dark:border-border-dark">
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer py-2">
              <span class="font-medium">Ingredients</span>
              <i data-lucide="chevron-down" class="w-5 h-5 transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark py-2">
              Alcohol Denat., Fragrance (Parfum), Water (Aqua), and natural essential oils. 
              Our fragrances are cruelty-free and made without phthalates.
            </p>
          </details>
          
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer py-2">
              <span class="font-medium">Shipping & Returns</span>
              <i data-lucide="chevron-down" class="w-5 h-5 transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark py-2">
              Free shipping on orders over ฿1,500. Standard delivery 2-3 business days in Bangkok. 
              7-day returns for unopened products.
            </p>
          </details>
        </div>
        
        <!-- Reviews Section -->
        <div class="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
          <h3 class="font-display text-lg mb-6">Customer Reviews</h3>
          
          <!-- Reviews List -->
          <div id="product-reviews" class="space-y-6 mb-8">
            <div class="text-center py-8">
              <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading reviews...</p>
            </div>
          </div>
          
          <!-- Write Review Form -->
          <div class="bg-stone-50 dark:bg-stone-900 rounded-2xl p-6">
            <h4 class="font-medium mb-4">Write a Review</h4>
            <form id="review-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  class="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Rating</label>
                <div class="flex gap-2" id="rating-selector">
                  ${[1, 2, 3, 4, 5].map(star => `
                    <label class="cursor-pointer">
                      <input type="radio" name="rating" value="${star}" class="hidden peer" required>
                      <span class="text-3xl text-stone-300 peer-checked:text-amber-500 transition-colors">★</span>
                    </label>
                  `).join('')}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  name="review_text"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-border-light dark:border-border-dark rounded-xl bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark resize-none"
                  placeholder="Share your experience with this fragrance..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                class="btn btn-primary btn-full"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Show sticky cart bar
  setTimeout(() => {
    showStickyCartBar(product, selectedVariant.id);
  }, 100);
  
  // Handle size selection
  const sizeSelector = container.querySelector('#size-selector');
  if (sizeSelector) {
    sizeSelector.addEventListener('change', (e) => {
      if (e.target.name === 'size') {
        selectedVariant = product.variants.find(v => v.id === e.target.value);
        showStickyCartBar(product, selectedVariant.id);
      }
    });
  }
  
  // Load and display reviews
  loadProductReviews(product.id);
  
  // Handle review form submission
  const reviewForm = container.querySelector('#review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(reviewForm);
      const reviewData = {
        product_id: product.id,
        customer_name: formData.get('customer_name'),
        rating: parseInt(formData.get('rating')),
        review_text: formData.get('review_text')
      };
      
      // Submit review
      const result = await createReview(reviewData);
      
      if (result.error) {
        alert('Error submitting review: ' + result.error);
        return;
      }
      
      // Show success message
      showToast('Review submitted! It will be visible after approval.');
      
      // Reset form
      reviewForm.reset();
      
      // Reload reviews
      loadProductReviews(product.id);
    });
  }
}

/**
 * Load and display product reviews
 * @param {string} productId - Product ID
 */
async function loadProductReviews(productId) {
  const reviewsContainer = document.getElementById('product-reviews');
  if (!reviewsContainer) return;
  
  // Load reviews from Supabase
  const result = await getProductReviews(productId);
  
  if (result.error) {
    reviewsContainer.innerHTML = `
      <div class="text-center py-8">
        <p class="text-text-secondary-light dark:text-text-secondary-dark">
          Unable to load reviews
        </p>
      </div>
    `;
    return;
  }
  
  const reviews = result.data || [];
  
  if (reviews.length === 0) {
    reviewsContainer.innerHTML = `
      <div class="text-center py-8">
        <p class="text-text-secondary-light dark:text-text-secondary-dark">
          No reviews yet. Be the first to review this fragrance!
        </p>
      </div>
    `;
    return;
  }
  
  // Display reviews
  reviewsContainer.innerHTML = reviews.map(review => `
    <div class="bg-stone-50 dark:bg-stone-900 rounded-xl p-5">
      <div class="flex items-start justify-between mb-3">
        <div>
          <p class="font-medium text-text-primary-light dark:text-text-primary-dark">${review.customer_name}</p>
          <p class="text-xs text-text-tertiary-light dark:text-text-tertiary-dark">
            ${new Date(review.created_at).toLocaleDateString('th-TH')}
          </p>
        </div>
        <div class="text-lg">
          ${renderStars(review.rating)}
        </div>
      </div>
      <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
        ${review.review_text}
      </p>
    </div>
  `).join('');
}

/**
 * Render star rating
 * @param {number} rating - Rating value (1-5)
 * @returns {string} HTML string
 */
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="text-amber-500">★</span>';
    } else {
      stars += '<span class="text-stone-300">★</span>';
    }
  }
  return stars;
}

/**
 * Render Cart page
 * @param {HTMLElement} container - Container element
 */
function renderCart(container) {
  container.innerHTML = `
    <div class="px-5 py-6 min-h-[calc(100vh-200px)]">
      <h1 class="font-display text-title mb-6">Your Bag</h1>
      
      <!-- Cart Items -->
      <div id="cart-items-container">
        <!-- Rendered by cart.js -->
      </div>
      
      <!-- Cart Summary (hidden when empty) -->
      <div id="cart-summary" class="mt-8 pt-6 border-t border-border-light dark:border-border-dark" style="display: none;">
        <div class="space-y-3 mb-6">
          <div class="flex items-center justify-between text-sm">
            <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</span>
            <span id="cart-subtotal">฿0</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-text-secondary-light dark:text-text-secondary-dark">Shipping</span>
            <span id="cart-shipping">FREE</span>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-border-light dark:border-border-dark">
            <span class="font-medium">Total</span>
            <span id="cart-total" class="font-display text-xl font-semibold">฿0</span>
          </div>
        </div>
        
        <a href="/checkout" class="btn btn-primary btn-full" data-nav>
          Proceed to Checkout
        </a>
        
        <p class="text-center text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-4">
          Free shipping on orders over ฿1,500
        </p>
      </div>
    </div>
  `;
  
  // Render cart items
  const itemsContainer = container.querySelector('#cart-items-container');
  const summaryContainer = container.querySelector('#cart-summary');
  
  renderCartItems(itemsContainer);
  
  // Show/hide summary based on cart contents
  const items = getCartItems();
  if (items.length > 0) {
    summaryContainer.style.display = 'block';
    updateCartSummary();
  }
}

/**
 * Render Checkout page
 * @param {HTMLElement} container - Container element
 */
function renderCheckout(container) {
  // Validate cart
  const validation = validateCheckout();
  if (!validation.valid) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-[60vh] px-5">
        <p class="text-text-secondary-light dark:text-text-secondary-dark mb-4">
          ${validation.errors[0]}
        </p>
        <a href="/products" class="btn btn-primary" data-nav>
          Continue Shopping
        </a>
      </div>
    `;
    return;
  }
  
  const summary = getCartSummary();
  
  container.innerHTML = `
    <div class="px-5 py-6">
      <h1 class="font-display text-title mb-6">Checkout</h1>
      
      <form id="checkout-form" class="space-y-6">
        <!-- Customer Details -->
        <section>
          <h2 class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            YOUR DETAILS
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" name="name" class="input" placeholder="Your name" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Phone Number</label>
              <input type="tel" name="phone" class="input" placeholder="081-234-5678" required>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Delivery Address</label>
              <textarea name="address" class="input" placeholder="Full address including postal code" required></textarea>
            </div>
          </div>
        </section>
        
        <!-- Payment Method -->
        <section>
          <h2 class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            PAYMENT METHOD
          </h2>
          <div class="space-y-3">
            <label class="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-accent-light dark:hover:border-accent-dark transition-colors">
              <input type="radio" name="payment" value="promptpay" checked class="w-4 h-4 accent-accent-light dark:accent-accent-dark">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <i data-lucide="qr-code" class="w-5 h-5 text-purple-600 dark:text-purple-400"></i>
                </div>
                <div>
                  <p class="font-medium">QR PromptPay</p>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Scan to pay instantly</p>
                </div>
              </div>
            </label>
            
            <label class="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-xl cursor-pointer hover:border-accent-light dark:hover:border-accent-dark transition-colors">
              <input type="radio" name="payment" value="bank_transfer" class="w-4 h-4 accent-accent-light dark:accent-accent-dark">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <i data-lucide="building-2" class="w-5 h-5 text-blue-600 dark:text-blue-400"></i>
                </div>
                <div>
                  <p class="font-medium">Bank Transfer</p>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Transfer to our account</p>
                </div>
              </div>
            </label>
          </div>
        </section>
        
        <!-- Order Summary -->
        <section class="pt-6 border-t border-border-light dark:border-border-dark">
          <h2 class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            ORDER SUMMARY
          </h2>
          <div class="space-y-3 mb-6">
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal (${summary.itemCount} items)</span>
              <span>${formatPrice(summary.subtotal)}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-text-secondary-light dark:text-text-secondary-dark">Shipping</span>
              <span>${summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping)}</span>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-border-light dark:border-border-dark">
              <span class="font-medium">Total</span>
              <span class="font-display text-2xl font-semibold">${formatPrice(summary.total)}</span>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full">
            Place Order
          </button>
          
          <p class="text-center text-xs text-text-tertiary-light dark:text-text-tertiary-dark mt-4">
            By placing this order, you agree to our Terms of Service
          </p>
        </section>
      </form>
    </div>
  `;
  
  // Handle form submission
  const form = container.querySelector('#checkout-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const orderData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      paymentMethod: formData.get('payment'),
      ...prepareCheckout(),
    };
    
    // Save order to storage (in production, send to server)
    setStorage('current_order', orderData);
    
    // Clear cart
    clearCart();
    
    // Navigate to confirmation
    navigateTo('/order-confirmation');
  });
}

/**
 * Render Order Confirmation page
 * @param {HTMLElement} container - Container element
 */
function renderOrderConfirmation(container) {
  const order = getStorage('current_order');
  
  if (!order) {
    navigateTo('/');
    return;
  }
  
  container.innerHTML = `
    <div class="px-5 py-12 min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center">
      <div class="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
        <i data-lucide="check" class="w-10 h-10 text-green-600 dark:text-green-400"></i>
      </div>
      
      <h1 class="font-display text-title mb-2">Thank You</h1>
      <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-6">
        Your order has been received
      </p>
      
      <div class="bg-stone-100 dark:bg-stone-900 rounded-2xl p-6 mb-8 w-full max-w-sm">
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-2 tracking-widest">
          ORDER NUMBER
        </p>
        <p class="font-display text-xl mb-4">${order.orderNumber}</p>
        
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-2 tracking-widest">
          TOTAL
        </p>
        <p class="font-display text-2xl font-semibold">${formatPrice(order.summary.total)}</p>
      </div>
      
      <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-8 max-w-xs">
        We've sent the order details to your LINE. 
        Please complete payment within 24 hours.
      </p>
      
      ${order.paymentMethod === 'promptpay' ? `
        <div class="w-full max-w-sm mb-8">
          <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
            SCAN TO PAY
          </p>
          <div class="aspect-square bg-white rounded-2xl p-4 flex items-center justify-center">
            <div class="text-center">
              <div class="w-48 h-48 bg-stone-200 dark:bg-stone-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <i data-lucide="qr-code" class="w-32 h-32 text-stone-400"></i>
              </div>
              <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                THANAT-CHA CO., LTD.
              </p>
            </div>
          </div>
        </div>
      ` : `
        <div class="w-full max-w-sm mb-8 text-left">
          <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest text-center">
            BANK TRANSFER
          </p>
          <div class="bg-stone-100 dark:bg-stone-900 rounded-xl p-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Bank</span>
              <span class="font-medium">Kasikorn Bank</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Account</span>
              <span class="font-medium">123-4-56789-0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Name</span>
              <span class="font-medium">THANAT-CHA CO., LTD.</span>
            </div>
          </div>
        </div>
      `}
      
      <a href="/products" class="btn btn-primary btn-full max-w-sm" data-nav>
        Continue Shopping
      </a>
    </div>
  `;
}

/**
 * Render About page
 * @param {HTMLElement} container - Container element
 */
function renderAbout(container) {
  container.innerHTML = `
    <div class="animate-fade-in">
      <!-- Hero Image -->
      <div class="aspect-[16/10] bg-stone-200 dark:bg-stone-800">
        <img 
          src="${getPlaceholderImage(480, 300, 'Our Story')}"
          alt="THANAT-CHA Atelier"
          class="w-full h-full object-cover"
        >
      </div>
      
      <div class="px-5 py-12 max-w-lg mx-auto">
        <p class="text-tiny text-text-tertiary-light dark:text-text-tertiary-dark mb-4 tracking-widest">
          OUR STORY
        </p>
        <h1 class="font-display text-title mb-6">Crafted with Intention</h1>
        
        <div class="space-y-6 text-body text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          <p>
            THANAT-CHA was born from a simple belief: that fragrance should tell a story. 
            Not just any story—your story. Each scent we create is a meditation on memory, 
            emotion, and the quiet moments that shape our lives.
          </p>
          <p>
            Founded in Bangkok in 2023, we blend traditional Thai craftsmanship with 
            contemporary perfumery techniques. Our small-batch approach ensures every 
            bottle receives the attention it deserves.
          </p>
          <p>
            We source the finest ingredients from around the world—French lavender, 
            Indonesian sandalwood, Italian bergamot—and blend them in our atelier 
            with meticulous care.
          </p>
        </div>
        
        <!-- Values -->
        <div class="mt-12 pt-12 border-t border-border-light dark:border-border-dark">
          <h2 class="font-display text-subtitle mb-8">Our Values</h2>
          
          <div class="space-y-8">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center flex-shrink-0">
                <i data-lucide="leaf" class="w-5 h-5 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
              </div>
              <div>
                <h3 class="font-medium mb-2">Sustainable</h3>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  We use recyclable packaging and source ingredients responsibly.
                </p>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center flex-shrink-0">
                <i data-lucide="heart" class="w-5 h-5 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
              </div>
              <div>
                <h3 class="font-medium mb-2">Cruelty-Free</h3>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Never tested on animals. Never will be.
                </p>
              </div>
            </div>
            
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center flex-shrink-0">
                <i data-lucide="hand" class="w-5 h-5 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
              </div>
              <div>
                <h3 class="font-medium mb-2">Handcrafted</h3>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  Every bottle is filled, labeled, and packed by hand in our Bangkok atelier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render Contact page
 * @param {HTMLElement} container - Container element
 */
function renderContact(container) {
  container.innerHTML = `
    <div class="px-5 py-12 max-w-lg mx-auto">
      <h1 class="font-display text-title mb-2">Get in Touch</h1>
      <p class="text-body text-text-secondary-light dark:text-text-secondary-dark mb-10">
        We'd love to hear from you
      </p>
      
      <!-- Contact Methods -->
      <div class="space-y-4 mb-12">
        <a href="https://line.me/R/ti/p/@thanatcha" target="_blank" rel="noopener" 
           class="flex items-center gap-4 p-4 bg-[#06C755] text-white rounded-xl hover:opacity-90 transition-opacity">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <div>
            <p class="font-medium">Chat on LINE</p>
            <p class="text-sm opacity-90">Fastest response</p>
          </div>
          <i data-lucide="arrow-up-right" class="w-5 h-5 ml-auto"></i>
        </a>
        
        <a href="mailto:hello@thanatcha.com" 
           class="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-xl hover:border-accent-light dark:hover:border-accent-dark transition-colors">
          <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
            <i data-lucide="mail" class="w-5 h-5 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
          </div>
          <div>
            <p class="font-medium">Email Us</p>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">hello@thanatcha.com</p>
          </div>
        </a>
        
        <a href="https://instagram.com/thanatcha" target="_blank" rel="noopener"
           class="flex items-center gap-4 p-4 border border-border-light dark:border-border-dark rounded-xl hover:border-accent-light dark:hover:border-accent-dark transition-colors">
          <div class="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
            <i data-lucide="instagram" class="w-5 h-5 text-text-tertiary-light dark:text-text-tertiary-dark"></i>
          </div>
          <div>
            <p class="font-medium">Instagram</p>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">@thanatcha</p>
          </div>
        </a>
      </div>
      
      <!-- Store Locations -->
      <div class="pt-8 border-t border-border-light dark:border-border-dark">
        <h2 class="font-display text-subtitle mb-6">Visit Us</h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="font-medium mb-2">Siam Discovery</h3>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              3rd Floor, Room 3-12<br>
              989 Rama I Road, Pathum Wan<br>
              Bangkok 10330
            </p>
            <p class="text-sm text-text-tertiary-light dark:text-text-tertiary-dark mt-2">
              Daily 10:00 - 22:00
            </p>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">The Commons Thonglor</h3>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              335 Thonglor 17<br>
              Sukhumvit 55, Klongton Nua<br>
              Bangkok 10110
            </p>
            <p class="text-sm text-text-tertiary-light dark:text-text-tertiary-dark mt-2">
              Daily 08:00 - 21:00
            </p>
          </div>
        </div>
      </div>
      
      <!-- FAQ -->
      <div class="mt-12 pt-8 border-t border-border-light dark:border-border-dark">
        <h2 class="font-display text-subtitle mb-6">Common Questions</h2>
        
        <div class="space-y-4">
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer py-3 font-medium">
              How long does shipping take?
              <i data-lucide="chevron-down" class="w-5 h-5 transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark pb-3">
              Bangkok: 1-2 business days. Upcountry: 2-3 business days. 
              Free shipping on orders over ฿1,500.
            </p>
          </details>
          
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer py-3 font-medium">
              Can I return or exchange?
              <i data-lucide="chevron-down" class="w-5 h-5 transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark pb-3">
              Unopened products can be returned within 7 days. 
              Due to hygiene reasons, opened fragrances cannot be returned.
            </p>
          </details>
          
          <details class="group">
            <summary class="flex items-center justify-between cursor-pointer py-3 font-medium">
              Are your perfumes long-lasting?
              <i data-lucide="chevron-down" class="w-5 h-5 transition-transform group-open:rotate-180"></i>
            </summary>
            <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark pb-3">
              Our Eau de Parfum concentration provides 6-8 hours of wear. 
              longevity varies based on skin chemistry and application.
            </p>
          </details>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Render product card HTML
 * @param {Object} product - Product data
 * @returns {string} HTML string
 */
function renderProductCard(product) {
  const minPrice = product.variants && product.variants.length > 0
    ? Math.min(...product.variants.map(v => v.price))
    : 0;
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : getPlaceholderImage(200, 250, product.name);
  const isBestseller = product.is_bestseller || product.isBestseller;

  return `
    <a href="/products/${product.slug}" class="card group" data-nav>
      <div class="relative aspect-[4/5] overflow-hidden">
        <img
          src="${imageUrl}"
          alt="${product.name}"
          class="card-image transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        >
        ${isBestseller ? `
          <span class="absolute top-3 left-3 px-2 py-1 bg-accent-light dark:bg-accent-dark text-white text-xs font-medium rounded-full">
            Bestseller
          </span>
        ` : ''}
      </div>
      <div class="card-content">
        <span class="mood-badge mood-${product.mood} text-[10px] mb-2">
          ${capitalize(product.mood)}
        </span>
        <h3 class="font-display text-lg mb-1 group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors">
          ${product.name}
        </h3>
        <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark line-clamp-2 mb-3">
          ${product.tagline}
        </p>
        <p class="font-medium">From ${formatPrice(minPrice)}</p>
      </div>
    </a>
  `;
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
