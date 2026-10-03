import { NAV_CATEGORIES } from '../data/categories';

export interface HeaderProps {
  activeNav: string;
  cartCount: number;
  searchQuery: string;
  selectedNavCategory?: string;
}

export function renderHeader(props: HeaderProps): string {
  const { activeNav = 'Shop', cartCount = 0, searchQuery = '', selectedNavCategory = '' } = props;

  return `
    <header class="shop-site-header">
      <!-- TOP HEADER -->
      <div class="top-header-bar">
        <div class="shop-container top-header-inner">
          
          <!-- Mobile Hamburger Toggle -->
          <button class="mobile-nav-toggle" id="btn-mobile-nav-toggle" aria-label="Toggle navigation">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <!-- Left: Logo -->
          <a href="#" class="shop-brand-logo" id="header-brand-logo">
            <img src="/uploads/assets/logo.png" alt="Falaq Food" class="brand-logo-img" />
          </a>

          <!-- Navigation Links -->
          <nav class="desktop-main-nav">
            <ul class="main-nav-list">
              <li>
                <a href="#" class="nav-link ${activeNav === 'Home' ? 'active' : ''}" data-nav="Home">Home</a>
              </li>
              <li>
                <a href="#" class="nav-link ${activeNav === 'Shop' ? 'active' : ''}" data-nav="Shop">Shop</a>
              </li>
              <li>
                <a href="#" class="nav-link ${activeNav === 'Offers' ? 'active' : ''}" data-nav="Offers">Offers</a>
              </li>
              <li>
                <a href="#" class="nav-link ${activeNav === 'New Arrivals' ? 'active' : ''}" data-nav="New Arrivals">New Arrivals</a>
              </li>
            </ul>
          </nav>

          <!-- Center/Right: Large Rounded Search Bar -->
          <div class="header-search-container">
            <form class="header-search-form" id="top-search-form" onsubmit="return false;">
              <input 
                type="text" 
                id="top-search-input" 
                class="header-search-input" 
                placeholder="Search for Products..." 
                value="${searchQuery}" 
                autocomplete="off"
              />
              <button type="submit" class="header-search-icon-btn" id="btn-top-search" aria-label="Search">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          <!-- Right: Circular User and Cart Icons -->
          <div class="header-user-actions">
            <!-- User / Profile Icon -->
            <button class="header-circle-btn profile-btn" id="btn-user-profile" title="Account" aria-label="User Account">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <!-- Shopping Basket / Cart Icon with Badge -->
            <button class="header-circle-btn cart-btn" id="btn-header-cart" title="Shopping Cart" aria-label="Shopping Cart">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="cart-badge-count" id="header-cart-badge">${cartCount}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- SECOND CATEGORY NAVIGATION -->
      <nav class="second-category-nav">
        <div class="shop-container category-nav-container">
          <ul class="category-nav-list" id="category-nav-list">
            ${NAV_CATEGORIES.map(cat => `
              <li class="category-nav-item">
                <a 
                  href="#" 
                  class="category-nav-link ${selectedNavCategory === cat.id ? 'active' : ''}" 
                  data-cat-nav="${cat.id}"
                >
                  ${cat.name}
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      </nav>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <div class="mobile-drawer-header">
          <img src="/uploads/assets/logo.png" alt="Falaq Food" style="height: 32px;" />
          <button class="drawer-close-btn" id="btn-close-mobile-nav" aria-label="Close menu">&times;</button>
        </div>
        <ul class="mobile-menu-links">
          <li><a href="#" class="mobile-link" data-nav="Home">Home</a></li>
          <li><a href="#" class="mobile-link active" data-nav="Shop">Shop</a></li>
          <li><a href="#" class="mobile-link" data-nav="Offers">Offers</a></li>
          <li><a href="#" class="mobile-link" data-nav="New Arrivals">New Arrivals</a></li>
        </ul>
        <div class="mobile-drawer-categories">
          <h4>Categories</h4>
          <ul>
            ${NAV_CATEGORIES.map(cat => `
              <li>
                <a href="#" class="mobile-cat-link" data-cat-nav="${cat.id}">${cat.name}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      <div class="mobile-drawer-backdrop" id="mobile-nav-backdrop"></div>
    </header>
  `;
}
