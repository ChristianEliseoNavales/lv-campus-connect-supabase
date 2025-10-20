/**
 * Toast Notification Utility for LVCampusConnect System
 * Context-aware colors with auto-dismiss and manual close functionality
 */

class ToastService {
  constructor() {
    this.toasts = [];
    this.container = null;
    this.nextId = 1;
    this.createContainer();
  }

  /**
   * Create toast container if it doesn't exist
   */
  createContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.className = 'fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none';
    this.container.style.maxWidth = '400px';
    document.body.appendChild(this.container);
  }

  /**
   * Show a toast notification
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  show(title, message, type = 'info', duration = 5000) {
    const toast = {
      id: this.nextId++,
      title,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    this.toasts.push(toast);
    this.renderToast(toast);

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, duration);
    }

    return toast.id;
  }

  /**
   * Render a toast element
   */
  renderToast(toast) {
    const toastElement = document.createElement('div');
    toastElement.id = `toast-${toast.id}`;
    toastElement.className = `
      pointer-events-auto transform transition-all duration-300 ease-in-out
      bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm w-full
      animate-slide-in-right
      ${this.getTypeClasses(toast.type)}
    `;

    toastElement.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${this.getIcon(toast.type)}
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium text-gray-900">
            ${this.escapeHtml(toast.title)}
          </p>
          ${toast.message ? `
            <p class="mt-1 text-sm text-gray-600">
              ${this.escapeHtml(toast.message)}
            </p>
          ` : ''}
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            onclick="window.toastService.dismiss(${toast.id})"
            class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;

    this.container.appendChild(toastElement);

    // Add slide-in animation
    setTimeout(() => {
      toastElement.classList.remove('animate-slide-in-right');
    }, 300);
  }

  /**
   * Get CSS classes for toast type
   */
  getTypeClasses(type) {
    const classes = {
      success: 'border-green-500',
      error: 'border-red-500',
      warning: 'border-yellow-500',
      info: 'border-blue-500'
    };
    return classes[type] || classes.info;
  }

  /**
   * Get icon for toast type
   */
  getIcon(type) {
    const icons = {
      success: `
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      error: `
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      warning: `
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
      `,
      info: `
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
      `
    };
    return icons[type] || icons.info;
  }

  /**
   * Dismiss a toast by ID
   */
  dismiss(toastId) {
    const toastElement = document.getElementById(`toast-${toastId}`);
    if (toastElement) {
      toastElement.classList.add('animate-slide-out-right');
      setTimeout(() => {
        if (toastElement.parentNode) {
          toastElement.parentNode.removeChild(toastElement);
        }
      }, 300);
    }

    // Remove from internal array
    this.toasts = this.toasts.filter(toast => toast.id !== toastId);
  }

  /**
   * Dismiss all toasts
   */
  dismissAll() {
    this.toasts.forEach(toast => this.dismiss(toast.id));
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Convenience methods for different toast types
  success(title, message, duration = 5000) {
    return this.show(title, message, 'success', duration);
  }

  error(title, message, duration = 8000) {
    return this.show(title, message, 'error', duration);
  }

  warning(title, message, duration = 6000) {
    return this.show(title, message, 'warning', duration);
  }

  info(title, message, duration = 5000) {
    return this.show(title, message, 'info', duration);
  }
}

// Create and export singleton instance
const toastService = new ToastService();

// Make it globally available for onclick handlers
window.toastService = toastService;

export default toastService;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-out-right {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }

  .animate-slide-out-right {
    animation: slide-out-right 0.3s ease-in;
  }
`;
document.head.appendChild(style);
