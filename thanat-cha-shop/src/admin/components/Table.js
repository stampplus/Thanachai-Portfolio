/**
 * THANAT-CHA Admin - Table Component
 * Simple reusable table for admin pages
 */

/**
 * Render a data table
 * @param {Object} options - Table options
 * @param {Array} options.columns - Column definitions [{ key, label, render?, width? }]
 * @param {Array} options.data - Row data
 * @param {Function} options.onRowClick - Optional row click handler
 * @param {Array} options.actions - Optional action buttons [{ label, onClick, className? }]
 * @returns {string} HTML string
 */
function renderTable({ columns, data, onRowClick = null, actions = [] }) {
  console.log('[DEBUG] renderTable called with data:', data);
  
  if (!data || data.length === 0) {
    console.log('[DEBUG] No data to render in table');
    return `
      <div class="p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200">
        <p>No data available</p>
      </div>
    `;
  }
  
  console.log(`[DEBUG] Rendering table with ${data.length} rows`);

  const headerHtml = columns.map(col => `
    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.width ? col.width : ''}">
      ${col.label}
    </th>
  `).join('');

  const rowsHtml = data.map((row, index) => {
    const cellsHtml = columns.map(col => {
      const value = col.key.includes('.') 
        ? col.key.split('.').reduce((obj, key) => obj?.[key], row)
        : row[col.key];
      
      const cellContent = col.render ? col.render(value, row) : (value ?? '-');
      
      return `<td class="px-4 py-3 text-sm text-gray-900">${cellContent}</td>`;
    }).join('');

    const actionHtml = actions.length > 0 ? `
      <td class="px-4 py-3 text-sm">
        <div class="flex items-center gap-2">
          ${actions.map((action, actionIndex) => `
            <button 
              data-action="${actionIndex}"
              data-row-id="${row.id}"
              class="table-action-btn ${action.className || 'text-blue-600 hover:text-blue-800'}"
            >
              ${action.label}
            </button>
          `).join('')}
        </div>
      </td>
    ` : '';

    const rowClass = onRowClick 
      ? 'cursor-pointer hover:bg-gray-50' 
      : '';
    
    const rowClickAttr = onRowClick 
      ? `onclick="${onRowClick}('${row.id}')"` 
      : '';

    return `
      <tr class="border-b border-gray-100 ${rowClass}" ${rowClickAttr}>
        ${cellsHtml}
        ${actionHtml}
      </tr>
    `;
  }).join('');

  // Generate unique table ID for action handling
  const tableId = 'table_' + Math.random().toString(36).substr(2, 9);
  
  // Register actions for this table
  if (actions.length > 0) {
    registerTableActions(tableId, actions);
  }
  
  return `
    <div class="overflow-x-auto bg-white rounded-lg border border-gray-200" data-table-id="${tableId}">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>${headerHtml}</tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Format price for display
 * @param {number} price - Price in satang
 * @returns {string}
 */
function formatPriceAdmin(price) {
  if (!price && price !== 0) return '-';
  const baht = Math.floor(price / 100);
  return `฿${baht.toLocaleString('th-TH')}`;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string}
 */
function formatDateAdmin(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Render status badge
 * @param {string} status - Status value
 * @returns {string}
 */
function renderStatusBadge(status) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';
  
  return `
    <span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">
      ${status}
    </span>
  `;
}

/**
 * Render stock indicator
 * @param {number} stock - Stock quantity
 * @returns {string}
 */
function renderStockIndicator(stock) {
  if (stock === null || stock === undefined) return '-';
  
  const colorClass = stock < 5 
    ? 'text-red-600 font-semibold' 
    : stock < 10 
      ? 'text-yellow-600' 
      : 'text-green-600';
  
  return `<span class="${colorClass}">${stock}</span>`;
}

// Store action handlers globally for table actions
window.tableActionHandlers = {};

/**
 * Register table action handlers
 * @param {string} tableId - Unique table identifier
 * @param {Array} actions - Action definitions with onClick functions
 */
function registerTableActions(tableId, actions) {
  window.tableActionHandlers[tableId] = actions;
}

// Global click handler for table action buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.table-action-btn');
  if (!btn) return;
  
  const actionIndex = parseInt(btn.dataset.action);
  const rowId = btn.dataset.rowId;
  
  // Find the actions from the parent table context
  // This is a simplified approach - in practice, you'd need to track which table
  const tableContainer = btn.closest('[data-table-id]');
  if (tableContainer) {
    const tableId = tableContainer.dataset.tableId;
    const actions = window.tableActionHandlers[tableId];
    if (actions && actions[actionIndex]) {
      e.stopPropagation();
      actions[actionIndex].onClick(rowId);
    }
  }
});
