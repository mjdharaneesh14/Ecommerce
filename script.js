// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════
const DEFAULT_PRODUCTS = [
  { id: 1,  name: "Rose Hip Face Serum",    cat: "Skincare",   price: 849,  old: 1099, image: "images/rose_hip_serum.jpg", rating: 4.8, reviews: 124, badge: "sale", desc: "Brightening vitamin C serum with rosehip oil." },
  { id: 2,  name: "Lavender Room Diffuser",  cat: "Home",       price: 699,             image: "images/lavender_diffuser.jpg", rating: 4.6, reviews: 89,  badge: "new",  desc: "Aromatherapy diffuser with lavender essential oil." },
  { id: 3,  name: "Linen Tote Bag",          cat: "Fashion",    price: 499,             image: "images/linen_tote_bag.jpg", rating: 4.5, reviews: 67,               desc: "Handwoven organic linen tote, natural dye." },
  { id: 4,  name: "Matcha Wellness Kit",     cat: "Wellness",   price: 1299, old: 1599, image: "images/matcha_kit.jpg", rating: 4.9, reviews: 203, badge: "sale", desc: "Ceremonial grade matcha + whisk + bowl set." },
  { id: 5,  name: "Marble Pen Stand",        cat: "Stationery", price: 599,             image: "images/marble_pen_stand.jpg", rating: 4.4, reviews: 45,               desc: "Minimalist marble pen and desk organizer." },
  { id: 6,  name: "Hyaluronic Moisturizer",  cat: "Skincare",   price: 999,             image: "images/hyaluronic_moisturizer.jpg", rating: 4.7, reviews: 156, badge: "new",  desc: "Deep hydration with hyaluronic acid & ceramides." },
  { id: 7,  name: "Rattan Storage Basket",   cat: "Home",       price: 799,             image: "images/rattan_basket.jpg", rating: 4.3, reviews: 38,               desc: "Handwoven rattan basket for stylish storage." },
  { id: 8,  name: "Silk Scrunchie Set",      cat: "Fashion",    price: 349,  old: 449,  image: "images/silk_scrunchie_set.jpg", rating: 4.6, reviews: 92,  badge: "sale", desc: "Set of 5 mulberry silk hair scrunchies." },
  { id: 9,  name: "Crystal Roller",          cat: "Wellness",   price: 899,             image: "images/crystal_roller.jpg", rating: 4.8, reviews: 178,              desc: "Rose quartz face roller, reduces puffiness." },
  { id: 10, name: "Leather Journal",         cat: "Stationery", price: 749,             image: "images/leather_journal.jpg", rating: 4.7, reviews: 61,  badge: "new",  desc: "A5 full-grain leather journal, 200 pages." },
  { id: 11, name: "Vitamin C Eye Cream",     cat: "Skincare",   price: 649,             image: "images/vitamin_c_eye_cream.jpg", rating: 4.5, reviews: 84,               desc: "Brightening under-eye cream with retinol." },
  { id: 12, name: "Scented Soy Candle",      cat: "Home",       price: 449,             image: "images/scented_soy_candle.jpg", rating: 4.9, reviews: 312, badge: "new",  desc: "Hand-poured soy candle, 40hr burn time." },
];

const DEFAULT_CATEGORIES = [...new Set(DEFAULT_PRODUCTS.map(p => p.cat))];

const COUPONS = {
  "SEREIN20":   20,
  "SAVE10":    10,
  "FIRST15":   15,
  "WELLNESS5": 5,
};

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let products         = JSON.parse(localStorage.getItem('serein_products'))    || DEFAULT_PRODUCTS;
let categories       = JSON.parse(localStorage.getItem('serein_categories'))  || DEFAULT_CATEGORIES;
let cart             = JSON.parse(localStorage.getItem('serein_cart'))        || [];
let wishlist         = JSON.parse(localStorage.getItem('serein_wishlist'))    || [];
let orders           = JSON.parse(localStorage.getItem('serein_orders'))      || [];
let darkMode         = localStorage.getItem('serein_dark') === 'true';
let appliedCoupon    = null;
let couponDiscount   = 0;
let activeFilter     = 'All';
let activePriceMin   = 0;
let activePriceMax   = Infinity;
let activeSort       = 'default';
let activeQuickFilter = null;
let searchQuery      = '';
let adminLoggedIn    = localStorage.getItem('serein_admin') === 'true';
let editingProductId = null;

// ═══════════════════════════════════════
// SECURITY HELPER (XSS Prevention)
// ═══════════════════════════════════════
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ═══════════════════════════════════════
// RATING STARS HELPER (SVG Icons)
// ═══════════════════════════════════════
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  let html = '';
  const starIcon = `<svg class="star-icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  const emptyStarIcon = `<svg class="star-icon empty" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
  
  for (let i = 0; i < 5; i++) {
    html += i < fullStars ? starIcon : emptyStarIcon;
  }
  return html;
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
function init() {
  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  renderCategoryList();
  renderProducts();
  updateBadges();
  initChat();
  initScrollReveal();
  bindEvents();
}

// ═══════════════════════════════════════
// SAVE HELPERS
// ═══════════════════════════════════════
function saveProducts()   { localStorage.setItem('serein_products',   JSON.stringify(products)); }
function saveCategories() { localStorage.setItem('serein_categories', JSON.stringify(categories)); }
function saveCart()       { localStorage.setItem('serein_cart',       JSON.stringify(cart)); }
function saveWishlist()   { localStorage.setItem('serein_wishlist',   JSON.stringify(wishlist)); }
function saveOrders()     { localStorage.setItem('serein_orders',     JSON.stringify(orders)); }

// ═══════════════════════════════════════
// CATEGORY SIDEBAR RENDER
// ═══════════════════════════════════════
function renderCategoryList() {
  const all = ['All', ...categories];
  document.getElementById('categoryList').innerHTML = all.map(cat =>
    `<button class="filter-btn" id="cat-${escapeHtml(cat)}" data-cat="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`
  ).join('');
  document.getElementById('cat-' + activeFilter)?.classList.add('active');
}

// ═══════════════════════════════════════
// PRODUCTS RENDER
// ═══════════════════════════════════════
function getFilteredProducts() {
  let list = [...products];
  if (activeFilter !== 'All') list = list.filter(p => p.cat === activeFilter);
  list = list.filter(p => p.price >= activePriceMin && p.price <= activePriceMax);
  if (searchQuery) list = list.filter(p =>
    p.name.toLowerCase().includes(searchQuery) || p.cat.toLowerCase().includes(searchQuery)
  );
  if (activeQuickFilter === 'new')  list = list.filter(p => p.badge === 'new');
  if (activeQuickFilter === 'sale') list = list.filter(p => p.badge === 'sale');
  if (activeSort === 'price-asc')   list.sort((a, b) => a.price - b.price);
  else if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (activeSort === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name));
  else if (activeSort === 'rating')     list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderProducts() {
  const list = getFilteredProducts();
  const grid = document.getElementById('productsGrid');
  document.getElementById('countBadge').textContent = list.length === products.length
    ? `Showing all ${list.length} products`
    : `Showing ${list.length} of ${products.length} products`;

  if (!list.length) {
    grid.innerHTML = `<div class="no-results" style="grid-column:1/-1">
      <div class="nr-icon">
        <svg class="svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <p>No products found. Try a different filter.</p>
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => {
    const inCart = cart.some(c => c.id === p.id);
    const inWish = wishlist.some(w => w.id === p.id);
    const starsHtml = renderStars(p.rating);
    return `<div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="product-img" loading="lazy" onerror="this.style.opacity='0'">
        <button class="wish-btn ${inWish ? 'active' : ''}" title="Wishlist">
          <svg class="svg-icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        ${p.badge ? `<span class="badge-tag badge-${escapeHtml(p.badge)}">${escapeHtml(p.badge)}</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-cat">${escapeHtml(p.cat)}</div>
        <div class="product-name">${escapeHtml(p.name)}</div>
        <div class="product-details-row">
          <div class="stars">${starsHtml} <span style="color:var(--text2);font-size:10px;margin-left:4px;">(${p.reviews})</span></div>
          <div class="product-price">${p.old ? `<span class="old">₹${p.old}</span>` : ''}₹${p.price}</div>
        </div>
        <button class="add-btn ${inCart ? 'added' : ''}">${inCart ? '✓ Added' : 'Add to Cart'}</button>
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════
// FILTER / SORT
// ═══════════════════════════════════════
function filterCat(cat) {
  activeFilter = cat;
  document.querySelectorAll('[id^="cat-"]').forEach(b => b.classList.remove('active'));
  const targetId = 'cat-' + cat;
  document.getElementById(targetId)?.classList.add('active');
  activeQuickFilter = null;
  document.getElementById('qf-new').classList.remove('active');
  document.getElementById('qf-sale').classList.remove('active');
  renderProducts();
}

function applyPriceFilter() {
  activePriceMin = parseFloat(document.getElementById('minPrice').value) || 0;
  activePriceMax = parseFloat(document.getElementById('maxPrice').value) || Infinity;
  renderProducts();
  toast('Price filter applied');
}

function applySortFilter() {
  activeSort = document.getElementById('sortSel').value;
  renderProducts();
}

function quickFilter(type) {
  if (activeQuickFilter === type) {
    activeQuickFilter = null;
    document.getElementById('qf-' + type).classList.remove('active');
  } else {
    activeQuickFilter = type;
    document.getElementById('qf-new').classList.remove('active');
    document.getElementById('qf-sale').classList.remove('active');
    document.getElementById('qf-' + type).classList.add('active');
  }
  renderProducts();
}

function handleSearch() {
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  renderProducts();
}

// ═══════════════════════════════════════
// CART
// ═══════════════════════════════════════
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...p, qty: 1 }); }
  saveCart(); updateBadges(); renderProducts();
  toast(`✓ ${p.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart(); updateBadges(); renderCart(); renderProducts();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(); renderCart();
}

function getCartSubtotal() { return cart.reduce((s, c) => s + c.price * c.qty, 0); }

function getCartTotal() {
  const sub  = getCartSubtotal();
  const disc = couponDiscount ? Math.round(sub * couponDiscount / 100) : 0;
  const ship = sub > 999 ? 0 : 79;
  return { sub, disc, ship, total: sub - disc + ship };
}

function renderCart() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!cart.length) {
    body.innerHTML = `<div class="empty-state">
      <div class="e-icon">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
      </div>
      <p>Your cart is empty.<br>Add some products to get started!</p>
    </div>`;
    footer.style.display = 'none';
    return;
  }
  footer.style.display = 'block';
  body.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-img" onerror="this.style.opacity='0'">
      <div class="cart-info">
        <div class="cart-name">${escapeHtml(item.name)}</div>
        <div class="cart-cat">${escapeHtml(item.cat)}</div>
        <div class="cart-controls-row">
          <div class="cart-controls">
            <button class="qty-btn qty-minus">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn qty-plus">+</button>
          </div>
          <div class="cart-price">₹${item.price * item.qty}</div>
          <button class="remove-btn" title="Remove">
            <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>`).join('');

  const { sub, disc, ship, total } = getCartTotal();
  document.getElementById('summaryRows').innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span class="val">₹${sub}</span></div>
    ${disc ? `<div class="summary-row" style="color:var(--green)"><span>Discount (${couponDiscount}%)</span><span class="val">−₹${disc}</span></div>` : ''}
    <div class="summary-row"><span>Shipping</span><span class="val">${ship === 0 ? '<span style="color:var(--green)">Free</span>' : '₹' + ship}</span></div>
    <div class="summary-row total"><span>Total</span><span class="val">₹${total}</span></div>`;
}

function applyCoupon() {
  const code  = document.getElementById('couponInput').value.trim().toUpperCase();
  const msgEl = document.getElementById('couponMsg');
  if (COUPONS[code]) {
    appliedCoupon  = code;
    couponDiscount = COUPONS[code];
    msgEl.className   = 'coupon-msg ok';
    msgEl.textContent = `✓ Coupon "${code}" applied! ${couponDiscount}% off.`;
    renderCart();
  } else {
    msgEl.className   = 'coupon-msg err';
    msgEl.textContent = '✗ Invalid coupon code. Try SEREIN20, SAVE10, or FIRST15.';
  }
}

// ═══════════════════════════════════════
// WISHLIST
// ═══════════════════════════════════════
function toggleWish(id) {
  const p   = products.find(x => x.id === id);
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx >= 0) { wishlist.splice(idx, 1); toast('Removed from wishlist'); }
  else          { wishlist.push(p); toast(`♥ Added to wishlist!`); }
  saveWishlist(); updateBadges(); renderProducts();
  if (document.getElementById('wishlistPanel').classList.contains('open')) renderWishlist();
}

function renderWishlist() {
  const body = document.getElementById('wishlistBody');
  if (!wishlist.length) {
    body.innerHTML = `<div class="empty-state">
      <div class="e-icon">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </div>
      <p>Your wishlist is empty.</p>
    </div>`;
    return;
  }
  body.innerHTML = wishlist.map(item => `
    <div class="wish-item" data-id="${item.id}">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="wish-img" onerror="this.style.opacity='0'">
      <div class="wish-info">
        <div class="wish-name">${escapeHtml(item.name)}</div>
        <div class="wish-price">₹${item.price}</div>
      </div>
      <div class="wish-actions">
        <button class="wish-add">Add to Cart</button>
        <button class="wish-remove">
          <svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════
function goCheckout() {
  closePanel('cart');
  setTimeout(() => { openPanel('checkout'); renderCheckout(); }, 300);
}

function renderCheckout() {
  const { sub, disc, ship, total } = getCartTotal();
  document.getElementById('checkoutBody').innerHTML = `
    <div class="form-section-title">Delivery Details</div>
    <div class="form-group"><label>Full Name</label><input id="co-name" placeholder="Your name"></div>
    <div class="form-group"><label>Email</label><input id="co-email" type="email" placeholder="email@example.com"></div>
    <div class="form-group"><label>Phone</label><input id="co-phone" type="tel" placeholder="+91 XXXXX XXXXX"></div>
    <div class="form-group"><label>Address</label><input id="co-addr" placeholder="Street address, apartment"></div>
    <div class="form-row">
      <div class="form-group"><label>City</label><input id="co-city" placeholder="City"></div>
      <div class="form-group"><label>Pincode</label><input id="co-pin" placeholder="Pincode"></div>
    </div>
    <div class="form-group">
      <label>State</label>
      <select id="co-state">
        <option>Tamil Nadu</option><option>Maharashtra</option><option>Karnataka</option>
        <option>Delhi</option><option>Gujarat</option><option>Rajasthan</option><option>Other</option>
      </select>
    </div>
    <div class="form-section-title">Payment (Simulated)</div>
    <div class="form-group"><label>Card Number</label><input id="co-card" placeholder="XXXX XXXX XXXX XXXX" maxlength="19"></div>
    <div class="form-row">
      <div class="form-group"><label>Expiry</label><input id="co-exp" placeholder="MM/YY" maxlength="5"></div>
      <div class="form-group"><label>CVV</label><input id="co-cvv" placeholder="CVV" maxlength="3"></div>
    </div>
    <div class="form-section-title">Order Summary</div>
    <div class="order-mini">
      ${cart.map(i => `<div class="order-mini-item"><span>${escapeHtml(i.name)} ×${i.qty}</span><span class="val">₹${i.price * i.qty}</span></div>`).join('')}
      ${disc ? `<div class="order-mini-item" style="color:var(--green)"><span>Discount</span><span class="val">−₹${disc}</span></div>` : ''}
      <div class="order-mini-item"><span>Shipping</span><span class="val">${ship === 0 ? 'Free' : '₹' + ship}</span></div>
      <div class="order-mini-item" style="font-weight:700;color:var(--text);margin-top:6px;padding-top:6px;border-top:1px solid var(--border)">
        <span>Total</span><span class="val">₹${total}</span>
      </div>
    </div>
    <button class="place-order-btn">🎉 Place Order — ₹${total}</button>`;
}

function formatCard(inp) {
  let v = inp.value.replace(/\D/g, '').substring(0, 16);
  inp.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function placeOrder() {
  const name  = document.getElementById('co-name')?.value;
  const email = document.getElementById('co-email')?.value;
  const addr  = document.getElementById('co-addr')?.value;
  const card  = document.getElementById('co-card')?.value;
  if (!name || !email || !addr || !card || card.length < 19) { toast('⚠️ Please fill all required fields.'); return; }

  const orderId = 'SRN-' + Date.now().toString().slice(-6);
  const { total } = getCartTotal();
  orders.unshift({ id: orderId, date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), items: [...cart], total, status: 'Processing', name });
  saveOrders();
  cart = []; appliedCoupon = null; couponDiscount = 0;
  saveCart(); updateBadges(); renderProducts();

  document.getElementById('checkoutBody').innerHTML = `
    <div class="success-wrap">
      <div class="success-icon">
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      <h2>Order Placed!</h2>
      <p>Thank you, ${escapeHtml(name.split(' ')[0])}! Your order has been received.</p>
      <div class="order-id">${escapeHtml(orderId)}</div>
      <div class="track-progress">
        <div class="track-steps">
          <div class="track-step"><div class="track-dot done">✓</div><div class="track-lbl">Placed</div></div>
          <div class="track-step">
            <div class="track-dot active">
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
            </div>
            <div class="track-lbl">Processing</div>
          </div>
          <div class="track-step">
            <div class="track-dot">
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect></svg>
            </div>
            <div class="track-lbl">Shipped</div>
          </div>
          <div class="track-step">
            <div class="track-dot">
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div class="track-lbl">Delivered</div>
          </div>
        </div>
      </div>
      <p style="font-size:13px;color:var(--text2);margin-bottom:20px">Estimated delivery: 3–5 business days</p>
      <button class="continue-btn">Continue Shopping</button>
    </div>`;
}

// ═══════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════
function renderOrders() {
  const body = document.getElementById('ordersBody');
  if (!orders.length) {
    body.innerHTML = `<div class="empty-state">
      <div class="e-icon">
        <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect></svg>
      </div>
      <p>No orders yet.<br>Shop some products!</p>
    </div>`;
    return;
  }
  const statusClass = { Processing: 'processing', Shipped: 'shipped', Delivered: 'delivered' };
  body.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-card-header">
        <span class="order-num">${escapeHtml(o.id)}</span>
        <span class="order-status status-${statusClass[o.status] || 'processing'}">${escapeHtml(o.status)}</span>
      </div>
      <div class="order-date">${escapeHtml(o.date)} · ${o.items.length} item${o.items.length > 1 ? 's' : ''}</div>
      <div class="order-items-mini">${o.items.map(i => escapeHtml(i.name)).join(', ')}</div>
      <div class="order-total">₹${o.total}</div>
    </div>`).join('');
}

// ═══════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════
function renderAdmin() {
  const body = document.getElementById('adminBody');

  if (!adminLoggedIn) {
    body.innerHTML = `<div class="admin-login">
      <div class="admin-login-icon">
        <svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
      <h2>Admin Login</h2>
      <p>Enter credentials to access the admin panel.</p>
      <div class="form-group"><label>Username</label><input id="admin-user" placeholder="admin" value="admin"></div>
      <div class="form-group"><label>Password</label><input id="admin-pass" type="password" placeholder="••••••••" value="admin123"></div>
      <p style="font-size:11px;color:var(--text2);margin-bottom:14px">Hint: admin / admin123</p>
      <button class="place-order-btn" style="width:100%">Login</button>
    </div>`;
    return;
  }

  body.innerHTML = `
    <div class="admin-tabs">
      <button class="admin-tab active" id="atab-products">Products</button>
      <button class="admin-tab"        id="atab-add">Add Product</button>
      <button class="admin-tab"        id="atab-categories">Categories</button>
      <button class="admin-tab"        id="atab-orders">Orders</button>
    </div>
    <div id="adminTabContent"></div>
    <button class="btn-cancel" style="margin-top:16px;width:100%">Logout</button>
  `;

  switchAdminTab('products');
}

function adminLogin() {
  const u = document.getElementById('admin-user').value;
  const p = document.getElementById('admin-pass').value;
  if (u === 'admin' && p === 'admin123') {
    adminLoggedIn = true;
    localStorage.setItem('serein_admin', 'true');
    renderAdmin();
  } else {
    toast('⚠️ Invalid credentials');
  }
}

function adminLogout() {
  adminLoggedIn = false;
  localStorage.removeItem('serein_admin');
  renderAdmin();
  toast('Logged out');
}

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('atab-' + tab)?.classList.add('active');

  const content = document.getElementById('adminTabContent');

  if (tab === 'products') {
    if (!products.length) {
      content.innerHTML = `<div class="empty-state">
        <div class="e-icon">
          <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect></svg>
        </div>
        <p>No products found.</p>
      </div>`;
      return;
    }
    content.innerHTML = products.map(p => `
      <div class="product-admin-item" data-id="${p.id}">
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="admin-img" onerror="this.style.opacity='0'">
        <div class="admin-product-info">
          <div class="admin-product-name">${escapeHtml(p.name)}</div>
          <div class="admin-product-price">₹${p.price} · ${escapeHtml(p.cat)}</div>
        </div>
        <div class="admin-btns">
          <button class="edit-btn">Edit</button>
          <button class="del-btn">Delete</button>
        </div>
      </div>`).join('');
  }

  else if (tab === 'add') {
    editingProductId = null;
    const addTab = document.getElementById('atab-add');
    if (addTab) addTab.textContent = 'Add Product';
    content.innerHTML = renderProductForm();
  }

  else if (tab === 'categories') {
    content.innerHTML = `
      <div class="add-product-form">
        <h3>Manage Categories</h3>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label>New Category</label>
            <input id="new-category-name" placeholder="Enter category name">
          </div>
          <div class="form-group" style="align-self:end">
            <button class="place-order-btn">Add Category</button>
          </div>
        </div>
        <div style="margin-top:16px">
          ${categories.length
            ? categories.map(cat => `
              <div class="product-admin-item">
                <div class="admin-product-info">
                  <div class="admin-product-name">${escapeHtml(cat)}</div>
                </div>
                <div class="admin-btns">
                  <button class="del-btn" data-cat="${escapeHtml(cat)}">Delete</button>
                </div>
              </div>`).join('')
            : `<div class="empty-state">
                <div class="e-icon">
                  <svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                </div>
                <p>No categories yet.</p>
              </div>`
          }
        </div>
      </div>`;
  }

  else if (tab === 'orders') {
    if (!orders.length) {
      content.innerHTML = `<div class="empty-state">
        <div class="e-icon">
          <svg class="svg-icon" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect></svg>
        </div>
        <p>No orders yet.</p>
      </div>`;
      return;
    }
    content.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-card-header">
          <span class="order-num">${escapeHtml(o.id)}</span>
          <select class="order-status-sel" data-id="${escapeHtml(o.id)}"
            style="font-size:12px;padding:4px 8px;border-radius:4px;border:1px solid var(--border);background:var(--surface2);color:var(--text);cursor:pointer">
            ${['Processing', 'Shipped', 'Delivered'].map(s => `<option ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="order-date">${escapeHtml(o.date)} · ${escapeHtml(o.name)}</div>
        <div class="order-total">₹${o.total}</div>
      </div>`).join('');
    
    // Bind dynamic select change listener for orders
    document.querySelectorAll('.order-status-sel').forEach(el => {
      el.addEventListener('change', (e) => {
        const orderId = e.target.getAttribute('data-id');
        updateOrderStatus(orderId, e.target.value);
      });
    });
  }
}

function updateOrderStatus(id, status) {
  const o = orders.find(x => x.id === id);
  if (o) { o.status = status; saveOrders(); toast(`Order ${id} → ${status}`); }
}

function confirmDelete(id) {
  showModal('Confirm Delete', 'Are you sure you want to delete this product?', () => deleteProduct(id));
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== Number(id));
  saveProducts();
  renderProducts();
  switchAdminTab('products');
  toast('🗑 Product deleted!');
}

function addCategory() {
  const input = document.getElementById('new-category-name');
  const name  = input.value.trim();
  if (!name) { toast('⚠️ Category name required'); return; }
  if (categories.some(c => c.toLowerCase() === name.toLowerCase())) { toast('⚠️ Category already exists'); return; }
  categories.push(name);
  saveCategories();
  renderCategoryList();
  switchAdminTab('categories');
  toast('✓ Category added!');
}

function deleteCategory(cat) {
  if (products.some(p => p.cat === cat)) {
    toast('⚠️ This category is used by products. Change or delete those products first.');
    return;
  }
  categories = categories.filter(c => c !== cat);
  if (activeFilter === cat) activeFilter = 'All';
  saveCategories();
  renderCategoryList();
  switchAdminTab('categories');
  toast('🗑 Category deleted!');
}

function renderProductForm(p) {
  return `<div class="add-product-form">
    <h3>${p ? 'Edit Product' : 'Add New Product'}</h3>
    <div class="form-group">
      <label>Name</label>
      <input id="pf-name" value="${p ? escapeHtml(p.name) : ''}">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Category</label>
        <select id="pf-cat">
          ${categories.map(c => `<option ${p && p.cat === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Product Image</label>
        <input type="file" id="pf-image-file" accept="image/*">
        <small style="color:var(--text2);font-size:12px;margin-top:4px;display:block">Select an image file (JPG, PNG, etc.)</small>
        <div id="image-preview" style="margin-top:8px;">
          ${p ? `<img src="${escapeHtml(p.image)}" style="max-width:100px;max-height:100px;border-radius:8px;border:1px solid var(--border);">` : ''}
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Price ₹</label>
        <input id="pf-price" type="number" value="${p ? p.price : ''}">
      </div>
      <div class="form-group">
        <label>Old Price ₹</label>
        <input id="pf-old" type="number" value="${p && p.old ? p.old : ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Rating</label>
        <input id="pf-rating" type="number" step="0.1" min="1" max="5" value="${p ? p.rating : '4.5'}">
      </div>
      <div class="form-group">
        <label>Badge</label>
        <select id="pf-badge">
          <option value="">None</option>
          <option ${p && p.badge === 'new'  ? 'selected' : ''} value="new">New</option>
          <option ${p && p.badge === 'sale' ? 'selected' : ''} value="sale">Sale</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Description</label>
      <input id="pf-desc" value="${p ? escapeHtml(p.desc) : ''}">
    </div>
    <button class="place-order-btn" style="margin-top:8px">
      ${p ? 'Update Product' : 'Add Product'}
    </button>
  </div>`;
}

function editProduct(id) {
  editingProductId = id;
  const p = products.find(x => x.id === id);
  switchAdminTab('add');
  document.getElementById('adminTabContent').innerHTML = renderProductForm(p);
  const addTab = document.getElementById('atab-add');
  if (addTab) addTab.textContent = 'Edit Product';
  const preview = document.getElementById('image-preview');
  if (p && p.image && preview) {
    preview.innerHTML = `<img src="${escapeHtml(p.image)}" style="max-width:100px;max-height:100px;border-radius:8px;border:1px solid var(--border);">`;
  }
}

function saveProduct() {
  const name      = document.getElementById('pf-name').value.trim();
  const price     = parseFloat(document.getElementById('pf-price').value);
  const fileInput = document.getElementById('pf-image-file');

  if (!name || !price) { toast('⚠️ Name and price required'); return; }

  const saveData = (imageData) => {
    const data = {
      name,
      price,
      image:   imageData,
      cat:     document.getElementById('pf-cat').value,
      old:     parseFloat(document.getElementById('pf-old').value) || undefined,
      rating:  parseFloat(document.getElementById('pf-rating').value) || 4.5,
      reviews: editingProductId ? products.find(p => p.id === editingProductId)?.reviews || 0 : 0,
      badge:   document.getElementById('pf-badge').value || undefined,
      desc:    document.getElementById('pf-desc').value
    };

    if (editingProductId) {
      const idx = products.findIndex(p => p.id === editingProductId);
      if (idx !== -1) products[idx] = { ...products[idx], ...data };
      toast('✓ Product updated!');
      editingProductId = null;
    } else {
      data.id = Date.now();
      products.push(data);
      toast('✓ Product added!');
    }

    saveProducts();
    renderProducts();
    switchAdminTab('products');
    const addTab = document.getElementById('atab-add');
    if (addTab) addTab.textContent = 'Add Product';
  };

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => saveData(e.target.result);
    reader.readAsDataURL(fileInput.files[0]);
  } else if (editingProductId) {
    const existing = products.find(p => p.id === editingProductId);
    saveData(existing ? existing.image : '');
  } else {
    saveData('images/linen_tote_bag.jpg');
  }
}

function previewImage(input) {
  const preview = document.getElementById('image-preview');
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      preview.innerHTML = `<img src="${escapeHtml(e.target.result)}" style="max-width:100px;max-height:100px;border-radius:8px;border:1px solid var(--border);">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ═══════════════════════════════════════
// PRODUCT DETAIL MODAL
// ═══════════════════════════════════════
function openProductModal(id) {
  const p      = products.find(x => x.id === id);
  const inCart = cart.some(c => c.id === id);
  const inWish = wishlist.some(w => w.id === id);
  const starsHtml = renderStars(p.rating);
  document.getElementById('modalTitle').innerHTML = escapeHtml(p.name);
  document.getElementById('modalSub').innerHTML = `
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--text2);margin-bottom:6px">${escapeHtml(p.cat)}</div>
    <div style="color:#e0a840;font-size:13px;margin-bottom:8px;display:flex;align-items:center;gap:2px">${starsHtml} <span style="color:var(--text2);margin-left:4px;">(${p.reviews} reviews)</span></div>
    <div style="font-size:13px;color:var(--text2);margin-bottom:14px;line-height:1.6">${escapeHtml(p.desc)}</div>
    <div style="font-family:'DM Mono',monospace;font-size:22px;font-weight:600;margin-bottom:16px">
      ${p.old ? `<span style="font-size:14px;text-decoration:line-through;color:var(--text2);margin-right:8px">₹${p.old}</span>` : ''}₹${p.price}
    </div>`;
  const confirmBtn = document.getElementById('modalConfirmBtn');
  const cancelBtn  = document.getElementById('modalCancelBtn');
  confirmBtn.textContent = inCart ? '✓ In Cart' : 'Add to Cart';
  confirmBtn.onclick     = () => { if (!inCart) { addToCart(id); closeModal(); } };
  confirmBtn.disabled    = inCart;
  cancelBtn.textContent  = inWish ? '♥ Wishlisted' : '♡ Wishlist';
  cancelBtn.onclick      = () => { toggleWish(id); closeModal(); };
  showModal();
}

// ═══════════════════════════════════════
// CHATBOT
// ═══════════════════════════════════════
const chatResponses = {
  'hello|hi|hey':                          ['Hey there! 👋 Welcome to Serein! How can I help you today?', "Hello! I'm the Serein concierge. Ask me about products, shipping, or orders!"],
  'product|products|shop|what do you sell': ['We curate lifestyle products including Skincare, Home & Living, Fashion, Wellness, and Stationery! 🛍️'],
  'cart|shopping cart':                    ['You can add items to cart by clicking "Add to Cart" on any product card. Your cart total updates automatically! 🛒'],
  'coupon|discount|offer|code':            ['Great news! We have active coupons: SEREIN20 (20% off), SAVE10 (10% off), FIRST15 (15% off for first order). Apply them at checkout! 🏷️'],
  'shipping|delivery|when will':           ["We offer complimentary shipping on orders over ₹999! Otherwise, it's just ₹79. Delivery takes 3–5 business days. 📦"],
  'return|refund|exchange':                ['We accept returns within 7 days of delivery. Products must be unused and in original packaging. Contact care@serein.com 📧'],
  'payment|pay|card':                      ['We accept all major credit/debit cards. All transactions are 100% secure! 💳'],
  'order|track|tracking':                  ['You can track your orders by clicking the box icon in the header. Your order status updates in real-time!'],
  'wishlist':                              ['Save your favorite products to your wishlist by clicking the heart icon on any product! ♥'],
  'dark mode|theme|light mode':            ['You can toggle dark/light mode using the sun/moon button in the header. Your preference is saved!'],
  'help|support':                          ['I can help with: products, cart, coupons, shipping, returns, orders, and more! Just ask 😊'],
  'bye|goodbye|thanks|thank you':          ['Happy shopping at Serein! Come back soon! 🌟', 'Thank you! Have a wonderful day! ✨'],
};

const suggestions = ['Active coupons?', 'Track my order', 'Shipping info', 'Return policy'];
let chatOpen = false;

function initChat() {
  addBotMsg("Hi! I'm Serein's concierge 🌿 How can I help you today?");
  renderSuggestions();
}

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatbotPanel').classList.toggle('show', chatOpen);
  // Wait, chatbotBtn icon is styled inside CSS now, we don't need text toggle.
}

function addBotMsg(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className   = 'chat-msg bot';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className   = 'chat-msg user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function renderSuggestions() {
  document.getElementById('chatSuggestions').innerHTML = suggestions
    .map(s => `<button class="suggest-btn" data-suggest="${escapeHtml(s)}">
      <svg class="svg-icon suggest-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
      ${escapeHtml(s)}
    </button>`).join('');
}

function sendSuggestion(text) {
  document.getElementById('chatInput').value = text;
  sendChat();
}

function sendChat() {
  const inp  = document.getElementById('chatInput');
  const text = inp.value.trim();
  if (!text) return;
  addUserMsg(text);
  inp.value = '';
  setTimeout(() => {
    const lower = text.toLowerCase();
    let response = "I'm not sure about that, but our team can help! Email us at care@serein.com 📧";
    for (const [pattern, replies] of Object.entries(chatResponses)) {
      if (pattern.split('|').some(p => lower.includes(p))) {
        response = replies[Math.floor(Math.random() * replies.length)];
        break;
      }
    }
    addBotMsg(response);
  }, 600);
}

// ═══════════════════════════════════════
// PANELS
// ═══════════════════════════════════════
function openPanel(name) {
  closeAllPanels(false);
  document.getElementById(name + 'Panel').classList.add('open');
  document.getElementById('overlay').classList.add('show');
  if (name === 'cart')     renderCart();
  if (name === 'wishlist') renderWishlist();
  if (name === 'orders')   renderOrders();
  if (name === 'admin')    renderAdmin();
}

// Ensure overlay gets hidden properly
function closePanel(name) {
  document.getElementById(name + 'Panel').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

function closeAllPanels(hideOverlay = true) {
  ['cart', 'wishlist', 'checkout', 'orders', 'admin'].forEach(n =>
    document.getElementById(n + 'Panel')?.classList.remove('open')
  );
  if (hideOverlay) document.getElementById('overlay').classList.remove('show');
}

// ═══════════════════════════════════════
// DARK MODE
// ═══════════════════════════════════════
function toggleDark() {
  darkMode = !darkMode;
  localStorage.setItem('serein_dark', darkMode);
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
}

// ═══════════════════════════════════════
// BADGES
// ═══════════════════════════════════════
function updateBadges() {
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const wishCount = wishlist.length;
  const cb = document.getElementById('cartBadge');
  const wb = document.getElementById('wishBadge');
  cb.textContent = cartCount; cb.style.display = cartCount ? 'flex' : 'none';
  wb.textContent = wishCount; wb.style.display = wishCount ? 'flex' : 'none';
}

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
function toast(msg) {
  const wrap = document.getElementById('toastWrap');
  const el   = document.createElement('div');
  el.className   = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ═══════════════════════════════════════
// MODAL
// ═══════════════════════════════════════
let modalCallback = null;

function showModal(title, sub, cb) {
  if (title) document.getElementById('modalTitle').textContent = title;
  if (sub)   document.getElementById('modalSub').textContent   = sub;
  if (cb) {
    modalCallback = cb;
    const confirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancel  = document.getElementById('modalCancelBtn');
    confirmBtn.textContent      = 'Delete';
    confirmBtn.style.background = 'var(--red)';
    confirmBtn.onclick          = () => { cb(); closeModal(); };
    modalCancel.textContent     = 'Cancel';
    modalCancel.onclick         = closeModal;
  }
  document.getElementById('confirmModal').classList.add('show');
}

function closeModal() {
  document.getElementById('confirmModal').classList.remove('show');
  document.getElementById('modalConfirmBtn').style.background = '';
  modalCallback = null;
}

// ═══════════════════════════════════════
// SCROLL REVEAL (additive — targets static .reveal elements only,
// never re-runs against JS-rendered lists, so it's safe against re-renders)
// ═══════════════════════════════════════
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach(t => io.observe(t));
}

// ═══════════════════════════════════════
// CENTRAL EVENT BINDINGS (Refactored from HTML onclick inline handlers)
// ═══════════════════════════════════════
function bindEvents() {
  // Navigation & Header Click Handlers
  document.getElementById('logoLink')?.addEventListener('click', () => {
    closeAllPanels();
  });
  
  document.getElementById('searchInput')?.addEventListener('input', handleSearch);
  
  document.getElementById('wishlistToggleBtn')?.addEventListener('click', () => openPanel('wishlist'));
  document.getElementById('cartToggleBtn')?.addEventListener('click', () => openPanel('cart'));
  document.getElementById('ordersToggleBtn')?.addEventListener('click', () => openPanel('orders'));
  document.getElementById('themeBtn')?.addEventListener('click', toggleDark);
  document.getElementById('adminToggleBtn')?.addEventListener('click', () => openPanel('admin'));
  
  // Hero Explore Link
  document.getElementById('heroExploreLink')?.addEventListener('click', () => {
    // Standard smooth scroll anchor action handled by browser default behaviour
  });

  // Hero Quick Filter
  document.getElementById('heroNewArrivalsBtn')?.addEventListener('click', (e) => {
    quickFilter('new');
  });
  
  // Price filtering & sorting sidebar bindings
  document.getElementById('applyPriceBtn')?.addEventListener('click', applyPriceFilter);
  document.getElementById('sortSel')?.addEventListener('change', applySortFilter);
  
  // Quick filters sidebar
  document.getElementById('qf-new')?.addEventListener('click', () => quickFilter('new'));
  document.getElementById('qf-sale')?.addEventListener('click', () => quickFilter('sale'));
  
  // Footer shop categories links delegation
  document.getElementById('footerShopCol')?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const cat = link.getAttribute('data-cat');
    if (cat) filterCat(cat);
  });
  
  // Footer support links
  document.getElementById('footerSupportCol')?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const id = link.id;
    if (id === 'footerChatLink') {
      e.preventDefault();
      toggleChat();
    } else if (id === 'footerTrackOrderLink') {
      e.preventDefault();
      openPanel('orders');
    } else if (id === 'footerReturnsLink') {
      e.preventDefault();
      sendSuggestion('Return policy');
    } else if (id === 'footerShippingLink') {
      e.preventDefault();
      sendSuggestion('Shipping info');
    }
  });
  
  // Newsletter subscription
  document.getElementById('footerSubscribeBtn')?.addEventListener('click', () => {
    const emailInput = document.getElementById('footerEmail');
    if (emailInput.value.includes('@')) {
      toast('✓ Subscribed! Welcome to Serein.');
      emailInput.value = '';
    } else {
      toast('⚠️ Enter a valid email');
    }
  });
  
  // Panel close triggers
  document.getElementById('overlay')?.addEventListener('click', () => closeAllPanels());
  document.getElementById('cartCloseBtn')?.addEventListener('click', () => closePanel('cart'));
  document.getElementById('couponApplyBtn')?.addEventListener('click', applyCoupon);
  document.getElementById('proceedCheckoutBtn')?.addEventListener('click', goCheckout);
  
  document.getElementById('wishlistCloseBtn')?.addEventListener('click', () => closePanel('wishlist'));
  document.getElementById('checkoutCloseBtn')?.addEventListener('click', () => closePanel('checkout'));
  document.getElementById('ordersCloseBtn')?.addEventListener('click', () => closePanel('orders'));
  document.getElementById('adminCloseBtn')?.addEventListener('click', () => closePanel('admin'));
  
  // Chat Concierge controls
  document.getElementById('chatPanelCloseBtn')?.addEventListener('click', toggleChat);
  document.getElementById('chatSendBtn')?.addEventListener('click', sendChat);
  document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChat();
  });
  document.getElementById('chatbotBtn')?.addEventListener('click', toggleChat);
  
  // Confirm modal close actions
  document.getElementById('modalCancelBtn')?.addEventListener('click', closeModal);
  document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Dynamic Elements - Event Delegation Setup
  
  // 1. Sidebar Categories
  document.getElementById('categoryList')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const cat = btn.getAttribute('data-cat');
    if (cat) filterCat(cat);
  });
  
  // 2. Product Grid delegation (cart clicks, wishlist clicks, card details clicks)
  document.getElementById('productsGrid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const id = Number(card.getAttribute('data-id'));
    
    const wishBtn = e.target.closest('.wish-btn');
    const addBtn = e.target.closest('.add-btn');
    
    if (wishBtn) {
      e.stopPropagation();
      toggleWish(id);
    } else if (addBtn) {
      e.stopPropagation();
      addToCart(id);
    } else {
      openProductModal(id);
    }
  });
  
  // 3. Cart panel quantity changes and item deletions
  document.getElementById('cartBody')?.addEventListener('click', (e) => {
    const itemRow = e.target.closest('.cart-item');
    if (!itemRow) return;
    const id = Number(itemRow.getAttribute('data-id'));
    
    if (e.target.closest('.qty-btn')) {
      const delta = e.target.classList.contains('qty-plus') ? 1 : -1;
      changeQty(id, delta);
    } else if (e.target.closest('.remove-btn')) {
      removeFromCart(id);
    }
  });
  
  // 4. Wishlist add to cart and removal delegation
  document.getElementById('wishlistBody')?.addEventListener('click', (e) => {
    const itemRow = e.target.closest('.wish-item');
    if (!itemRow) return;
    const id = Number(itemRow.getAttribute('data-id'));
    
    if (e.target.closest('.wish-add')) {
      addToCart(id);
      toggleWish(id);
    } else if (e.target.closest('.wish-remove')) {
      toggleWish(id);
    }
  });
  
  // 5. Checkout billing panel input adjustments and action triggers
  document.getElementById('checkoutBody')?.addEventListener('input', (e) => {
    if (e.target.id === 'co-card') {
      formatCard(e.target);
    }
  });
  
  document.getElementById('checkoutBody')?.addEventListener('click', (e) => {
    if (e.target.closest('.place-order-btn')) {
      placeOrder();
    } else if (e.target.closest('.continue-btn')) {
      closePanel('checkout');
    }
  });
  
  // 6. Admin Panel authentication controls
  document.getElementById('adminBody')?.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('.admin-tab');
    if (tabBtn) {
      const tab = tabBtn.id.replace('atab-', '');
      switchAdminTab(tab);
      return;
    }
    
    if (e.target.closest('.btn-cancel') && e.target.textContent.includes('Logout')) {
      adminLogout();
      return;
    }
    
    if (e.target.closest('.place-order-btn') && e.target.parentNode.classList.contains('admin-login')) {
      adminLogin();
      return;
    }
  });
  
  // 7. Admin Panel dynamic form interactions (Product additions/modifications)
  document.getElementById('adminTabContent')?.addEventListener('click', (e) => {
    const itemRow = e.target.closest('.product-admin-item');
    const id = itemRow ? Number(itemRow.getAttribute('data-id')) : null;
    
    if (e.target.closest('.edit-btn') && id) {
      editProduct(id);
    } else if (e.target.closest('.del-btn')) {
      if (id) {
        confirmDelete(id);
      } else {
        const catName = e.target.getAttribute('data-cat');
        if (catName) deleteCategory(catName);
      }
    } else if (e.target.closest('.place-order-btn')) {
      if (document.getElementById('new-category-name')) {
        addCategory();
      } else if (document.getElementById('pf-name')) {
        saveProduct();
      }
    }
  });
  
  document.getElementById('adminTabContent')?.addEventListener('change', (e) => {
    if (e.target.id === 'pf-image-file') {
      previewImage(e.target);
    }
  });
  
  // 8. Chat suggestions triggers
  document.getElementById('chatSuggestions')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.suggest-btn');
    if (!btn) return;
    const text = btn.getAttribute('data-suggest');
    if (text) sendSuggestion(text);
  });
}

// ─── START ───
init();