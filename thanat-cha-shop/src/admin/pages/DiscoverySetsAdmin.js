/**
 * THANAT-CHA Admin - Discovery Sets Management Page
 * CRUD operations for discovery set bundles
 */

let adminDiscoverySetsData = [];
let editingDiscoverySetId = null;

/**
 * Render Discovery Sets Admin page
 * @param {HTMLElement} container - Container element
 */
async function renderDiscoverySetsAdmin(container) {
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  // Load discovery sets
  const result = await window.getAllDiscoverySets();
  adminDiscoverySetsData = result.data || [];

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Discovery Sets</h1>
          <button onclick="openAddDiscoverySetModal()" class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Discovery Set
          </button>
        </div>
        
        <!-- Discovery Sets Table -->
        <div id="discovery-sets-table-container">
          ${renderDiscoverySetsTable(adminDiscoverySetsData)}
        </div>
      </main>
      
      <!-- Discovery Set Modal -->
      <div id="discovery-set-modal"></div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-modal"></div>
    </div>
  `;
}

/**
 * Render discovery sets table
 */
function renderDiscoverySetsTable(discoverySets) {
  const columns = [
    { key: 'name', label: 'Set Name' },
    { 
      key: 'description', 
      label: 'Description',
      render: (v) => `<span class="text-gray-600 max-w-xs truncate block">${v || '-'}</span>`
    },
    { 
      key: 'price', 
      label: 'Price',
      render: (v) => formatPriceAdmin(v)
    },
    { 
      key: 'included_product_ids', 
      label: 'Products',
      render: (v) => v?.length || 0
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (v) => renderStatusBadge(v ? 'active' : 'inactive')
    }
  ];

  const actions = [
    { 
      label: 'Edit', 
      onClick: editDiscoverySet,
      className: 'text-blue-600 hover:text-blue-800'
    },
    { 
      label: 'Delete', 
      onClick: confirmDeleteDiscoverySet,
      className: 'text-red-600 hover:text-red-800'
    }
  ];

  return renderTable({
    columns,
    data: discoverySets,
    onRowClick: 'editDiscoverySet',
    actions
  });
}

/**
 * Open add discovery set modal
 */
function openAddDiscoverySetModal() {
  editingDiscoverySetId = null;
  const modal = document.getElementById('discovery-set-modal');
  modal.innerHTML = renderDiscoverySetFormModal();
  openModal('discovery-set-form-modal');
}

/**
 * Edit discovery set
 */
function editDiscoverySet(id) {
  editingDiscoverySetId = id;
  const discoverySet = adminDiscoverySetsData.find(d => d.id === id);
  if (!discoverySet) return;
  
  const modal = document.getElementById('discovery-set-modal');
  modal.innerHTML = renderDiscoverySetFormModal(discoverySet);
  openModal('discovery-set-form-modal');
}

/**
 * Render discovery set form modal
 */
function renderDiscoverySetFormModal(discoverySet = null) {
  const isEdit = !!discoverySet;
  
  const content = `
    <form id="discovery-set-form" class="space-y-4">
      ${renderInput({
        name: 'name',
        label: 'Set Name',
        value: discoverySet?.name || '',
        required: true
      })}
      
      ${renderTextarea({
        name: 'description',
        label: 'Description',
        value: discoverySet?.description || '',
        required: true
      })}
      
      ${renderNumberInput({
        name: 'price',
        label: 'Price (satang)',
        value: discoverySet?.price || 59900,
        required: true,
        helpText: 'e.g., 59900 for ฿599'
      })}
      
      ${renderTextarea({
        name: 'included_product_ids',
        label: 'Included Product IDs (comma-separated)',
        value: discoverySet?.included_product_ids?.join(', ') || '',
        required: true,
        helpText: 'Enter product UUIDs separated by commas'
      })}
      
      <div class="grid grid-cols-2 gap-4">
        ${renderCheckbox({
          name: 'is_active',
          label: 'Active',
          checked: discoverySet?.is_active !== false
        })}
      </div>
      
      ${renderFormButtons({ submitText: isEdit ? 'Update Discovery Set' : 'Create Discovery Set' })}
    </form>
  `;

  return renderModal({
    id: 'discovery-set-form-modal',
    title: isEdit ? 'Edit Discovery Set' : 'Add New Discovery Set',
    content,
    size: 'lg'
  });
}

/**
 * Handle discovery set form submit
 */
async function handleDiscoverySetFormSubmit(e) {
  e.preventDefault();
  
  const formData = getFormData(e.target);
  
  // Parse product IDs
  const productIds = formData.included_product_ids
    .split(',')
    .map(id => id.trim())
    .filter(id => id);
  
  const discoverySetData = {
    ...formData,
    included_product_ids: productIds
  };
  
  let result;
  if (editingDiscoverySetId) {
    result = await window.updateDiscoverySet(editingDiscoverySetId, discoverySetData);
  } else {
    result = await window.createDiscoverySet(discoverySetData);
  }
  
  if (result.error) {
    alert('Error saving discovery set: ' + result.error);
    return;
  }
  
  closeModal('discovery-set-form-modal');
  
  // Reload discovery sets and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllDiscoverySets();
  adminDiscoverySetsData = refreshResult.data || [];
  renderDiscoverySetsAdmin(container);
}

// Attach event listener after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'discovery-set-form') {
      handleDiscoverySetFormSubmit(e);
    }
  });
});

/**
 * Confirm delete discovery set
 */
function confirmDeleteDiscoverySet(id) {
  const modal = document.getElementById('delete-modal');
  modal.innerHTML = renderModal({
    id: 'delete-confirm-modal',
    title: 'Confirm Delete',
    content: `
      <p class="text-gray-600 mb-4">Are you sure you want to delete this discovery set? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button onclick="closeModal('delete-confirm-modal')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button onclick="doDeleteDiscoverySet('${id}')" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
          Delete
        </button>
      </div>
    `,
    size: 'md'
  });
  openModal('delete-confirm-modal');
}

/**
 * Delete discovery set
 */
async function doDeleteDiscoverySet(id) {
  const result = await window.deleteDiscoverySet(id);
  
  if (result.error) {
    alert('Error deleting discovery set: ' + result.error);
    return;
  }
  
  closeModal('delete-confirm-modal');
  
  // Reload and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllDiscoverySets();
  adminDiscoverySetsData = refreshResult.data || [];
  renderDiscoverySetsAdmin(container);
}
