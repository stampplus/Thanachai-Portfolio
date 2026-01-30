/**
 * THANAT-CHA Admin - Modal Component
 * Simple reusable modal for admin pages
 */

/**
 * Render a modal
 * @param {Object} options - Modal options
 * @param {string} options.id - Modal ID
 * @param {string} options.title - Modal title
 * @param {string} options.content - Modal content HTML
 * @param {string} options.size - Modal size (sm, md, lg)
 * @returns {string} HTML string
 */
function renderModal({ id, title, content, size = 'md' }) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return `
    <div id="${id}" class="fixed inset-0 z-50 hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" onclick="closeModal('${id}')"></div>
      
      <!-- Modal -->
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
            <button onclick="closeModal('${id}')" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
            ${content}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Open a modal
 * @param {string} id - Modal ID
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close a modal
 * @param {string} id - Modal ID
 */
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/**
 * Render a confirmation modal
 * @param {Object} options - Options
 * @param {string} options.id - Modal ID
 * @param {string} options.title - Title
 * @param {string} options.message - Message
 * @param {string} options.confirmText - Confirm button text
 * @param {string} options.cancelText - Cancel button text
 * @param {string} options.confirmClass - Confirm button class
 * @param {Function} options.onConfirm - Confirm callback
 * @returns {string} HTML string
 */
function renderConfirmModal({ 
  id, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmClass = 'bg-red-600 hover:bg-red-700',
  onConfirm 
}) {
  const content = `
    <p class="text-gray-600 mb-6">${message}</p>
    <div class="flex justify-end gap-3">
      <button onclick="closeModal('${id}')" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
        ${cancelText}
      </button>
      <button onclick="${onConfirm}(); closeModal('${id}');" class="px-4 py-2 text-white ${confirmClass} rounded-lg">
        ${confirmText}
      </button>
    </div>
  `;

  return renderModal({ id, title, content, size: 'sm' });
}
