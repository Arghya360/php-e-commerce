import './style.css';
import { PRODUCTS, getProductById } from './data/products';
import type { Product } from './data/products';
import { BLOG_POSTS } from './data/blogs';
import type { BlogPost } from './data/blogs';
import { cartStore } from './store/cart';
import { renderHeader } from './components/Header';
import { renderPageBanner } from './components/PageBanner';
import { renderProductCard } from './components/ProductCard';
import { renderFilterSidebar } from './components/FilterSidebar';
import type { FilterState } from './components/FilterSidebar';
import { renderHomePage } from './components/HomePage';
import { renderFalaqFooter } from './components/Footer';

// ═══════════════════════════════════════════════════════════════
// ROUTER STATE
// ═══════════════════════════════════════════════════════════════
type Page = 'home' | 'shop';

let currentPage: Page = 'home';

// ── Modals & Drawer state ────────────────────────────────────
let isCartOpen = false;
let isCheckoutOpen = false;
let selectedBlog: BlogPost | null = null;

// ── Home slider state ────────────────────────────────────────
let currentSlide = 0;
let slideInterval: ReturnType<typeof setInterval> | null = null;

// ── Shop filter state ────────────────────────────────────────
let selectedNavCategory: string = '';
let topSearchQuery: string = '';

let filters: FilterState = {
  searchQuery: '',
  selectedCategories: [],
  priceMin: 0,
  priceMax: 5000,
  selectedPackSizes: [],
  minRating: 0,
  inStockOnly: false,
};

let expandedSections: string[] = ['categories'];
let mobileFilterOpen = false;

const app = document.getElementById('app')!;

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
function navigateTo(page: Page, cat?: string) {
  currentPage = page;
  if (page === 'shop') {
    if (cat) {
      selectedNavCategory = cat;
      filters.selectedCategories = [];
    }
    stopSlideshow();
  } else {
    startSlideshow();
  }
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════
// TOAST NOTIFICATION
// ═══════════════════════════════════════════════════════════════
function showToast(msg: string) {
  const el = document.getElementById('shop-toast');
  if (el) {
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
  }
}

// ═══════════════════════════════════════════════════════════════
// HOME SLIDER
// ═══════════════════════════════════════════════════════════════
function startSlideshow() {
  stopSlideshow();
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % 4;
    updateHeroTrack();
  }, 4000);
}

function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

function updateHeroTrack() {
  const track = document.getElementById('hero-track');
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  document.querySelectorAll('.hero-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });
}

// ═══════════════════════════════════════════════════════════════
// SHOP FILTERING
// ═══════════════════════════════════════════════════════════════
function getFilteredProducts(): Product[] {
  let list = [...PRODUCTS];

  if (filters.selectedCategories.length > 0) {
    list = list.filter(p => filters.selectedCategories.includes(p.category));
  } else if (selectedNavCategory) {
    list = list.filter(p => p.category === selectedNavCategory);
  }

  const q = (filters.searchQuery || topSearchQuery || '').toLowerCase().trim();
  if (q) {
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (filters.priceMax > 0) {
    list = list.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);
  }
  if (filters.selectedPackSizes.length > 0) {
    list = list.filter(p => p.packSize && filters.selectedPackSizes.includes(p.packSize));
  }
  if (filters.minRating > 0) {
    list = list.filter(p => (p.rating ?? 5) >= filters.minRating);
  }
  if (filters.inStockOnly) {
    list = list.filter(p => p.inStock !== false);
  }

  return list;
}

function renderProductGrid(products: Product[]): string {
  if (products.length === 0) {
    return `
      <div class="no-products-found">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <p>No products found</p>
        <span>Try adjusting your filters or search term</span>
      </div>`;
  }
  return products.map(p => renderProductCard(p)).join('');
}

// ═══════════════════════════════════════════════════════════════
// RENDER MODALS & CART DRAWER
// ═══════════════════════════════════════════════════════════════
function renderCartDrawerAndModals(): string {
  const cartItems = cartStore.getItems();
  const cartSubtotal = cartStore.getSubtotal();

  return `
    <!-- Toast Notification -->
    <div id="shop-toast" class="shop-toast-notification"></div>

    <!-- SIDE-CART DRAWER -->
    <div class="side-cart-backdrop ${isCartOpen ? 'open' : ''}" id="cart-backdrop"></div>
    <div class="side-cart-drawer ${isCartOpen ? 'open' : ''}" id="cart-drawer">
      <div class="side-cart-header">
        <h3>Shopping Cart</h3>
        <button class="side-cart-close" id="btn-cart-close" aria-label="Close cart">&times;</button>
      </div>
      <div class="side-cart-body">
        ${cartItems.length === 0 ? `
          <div style="text-align: center; padding: 48px 0; color: #6B7280;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#ccc" stroke-width="1.5" style="margin: 0 auto 12px; display:block;">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <p style="font-size: 15px; margin-bottom: 16px;">No products in the cart.</p>
            <button class="side-cart-checkout-btn" id="btn-return-shop" style="display:inline-block; width:auto; padding: 9px 24px; font-size:13.5px;">
              Return to shop
            </button>
          </div>
        ` : cartItems.map(item => `
          <div class="side-cart-item">
            <img src="${item.product.image}" alt="${item.product.title}" />
            <div class="side-cart-item-info">
              <div class="side-cart-item-title">${item.product.title}</div>
              <div class="side-cart-item-price">${item.product.price} ৳ × ${item.quantity} = ${item.product.price * item.quantity} ৳</div>
              <div class="side-cart-qty-ctrl">
                <button data-dec="${item.product.id}">-</button>
                <span>${item.quantity}</span>
                <button data-inc="${item.product.id}">+</button>
              </div>
            </div>
            <button class="side-cart-item-del" data-del="${item.product.id}" aria-label="Remove item">&times;</button>
          </div>
        `).join('')}
      </div>

      ${cartItems.length > 0 ? `
        <div class="side-cart-footer">
          <div class="side-cart-subtotal-row">
            <span>Subtotal:</span>
            <span style="color: #0d874c;">${cartSubtotal} ৳</span>
          </div>
          <button class="side-cart-checkout-btn" id="btn-open-checkout">
            Proceed to Checkout
          </button>
        </div>
      ` : ''}
    </div>

    <!-- CASH ON DELIVERY CHECKOUT MODAL -->
    <div class="checkout-modal-backdrop ${isCheckoutOpen ? 'open' : ''}" id="checkout-modal">
      <div class="checkout-modal-box">
        <div class="checkout-modal-header">
          <h3 style="font-size: 17px; font-weight: 700; color: #111827;">ক্যাশ অন ডেলিভারি অর্ডার (Cash on Delivery)</h3>
          <button id="btn-close-checkout-modal" style="font-size: 22px; cursor: pointer; border: none; background: none; color: #6b7280;">&times;</button>
        </div>
        <div class="checkout-modal-body" id="checkout-body-content">
          <form id="order-form">
            <div class="checkout-input-group">
              <label class="checkout-label">আপনার নাম *</label>
              <input type="text" id="order-name" class="checkout-input" placeholder="আপনার সম্পূর্ণ নাম লিখুন" required />
            </div>
            <div class="checkout-input-group">
              <label class="checkout-label">মোবাইল নম্বর *</label>
              <input type="tel" id="order-phone" class="checkout-input" placeholder="01XXXXXXXXX" required />
            </div>
            <div class="checkout-input-group">
              <label class="checkout-label">ডেলিভারি ঠিকানা *</label>
              <textarea id="order-address" class="checkout-input" rows="2" placeholder="বাড়ি/রোড/এলাকা/জেলা" required></textarea>
            </div>
            <div class="checkout-input-group">
              <label class="checkout-label">ডেলিভারি এরিয়া</label>
              <div style="display: flex; gap: 16px; margin-top: 4px;">
                <label style="display:flex; align-items:center; gap: 6px; font-size: 13.5px; cursor: pointer;">
                  <input type="radio" name="area" value="inside" checked /> ঢাকার ভেতর (৭০ ৳)
                </label>
                <label style="display:flex; align-items:center; gap: 6px; font-size: 13.5px; cursor: pointer;">
                  <input type="radio" name="area" value="outside" /> ঢাকার বাইরে (১৩০ ৳)
                </label>
              </div>
            </div>

            <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 14px; margin: 16px 0; font-size: 14px;">
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color: #4b5563;">
                <span>মোট পণ্যের মূল্য:</span>
                <span>${cartSubtotal} ৳</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color: #4b5563;">
                <span>ডেলিভারি চার্জ:</span>
                <span id="display-delivery-fee">৭০ ৳</span>
              </div>
              <div style="display:flex; justify-content:space-between; font-weight:700; color:#0d874c; font-size:16px; border-top:1px dashed #D1D5DB; padding-top:8px;">
                <span>সর্বমোট:</span>
                <span id="display-grand-total">${cartSubtotal + 70} ৳</span>
              </div>
            </div>

            <button type="submit" class="side-cart-checkout-btn" style="padding: 13px;">
              অর্ডার নিশ্চিত করুন (Confirm Order)
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- BLOG DETAIL MODAL -->
    <div class="checkout-modal-backdrop ${selectedBlog ? 'open' : ''}" id="blog-modal">
      ${selectedBlog ? `
        <div class="checkout-modal-box" style="max-width: 640px;">
          <div class="checkout-modal-header">
            <h3 style="font-size: 17px; font-weight: 700; color: #111827;">${selectedBlog.title}</h3>
            <button id="btn-close-blog-modal" style="font-size: 22px; cursor: pointer; border: none; background: none; color: #6b7280;">&times;</button>
          </div>
          <div class="checkout-modal-body">
            <img src="${selectedBlog.image}" alt="${selectedBlog.title}" style="width: 100%; height: 260px; object-fit: cover; border-radius: 8px; margin-bottom: 14px;" />
            <div style="font-size: 12px; color: #6B7280; margin-bottom: 12px;">${selectedBlog.date} • ${selectedBlog.author} • ${selectedBlog.category}</div>
            <div style="font-size: 14.5px; line-height: 1.8; color: #374151; white-space: pre-line;">${selectedBlog.content}</div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════
// MAIN RENDER
// ═══════════════════════════════════════════════════════════════
function render() {
  const cartCount = cartStore.getItemCount();

  if (currentPage === 'home') {
    renderHome(cartCount);
  } else {
    renderShop(cartCount);
  }
}

function renderHome(cartCount: number) {
  app.innerHTML = `
    ${renderCartDrawerAndModals()}
    ${renderHeader({ activeNav: 'Home', cartCount, searchQuery: '', selectedNavCategory: '' })}
    <main>
      ${renderHomePage({ currentSlide })}
    </main>
  `;
  attachHeaderListeners();
  attachHomeListeners();
  attachCartAndModalListeners();
}

function renderShop(cartCount: number) {
  const filteredProducts = getFilteredProducts();
  app.innerHTML = `
    ${renderCartDrawerAndModals()}
    ${renderHeader({ activeNav: 'Shop', cartCount, searchQuery: topSearchQuery, selectedNavCategory })}
    <main class="shop-main-bg">
      ${renderPageBanner()}
      <div class="shop-container shop-content-area">
        <div class="shop-layout-grid">
          <div class="mobile-filter-bar">
            <button class="mobile-filter-toggle-btn" id="btn-mobile-filter-open">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
              Filters
            </button>
            <span class="results-count">${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found</span>
          </div>
          <div class="sidebar-column ${mobileFilterOpen ? 'mobile-open' : ''}" id="sidebar-column">
            ${renderFilterSidebar({ filters, expandedSections })}
          </div>
          <div class="sidebar-overlay ${mobileFilterOpen ? 'visible' : ''}" id="sidebar-overlay"></div>
          <section class="products-column">
            <div class="shop-products-grid" id="products-grid">
              ${renderProductGrid(filteredProducts)}
            </div>
          </section>
        </div>
      </div>
      ${renderFalaqFooter()}
    </main>
  `;
  attachHeaderListeners();
  attachShopListeners();
  attachCartAndModalListeners();
}

// ═══════════════════════════════════════════════════════════════
// HEADER LISTENERS
// ═══════════════════════════════════════════════════════════════
function attachHeaderListeners() {
  // Brand logo
  document.getElementById('header-brand-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Nav links (Home, Shop, Offers, New Arrivals)
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const nav = (el as HTMLElement).dataset.nav || '';
      closeMobileNav();
      if (nav === 'Home') {
        navigateTo('home');
      } else if (nav === 'Shop') {
        navigateTo('shop');
      } else if (nav === 'Offers') {
        selectedNavCategory = '';
        filters.selectedCategories = [];
        navigateTo('shop');
      } else if (nav === 'New Arrivals') {
        selectedNavCategory = '';
        filters.selectedCategories = [];
        navigateTo('shop');
      }
    });
  });

  // Secondary Category Nav
  document.querySelectorAll('[data-cat-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const catId = (el as HTMLElement).dataset.catNav || '';
      closeMobileNav();
      navigateTo('shop', catId);
    });
  });

  // Top search
  const topInput = document.getElementById('top-search-input') as HTMLInputElement;
  document.getElementById('top-search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    topSearchQuery = topInput?.value ?? '';
    navigateTo('shop');
  });
  document.getElementById('btn-top-search')?.addEventListener('click', () => {
    topSearchQuery = topInput?.value ?? '';
    navigateTo('shop');
  });

  // Cart button in header
  document.getElementById('btn-header-cart')?.addEventListener('click', () => {
    isCartOpen = true;
    render();
  });

  // User profile button in header
  document.getElementById('btn-user-profile')?.addEventListener('click', () => {
    showToast('My Account: Please login to manage your orders.');
  });

  // Mobile nav drawer toggles
  document.getElementById('btn-mobile-nav-toggle')?.addEventListener('click', openMobileNav);
  document.getElementById('btn-close-mobile-nav')?.addEventListener('click', closeMobileNav);
  document.getElementById('mobile-nav-backdrop')?.addEventListener('click', closeMobileNav);
}

function openMobileNav() {
  document.getElementById('mobile-nav-drawer')?.classList.add('open');
  document.getElementById('mobile-nav-backdrop')?.classList.add('open');
}

function closeMobileNav() {
  document.getElementById('mobile-nav-drawer')?.classList.remove('open');
  document.getElementById('mobile-nav-backdrop')?.classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// HOME PAGE LISTENERS
// ═══════════════════════════════════════════════════════════════
function attachHomeListeners() {
  // Slider dot navigation
  document.querySelectorAll('[data-dot]').forEach(dot => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt((dot as HTMLElement).dataset.dot || '0', 10);
      updateHeroTrack();
    });
  });

  // Side promo banners
  document.querySelectorAll('[data-promo-cat]').forEach(box => {
    box.addEventListener('click', () => {
      const cat = (box as HTMLElement).dataset.promoCat;
      navigateTo('shop', cat);
    });
  });

  // ── Category Carousel: Infinite Loop ──────────────────────
  const catTrack = document.getElementById('category-track');
  const catPrev = document.getElementById('cat-carousel-prev');
  const catNext = document.getElementById('cat-carousel-next');

  if (catTrack && catPrev && catNext) {
    // Clone all original cards and append/prepend them for infinite loop
    const originalCards = Array.from(catTrack.querySelectorAll('.category-card'));
    const CARD_W = 120; // px, matches CSS min-width
    const GAP = 12;     // px, matches CSS gap
    const STEP = CARD_W + GAP;
    const CLONE_COUNT = originalCards.length;

    // Prepend clones (right-to-left order to fill left buffer)
    const prependFragment = document.createDocumentFragment();
    [...originalCards].reverse().forEach(card => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.setAttribute('data-cat-card', card.getAttribute('data-cat-card') || '');
      clone.classList.add('cat-clone');
      prependFragment.appendChild(clone);
    });
    catTrack.prepend(prependFragment);

    // Append clones (left-to-right order for right buffer)
    const appendFragment = document.createDocumentFragment();
    originalCards.forEach(card => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.setAttribute('data-cat-card', card.getAttribute('data-cat-card') || '');
      clone.classList.add('cat-clone');
      appendFragment.appendChild(clone);
    });
    catTrack.appendChild(appendFragment);

    // Jump silently to the real (center) cards on init
    const bufferWidth = CLONE_COUNT * STEP;
    const track = catTrack as HTMLElement; // non-null ref for nested functions
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = bufferWidth;
    requestAnimationFrame(() => {
      track.style.scrollBehavior = '';
    });

    // Scroll by one page width (number of visible cards × step)
    function getPageStep(): number {
      const visibleCount = Math.floor(track.clientWidth / STEP) || 1;
      return visibleCount * STEP;
    }


    function scrollCarousel(direction: 'prev' | 'next') {
      const pageStep = getPageStep();
      const totalReal = CLONE_COUNT * STEP;
      const totalBuf  = CLONE_COUNT * STEP; // same — symmetrical

      // Enable smooth scroll for the animated step
      track.style.scrollBehavior = 'smooth';
      track.scrollLeft += direction === 'next' ? pageStep : -pageStep;

      // After animation (~350ms) check if we need to silently reset
      setTimeout(() => {
        track.style.scrollBehavior = 'auto';
        const leftEdge  = totalBuf;              // start of real cards
        const rightEdge = totalBuf + totalReal;  // end of real cards

        if (track.scrollLeft < leftEdge - STEP * 0.5) {
          // Jumped into left clone zone — teleport to right real equivalent
          track.scrollLeft += totalReal;
        } else if (track.scrollLeft > rightEdge - STEP * 0.5) {
          // Jumped into right clone zone — teleport to left real equivalent
          track.scrollLeft -= totalReal;
        }

        // Re-enable smooth for next interaction
        requestAnimationFrame(() => {
          track.style.scrollBehavior = '';
        });
      }, 380);
    }

    catPrev.addEventListener('click', (e) => {
      e.preventDefault();
      scrollCarousel('prev');
    });
    catNext.addEventListener('click', (e) => {
      e.preventDefault();
      scrollCarousel('next');
    });

    // Also re-attach click listeners on cloned cards
    track.querySelectorAll('.cat-clone[data-cat-card]').forEach(clone => {
      clone.addEventListener('click', () => {
        const catId = (clone as HTMLElement).dataset.catCard;
        if (catId) navigateTo('shop', catId);
      });
    });
  }


  // Category card click -> navigate to Shop filtered by that category
  document.querySelectorAll('[data-cat-card]').forEach(card => {
    card.addEventListener('click', () => {
      const catId = (card as HTMLElement).dataset.catCard;
      navigateTo('shop', catId);
    });
  });

  // Add to cart buttons on Recent Products
  document.querySelectorAll('[data-add]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = parseInt((el as HTMLElement).dataset.add || '0', 10);
      const prod = getProductById(pid);
      if (prod) {
        cartStore.addItem(prod, 1);
        showToast(`"${prod.title}" added to cart!`);
        isCartOpen = true;
        render();
      }
    });
  });

  // "SHOP ALL PRODUCTS" button click -> navigate to shop!
  document.getElementById('btn-shop-all-products')?.addEventListener('click', () => {
    navigateTo('shop');
  });

  // Blog card "READ MORE »" click -> open blog modal
  document.querySelectorAll('[data-blog-id]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const bid = parseInt((link as HTMLElement).dataset.blogId || '0', 10);
      selectedBlog = BLOG_POSTS.find(b => b.id === bid) || null;
      render();
    });
  });

  // Reviews carousel buttons
  const revTrack = document.getElementById('reviews-track');
  document.getElementById('review-prev')?.addEventListener('click', () => {
    if (revTrack) revTrack.scrollBy({ left: -320, behavior: 'smooth' });
  });
  document.getElementById('review-next')?.addEventListener('click', () => {
    if (revTrack) revTrack.scrollBy({ left: 320, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════════════════════════════════
// SHOP PAGE LISTENERS
// ═══════════════════════════════════════════════════════════════
function attachShopListeners() {
  // Add to cart buttons in shop grid
  document.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt((btn as HTMLElement).dataset.id || '0', 10);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        cartStore.addItem(product, 1);
        showToast(`"${product.title}" added to cart!`);
        isCartOpen = true;
        render();
      }
    });
  });

  // Sidebar search
  const sidebarInput = document.getElementById('sidebar-search-input') as HTMLInputElement;
  sidebarInput?.addEventListener('input', () => {
    filters.searchQuery = sidebarInput.value;
    updateProductGrid();
  });
  document.getElementById('btn-sidebar-search')?.addEventListener('click', () => {
    filters.searchQuery = sidebarInput?.value ?? '';
    updateProductGrid();
  });

  // Category checkboxes
  document.querySelectorAll('[data-filter-cat]').forEach(el => {
    el.addEventListener('change', () => {
      const catId = (el as HTMLInputElement).value;
      const checked = (el as HTMLInputElement).checked;
      if (checked) {
        if (!filters.selectedCategories.includes(catId)) filters.selectedCategories.push(catId);
      } else {
        filters.selectedCategories = filters.selectedCategories.filter(c => c !== catId);
      }
      selectedNavCategory = '';
      updateProductGrid();
    });
  });

  // Pack size checkboxes
  document.querySelectorAll('[data-filter-size]').forEach(el => {
    el.addEventListener('change', () => {
      const size = (el as HTMLInputElement).value;
      const checked = (el as HTMLInputElement).checked;
      if (checked) {
        if (!filters.selectedPackSizes.includes(size)) filters.selectedPackSizes.push(size);
      } else {
        filters.selectedPackSizes = filters.selectedPackSizes.filter(s => s !== size);
      }
      updateProductGrid();
    });
  });

  // Price range slider
  const slider = document.getElementById('price-range-slider') as HTMLInputElement;
  const pMax = document.getElementById('price-max-input') as HTMLInputElement;
  const pMin = document.getElementById('price-min-input') as HTMLInputElement;
  slider?.addEventListener('input', () => {
    filters.priceMax = parseInt(slider.value, 10);
    if (pMax) pMax.value = slider.value;
    updateProductGrid();
  });
  pMin?.addEventListener('input', () => {
    filters.priceMin = parseInt(pMin.value, 10) || 0;
    updateProductGrid();
  });
  pMax?.addEventListener('input', () => {
    filters.priceMax = parseInt(pMax.value, 10) || 5000;
    if (slider) slider.value = String(filters.priceMax);
    updateProductGrid();
  });

  // Rating filter
  document.querySelectorAll('[data-filter-rating]').forEach(el => {
    el.addEventListener('change', () => {
      filters.minRating = parseInt((el as HTMLInputElement).value, 10);
      updateProductGrid();
    });
  });

  // Stock filter
  document.querySelectorAll('[data-filter-stock]').forEach(el => {
    el.addEventListener('change', () => {
      filters.inStockOnly = (el as HTMLInputElement).value === 'in-stock';
      updateProductGrid();
    });
  });

  // Apply / Reset
  document.getElementById('btn-apply-filter')?.addEventListener('click', () => {
    mobileFilterOpen = false;
    updateProductGrid();
  });
  document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
    filters = {
      searchQuery: '',
      selectedCategories: [],
      priceMin: 0,
      priceMax: 5000,
      selectedPackSizes: [],
      minRating: 0,
      inStockOnly: false
    };
    selectedNavCategory = '';
    topSearchQuery = '';
    mobileFilterOpen = false;
    render();
  });

  // Collapsible accordion
  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const section = (el as HTMLElement).dataset.toggle || '';
      if (expandedSections.includes(section)) {
        expandedSections = expandedSections.filter(s => s !== section);
      } else {
        expandedSections.push(section);
      }
      const col = document.getElementById('sidebar-column');
      if (col) {
        col.innerHTML = renderFilterSidebar({ filters, expandedSections });
        attachShopListeners();
      }
    });
  });

  // Mobile filter drawer
  document.getElementById('btn-mobile-filter-open')?.addEventListener('click', () => {
    mobileFilterOpen = true;
    document.getElementById('sidebar-column')?.classList.add('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.add('visible');
  });
  document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
    mobileFilterOpen = false;
    document.getElementById('sidebar-column')?.classList.remove('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.remove('visible');
  });
}

function updateProductGrid() {
  const grid = document.getElementById('products-grid');
  const countEl = document.querySelector('.results-count');
  const filtered = getFilteredProducts();
  if (grid) {
    grid.innerHTML = renderProductGrid(filtered);
    attachShopListeners();
  }
  if (countEl) {
    countEl.textContent = `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`;
  }
}

// ═══════════════════════════════════════════════════════════════
// CART & MODALS LISTENERS
// ═══════════════════════════════════════════════════════════════
function attachCartAndModalListeners() {
  // Cart close button
  document.getElementById('btn-cart-close')?.addEventListener('click', () => {
    isCartOpen = false;
    render();
  });

  // Cart backdrop click
  document.getElementById('cart-backdrop')?.addEventListener('click', () => {
    isCartOpen = false;
    render();
  });

  // Return to shop from empty cart
  document.getElementById('btn-return-shop')?.addEventListener('click', () => {
    isCartOpen = false;
    navigateTo('shop');
  });

  // Cart increment / decrement / delete
  document.querySelectorAll('[data-inc]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt((btn as HTMLElement).dataset.inc || '0', 10);
      const item = cartStore.getItems().find(i => i.product.id === pid);
      if (item) {
        cartStore.updateQuantity(pid, item.quantity + 1);
        render();
      }
    });
  });

  document.querySelectorAll('[data-dec]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt((btn as HTMLElement).dataset.dec || '0', 10);
      const item = cartStore.getItems().find(i => i.product.id === pid);
      if (item) {
        if (item.quantity > 1) {
          cartStore.updateQuantity(pid, item.quantity - 1);
        } else {
          cartStore.removeItem(pid);
        }
        render();
      }
    });
  });

  document.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt((btn as HTMLElement).dataset.del || '0', 10);
      cartStore.removeItem(pid);
      render();
    });
  });

  // Open checkout modal
  document.getElementById('btn-open-checkout')?.addEventListener('click', () => {
    isCartOpen = false;
    isCheckoutOpen = true;
    render();
  });

  // Close checkout modal
  document.getElementById('btn-close-checkout-modal')?.addEventListener('click', () => {
    isCheckoutOpen = false;
    render();
  });

  document.getElementById('checkout-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('checkout-modal')) {
      isCheckoutOpen = false;
      render();
    }
  });

  // Area radio switch (delivery fee update)
  document.querySelectorAll('input[name="area"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const val = (radio as HTMLInputElement).value;
      const fee = val === 'inside' ? 70 : 130;
      const feeEl = document.getElementById('display-delivery-fee');
      const totalEl = document.getElementById('display-grand-total');
      if (feeEl) feeEl.textContent = `${fee} ৳`;
      if (totalEl) totalEl.textContent = `${cartStore.getSubtotal() + fee} ৳`;
    });
  });

  // Checkout order submission
  document.getElementById('order-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('order-name') as HTMLInputElement).value;
    const phone = (document.getElementById('order-phone') as HTMLInputElement).value;
    const address = (document.getElementById('order-address') as HTMLInputElement).value;
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const modalBox = document.querySelector('.checkout-modal-box');
    if (modalBox) {
      modalBox.innerHTML = `
        <div style="padding: 36px 24px; text-align: center;">
          <div style="width: 60px; height: 60px; background: #ECFDF5; color: #0D874C; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 26px; font-weight: 700;">
            ✓
          </div>
          <h3 style="font-size: 20px; font-weight: 700; color: #111827; margin-bottom: 8px;">অর্ডার সফল হয়েছে! (Order Placed)</h3>
          <p style="font-size: 14px; color: #4B5563; margin-bottom: 16px;">Order ID: <b>#${orderId}</b></p>
          <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; text-align: left; font-size: 13.5px; line-height: 1.7; margin-bottom: 22px;">
            <div><b>নাম:</b> ${name}</div>
            <div><b>মোবাইল:</b> ${phone}</div>
            <div><b>ঠিকানা:</b> ${address}</div>
            <div><b>পেমেন্ট:</b> ক্যাশ অন ডেলিভারি (Cash on Delivery)</div>
          </div>
          <button class="side-cart-checkout-btn" id="btn-finish-order">Continue Shopping</button>
        </div>
      `;
      cartStore.clear();
      document.getElementById('btn-finish-order')?.addEventListener('click', () => {
        isCheckoutOpen = false;
        navigateTo('home');
      });
    }
  });

  // Blog modal close
  document.getElementById('btn-close-blog-modal')?.addEventListener('click', () => {
    selectedBlog = null;
    render();
  });
  document.getElementById('blog-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('blog-modal')) {
      selectedBlog = null;
      render();
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CART SUBSCRIPTION
// ═══════════════════════════════════════════════════════════════
cartStore.subscribe(() => {
  const badge = document.getElementById('header-cart-badge');
  if (badge) {
    badge.textContent = String(cartStore.getItemCount());
  }
});

// ═══════════════════════════════════════════════════════════════
// BOOTSTRAP
// ═══════════════════════════════════════════════════════════════
navigateTo('home');
