/**
 * Analytics Admin Page
 * Simple numbers-only dashboard showing daily orders and revenue
 */

function renderAnalyticsAdmin(container) {
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p class="text-gray-500 mb-6">Daily orders and revenue</p>

      <!-- Date Range Selector -->
      <div class="date-range-selector mb-6">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input type="date" id="date-from" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900">
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input type="date" id="date-to" class="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900">
          </div>
          <div class="flex items-end">
            <button id="apply-date-range" class="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition">
              Apply
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Date Buttons -->
      <div class="quick-dates mb-6">
        <button data-days="7" class="quick-date-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Last 7 days</button>
        <button data-days="30" class="quick-date-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Last 30 days</button>
        <button data-days="90" class="quick-date-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Last 90 days</button>
        <button data-days="365" class="quick-date-btn px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">This year</button>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="summary-card bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Total Orders</div>
          <div class="text-3xl font-bold text-gray-900" id="total-orders">-</div>
        </div>
        <div class="summary-card bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Total Revenue</div>
          <div class="text-3xl font-bold text-green-600" id="total-revenue">-</div>
        </div>
        <div class="summary-card bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Average Order Value</div>
          <div class="text-3xl font-bold text-gray-900" id="avg-order-value">-</div>
        </div>
        <div class="summary-card bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-sm text-gray-500 mb-1">Paid Orders</div>
          <div class="text-3xl font-bold text-blue-600" id="paid-orders">-</div>
        </div>
      </div>

      <!-- Daily Breakdown Table -->
      <div class="daily-breakdown bg-white rounded-lg border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">Daily Breakdown</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Orders</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Revenue</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Avg Order</th>
              </tr>
            </thead>
            <tbody id="daily-breakdown-body">
              <tr>
                <td colspan="4" class="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Top Products -->
      <div class="top-products bg-white rounded-lg border border-gray-200 mt-6">
        <h2 class="text-lg font-semibold text-gray-900 p-4 border-b border-gray-200">Top Products</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Units Sold</th>
                <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">Revenue</th>
              </tr>
            </thead>
            <tbody id="top-products-body">
              <tr>
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </div>
  `;

  // Set default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  document.getElementById('date-to').value = today.toISOString().split('T')[0];
  document.getElementById('date-from').value = thirtyDaysAgo.toISOString().split('T')[0];

  // Load initial data
  loadAnalyticsData();

  // Event listeners
  document.getElementById('apply-date-range').addEventListener('click', loadAnalyticsData);

  document.querySelectorAll('.quick-date-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const days = parseInt(btn.dataset.days);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      document.getElementById('date-to').value = endDate.toISOString().split('T')[0];
      document.getElementById('date-from').value = startDate.toISOString().split('T')[0];

      loadAnalyticsData();
    });
  });
}

async function loadAnalyticsData() {
  const dateFrom = document.getElementById('date-from').value;
  const dateTo = document.getElementById('date-to').value;

  if (!dateFrom || !dateTo) {
    alert('Please select both dates');
    return;
  }

  // Load analytics data
  const result = await window.getAnalyticsData(dateFrom, dateTo);

  if (result.error) {
    console.error('Analytics error:', result.error);
    alert('Error loading analytics: ' + result.error);
    return;
  }

  const data = result.data;

  // Update summary cards
  document.getElementById('total-orders').textContent = data.summary.totalOrders;
  document.getElementById('total-revenue').textContent = formatCurrency(data.summary.totalRevenue);
  document.getElementById('avg-order-value').textContent = formatCurrency(data.summary.avgOrderValue);
  document.getElementById('paid-orders').textContent = data.summary.paidOrders;

  // Update daily breakdown table
  renderDailyBreakdown(data.dailyBreakdown);

  // Update top products table
  renderTopProducts(data.topProducts);
}

function renderDailyBreakdown(dailyData) {
  const tbody = document.getElementById('daily-breakdown-body');

  if (!dailyData || dailyData.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-gray-500">No data for this period</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = dailyData.map(day => `
    <tr class="border-b border-gray-100 hover:bg-gray-50">
      <td class="px-4 py-3 text-sm text-gray-900">${formatDate(day.date)}</td>
      <td class="px-4 py-3 text-sm text-gray-900 text-right">${day.orders}</td>
      <td class="px-4 py-3 text-sm text-green-600 text-right">${formatCurrency(day.revenue)}</td>
      <td class="px-4 py-3 text-sm text-gray-900 text-right">${formatCurrency(day.avgOrder)}</td>
    </tr>
  `).join('');
}

function renderTopProducts(products) {
  const tbody = document.getElementById('top-products-body');

  if (!products || products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-4 py-8 text-center text-gray-500">No product data</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = products.map((product, index) => `
    <tr class="border-b border-gray-100 hover:bg-gray-50">
      <td class="px-4 py-3 text-sm text-gray-900">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs mr-2">${index + 1}</span>
        ${product.product_name}
      </td>
      <td class="px-4 py-3 text-sm text-gray-900 text-right">${product.units_sold}</td>
      <td class="px-4 py-3 text-sm text-green-600 text-right">${formatCurrency(product.revenue)}</td>
    </tr>
  `).join('');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(amount);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  });
}


