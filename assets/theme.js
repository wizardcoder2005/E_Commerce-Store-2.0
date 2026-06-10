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

    // Update notification bubbles
    cartCountElements.forEach(el => {
      el.textContent = cart.item_count;
      el.classList.toggle('hidden', cart.item_count === 0);
    });

    // Format Money Helper (Basic fallback for Shopify)
    const formatMoney = (cents) => Shopify && Shopify.formatMoney ? Shopify.formatMoney(cents, "${{amount}}") : '$' + (cents / 100).toFixed(2);

    cartTotalElement.textContent = formatMoney(cart.total_price);

    if (cart.item_count === 0) {
      cartItemsContainer.innerHTML = '<p class="text-zonura-navy/60 font-sans text-center py-12">Your bag is empty.</p>';
      return;
    }
    
    let html = '';
    cart.items.forEach(item => {
      html += `
        <div class="flex gap-4 items-center border-b border-zonura-navy/5 py-6">
          <img src="${item.image}" alt="${item.title}" class="w-20 h-24 object-cover rounded-md border border-zonura-navy/10" />
          <div class="flex-1 flex flex-col">
            <h4 class="font-sans font-bold text-zonura-navy text-sm mb-1 pr-4">${item.product_title}</h4>
            ${item.variant_title ? `<p class="font-sans text-xs text-zonura-navy/60 mb-2">${item.variant_title}</p>` : ''}
            <div class="flex items-center justify-between mt-auto">
              <span class="font-sans text-xs text-zonura-navy/50">Qty: ${item.quantity}</span>
              <p class="font-serif font-bold text-zonura-navy">${formatMoney(item.price)}</p>
            </div>
          </div>
        </div>
      `;
    });
    cartItemsContainer.innerHTML = html;
  }

  // --- AJAX Add to Cart ---
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
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

  // --- Wishlist Interaction (UI Mock) ---
  const wishlistButtons = document.querySelectorAll('.wishlist-btn, [href="#wishlist"]');
  wishlistButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('text-zonura-gold');
      const icon = btn.querySelector('svg');
      if (icon) {
        icon.classList.toggle('fill-current');
      }
    });
  });

  // Fetch initial cart state on load to ensure badges are correct
  fetchCart();
});
