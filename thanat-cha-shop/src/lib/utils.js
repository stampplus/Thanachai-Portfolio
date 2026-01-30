/**
 * THANAT-CHA - Utility Functions
 * Helper functions for the e-commerce application
 */

// ========================================
// DOM UTILITIES
// ========================================

/**
 * Select a single element
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {Element|null}
 */
function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Select multiple elements
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (default: document)
 * @returns {NodeList}
 */
function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
}

/**
 * Create an element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attrs - Attributes object
 * @param {Array} children - Child elements or text
 * @returns {Element}
 */
function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        el.dataset[dataKey] = dataValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      el.appendChild(child);
    }
  });
  
  return el;
}

// ========================================
// FORMATTING UTILITIES
// ========================================

/**
 * Format price in Thai Baht
 * @param {number} price - Price in satang (1 THB = 100 satang)
 * @returns {string} Formatted price
 */
function formatPrice(price) {
  const baht = Math.floor(price / 100);
  return `฿${baht.toLocaleString('th-TH')}`;
}

/**
 * Format price with decimal
 * @param {number} price - Price in satang
 * @returns {string} Formatted price with decimal
 */
function formatPriceDecimal(price) {
  const baht = price / 100;
  return `฿${baht.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format phone number to Thai format
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone
 */
function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Format date to Thai locale
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate order number
 * @returns {string} Order number (e.g., TH-2025-00001)
 */
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `TH-${year}-${random}`;
}

// ========================================
// VALIDATION UTILITIES
// ========================================

/**
 * Validate Thai phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return /^0[689]\d{8}$/.test(cleaned);
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate required fields
 * @param {Object} fields - Object with field names and values
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
function validateRequired(fields) {
  const errors = [];
  
  Object.entries(fields).forEach(([name, value]) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(name);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ========================================
// URL & ROUTING UTILITIES
// ========================================

/**
 * Parse URL parameters
 * @param {string} url - URL to parse (default: current URL)
 * @returns {URLSearchParams}
 */
function getUrlParams(url = window.location.href) {
  return new URLSearchParams(new URL(url).search);
}

/**
 * Update URL without reloading
 * @param {string} path - New path
 * @param {Object} params - Query parameters
 */
function updateUrl(path, params = {}) {
  const url = new URL(window.location.href);
  url.pathname = path;
  url.search = new URLSearchParams(params).toString();
  window.history.pushState({}, '', url);
}

/**
 * Get current path
 * @returns {string}
 */
function getCurrentPath() {
  return window.location.pathname;
}

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Save to localStorage with expiry
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @param {number} ttl - Time to live in milliseconds
 */
function setStorage(key, value, ttl = null) {
  const item = {
    value,
    expires: ttl ? Date.now() + ttl : null,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get from localStorage with expiry check
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found or expired
 * @returns {*}
 */
function getStorage(key, defaultValue = null) {
  try {
    const item = JSON.parse(localStorage.getItem(key));
    if (!item) return defaultValue;
    
    if (item.expires && Date.now() > item.expires) {
      localStorage.removeItem(key);
      return defaultValue;
    }
    
    return item.value;
  } catch {
    return defaultValue;
  }
}

/**
 * Remove from localStorage
 * @param {string} key - Storage key
 */
function removeStorage(key) {
  localStorage.removeItem(key);
}

// ========================================
// DEBOUNCE & THROTTLE
// ========================================

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function}
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function}
 */
function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ========================================
// IMAGE UTILITIES
// ========================================

/**
 * Lazy load images with blur-up effect
 * @param {string} selector - Image selector
 */
function lazyLoadImages(selector = 'img[data-src]') {
  const images = $$(selector);
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  }
}

/**
 * Generate placeholder image URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Placeholder text
 * @returns {string}
 */
function getPlaceholderImage(width = 400, height = 500, text = 'THANAT-CHA') {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%23F5F5F4'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='14' fill='%2357534E'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}

// ========================================
// THEME UTILITIES
// ========================================

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  setStorage('theme', isDark ? 'dark' : 'light');
}

/**
 * Initialize theme from storage or preference
 */
function initTheme() {
  const savedTheme = getStorage('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ========================================
// SCROLL UTILITIES
// ========================================

/**
 * Smooth scroll to element
 * @param {string|Element} target - Target element or selector
 * @param {number} offset - Offset from top
 */
function scrollTo(target, offset = 80) {
  try {
    const element = typeof target === 'string' ? $(target) : target;
    if (element && element.getBoundingClientRect) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  } catch (e) {
    console.warn('scrollTo error:', e);
  }
}

/**
 * Lock body scroll
 */
function lockScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
}

/**
 * Unlock body scroll
 */
function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
}

// ========================================
// COPY TO CLIPBOARD
// ========================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}

// ========================================
// SHARE UTILITIES
// ========================================

/**
 * Share content using Web Share API or fallback
 * @param {Object} data - Share data
 */
async function share(data) {
  if (navigator.share) {
    try {
      await navigator.share(data);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  } else {
    // Fallback: copy link to clipboard
    if (data.url) {
      await copyToClipboard(data.url);
      showToast('Link copied to clipboard');
    }
  }
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, duration = 3000) {
  const toast = $('#toast');
  const toastMessage = $('#toast-message');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100');
    
    setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none');
      toast.classList.remove('opacity-100');
    }, duration);
  }
}

// ========================================
// DEVICE DETECTION
// ========================================

/**
 * Check if device is iOS
 * @returns {boolean}
 */
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if device is Android
 * @returns {boolean}
 */
function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if running inside LINE app
 * @returns {boolean}
 */
function isLINE() {
  return /Line/.test(navigator.userAgent);
}

/**
 * Check if touch device
 * @returns {boolean}
 */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Re-initialize Lucide icons after dynamic content
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
