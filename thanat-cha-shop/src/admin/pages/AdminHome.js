
/**
 * THANAT-CHA Admin - Home Page
 * Dashboard overview for admin
 */

/**
 * Render Admin Home page
 * @param {HTMLElement} container - Container element
 */
async function renderAdminHome(container) {
  // Check auth
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  console.log('[DEBUG] AdminHome: Auth passed, loading dashboard data...');

  // Load dashboard data
  let products = [];
  let orders = [];
  let lowStock = [];

  try {
    const productsResult = await getAllProducts();
    console.log('[DEBUG] AdminHome: Products result:', productsResult);
    products = productsResult.data || [];
  } catch (e) {
    console.error('[DEBUG] AdminHome: Error loading products:', e);
  }

  try {
    const ordersResult = await getAllOrders();
    console.log('[DEBUG] AdminHome: Orders result:', ordersResult);
    orders = ordersResult.data || [];
  } catch (e) {
    console.error('[DEBUG] AdminHome: Error loading orders:', e);
  }

  try {
    const lowStockResult = await getLowStockProducts(5);
    console.log('[DEBUG] AdminHome: Low stock result:', lowStockResult);
    lowStock = lowStockResult.data || [];
  } catch (e) {
    console.error('[DEBUG] AdminHome: Error loading low stock:', e);
  }

  const activeProducts = products?.filter(p => p.is_active).length || 0;
  const totalProducts = products?.length || 0;
  const pendingOrders = orders?.filter(o => o.order_status === 'pending').length || 0;
  const totalOrders = orders?.length || 0;

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          ${renderStatCard('Total Products', totalProducts, 'package', 'bg-blue-500')}
          ${renderStatCard('Active Products', activeProducts, 'check-circle', 'bg-green-500')}
          ${renderStatCard('Pending Orders', pendingOrders, 'shopping-bag', 'bg-yellow-500')}
          ${renderStatCard('Total Orders', totalOrders, 'clipboard-list', 'bg-purple-500')}
        </div>
        
        <!-- Low Stock Alert -->
        ${lowStock?.length > 0 ? `
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <h2 class="text-lg font-semibold text-red-800">Low Stock Alert</h2>
            </div>
            <p class="text-red-700 mb-4">${lowStock.length} product(s) have stock below 5 units</p>
            <a href="/admin/inventory" class="inline-flex items-center text-red-700 font-medium hover:underline">
              View Inventory
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        ` : ''}
        
        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/admin/products" class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Manage Products</h3>
                <p class="text-sm text-gray-500">Add, edit, or remove products</p>
              </div>
            </a>
            
            <a href="/admin/orders" class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">View Orders</h3>
                <p class="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </a>
            
            <a href="/admin/inventory" class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Inventory</h3>
                <p class="text-sm text-gray-500">Check stock levels</p>
              </div>
            </a>
            
            <a href="/admin/analytics" class="flex items-center p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Analytics</h3>
                <p class="text-sm text-gray-500">View sales data</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  `;
}

/**
 * Render stat card
 */
function renderStatCard(title, value, iconName, bgColor) {
  const icons = {
    package: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>',
    'check-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    'shopping-bag': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>',
    'clipboard-list': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>'
  };

  return `
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mr-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icons[iconName] || icons.package}
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-500">${title}</p>
          <p class="text-2xl font-bold text-gray-900">${value}</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render admin header
 */
function renderAdminHeader() {
  return `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <a href="/admin" class="text-xl font-bold text-gray-900">THANAT-CHA Admin</a>
            <nav class="ml-8 flex space-x-4">
              <a href="/admin" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              <a href="/admin/products" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Products</a>
              <a href="/admin/orders" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Orders</a>
              <a href="/admin/inventory" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Inventory</a>
              <a href="/admin/analytics" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Analytics</a>
              <a href="/admin/reviews" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Reviews</a>
              <a href="/admin/discovery-sets" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Discovery Sets</a>
            </nav>
          </div>
          <div class="flex items-center gap-4">
            <a href="/" class="text-gray-600 hover:text-gray-900 text-sm">View Shop</a>
            <button onclick="logoutAdmin()" class="text-gray-600 hover:text-gray-900 text-sm">Logout</button>
          </div>
        </div>
      </div>
    </header>
  `;
}

/**
 * Render admin login
 */
function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
        <form id="admin-login-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter admin password"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700"
          >
            Login
          </button>
        </form>
        <p id="login-error" class="mt-4 text-red-600 text-sm text-center hidden">Invalid password</p>
      </div>
    </div>
  `;

  const form = container.querySelector('#admin-login-form');
  const errorEl = container.querySelector('#login-error');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = form.querySelector('[name="password"]').value;
    
    console.log('[DEBUG] Login form submitted');
    
    if (password === ADMIN_PASSWORD) {
      console.log('[DEBUG] Password correct, setting auth');
      sessionStorage.setItem('admin_auth', 'true');
      errorEl.classList.add('hidden');
      
      // Navigate to the current path after login
      const currentPath = window.location.pathname;
      console.log('[DEBUG] Current path:', currentPath);
      
      if (currentPath !== '/admin') {
        console.log('[DEBUG] Reloading to:', currentPath);
        window.location.href = currentPath;
      } else {
        console.log('[DEBUG] Rendering AdminHome');
        renderAdminHome(container);
      }
    } else {
      console.log('[DEBUG] Password incorrect');
      errorEl.classList.remove('hidden');
    }
  });
}

// Admin password (simple gate)
const ADMIN_PASSWORD = 'thanatcha2025';

/**
 * Check admin auth
 */
function checkAdminAuth() {
  return sessionStorage.getItem('admin_auth') === 'true';
}

/**
 * Logout admin
 */
function logoutAdmin() {
  sessionStorage.removeItem('admin_auth');
  window.location.href = '/admin';
}
