/**
 * THANAT-CHA - Cart Management
 * Client-side cart functionality with localStorage persistence
 */

// ========================================
// CART STATE
// ========================================

const CART_KEY = 'thanatcha_cart';
const CART_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

let cartState = {
  items: [],
  lastUpdated: null,
};

// ========================================
// CART OPERATIONS
// ========================================

/**
 * Initialize cart from localStorage
 */
function initCart() {
  const saved = getStorage(CART_KEY);
  if (saved && Array.isArray(saved.items)) {
    cartState = saved;
  }
  updateCartBadge();
}

/**
 * Save cart to localStorage
 */
function saveCart() {
  cartState.lastUpdated = Date.now();
  setStorage(CART_KEY, cartState, CART_EXPIRY);
  updateCartBadge();
  dispatchCartEvent();
}

/**
 * Get all cart items
 * @returns {Array}
 */
function getCartItems() {
  return [...cartState.items];
}

/**
 * Get cart summary
 * @returns {Object}
 */
function getCartSummary() {
  const items = cartState.items;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return {
    itemCount,
    subtotal,
    shipping: subtotal >= 150000 ? 0 : 10000, // Free shipping over ฿1,500
    total: subtotal + (subtotal >= 150000 ? 0 : 10000),
  };
}

/**
 * Add item to cart
 * @param {Object} product - Product data
 * @param {string} variantId - Selected variant ID
 * @param {number} quantity - Quantity to add
 * @returns {boolean}
 */
function addToCart(product, variantId, quantity = 1) {
  const variant = product.variants?.find(v => v.id === variantId);
  if (!variant) {
    console.error('Variant not found:', variantId);
    return false;
  }
  
  const existingIndex = cartState.items.findIndex(
    item => item.productId === product.id && item.variantId === variantId
  );
  
  if (existingIndex >= 0) {
    // Update existing item
    cartState.items[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cartState.items.push({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantSize: variant.size,
      price: variant.price,
      image: product.images?.[0] || '',
      quantity,
      addedAt: Date.now(),
    });
  }
  
  saveCart();
  return true;
}

/**
 * Update item quantity
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @param {number} quantity - New quantity
 * @returns {boolean}
 */
function updateQuantity(productId, variantId, quantity) {
  const index = cartState.items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  );
  
  if (index < 0) return false;
  
  if (quantity <= 0) {
    cartState.items.splice(index, 1);
  } else {
    cartState.items[index].quantity = quantity;
  }
  
  saveCart();
  return true;
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @returns {boolean}
 */
function removeFromCart(productId, variantId) {
  const index = cartState.items.findIndex(
    item => item.productId === productId && item.variantId === variantId
  );
  
  if (index < 0) return false;
  
  cartState.items.splice(index, 1);
  saveCart();
  return true;
}

/**
 * Clear entire cart
 */
function clearCart() {
  cartState.items = [];
  saveCart();
}

/**
 * Check if product is in cart
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @returns {boolean}
 */
function isInCart(productId, variantId) {
  return cartState.items.some(
    item => item.productId === productId && item.variantId === variantId
  );
}

/**
 * Get quantity of specific item in cart
 * @param {string} productId - Product ID
 * @param {string} variantId - Variant ID
 * @returns {number}
 */
function getItemQuantity(productId, variantId) {
  const item = cartState.items.find(
    item => item.productId === productId && item.variantId === variantId
  );
  return item ? item.quantity : 0;
}

// ========================================
// UI UPDATES
// ========================================

/**
 * Update cart badge in header
 */
function updateCartBadge() {
  const badge = $('#cart-badge');
  if (!badge) return;
  
  const { itemCount } = getCartSummary();
  
  if (itemCount > 0) {
    badge.textContent = itemCount > 99 ? '99+' : itemCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

/**
 * Dispatch cart update event
 */
function dispatchCartEvent() {
  window.dispatchEvent(new CustomEvent('cartUpdated', {
    detail: getCartSummary(),
  }));
}

// ========================================
// RENDER FUNCTIONS
// ========================================

/**
 * Render cart items
 * @param {HTMLElement} container - Container element
 */
function renderCartItems(container) {
  if (!container) return;
  
  const items = getCartItems();
  
  if (items.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
          <i data-lucide="shopping-bag" class="w-8 h-8 text-stone-400"></i>
        </div>
        <h3 class="font-display text-xl mb-2">Your bag is empty</h3>
        <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-6">Discover scents that speak to you</p>
        <a href="/products" class="btn btn-primary" data-nav>
          Explore Scents
        </a>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="cart-item" data-product-id="${item.productId}" data-variant-id="${item.variantId}">
      <img 
        src="${item.image || getPlaceholderImage(80, 100)}" 
        alt="${item.productName}"
        class="cart-item-image"
        loading="lazy"
      >
      <div class="cart-item-details">
        <div>
          <h4 class="font-display text-lg mb-1">${item.productName}</h4>
          <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${item.variantSize}</p>
          <p class="font-medium mt-1">${formatPrice(item.price)}</p>
        </div>
        <div class="flex items-center justify-between">
          <div class="quantity-selector">
            <button class="quantity-btn cart-decrease" aria-label="Decrease quantity">
              <i data-lucide="minus" class="w-4 h-4"></i>
            </button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn cart-increase" aria-label="Increase quantity">
              <i data-lucide="plus" class="w-4 h-4"></i>
            </button>
          </div>
          <button class="cart-remove p-2 text-text-tertiary-light dark:text-text-tertiary-dark hover:text-red-500 transition-colors" aria-label="Remove item">
            <i data-lucide="trash-2" class="w-5 h-5"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.cart-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      const productId = item.dataset.productId;
      const variantId = item.dataset.variantId;
      const currentQty = parseInt(item.querySelector('.quantity-value').textContent);
      updateQuantity(productId, variantId, currentQty - 1);
      renderCartItems(container);
      updateCartSummary();
    });
  });
  
  container.querySelectorAll('.cart-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      const productId = item.dataset.productId;
      const variantId = item.dataset.variantId;
      const currentQty = parseInt(item.querySelector('.quantity-value').textContent);
      updateQuantity(productId, variantId, currentQty + 1);
      renderCartItems(container);
      updateCartSummary();
    });
  });
  
  container.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const item = e.target.closest('.cart-item');
      const productId = item.dataset.productId;
      const variantId = item.dataset.variantId;
      removeFromCart(productId, variantId);
      renderCartItems(container);
      updateCartSummary();
      showToast('Item removed');
    });
  });
  
  lucide.createIcons();
}

/**
 * Update cart summary display
 */
function updateCartSummary() {
  const summary = getCartSummary();
  
  // Update subtotal
  const subtotalEl = $('#cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);
  
  // Update shipping
  const shippingEl = $('#cart-shipping');
  if (shippingEl) {
    shippingEl.textContent = summary.shipping === 0 ? 'FREE' : formatPrice(summary.shipping);
  }
  
  // Update total
  const totalEl = $('#cart-total');
  if (totalEl) totalEl.textContent = formatPrice(summary.total);
  
  // Update sticky bar price
  const stickyPrice = $('#sticky-price');
  if (stickyPrice) stickyPrice.textContent = formatPrice(summary.total);
}

// ========================================
// STICKY CART BAR
// ========================================

/**
 * Show sticky cart bar on product detail
 * @param {Object} product - Current product
 * @param {string} selectedVariantId - Selected variant
 */
function showStickyCartBar(product, selectedVariantId) {
  const bar = $('#sticky-cart-bar');
  if (!bar) return;
  
  const variant = product.variants?.find(v => v.id === selectedVariantId);
  if (!variant) return;
  
  // Update price
  const priceEl = $('#sticky-price');
  if (priceEl) priceEl.textContent = formatPrice(variant.price);
  
  // Update button
  const addBtn = $('#sticky-add-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      addToCart(product, selectedVariantId, 1);
      showToast('Added to bag');
      
      // Animate button
      addBtn.innerHTML = `
        <i data-lucide="check" class="w-4 h-4"></i>
        <span>Added</span>
      `;
      lucide.createIcons();
      
      setTimeout(() => {
        addBtn.innerHTML = `
          <span>Add to Bag</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        `;
        lucide.createIcons();
      }, 1500);
    };
  }
  
  // Show bar
  bar.classList.remove('translate-y-full');
}

/**
 * Hide sticky cart bar
 */
function hideStickyCartBar() {
  const bar = $('#sticky-cart-bar');
  if (bar) {
    bar.classList.add('translate-y-full');
  }
}

// ========================================
// CHECKOUT PREPARATION
// ========================================

/**
 * Prepare checkout data
 * @returns {Object|null}
 */
function prepareCheckout() {
  const items = getCartItems();
  const summary = getCartSummary();
  
  if (items.length === 0) return null;
  
  return {
    items,
    summary,
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
  };
}

/**
 * Validate checkout readiness
 * @returns {Object}
 */
function validateCheckout() {
  const items = getCartItems();
  const errors = [];
  
  if (items.length === 0) {
    errors.push('Your cart is empty');
  }
  
  // Check stock availability (would need server validation in production)
  items.forEach(item => {
    if (item.quantity < 1) {
      errors.push(`${item.productName} has invalid quantity`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  
  // Cart button click - navigate to cart
  const cartBtn = $('#cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      navigateTo('/cart');
    });
  }
});
