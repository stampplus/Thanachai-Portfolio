/**
 * THANAT-CHA Admin - Main Entry Point
 * Admin dashboard initialization
 */

// ========================================
// ADMIN ROUTER
// ========================================

const adminRoutes = {
  '/admin': {
    title: 'Admin Dashboard | THANAT-CHA',
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
  '/admin/reviews': {
    title: 'Reviews | THANAT-CHA Admin',
    render: renderReviewsAdmin,
  },
  '/admin/discovery-sets': {
    title: 'Discovery Sets | THANAT-CHA Admin',
    render: renderDiscoverySetsAdmin,
  },
};

/**
 * Initialize admin router
 */
function initAdminRouter() {
  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    handleAdminRoute(window.location.pathname);
  });
  
  // Handle link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="/admin"]');
    if (link) {
      e.preventDefault();
      const href = link.getAttribute('href');
      navigateToAdmin(href);
    }
  });
  
  // Handle initial route
  handleAdminRoute(window.location.pathname);
}

/**
 * Navigate to admin route
 */
function navigateToAdmin(path) {
  const url = new URL(window.location.href);
  url.pathname = path;
  window.history.pushState({}, '', url);
  handleAdminRoute(path);
}

/**
 * Handle admin route
 */
function handleAdminRoute(path) {
  // Check auth for all admin routes
  const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
  
  const route = adminRoutes[path];
  
  if (!route) {
    // Check if it's a sub-route or redirect to admin home
    if (path.startsWith('/admin/')) {
      navigateToAdmin('/admin');
    }
    return;
  }
  
  // Update page title
  document.title = route.title;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  // Render page
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    route.render(mainContent);
  }
}

// ========================================
// ADMIN INITIALIZATION
// ========================================

/**
 * Initialize admin dashboard
 */
function initAdmin() {
  // Only initialize on admin routes
  if (!window.location.pathname.startsWith('/admin')) {
    return;
  }
  
  // Initialize Supabase
  initSupabase();
  
  // Initialize router
  initAdminRouter();
  
  console.log('🔧 THANAT-CHA Admin ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
