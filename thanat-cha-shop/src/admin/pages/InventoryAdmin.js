/**
 * THANAT-CHA Admin - Inventory Management Page
 * Track and update stock levels
 */

let adminInventoryData = [];

/**
 * Render Inventory Admin page
 * @param {HTMLElement} container - Container element
 */
async function renderInventoryAdmin(container) {
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  // Load low stock products
  const result = await getLowStockProducts(10);
  adminInventoryData = result.data || [];

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Inventory</h1>
        
        <!-- Low Stock Alert Section -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <p class="text-sm text-gray-500">Products with stock below 5 units are highlighted in red</p>
            </div>
          </div>
          
          ${adminInventoryData.filter(i => i.stock < 5).length > 0 ? `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p class="text-red-700 font-medium">⚠️ ${adminInventoryData.filter(i => i.stock < 5).length} product(s) need immediate restocking</p>
            </div>
          ` : ''}
        </div>
        
        <!-- Inventory Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-semibold text-gray-900">All Inventory</h3>
          </div>
          <div id="inventory-table-container">
            ${renderInventoryTable(adminInventoryData)}
          </div>
        </div>
      </main>
      
      <!-- Update Stock Modal -->
      <div id="stock-modal"></div>
    </div>
  `;
}

/**
 * Render inventory table
 */
function renderInventoryTable(items) {
  if (!items || items.length === 0) {
    return `
      <div class="p-8 text-center text-gray-500">
        <p>No inventory data available</p>
      </div>
    `;
  }

  // Sort by stock level (lowest first)
  const sortedItems = [...items].sort((a, b) => a.stock - b.stock);

  return `
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Size</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        ${sortedItems.map(item => {
          const isLowStock = item.stock < 5;
          const isOutOfStock = item.stock === 0;
          
          return `
            <tr class="${isLowStock ? 'bg-red-50' : ''}">
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">${item.products?.name || 'Unknown'}</div>
                <div class="text-sm text-gray-500">${item.products?.mood || ''}</div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-900">${item.size}</td>
              <td class="px-4 py-3 text-sm text-gray-500">${item.sku || '-'}</td>
              <td class="px-4 py-3">
                <span class="text-lg font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-900'}">
                  ${item.stock}
                </span>
              </td>
              <td class="px-4 py-3">
                ${isOutOfStock ? 
                  '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Out of Stock</span>' :
                  isLowStock ?
                    '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Low Stock</span>' :
                    '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">In Stock</span>'
                }
              </td>
              <td class="px-4 py-3">
                <button 
                  onclick="openUpdateStockModal('${item.id}', ${item.stock}, '${item.size}', '${item.products?.name}')"
                  class="text-amber-600 hover:text-amber-800 font-medium text-sm"
                >
                  Update Stock
                </button>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

/**
 * Open update stock modal
 */
function openUpdateStockModal(variantId, currentStock, size, productName) {
  const modal = document.getElementById('stock-modal');
  modal.innerHTML = renderUpdateStockModal(variantId, currentStock, size, productName);
  openModal('update-stock-modal');
}

/**
 * Render update stock modal
 */
function renderUpdateStockModal(variantId, currentStock, size, productName) {
  const content = `
    <form id="update-stock-form" class="space-y-4">
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500">Product</p>
        <p class="font-medium text-gray-900">${productName}</p>
        <p class="text-sm text-gray-500 mt-1">Size: ${size}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
        <p class="text-2xl font-bold text-gray-900">${currentStock}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">New Stock Level</label>
        <input
          type="number"
          name="stock"
          value="${currentStock}"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
        <p class="mt-1 text-xs text-gray-500">Enter the new total stock quantity</p>
      </div>
      
      <div class="flex gap-2 pt-2">
        <button type="button" onclick="adjustStock(-1)" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">-1</button>
        <button type="button" onclick="adjustStock(-5)" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">-5</button>
        <button type="button" onclick="adjustStock(1)" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+1</button>
        <button type="button" onclick="adjustStock(5)" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+5</button>
        <button type="button" onclick="adjustStock(10)" class="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">+10</button>
      </div>
      
      ${renderFormButtons({ submitText: 'Update Stock' })}
    </form>
  `;

  // Store variant ID for form submission
  window.currentUpdateVariantId = variantId;

  return renderModal({
    id: 'update-stock-modal',
    title: 'Update Stock',
    content,
    size: 'sm'
  });
}

/**
 * Adjust stock value
 */
function adjustStock(amount) {
  const input = document.querySelector('#update-stock-form [name="stock"]');
  const currentValue = parseInt(input.value) || 0;
  input.value = Math.max(0, currentValue + amount);
}

/**
 * Handle stock form submission
 */
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'update-stock-form') {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newStock = parseInt(formData.get('stock'));
    
    if (window.currentUpdateVariantId) {
      const result = await updateVariantStock(window.currentUpdateVariantId, newStock);
      if (!result.error) {
        closeModal('update-stock-modal');
        renderInventoryAdmin(document.getElementById('main-content'));
      }
    }
  }
});
