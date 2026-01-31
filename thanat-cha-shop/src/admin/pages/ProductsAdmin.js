/**
 * THANAT-CHA Admin - Products Management Page
 * CRUD operations for products with image upload
 */

let adminProductsData = [];
let editingProductId = null;
let pendingImages = []; // Store selected files before upload

/**
 * Render Products Admin page
 * @param {HTMLElement} container - Container element
 */
async function renderProductsAdmin(container) {
  console.log('[DEBUG] renderProductsAdmin called');

  if (!checkAdminAuth()) {
    console.log('[DEBUG] Not authenticated, showing login');
    renderAdminLogin(container);
    return;
  }

  console.log('[DEBUG] Authenticated, loading products...');

  // Load products from Supabase
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DEBUG] Error fetching products:', error);
    adminProductsData = [];
  } else {
    adminProductsData = data || [];
    console.log('Products loaded:', adminProductsData.length);
  }

  console.log('[DEBUG] adminProductsData set to:', adminProductsData);

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Products</h1>
          <button onclick="openAddProductModal()" class="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Product
          </button>
        </div>
        
        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
          <input
            type="text"
            id="product-search"
            placeholder="Search products..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-400"
            oninput="filterProducts()"
          />
          <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900" onchange="filterProducts()">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <!-- Products Table -->
        <div id="products-table-container">
          ${renderProductsTable(adminProductsData)}
        </div>
      </main>
      
      <!-- Product Modal -->
      <div id="product-modal"></div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-modal"></div>
    </div>
  `;
}

/**
 * Render products table
 */
function renderProductsTable(products) {
  const columns = [
    { key: 'name', label: 'Product Name' },
    { key: 'mood', label: 'Mood', render: (v) => `<span class="capitalize">${v}</span>` },
    { 
      key: 'variants', 
      label: 'Price Range',
      render: (variants) => {
        if (!variants || variants.length === 0) return '-';
        const prices = variants.map(v => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? formatPriceAdmin(min) : `${formatPriceAdmin(min)} - ${formatPriceAdmin(max)}`;
      }
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (v) => renderStatusBadge(v ? 'active' : 'inactive')
    },
    { 
      key: 'is_bestseller', 
      label: 'Bestseller',
      render: (v) => v ? '<span class="text-amber-600">★</span>' : '-'
    }
  ];

  const actions = [
    { 
      label: 'Edit', 
      onClick: editProduct,
      className: 'text-blue-600 hover:text-blue-800'
    },
    { 
      label: 'Delete', 
      onClick: confirmDeleteProduct,
      className: 'text-red-600 hover:text-red-800'
    }
  ];

  return renderTable({
    columns,
    data: products,
    onRowClick: 'editProduct',
    actions
  });
}

/**
 * Filter products
 */
function filterProducts() {
  const search = document.getElementById('product-search').value.toLowerCase();
  const status = document.getElementById('status-filter').value;
  
  let filtered = adminProductsData;
  
  if (search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.mood.toLowerCase().includes(search)
    );
  }
  
  if (status) {
    const isActive = status === 'active';
    filtered = filtered.filter(p => p.is_active === isActive);
  }
  
  document.getElementById('products-table-container').innerHTML = renderProductsTable(filtered);
}

/**
 * Open add product modal
 */
function openAddProductModal() {
  editingProductId = null;
  pendingImages = [];
  const modal = document.getElementById('product-modal');
  modal.innerHTML = renderProductFormModal();
  openModal('product-form-modal');
}

/**
 * Edit product
 */
function editProduct(id) {
  editingProductId = id;
  const product = adminProductsData.find(p => p.id === id);
  if (!product) return;
  
  pendingImages = [];
  const modal = document.getElementById('product-modal');
  modal.innerHTML = renderProductFormModal(product);
  openModal('product-form-modal');
}

/**
 * Render product form modal
 */
function renderProductFormModal(product = null) {
  const isEdit = !!product;
  const moods = ['calm', 'warm', 'wild', 'fresh', 'deep'];
  
  const moodOptions = moods.map(m => ({
    value: m,
    label: m.charAt(0).toUpperCase() + m.slice(1)
  }));

  const content = `
    <form id="product-form" class="space-y-4">
      ${renderInput({
        name: 'name',
        label: 'Product Name',
        value: product?.name || '',
        required: true
      })}
      
      ${renderInput({
        name: 'slug',
        label: 'Slug (URL)',
        value: product?.slug || '',
        required: true,
        helpText: 'e.g., after-rain'
      })}
      
      ${renderInput({
        name: 'tagline',
        label: 'Tagline',
        value: product?.tagline || '',
        required: true
      })}
      
      ${renderTextarea({
        name: 'description',
        label: 'Description',
        value: product?.description || '',
        required: true
      })}
      
      ${renderSelect({
        name: 'mood',
        label: 'Mood',
        value: product?.mood || 'calm',
        options: moodOptions,
        required: true
      })}
      
      <div class="grid grid-cols-2 gap-4">
        ${renderCheckbox({
          name: 'is_active',
          label: 'Active',
          checked: product?.is_active !== false
        })}
        
        ${renderCheckbox({
          name: 'is_bestseller',
          label: 'Bestseller',
          checked: product?.is_bestseller || false
        })}
      </div>
      
      <!-- Images Upload -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <h4 class="font-medium text-gray-900 mb-3">Product Images</h4>
        
        <!-- Existing Images -->
        ${product?.images && product.images.length > 0 ? `
          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Current Images:</p>
            <div class="flex gap-2 flex-wrap" id="existing-images">
              ${product.images.map((img, idx) => `
                <div class="relative group">
                  <img src="${img}" alt="Product" class="w-20 h-20 object-cover rounded-lg border border-gray-200">
                  <button type="button" onclick="removeExistingImage(${idx})" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
                </div>
              `).join('')}
            </div>
            <input type="hidden" name="existing_images" value='${JSON.stringify(product.images)}'>
          </div>
        ` : ''}
        
        <!-- New Images Preview -->
        <div id="new-images-preview" class="flex gap-2 flex-wrap mb-3"></div>
        
        <!-- File Input -->
        <div class="relative">
          <input
            type="file"
            id="product-images"
            name="product_images"
            accept="image/*"
            multiple
            class="hidden"
            onchange="handleImageSelect(event)"
          />
          <label for="product-images" class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Select Images
          </label>
          <span class="ml-3 text-sm text-gray-500">Max 5 images</span>
        </div>
      </div>
      
      <!-- Variants -->
      <div class="border-t border-gray-200 pt-4 mt-4">
        <h4 class="font-medium text-gray-900 mb-3">Variants (Size & Price)</h4>
        <div id="variants-container">
          ${renderVariantsInputs(product?.variants || [{ size: '10ml', price: 49000, stock: 10 }])}
        </div>
        <button type="button" onclick="addVariantInput()" class="mt-2 text-sm text-amber-600 hover:text-amber-700">
          + Add Variant
        </button>
      </div>
      
      ${renderFormButtons({ submitText: isEdit ? 'Update Product' : 'Create Product' })}
    </form>
  `;

  return renderModal({
    id: 'product-form-modal',
    title: isEdit ? 'Edit Product' : 'Add New Product',
    content,
    size: 'lg'
  });
}

/**
 * Handle image file selection
 */
function handleImageSelect(event) {
  const files = Array.from(event.target.files);
  const previewContainer = document.getElementById('new-images-preview');
  
  // Add to pending images
  files.forEach(file => {
    if (pendingImages.length < 5) {
      pendingImages.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'relative group';
        div.innerHTML = `
          <img src="${e.target.result}" alt="Preview" class="w-20 h-20 object-cover rounded-lg border border-gray-200">
          <button type="button" onclick="removePendingImage('${file.name}')" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
        `;
        previewContainer.appendChild(div);
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Clear input so same files can be selected again if removed
  event.target.value = '';
}

/**
 * Remove a pending image
 */
function removePendingImage(fileName) {
  const index = pendingImages.findIndex(f => f.name === fileName);
  if (index > -1) {
    pendingImages.splice(index, 1);
    
    // Refresh preview
    const previewContainer = document.getElementById('new-images-preview');
    previewContainer.innerHTML = '';
    pendingImages.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const div = document.createElement('div');
        div.className = 'relative group';
        div.innerHTML = `
          <img src="${e.target.result}" alt="Preview" class="w-20 h-20 object-cover rounded-lg border border-gray-200">
          <button type="button" onclick="removePendingImage('${file.name}')" class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">×</button>
        `;
        previewContainer.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Remove existing image
 */
function removeExistingImage(index) {
  const existingInput = document.querySelector('input[name="existing_images"]');
  if (existingInput) {
    const images = JSON.parse(existingInput.value);
    images.splice(index, 1);
    existingInput.value = JSON.stringify(images);
    
    // Remove from DOM
    const container = document.getElementById('existing-images');
    if (container && container.children[index]) {
      container.children[index].remove();
    }
  }
}

/**
 * Render variant inputs
 */
function renderVariantsInputs(variants) {
  return variants.map((v, i) => `
    <div class="flex gap-3 mb-3 variant-row">
      <input
        type="text"
        name="variant_size[]"
        value="${v.size}"
        placeholder="Size (e.g., 10ml)"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      <input
        type="number"
        name="variant_price[]"
        value="${v.price}"
        placeholder="Price (satang)"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      <input
        type="number"
        name="variant_stock[]"
        value="${v.stock || 10}"
        placeholder="Stock"
        class="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
        required
      />
      ${variants.length > 1 ? `
        <button type="button" onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      ` : ''}
    </div>
  `).join('');
}

/**
 * Add variant input
 */
function addVariantInput() {
  const container = document.getElementById('variants-container');
  const div = document.createElement('div');
  div.className = 'flex gap-3 mb-3 variant-row';
  div.innerHTML = `
    <input
      type="text"
      name="variant_size[]"
      placeholder="Size (e.g., 10ml)"
      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
      required
    />
    <input
      type="number"
      name="variant_price[]"
      placeholder="Price (satang)"
      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
      required
    />
    <input
      type="number"
      name="variant_stock[]"
      placeholder="Stock"
      class="w-24 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400"
      required
    />
    <button type="button" onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `;
  container.appendChild(div);
}

/**
 * Upload images to Supabase Storage
 */
async function uploadProductImages(files, productSlug) {
  console.log('[DEBUG] uploadProductImages called, files:', files.length);
  
  // Always use window.getSupabase() to ensure client is properly initialized
  const client = window.getSupabase();
  console.log('[DEBUG] window.getSupabase() returned:', client ? 'client' : 'null');
  
  if (!client) {
    console.error('[DEBUG] Failed to get Supabase client');
    return [];
  }
  
  const uploadedUrls = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productSlug}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `products/${fileName}`;
    
    const { data, error } = await client
      .storage
      .from('products')
      .upload(filePath, file);
    
    if (error) {
      console.error('Upload error:', error);
      continue;
    }
    
    // Get public URL
    const { data: { publicUrl } } = client
      .storage
      .from('products')
      .getPublicUrl(filePath);
    
    uploadedUrls.push(publicUrl);
  }
  
  return uploadedUrls;
}

/**
 * Handle product form submit
 */
async function handleProductFormSubmit(e) {
  e.preventDefault();
  
  const formData = getFormData(e.target);
  
  // Build variants array
  const sizes = e.target.querySelectorAll('[name="variant_size[]"]');
  const prices = e.target.querySelectorAll('[name="variant_price[]"]');
  const stocks = e.target.querySelectorAll('[name="variant_stock[]"]');
  
  const variants = [];
  for (let i = 0; i < sizes.length; i++) {
    variants.push({
      size: sizes[i].value,
      price: parseInt(prices[i].value),
      stock: parseInt(stocks[i].value)
    });
  }
  
  // Get existing images
  let existingImages = [];
  const existingInput = e.target.querySelector('input[name="existing_images"]');
  if (existingInput) {
    try {
      existingImages = JSON.parse(existingInput.value);
    } catch (e) {
      console.error('Error parsing existing images:', e);
    }
  }
  
  // Upload new images
  let newImageUrls = [];
  if (pendingImages.length > 0) {
    newImageUrls = await uploadProductImages(pendingImages, formData.slug);
  }
  
  // Combine all images
  const allImages = [...existingImages, ...newImageUrls];
  
  // Remove product_images field from formData (it's a File object, not for database)
  const { product_images, variant_size, variant_price, variant_stock, ...cleanFormData } = formData;
  
  const productData = {
    ...cleanFormData,
    images: allImages,
    variants
  };
  
  let result;
  if (editingProductId) {
    result = await window.updateProduct(editingProductId, productData);
    console.log('Update product result:', result);
  } else {
    result = await window.createProduct(productData);
    console.log('Create product result:', result);
  }
  
  if (result.error) {
    console.error('Product save error:', result.error);
    alert('Error saving product: ' + result.error);
    return;
  }
  
  // Clear pending images
  pendingImages = [];
  
  closeModal('product-form-modal');
  
  // Reload products and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllProducts();
  adminProductsData = refreshResult.data || [];
  
  // Re-render the page
  renderProductsAdmin(container);
}

// Attach event listener after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'product-form') {
      handleProductFormSubmit(e);
    }
  });
});

/**
 * Confirm delete product
 */
function confirmDeleteProduct(id) {
  const modal = document.getElementById('delete-modal');
  modal.innerHTML = renderModal({
    id: 'delete-confirm-modal',
    title: 'Confirm Delete',
    content: `
      <p class="text-gray-600 mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button onclick="closeModal('delete-confirm-modal')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button onclick="doDeleteProduct('${id}')" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
          Delete
        </button>
      </div>
    `,
    size: 'md'
  });
  openModal('delete-confirm-modal');
}

/**
 * Delete product
 */
async function doDeleteProduct(id) {
  const result = await window.deleteProduct(id);
  
  if (result.error) {
    alert('Error deleting product: ' + result.error);
    return;
  }
  
  closeModal('delete-confirm-modal');
  
  // Reload and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllProducts();
  adminProductsData = refreshResult.data || [];
  renderProductsAdmin(container);
}

/**
 * Format price for admin display
 */
function formatPriceAdmin(satang) {
  const baht = satang / 100;
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0
  }).format(baht);
}

/**
 * Render status badge
 */
function renderStatusBadge(status) {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  const color = colors[status] || colors.inactive;
  
  return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${status}</span>`;
}
