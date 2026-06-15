// assets/theme.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Logic ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuDrawer = document.getElementById("mobile-menu-drawer");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  function toggleMobileMenu() {
    if(!mobileMenuDrawer) return;
    mobileMenuDrawer.classList.toggle("-translate-x-full");
    mobileMenuOverlay.classList.toggle("opacity-0");
    mobileMenuOverlay.classList.toggle("pointer-events-none");
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener("click", toggleMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", toggleMobileMenu);

  // --- Cart Drawer Logic ---
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartClose = document.getElementById("cart-close");
  const cartIcons = document.querySelectorAll(".cart-icon-toggle");

  function toggleCart() {
    if(!cartDrawer) return;
    cartDrawer.classList.toggle("translate-x-full");
    cartOverlay.classList.toggle("opacity-0");
    cartOverlay.classList.toggle("pointer-events-none");
  }

  cartIcons.forEach(icon => icon.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart();
    fetchCart();
  }));
  
  if (cartClose) cartClose.addEventListener("click", toggleCart);
  if (cartOverlay) cartOverlay.addEventListener("click", toggleCart);

  // Fetch Cart from Shopify API
  async function fetchCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      renderCart(cart);
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
  }

  // Render Cart HTML
  function renderCart(cart) {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElements = document.querySelectorAll(".cart-count-badge");

    if(!cartItemsContainer) return;

    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      el.classList.toggle('hidden', cart.item_count === 0);
    });

    // Format Money - Using INR specifically for Zonura
    const formatMoney = (cents) => {
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        return Shopify.formatMoney(cents, "Rs. {{amount}}");
      }
      return 'Rs. ' + (cents / 100).toLocaleString('en-IN', {minimumFractionDigits: 2});
    };

    cartTotalElement.textContent = formatMoney(cart.total_price);

    if (cart.item_count === 0) {
      cartItemsContainer.innerHTML = '<p class="text-zonura-navy/60 font-sans text-center py-12">Your bag is empty.</p>';
      return;
    }
    
    let html = '';
    cart.items.forEach(item => {
      html += `
        <div class="flex gap-4 items-center border-b border-zonura-navy/5 py-6 relative">
          <img src="${item.image}" alt="${item.title}" class="w-20 h-24 object-cover rounded-md border border-zonura-navy/10" />
          <div class="flex-1 flex flex-col">
            <h4 class="font-sans font-bold text-zonura-navy text-sm mb-1 pr-8">${item.product_title}</h4>
            ${item.variant_title ? `<p class="font-sans text-xs text-zonura-navy/60 mb-2">${item.variant_title}</p>` : ''}
            <div class="flex items-center justify-between mt-auto">
              <span class="font-sans text-xs text-zonura-navy/50">Qty: ${item.quantity}</span>
              <p class="font-serif font-bold text-zonura-navy">${formatMoney(item.price)}</p>
            </div>
          </div>
          <button type="button" class="cart-remove-btn absolute top-6 right-0 text-zonura-navy/40 hover:text-red-500" data-key="${item.key}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      `;
    });
    cartItemsContainer.innerHTML = html;

    // Attach remove event listeners
    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const key = btn.dataset.key;
        try {
          await fetch('/cart/change.js', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: key, quantity: 0})
          });
          fetchCart();
        } catch(err) {
          console.error(err);
        }
      });
    });
  }

  // --- AJAX Add to Cart ---
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if(!submitBtn) return;

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="animate-pulse">ADDING...</span>';
      submitBtn.disabled = true;

      const formData = new FormData(form);
      
      try {
        await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        await fetchCart();
        toggleCart();
      } catch (err) {
        console.error("Error adding to cart", err);
        alert('Failed to add item to bag.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  });

  // --- Wishlist Interaction (localStorage) ---
  const wishlistKey = 'zonura_wishlist';
  let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');

  function renderWishlistIcons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(btn => {
      const productId = btn.dataset.productId;
      if(!productId) return;
      
      const icon = btn.querySelector('svg');
      if (wishlist.includes(productId)) {
        btn.classList.add('text-red-500');
        if (icon) icon.classList.add('fill-current');
      } else {
        btn.classList.remove('text-red-500');
        if (icon) icon.classList.remove('fill-current');
      }
    });
  }

  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if(btn) {
      e.preventDefault();
      const productId = btn.dataset.productId;
      if(!productId) return;

      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
      } else {
        wishlist.push(productId);
      }
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      renderWishlistIcons();
    }
  });

  renderWishlistIcons();

  // --- Sticky ATC Observer ---
  const mainAtcButton = document.getElementById('main-atc-button');
  const stickyAtcBar = document.getElementById('sticky-atc-bar');

  if (mainAtcButton && stickyAtcBar) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show sticky bar when main button leaves viewport going up
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          stickyAtcBar.classList.remove('translate-y-full');
        } else {
          stickyAtcBar.classList.add('translate-y-full');
        }
      });
    }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });

    observer.observe(mainAtcButton);
  }

  // --- Predictive Search ---
  const searchInputs = document.querySelectorAll('input[name="q"]');
  let searchTimeout;

  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      const resultsContainer = input.closest('form').querySelector('#predictive-search-results');
      
      if(!resultsContainer) return;

      if (query.length < 3) {
        resultsContainer.classList.add('hidden');
        return;
      }

      searchTimeout = setTimeout(() => {
        fetch(`/search/suggest.json?q=${query}&resources[type]=product`)
          .then(res => res.json())
          .then(data => {
            const products = data.resources.results.products;
            if (products && products.length > 0) {
              let html = '<div class="p-4 flex flex-col gap-4">';
              products.slice(0, 5).forEach(product => {
                html += `
                  <a href="${product.url}" class="flex items-center gap-4 group">
                    <img src="${product.image}" class="w-12 h-12 object-cover rounded-md border border-zonura-navy/10" />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-sans font-bold text-sm text-zonura-navy truncate group-hover:text-zonura-gold transition-colors">${product.title}</h4>
                      <p class="font-serif text-sm text-zonura-navy/80">${product.price}</p>
                    </div>
                  </a>
                `;
              });
              html += `<a href="/search?q=${query}" class="text-center w-full block pt-4 border-t border-zonura-navy/10 font-sans font-bold text-xs tracking-widest uppercase text-zonura-gold hover:text-zonura-navy">See all results</a></div>`;
              resultsContainer.innerHTML = html;
              resultsContainer.classList.remove('hidden');
            } else {
              resultsContainer.innerHTML = '<div class="p-4 text-sm text-zonura-navy/60 text-center font-sans">No products found</div>';
              resultsContainer.classList.remove('hidden');
            }
          });
      }, 300);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      const resultsContainer = input.closest('form').querySelector('#predictive-search-results');
      if (resultsContainer && !input.closest('form').contains(e.target)) {
        resultsContainer.classList.add('hidden');
      }
    });
  });

  // --- Collection Filters Mobile Drawer ---
  const filterBtn = document.getElementById('mobile-filter-btn');
  const filterDrawer = document.getElementById('filter-drawer');
  const filterClose = document.getElementById('filter-close-btn');
  const filterOverlay = document.getElementById('filter-overlay');

  function toggleFilter() {
    if(!filterDrawer) return;
    filterDrawer.classList.toggle('translate-x-full');
    if(filterOverlay) {
      filterOverlay.classList.toggle('opacity-0');
      filterOverlay.classList.toggle('pointer-events-none');
    }
  }

  if (filterBtn) filterBtn.addEventListener('click', toggleFilter);
  if (filterClose) filterClose.addEventListener('click', toggleFilter);
  if (filterOverlay) filterOverlay.addEventListener('click', toggleFilter);

  // Fetch initial cart state
  fetchCart();

  // --- Urgency Signals ---
  const viewerCount = document.getElementById('viewer-count');
  if(viewerCount) {
    // Random between 4 and 18
    const updateViewers = () => {
      viewerCount.textContent = Math.floor(Math.random() * (18 - 4 + 1)) + 4;
    };
    updateViewers();
    setInterval(updateViewers, 30000); // Update every 30s
  }

  const deliveryCountdown = document.getElementById('delivery-countdown');
  const deliveryDate = document.getElementById('delivery-date');
  if(deliveryCountdown && deliveryDate) {
    // Delivery date = today + 5 days
    const d = new Date();
    d.setDate(d.getDate() + 5);
    deliveryDate.textContent = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    // Cutoff timer (11:59 PM today)
    const cutoff = new Date();
    cutoff.setHours(23, 59, 59, 999);

    const updateCountdown = () => {
      const now = new Date();
      const diff = cutoff - now;
      if (diff <= 0) return;
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      deliveryCountdown.textContent = `${hours}h ${mins}m`;
    };
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  // --- Back to Top ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.remove('opacity-0', 'translate-y-20');
      } else {
        backToTop.classList.add('opacity-0', 'translate-y-20');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookies) {
    if (!localStorage.getItem('zonura_cookies_accepted')) {
      setTimeout(() => {
        cookieBanner.classList.remove('translate-y-full');
      }, 2000);
    }
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('zonura_cookies_accepted', 'true');
      cookieBanner.classList.add('translate-y-full');
    });
  }
});
