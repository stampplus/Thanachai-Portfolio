/**
 * THANAT-CHA Admin - Reviews Management Page
 * Manage customer reviews (approve/delete)
 */

let adminReviewsData = [];

/**
 * Render Reviews Admin page
 * @param {HTMLElement} container - Container element
 */
async function renderReviewsAdmin(container) {
  if (!checkAdminAuth()) {
    renderAdminLogin(container);
    return;
  }

  // Load reviews
  const result = await window.getAllReviews();
  adminReviewsData = result.data || [];

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${renderAdminHeader()}
      
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Reviews</h1>
        </div>
        
        <!-- Filters -->
        <div class="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
          <select id="status-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900" onchange="filterReviews()">
            <option value="">All Reviews</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        
        <!-- Reviews Table -->
        <div id="reviews-table-container">
          ${renderReviewsTable(adminReviewsData)}
        </div>
      </main>
      
      <!-- Review Detail Modal -->
      <div id="review-modal"></div>
      
      <!-- Delete Confirmation Modal -->
      <div id="delete-modal"></div>
    </div>
  `;
}

/**
 * Render reviews table
 */
function renderReviewsTable(reviews) {
  const columns = [
    { 
      key: 'customer_name', 
      label: 'Customer',
      render: (v) => `<span class="font-medium">${v}</span>`
    },
    { 
      key: 'products', 
      label: 'Product',
      render: (products) => products?.name || '-'
    },
    { 
      key: 'rating', 
      label: 'Rating',
      render: (v) => renderStars(v)
    },
    { 
      key: 'review_text', 
      label: 'Review',
      render: (v) => `<span class="text-gray-600 max-w-xs truncate block">${v}</span>`
    },
    { 
      key: 'is_approved', 
      label: 'Status',
      render: (v) => renderStatusBadge(v ? 'approved' : 'pending')
    },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (v) => new Date(v).toLocaleDateString('th-TH')
    }
  ];

  const actions = [
    { 
      label: 'View', 
      onClick: viewReview,
      className: 'text-blue-600 hover:text-blue-800'
    },
    { 
      label: 'Delete', 
      onClick: confirmDeleteReview,
      className: 'text-red-600 hover:text-red-800'
    }
  ];

  return renderTable({
    columns,
    data: reviews,
    onRowClick: 'viewReview',
    actions
  });
}

/**
 * Render star rating
 */
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<span class="text-amber-500">★</span>';
    } else {
      stars += '<span class="text-gray-300">★</span>';
    }
  }
  return stars;
}

/**
 * Filter reviews
 */
function filterReviews() {
  const status = document.getElementById('status-filter').value;
  
  let filtered = adminReviewsData;
  
  if (status === 'pending') {
    filtered = filtered.filter(r => !r.is_approved);
  } else if (status === 'approved') {
    filtered = filtered.filter(r => r.is_approved);
  }
  
  document.getElementById('reviews-table-container').innerHTML = renderReviewsTable(filtered);
}

/**
 * View review details
 */
function viewReview(id) {
  const review = adminReviewsData.find(r => r.id === id);
  if (!review) return;
  
  const modal = document.getElementById('review-modal');
  modal.innerHTML = renderModal({
    id: 'review-detail-modal',
    title: 'Review Details',
    content: `
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-gray-500">Customer</label>
          <p class="text-lg font-medium text-gray-900">${review.customer_name}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-500">Product</label>
          <p class="text-gray-900">${review.products?.name || '-'}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-500">Rating</label>
          <p class="text-2xl">${renderStars(review.rating)}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-500">Review</label>
          <p class="text-gray-900 bg-gray-50 p-4 rounded-lg">${review.review_text}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-500">Status</label>
          <p>${renderStatusBadge(review.is_approved ? 'approved' : 'pending')}</p>
        </div>
        
        <div>
          <label class="text-sm font-medium text-gray-500">Submitted</label>
          <p class="text-gray-600">${new Date(review.created_at).toLocaleString('th-TH')}</p>
        </div>
        
        ${!review.is_approved ? `
          <div class="pt-4 border-t">
            <button onclick="approveReview('${review.id}')" class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve Review
            </button>
          </div>
        ` : ''}
      </div>
    `,
    size: 'md'
  });
  openModal('review-detail-modal');
}

/**
 * Approve review
 */
async function approveReview(id) {
  const result = await window.approveReview(id);
  
  if (result.error) {
    alert('Error approving review: ' + result.error);
    return;
  }
  
  closeModal('review-detail-modal');
  
  // Reload and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllReviews();
  adminReviewsData = refreshResult.data || [];
  renderReviewsAdmin(container);
}

/**
 * Confirm delete review
 */
function confirmDeleteReview(id) {
  const modal = document.getElementById('delete-modal');
  modal.innerHTML = renderModal({
    id: 'delete-confirm-modal',
    title: 'Confirm Delete',
    content: `
      <p class="text-gray-600 mb-4">Are you sure you want to delete this review? This action cannot be undone.</p>
      <div class="flex justify-end gap-3">
        <button onclick="closeModal('delete-confirm-modal')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button onclick="doDeleteReview('${id}')" class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700">
          Delete
        </button>
      </div>
    `,
    size: 'md'
  });
  openModal('delete-confirm-modal');
}

/**
 * Delete review
 */
async function doDeleteReview(id) {
  const result = await window.deleteReview(id);
  
  if (result.error) {
    alert('Error deleting review: ' + result.error);
    return;
  }
  
  closeModal('delete-confirm-modal');
  
  // Reload and re-render
  const container = document.getElementById('main-content');
  const refreshResult = await window.getAllReviews();
  adminReviewsData = refreshResult.data || [];
  renderReviewsAdmin(container);
}
