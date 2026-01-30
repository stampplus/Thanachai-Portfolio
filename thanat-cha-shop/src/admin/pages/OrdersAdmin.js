/**
 * THANAT-CHA Admin - Orders Management Page
 * View and manage customer orders
 */

let adminOrdersData = [];

/**
 * Render Orders Admin page
 * @param {HTMLElement} container - Container element
 */
async function renderOrdersAdmin(container) {
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  // Load orders
  const result = await getAllOrders();
  adminOrdersData = result.data || [];

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Orders</h1>
        
        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
          <input
            type="text"
            id="order-search"
            placeholder="Search order number or customer..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 placeholder-gray-500"
            oninput="filterOrders()"
          />
          <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900" onchange="filterOrders()">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <!-- Orders Table -->
        <div id="orders-table-container">
          ${renderOrdersTable(adminOrdersData)}
        </div>
      </main>
      
      <!-- Order Detail Modal -->
      <div id="order-modal"></div>
    </div>
  `;
}

/**
 * Render orders table
 */
function renderOrdersTable(orders) {
  const columns = [
    { key: 'order_number', label: 'Order #' },
    { key: 'customer_name', label: 'Customer' },
    { 
      key: 'total', 
      label: 'Total',
      render: (v) => formatPriceAdmin(v)
    },
    { 
      key: 'order_status', 
      label: 'Status',
      render: (v) => renderStatusBadge(v)
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (v) => formatDateAdmin(v)
    }
  ];

  return renderTable({
    columns,
    data: orders,
    onRowClick: 'viewOrderDetail'
  });
}

/**
 * Filter orders
 */
function filterOrders() {
  const search = document.getElementById('order-search').value.toLowerCase();
  const status = document.getElementById('status-filter').value;
  
  let filtered = adminOrdersData;
  
  if (search) {
    filtered = filtered.filter(o => 
      o.order_number?.toLowerCase().includes(search) ||
      o.customer_name?.toLowerCase().includes(search) ||
      o.customer_phone?.includes(search)
    );
  }
  
  if (status) {
    filtered = filtered.filter(o => o.order_status === status);
  }
  
  document.getElementById('orders-table-container').innerHTML = renderOrdersTable(filtered);
}

/**
 * View order detail
 */
async function viewOrderDetail(id) {
  const result = await getOrderById(id);
  const order = result.data;
  if (!order) return;
  
  const modal = document.getElementById('order-modal');
  modal.innerHTML = renderOrderDetailModal(order);
  openModal('order-detail-modal');
}

/**
 * Render order detail modal
 */
function renderOrderDetailModal(order) {
  const itemsHtml = order.items?.map(item => `
    <tr class="border-b border-gray-100">
      <td class="py-2">${item.product_name}</td>
      <td class="py-2">${item.variant_size}</td>
      <td class="py-2">${item.quantity}</td>
      <td class="py-2 text-right">${formatPriceAdmin(item.price)}</td>
      <td class="py-2 text-right">${formatPriceAdmin(item.total)}</td>
    </tr>
  `).join('') || '<tr><td colspan="5" class="py-4 text-center text-gray-500">No items</td></tr>';

  const content = `
    <div class="space-y-6">
      <!-- Order Info -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-500">Order Number</p>
          <p class="font-medium">${order.order_number}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Date</p>
          <p class="font-medium">${formatDateAdmin(order.created_at)}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Status</p>
          <div class="mt-1">${renderStatusBadge(order.order_status)}</div>
        </div>
        <div>
          <p class="text-sm text-gray-500">Payment</p>
          <p class="font-medium capitalize">${order.payment_method?.replace('_', ' ') || '-'}</p>
        </div>
      </div>
      
      <!-- Customer Info -->
      <div class="border-t border-gray-200 pt-4">
        <h4 class="font-medium text-gray-900 mb-3">Customer Information</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Name</p>
            <p class="font-medium">${order.customer_name}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Phone</p>
            <div class="flex items-center gap-2">
              <p class="font-medium">${order.customer_phone}</p>
              <button onclick="copyToClipboard('${order.customer_phone}')" class="text-amber-600 hover:text-amber-700" title="Copy phone number">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <p class="text-sm text-gray-500">Address</p>
          <p class="font-medium">${order.customer_address}</p>
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="border-t border-gray-200 pt-4">
        <h4 class="font-medium text-gray-900 mb-3">Order Items</h4>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 text-left">
              <th class="pb-2">Product</th>
              <th class="pb-2">Size</th>
              <th class="pb-2">Qty</th>
              <th class="pb-2 text-right">Price</th>
              <th class="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr class="border-t border-gray-200 font-medium">
              <td colspan="4" class="py-2 text-right">Subtotal:</td>
              <td class="py-2 text-right">${formatPriceAdmin(order.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="4" class="py-1 text-right text-gray-500">Shipping:</td>
              <td class="py-1 text-right text-gray-500">${order.shipping_cost === 0 ? 'FREE' : formatPriceAdmin(order.shipping_cost)}</td>
            </tr>
            <tr class="text-lg font-bold">
              <td colspan="4" class="py-2 text-right">Total:</td>
              <td class="py-2 text-right">${formatPriceAdmin(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <!-- Update Status -->
      <div class="border-t border-gray-200 pt-4">
        <h4 class="font-medium text-gray-900 mb-3">Update Status</h4>
        <div class="flex gap-2">
          ${['pending', 'paid', 'shipped', 'cancelled'].map(status => `
            <button
              onclick="doUpdateOrderStatus('${order.id}', '${status}')"
              class="px-3 py-1 text-sm rounded-full border ${order.order_status === status ? 'bg-amber-100 border-amber-500 text-amber-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}"
              ${order.order_status === status ? 'disabled' : ''}
            >
              ${status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  return renderModal({
    id: 'order-detail-modal',
    title: `Order ${order.order_number}`,
    content,
    size: 'lg'
  });
}

/**
 * Update order status
 */
async function doUpdateOrderStatus(orderId, status) {
  const result = await updateOrderStatus(orderId, status);
  if (!result.error) {
    closeModal('order-detail-modal');
    renderOrdersAdmin(document.getElementById('main-content'));
  }
}
