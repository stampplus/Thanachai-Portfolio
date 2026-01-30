/**
 * THANAT-CHA Admin - Form Component
 * Simple reusable form elements for admin pages
 */

/**
 * Render a text input
 * @param {Object} options - Input options
 * @returns {string} HTML string
 */
function renderInput({ 
  name, 
  label, 
  value = '', 
  placeholder = '', 
  type = 'text',
  required = false,
  helpText = ''
}) {
  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ${label} ${required ? '<span class="text-red-500">*</span>' : ''}
      </label>
      <input
        type="${type}"
        name="${name}"
        value="${value}"
        placeholder="${placeholder}"
        ${required ? 'required' : ''}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
      />
      ${helpText ? `<p class="mt-1 text-xs text-gray-500">${helpText}</p>` : ''}
    </div>
  `;
}

/**
 * Render a textarea
 * @param {Object} options - Textarea options
 * @returns {string} HTML string
 */
function renderTextarea({ 
  name, 
  label, 
  value = '', 
  placeholder = '', 
  rows = 4,
  required = false
}) {
  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ${label} ${required ? '<span class="text-red-500">*</span>' : ''}
      </label>
      <textarea
        name="${name}"
        rows="${rows}"
        placeholder="${placeholder}"
        ${required ? 'required' : ''}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
      >${value}</textarea>
    </div>
  `;
}

/**
 * Render a select dropdown
 * @param {Object} options - Select options
 * @returns {string} HTML string
 */
function renderSelect({ 
  name, 
  label, 
  value = '', 
  options = [],
  required = false
}) {
  const optionsHtml = options.map(opt => `
    <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
      ${opt.label}
    </option>
  `).join('');

  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ${label} ${required ? '<span class="text-red-500">*</span>' : ''}
      </label>
      <select
        name="${name}"
        ${required ? 'required' : ''}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
      >
        ${optionsHtml}
      </select>
    </div>
  `;
}

/**
 * Render a checkbox
 * @param {Object} options - Checkbox options
 * @returns {string} HTML string
 */
function renderCheckbox({ 
  name, 
  label, 
  checked = false
}) {
  return `
    <div class="mb-4">
      <label class="flex items-center">
        <input
          type="checkbox"
          name="${name}"
          ${checked ? 'checked' : ''}
          class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <span class="ml-2 text-sm text-gray-700">${label}</span>
      </label>
    </div>
  `;
}

/**
 * Render a number input
 * @param {Object} options - Number input options
 * @returns {string} HTML string
 */
function renderNumberInput({ 
  name, 
  label, 
  value = 0, 
  min = 0,
  step = 1,
  required = false
}) {
  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ${label} ${required ? '<span class="text-red-500">*</span>' : ''}
      </label>
      <input
        type="number"
        name="${name}"
        value="${value}"
        min="${min}"
        step="${step}"
        ${required ? 'required' : ''}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900"
      />
    </div>
  `;
}

/**
 * Render a file input
 * @param {Object} options - File input options
 * @returns {string} HTML string
 */
function renderFileInput({
  name, 
  label, 
  accept = 'image/*',
  multiple = false
}) {
  return `
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        ${label}
      </label>
      <input
        type="file"
        name="${name}"
        accept="${accept}"
        ${multiple ? 'multiple' : ''}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
      />
    </div>
  `;
}

/**
 * Render form buttons
 * @param {Object} options - Button options
 * @returns {string} HTML string
 */
function renderFormButtons({ 
  submitText = 'Save', 
  cancelText = 'Cancel',
  onCancel = 'closeModal()'
}) {
  return `
    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        onclick="${onCancel}"
        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        ${cancelText}
      </button>
      <button
        type="submit"
        class="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
      >
        ${submitText}
      </button>
    </div>
  `;
}

/**
 * Get form data as object
 * @param {HTMLFormElement} form - Form element
 * @returns {Object} Form data
 */
function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    // Handle arrays (e.g., top_notes[])
    if (key.endsWith('[]')) {
      const cleanKey = key.slice(0, -2);
      if (!data[cleanKey]) data[cleanKey] = [];
      if (value) data[cleanKey].push(value);
    } else if (form.querySelector(`[name="${key}"]`).type === 'checkbox') {
      data[key] = form.querySelector(`[name="${key}"]`).checked;
    } else if (form.querySelector(`[name="${key}"]`).type === 'number') {
      data[key] = parseFloat(value) || 0;
    } else {
      data[key] = value;
    }
  });
  
  return data;
}
