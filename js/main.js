// ===================================
// Main Application Script
// ===================================

class FGSSmapRecruitmentApp {
  constructor() {
    this.version = '1.0.0';
    this.isProduction = window.location.hostname !== 'localhost';
    this.debugMode = !this.isProduction;
    
    this.init();
  }
  
  init() {
    console.log(`🚀 FGSSmap プレースマーク募集サイト v${this.version} 開始`);
    console.log(`📍 環境: ${this.isProduction ? 'Production' : 'Development'}`);
    
    this.setupEventListeners();
    this.setupAnalytics();
    this.setupAccessibility();
    this.setupPerformanceMonitoring();
    
    if (this.debugMode) {
      this.setupDevelopmentTools();
    }
    
    console.log('✅ アプリケーション初期化完了');
  }
  
  setupEventListeners() {
    // Page load optimization
    window.addEventListener('load', () => {
      this.optimizePageLoad();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
    
    // Form validation enhancement (disabled for form-steps compatibility)
    // document.addEventListener('input', (e) => {
    //   if (e.target.matches('.form-input, .form-textarea')) {
    //     this.enhanceFormValidation(e.target);
    //   }
    // });
    
    // Scroll behavior
    window.addEventListener('scroll', () => {
      this.handleScrollBehavior();
    });
    
    // Resize handling
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.handleResize();
      }, 150);
    });
  }
  
  setupAnalytics() {
    // Basic analytics tracking
    if (this.isProduction) {
      this.trackPageView();
      this.trackUserInteraction();
    }
  }
  
  setupAccessibility() {
    // Enhanced accessibility features
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupReducedMotion();
  }
  
  setupPerformanceMonitoring() {
    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log('⚡ ページ読み込み時間:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
        }, 0);
      });
    }
  }
  
  setupDevelopmentTools() {
    // Development helper tools
    console.log('🛠️ 開発ツール有効');
    
    // Global debug helpers
    window.debugFormData = () => {
      if (window.formStepManager) {
        console.table(window.formStepManager.formData);
      }
    };
    
    window.testGoogleForms = (testData) => {
      if (window.GoogleFormsHandler) {
        window.GoogleFormsHandler.submitToGoogleForms(testData || {
          mapType: 'campus',
          area: null,
          placeName: 'テスト場所',
          coordinates: '34.1234, 131.5678',
          description: 'テスト投稿です',
          imageUrl: 'https://example.com/test.jpg',
          submitterName: 'テストユーザー'
        });
      }
    };
    
    // CSS debugging
    if (window.location.search.includes('debug-css')) {
      this.enableCssDebugging();
    }
  }
  
  optimizePageLoad() {
    // Lazy load non-critical resources
    this.lazyLoadImages();
    this.prefetchImportantResources();
    
    // Remove loading class
    document.body.classList.remove('loading');
    
    console.log('⚡ ページ最適化完了');
  }
  
  handleKeyboardNavigation(e) {
    // Enhanced keyboard navigation
    switch (e.key) {
      case 'Enter':
        if (e.target.classList.contains('map-option') || 
            e.target.classList.contains('prefecture-btn') ||
            e.target.classList.contains('region-option')) {
          e.target.click();
        }
        break;
      case 'Escape':
        if (document.querySelector('.loading-overlay.show')) {
          // Cancel submission if possible
          this.handleEscapeKey();
        }
        break;
    }
  }
  
  enhanceFormValidation(input) {
    // Real-time validation feedback
    const isValid = input.checkValidity();
    const value = input.value.trim();
    
    // Remove previous validation classes
    input.classList.remove('form-error', 'form-success');
    
    // Add appropriate class
    if (value && isValid) {
      input.classList.add('form-success');
    } else if (value && !isValid) {
      input.classList.add('form-error');
    }
    
    // Coordinate validation
    if (input.id === 'coordinates' && value) {
      this.validateCoordinates(input);
    }
    
    // URL validation
    if (input.type === 'url' && value) {
      this.validateUrl(input);
    }
  }
  
  validateCoordinates(input) {
    const coordinatePattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
    const isValidFormat = coordinatePattern.test(input.value.trim());
    
    let errorMessage = '';
    if (!isValidFormat) {
      errorMessage = '座標は「緯度, 経度」の形式で入力してください（例：35.6762, 139.6503）';
    }
    
    this.showInputError(input, errorMessage);
  }
  
  validateUrl(input) {
    try {
      new URL(input.value);
      this.showInputError(input, '');
    } catch {
      this.showInputError(input, '正しいURL形式で入力してください');
    }
  }
  
  showInputError(input, message) {
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.form-error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message if needed
    if (message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'form-error-message';
      errorDiv.textContent = message;
      input.parentNode.appendChild(errorDiv);
      input.classList.add('form-error');
    } else {
      input.classList.remove('form-error');
    }
  }
  
  handleScrollBehavior() {
    // Progress indicator sticky behavior
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
      const scrollY = window.scrollY;
      progressContainer.style.boxShadow = scrollY > 0 ? 
        '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
    }
  }
  
  handleResize() {
    // Responsive adjustments
    console.log('📱 画面サイズ変更:', window.innerWidth, 'x', window.innerHeight);
  }
  
  setupFocusManagement() {
    // Focus trap for modals
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault(); // Prevent tabbing out of loading overlay
        }
      });
    }
  }
  
  setupScreenReaderSupport() {
    // ARIA live regions for dynamic content
    if (!document.getElementById('sr-status')) {
      const statusRegion = document.createElement('div');
      statusRegion.id = 'sr-status';
      statusRegion.setAttribute('aria-live', 'polite');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.className = 'visually-hidden';
      document.body.appendChild(statusRegion);
    }
  }
  
  setupReducedMotion() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--transition', 'none');
      console.log('♿ アニメーション軽減モード有効');
    }
  }
  
  lazyLoadImages() {
    // Lazy load images when they become visible
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });
      
      document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  prefetchImportantResources() {
    // Prefetch next step resources
    const prefetchLinks = [
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ];
    
    prefetchLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }
  
  trackPageView() {
    // Basic page view tracking
    console.log('📊 ページビュー記録:', window.location.pathname);
  }
  
  trackUserInteraction() {
    // Track important user interactions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('map-option') ||
          e.target.classList.contains('prefecture-btn') ||
          e.target.classList.contains('region-option') ||
          e.target.classList.contains('btn')) {
        console.log('👆 ユーザー操作:', e.target.className, e.target.textContent?.trim());
      }
    });
  }
  
  handleEscapeKey() {
    // Handle escape key during submission
    console.log('⚠️ Escapeキーが押されました');
  }
  
  enableCssDebugging() {
    // Add visual debugging for CSS
    const style = document.createElement('style');
    style.textContent = `
      * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }
      .container { outline: 2px solid blue !important; }
      .form-step { outline: 2px solid green !important; }
    `;
    document.head.appendChild(style);
    console.log('🎨 CSS デバッグモード有効');
  }
  
  // Public API methods
  showNotification(message, type = 'info') {
    if (window.formStepManager) {
      window.formStepManager.showNotification(message, type);
    }
  }
  
  announceToScreenReader(message) {
    const statusRegion = document.getElementById('sr-status');
    if (statusRegion) {
      statusRegion.textContent = message;
    }
  }
}

// ===================================
// Utility Functions
// ===================================

const Utils = {
  /**
   * 文字列をSlug化
   */
  slugify: (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  },
  
  /**
   * 日付フォーマット
   */
  formatDate: (date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },
  
  /**
   * 座標の妥当性チェック
   */
  isValidCoordinate: (lat, lng) => {
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  },
  
  /**
   * URLの妥当性チェック
   */
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  },
  
  /**
   * 文字数制限チェック
   */
  checkTextLength: (text, min = 0, max = Infinity) => {
    const length = text.trim().length;
    return length >= min && length <= max;
  },
  
  /**
   * デバウンス関数
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// ===================================
// Error Handling
// ===================================

window.addEventListener('error', (e) => {
  console.error('❌ JavaScript Error:', e.error);
  
  if (window.formStepManager) {
    window.formStepManager.showNotification(
      'エラーが発生しました。ページを再読み込みして再度お試しください。', 
      'error'
    );
  }
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled Promise Rejection:', e.reason);
  e.preventDefault();
});

// ===================================
// Initialize Application
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  window.FGSSmapApp = new FGSSmapRecruitmentApp();
});

// Export utilities globally
window.Utils = Utils;
