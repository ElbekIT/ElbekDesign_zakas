// Firebase Realtime Database Configuration
import { initializeApp as firebaseInitializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyDlyb188VfYALM8FfjhoN5NAH80uIUIaMk",
  authDomain: "shopmagazina-988f7.firebaseapp.com",
  databaseURL: "https://shopmagazina-988f7-default-rtdb.firebaseio.com",
  projectId: "shopmagazina-988f7",
  storageBucket: "shopmagazina-988f7.firebasestorage.app",
  messagingSenderId: "455847708477",
  appId: "1:455847708477:web:1282e7a719bd4f8314e754",
  measurementId: "G-P943SCYXTT",
}

const app = firebaseInitializeApp(firebaseConfig)
const database = getDatabase(app)

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// Global variables
let currentUser = null
let cart = JSON.parse(localStorage.getItem("nexusCart")) || []
const wishlist = JSON.parse(localStorage.getItem("nexusWishlist")) || []

// Enhanced product data with better organization
const products = [
  {
    id: 1,
    title: "Premium Wireless Headphones",
    category: "electronics",
    price: 299.99,
    originalPrice: 399.99,
    image: "img/product1.jpg",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 1247,
    likes: 156,
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation and 30-hour battery life.",
    features: ["Active Noise Cancellation", "30-hour Battery", "Quick Charge", "Premium Sound Quality"],
  },
  {
    id: 2,
    title: "Smart Fitness Watch",
    category: "electronics",
    price: 199.99,
    originalPrice: 249.99,
    image: "img/product2.jpg",
    badge: "New",
    rating: 4.6,
    reviews: 892,
    likes: 89,
    description: "Track your fitness goals with advanced health monitoring, GPS capabilities, and smart notifications.",
    features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "Smart Notifications"],
  },
  {
    id: 3,
    title: "Designer Leather Handbag",
    category: "fashion",
    price: 159.99,
    originalPrice: 199.99,
    image: "img/product3.jpg",
    badge: "Sale",
    rating: 4.9,
    reviews: 456,
    likes: 234,
    description: "Elegant handcrafted leather handbag perfect for any occasion. Made from premium Italian leather.",
    features: ["Italian Leather", "Handcrafted", "Multiple Compartments", "Elegant Design"],
  },
  {
    id: 4,
    title: "Professional Camera",
    category: "electronics",
    price: 899.99,
    originalPrice: 1099.99,
    image: "img/product4.jpg",
    badge: "Pro",
    rating: 4.7,
    reviews: 234,
    likes: 67,
    description:
      "Capture stunning photos with this professional-grade camera system featuring advanced optics and 4K video recording.",
    features: ["4K Video Recording", "Professional Optics", "Image Stabilization", "Weather Sealed"],
  },
  {
    id: 5,
    title: "Luxury Skincare Set",
    category: "beauty",
    price: 89.99,
    originalPrice: 119.99,
    image: "img/product5.jpg",
    badge: "Popular",
    rating: 4.5,
    reviews: 678,
    likes: 123,
    description: "Premium skincare collection for radiant and healthy skin. Includes cleanser, serum, and moisturizer.",
    features: ["Natural Ingredients", "Anti-Aging Formula", "Dermatologist Tested", "Complete Set"],
  },
  {
    id: 6,
    title: "Smart Home Speaker",
    category: "electronics",
    price: 79.99,
    originalPrice: 99.99,
    image: "img/product6.jpg",
    badge: "Smart",
    rating: 4.4,
    reviews: 345,
    likes: 78,
    description: "Voice-controlled smart speaker with premium sound quality and smart home integration.",
    features: ["Voice Control", "Smart Home Hub", "Premium Audio", "Multi-Room Audio"],
  },
  {
    id: 7,
    title: "Minimalist Dining Set",
    category: "home",
    price: 599.99,
    originalPrice: 799.99,
    image: "img/product7.jpg",
    badge: "Luxury",
    rating: 4.8,
    reviews: 123,
    likes: 45,
    description: "Modern dining set that combines style with functionality. Perfect for contemporary homes.",
    features: ["Modern Design", "Solid Wood", "Seats 4 People", "Easy Assembly"],
  },
  {
    id: 8,
    title: "Gaming Mechanical Keyboard",
    category: "electronics",
    price: 129.99,
    originalPrice: 159.99,
    image: "img/product8.jpg",
    badge: "Gaming",
    rating: 4.7,
    reviews: 567,
    likes: 189,
    description: "High-performance mechanical keyboard designed for gaming enthusiasts with RGB backlighting.",
    features: ["Mechanical Switches", "RGB Backlighting", "Gaming Optimized", "Durable Build"],
  },
  {
    id: 9,
    title: "Organic Cotton T-Shirt",
    category: "fashion",
    price: 29.99,
    originalPrice: 39.99,
    image: "img/product9.jpg",
    badge: "Eco",
    rating: 4.3,
    reviews: 789,
    likes: 267,
    description: "Sustainable and comfortable organic cotton t-shirt. Perfect for everyday wear.",
    features: ["100% Organic Cotton", "Eco-Friendly", "Comfortable Fit", "Sustainable Fashion"],
  },
  {
    id: 10,
    title: "Aromatherapy Diffuser",
    category: "home",
    price: 49.99,
    originalPrice: 69.99,
    image: "img/product10.jpg",
    badge: "Wellness",
    rating: 4.6,
    reviews: 432,
    likes: 98,
    description: "Create a relaxing atmosphere with this elegant aromatherapy diffuser featuring LED lighting.",
    features: ["Ultrasonic Technology", "LED Lighting", "Timer Function", "Whisper Quiet"],
  },
]

// DOM elements
const loadingScreen = document.getElementById("loadingScreen")
const searchToggle = document.getElementById("searchToggle")
const searchOverlay = document.getElementById("searchOverlay")
const searchClose = document.getElementById("searchClose")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const cartToggle = document.getElementById("cartToggle")
const cartBadge = document.getElementById("cartBadge")
const cartSidebar = document.getElementById("cartSidebar")
const cartItems = document.getElementById("cartItems")
const emptyCart = document.getElementById("emptyCart")
const cartSubtotal = document.getElementById("cartSubtotal")
const cartShipping = document.getElementById("cartShipping")
const cartTotal = document.getElementById("cartTotal")
const checkoutBtn = document.getElementById("checkoutBtn")
const productsGrid = document.getElementById("productsGrid")
const notification = document.getElementById("notification")
const newsletterForm = document.getElementById("newsletterForm")
const menuToggle = document.getElementById("menuToggle")
const floatingNav = document.getElementById("floatingNav")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    appInit()
  }, 2500)
})

function appInit() {
  // Check if user is logged in
  const userData = localStorage.getItem("userData")
  if (!userData) {
    window.location.href = "registration.html"
    return
  }

  currentUser = JSON.parse(userData)
  updateUserDisplay()
  renderProducts()
  updateCartUI()
  initializeEventListeners()
  initializeScrollEffects()
  animateStats()
}

// Update user display
function updateUserDisplay() {
  // Add user menu to navigation
  const navActions = document.querySelector(".nav-actions")
  if (navActions && !document.getElementById("userMenu")) {
    const userMenu = document.createElement("div")
    userMenu.id = "userMenu"
    userMenu.className = "user-menu"
    userMenu.innerHTML = `
      <button class="user-btn" onclick="toggleUserMenu()">
        <i class="fas fa-user"></i>
        <span>${currentUser.fullName.split(" ")[0]}</span>
      </button>
      <div class="user-dropdown" id="userDropdown">
        <a href="#" onclick="showAccountPanel()">
          <i class="fas fa-user-circle"></i>
          My Account
        </a>
        <a href="#" onclick="showWishlist()">
          <i class="fas fa-heart"></i>
          Wishlist (${wishlist.length})
        </a>
        <a href="#" onclick="logout()">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
    `
    navActions.insertBefore(userMenu, cartToggle)
  }
}

// Animate statistics
function animateStats() {
  const stats = [
    { element: '[data-stat="customers"]', target: 50, suffix: "K+" },
    { element: '[data-stat="products"]', target: 10, suffix: "K+" },
    { element: '[data-stat="satisfaction"]', target: 99, suffix: "%" },
  ]

  stats.forEach((stat) => {
    const element = document.querySelector(stat.element)
    if (element) {
      animateCounter(element, stat.target, stat.suffix)
    }
  })
}

function animateCounter(element, target, suffix = "") {
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current) + suffix
  }, 30)
}

// Initialize event listeners
function initializeEventListeners() {
  // Search functionality
  searchToggle?.addEventListener("click", toggleSearch)
  searchClose?.addEventListener("click", toggleSearch)
  searchBtn?.addEventListener("click", handleSearch)
  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch()
  })

  // Cart functionality
  cartToggle?.addEventListener("click", toggleCart)
  checkoutBtn?.addEventListener("click", handleCheckout)

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      e.target.classList.add("active")
      const filter = e.target.dataset.filter
      renderProducts(filter)
    })
  })

  // Newsletter form
  newsletterForm?.addEventListener("submit", handleNewsletterSubmit)

  // Navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelectorAll(".nav-link").forEach((l) => l.classList.remove("active"))
      e.target.classList.add("active")

      const target = e.target.getAttribute("href")
      if (target === "#products") {
        scrollToProducts()
      } else if (target === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  })

  // Close overlays on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (searchOverlay?.classList.contains("active")) toggleSearch()
      if (cartSidebar?.classList.contains("active")) toggleCart()
      closeAllModals()
    }
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    const userDropdown = document.getElementById("userDropdown")
    const userMenu = document.getElementById("userMenu")
    if (userDropdown && userMenu && !userMenu.contains(e.target)) {
      userDropdown.classList.remove("active")
    }
  })
}

// Search functionality
function toggleSearch() {
  searchOverlay?.classList.toggle("active")
  if (searchOverlay?.classList.contains("active")) {
    searchInput?.focus()
  }
}

function handleSearch() {
  const query = searchInput?.value.trim().toLowerCase()
  if (!query) return

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query),
  )

  renderFilteredProducts(filteredProducts)
  toggleSearch()
  scrollToProducts()
  showNotification(`Found ${filteredProducts.length} products for "${query}"`)
}

function scrollToProducts() {
  document.getElementById("products")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  })
}

// Cart functionality
function toggleCart() {
  cartSidebar?.classList.toggle("active")
  document.body.style.overflow = cartSidebar?.classList.contains("active") ? "hidden" : ""
}

// User menu functionality
function toggleUserMenu() {
  const userDropdown = document.getElementById("userDropdown")
  userDropdown?.classList.toggle("active")
}

function showAccountPanel() {
  createModal(
    "My Account",
    `
    <div class="account-info">
      <div class="info-item">
        <label>Full Name:</label>
        <span>${currentUser.fullName}</span>
      </div>
      <div class="info-item">
        <label>Phone Number:</label>
        <span>${currentUser.phoneNumber}</span>
      </div>
      <div class="info-item">
        <label>Registration Date:</label>
        <span>${new Date(currentUser.registrationDate).toLocaleDateString()}</span>
      </div>
    </div>
    <div class="account-actions">
      <button class="btn-danger" onclick="confirmDeleteAccount()">
        <i class="fas fa-trash"></i>
        Delete Account
      </button>
    </div>
  `,
  )
}

function showWishlist() {
  const wishlistContent =
    wishlist.length === 0
      ? '<div class="empty-wishlist"><i class="fas fa-heart"></i><p>Your wishlist is empty</p></div>'
      : wishlist
          .map((productId) => {
            const product = products.find((p) => p.id === productId)
            return product
              ? `
          <div class="wishlist-item">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.svg?height=80&width=80'">
            <div class="item-info">
              <h4>${product.title}</h4>
              <p class="price">$${product.price}</p>
            </div>
            <div class="item-actions">
              <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
              <button onclick="removeFromWishlist(${product.id})" class="btn-secondary">Remove</button>
            </div>
          </div>
        `
              : ""
          })
          .join("")

  createModal("My Wishlist", `<div class="wishlist-items">${wishlistContent}</div>`)
}

function createModal(title, content) {
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" onclick="closeModal(this)">&times;</button>
      </div>
      <div class="modal-body">${content}</div>
    </div>
  `
  document.body.appendChild(modal)
  modal.style.display = "flex"

  // Close modal when clicking overlay
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal.querySelector(".modal-close"))
  })
}

function closeModal(button) {
  const modal = button.closest(".modal")
  modal?.remove()
}

function closeAllModals() {
  document.querySelectorAll(".modal").forEach((modal) => modal.remove())
}

function confirmDeleteAccount() {
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    // Clear local storage
    localStorage.removeItem("userData")
    localStorage.removeItem("nexusCart")
    localStorage.removeItem("nexusWishlist")

    showNotification("Account deleted successfully", "success")
    setTimeout(() => {
      window.location.href = "registration.html"
    }, 2000)
  }
}

function logout() {
  localStorage.removeItem("userData")
  localStorage.removeItem("nexusCart")
  localStorage.removeItem("nexusWishlist")
  window.location.href = "registration.html"
}

// Product rendering
function renderProducts(filter = "all") {
  const filteredProducts = filter === "all" ? products : products.filter((product) => product.category === filter)

  productsGrid.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")

  // Add staggered animation
  setTimeout(() => {
    document.querySelectorAll(".product-card").forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("animate-fadeIn")
    })
  }, 100)
}

function renderFilteredProducts(filteredProducts) {
  productsGrid.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")
}

function createProductCard(product) {
  const isInCart = cart.some((item) => item.id === product.id)
  const isInWishlist = wishlist.includes(product.id)
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.svg?height=300&width=300'">
        <div class="product-badge">${product.badge}</div>
        <div class="product-actions">
          <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn wishlist-btn ${isInWishlist ? "active" : ""}" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${product.price}</span>
          <span class="original-price">$${product.originalPrice}</span>
          <span class="discount-percent">-${discountPercent}%</span>
        </div>
        <div class="product-likes">
          <i class="fas fa-heart"></i>
          <span>${product.likes} likes</span>
        </div>
        <button class="add-to-cart ${isInCart ? "in-cart" : ""}" onclick="addToCart(${product.id})">
          <i class="fas fa-${isInCart ? "check" : "shopping-cart"}"></i>
          <span>${isInCart ? "In Cart" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  `
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>'
  }

  return stars
}

// Wishlist functionality
function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId)

  if (index > -1) {
    wishlist.splice(index, 1)
    showNotification("Removed from wishlist", "info")
  } else {
    wishlist.push(productId)
    showNotification("Added to wishlist!", "success")
  }

  localStorage.setItem("nexusWishlist", JSON.stringify(wishlist))
  updateWishlistUI()
  renderProducts(getCurrentFilter())
}

function removeFromWishlist(productId) {
  const index = wishlist.indexOf(productId)
  if (index > -1) {
    wishlist.splice(index, 1)
    localStorage.setItem("nexusWishlist", JSON.stringify(wishlist))
    updateWishlistUI()
    showNotification("Removed from wishlist", "info")

    // Refresh wishlist modal if open
    const wishlistModal = document.querySelector(".modal")
    if (wishlistModal && wishlistModal.querySelector("h3").textContent === "My Wishlist") {
      closeModal(wishlistModal.querySelector(".modal-close"))
      showWishlist()
    }
  }
}

function updateWishlistUI() {
  const userMenu = document.getElementById("userMenu")
  if (userMenu) {
    const wishlistLink = userMenu.querySelector('a[onclick="showWishlist()"]')
    if (wishlistLink) {
      wishlistLink.innerHTML = `
        <i class="fas fa-heart"></i>
        Wishlist (${wishlist.length})
      `
    }
  }
}

function getCurrentFilter() {
  const activeFilter = document.querySelector(".filter-btn.active")
  return activeFilter ? activeFilter.dataset.filter : "all"
}

// Cart functionality
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  updateCartUI()
  saveCartToStorage()
  showNotification("Product added to cart!", "success")
  renderProducts(getCurrentFilter()) // Refresh to update button states
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  saveCartToStorage()
  showNotification("Product removed from cart", "error")
  renderProducts(getCurrentFilter()) // Refresh to update button states
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
    return
  }

  updateCartUI()
  saveCartToStorage()
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartBadge) cartBadge.textContent = totalItems

  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = "flex"
    if (cartItems) cartItems.style.display = "none"
    const cartFooter = document.getElementById("cartFooter")
    if (cartFooter) cartFooter.style.display = "none"
  } else {
    if (emptyCart) emptyCart.style.display = "none"
    if (cartItems) cartItems.style.display = "block"
    const cartFooter = document.getElementById("cartFooter")
    if (cartFooter) cartFooter.style.display = "block"

    if (cartItems) {
      cartItems.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}" onerror="this.src='/placeholder.svg?height=80&width=80'">
          </div>
          <div class="cart-item-details">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">$${item.price}</div>
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? "disabled" : ""}>
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove item">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `,
        )
        .join("")
    }

    // Update cart summary
    const subtotal = totalPrice
    const shipping = subtotal > 100 ? 0 : 10
    const total = subtotal + shipping

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`
    if (cartShipping) cartShipping.textContent = shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`
  }
}

function saveCartToStorage() {
  localStorage.setItem("nexusCart", JSON.stringify(cart))
}

// Checkout functionality
async function handleCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  try {
    // Show loading state
    if (checkoutBtn) {
      checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>'
      checkoutBtn.disabled = true
    }

    // Prepare order data
    const orderData = {
      customer: currentUser,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: new Date().toISOString(),
    }

    // Send to Telegram
    await sendOrderToTelegram(orderData)

    // Clear cart
    cart = []
    updateCartUI()
    saveCartToStorage()
    toggleCart()

    showNotification("Order placed successfully! 🎉", "success")
  } catch (error) {
    console.error("Checkout error:", error)
    showNotification("Failed to place order. Please try again.", "error")
  } finally {
    // Reset button state
    if (checkoutBtn) {
      checkoutBtn.innerHTML = '<span>Proceed to Checkout</span><i class="fas fa-arrow-right"></i>'
      checkoutBtn.disabled = false
    }
  }
}

async function sendOrderToTelegram(orderData) {
  const message = `🛒 *NEW ORDER RECEIVED!*

👤 *Customer Details:*
• Name: ${orderData.customer.fullName}
• Phone: ${orderData.customer.phoneNumber}

📦 *Order Items:*
${orderData.items.map((item) => `• ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

💰 *Total: $${orderData.total.toFixed(2)}*

📅 *Order Date:* ${new Date(orderData.timestamp).toLocaleString()}

---
🏪 *NEXUS STORE* - Premium Shopping Experience`

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send order to Telegram")
  }
}

// Quick view functionality
function quickView(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const isInWishlist = wishlist.includes(productId)
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  createModal(
    product.title,
    `
    <div class="product-quick-view">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.svg?height=300&width=300'">
      </div>
      <div class="product-details">
        <div class="product-category">${product.category}</div>
        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="rating-count">(${product.reviews} reviews)</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${product.price}</span>
          <span class="original-price">$${product.originalPrice}</span>
          <span class="discount-percent">-${discountPercent}%</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-features">
          <h4>Key Features:</h4>
          <ul>
            ${product.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
        </div>
        <div class="product-actions">
          <button class="btn-primary" onclick="addToCart(${product.id}); closeModal(this)">
            <i class="fas fa-shopping-cart"></i>
            Add to Cart
          </button>
          <button class="btn-secondary ${isInWishlist ? "active" : ""}" onclick="toggleWishlist(${product.id})">
            <i class="fas fa-heart"></i>
            ${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  `,
  )
}

// Newsletter functionality
function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]')?.value

  if (email) {
    showNotification("Thank you for subscribing!", "success")
    e.target.reset()
  }
}

// Notification system
function showNotification(message, type = "success") {
  if (!notification) return

  const notificationIcon = notification.querySelector(".notification-icon")
  const notificationText = notification.querySelector(".notification-text")

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
  }

  if (notificationIcon) notificationIcon.className = `notification-icon ${icons[type] || icons.success}`
  if (notificationText) notificationText.textContent = message
  notification.className = `notification ${type}`

  notification.classList.add("show")

  setTimeout(() => {
    notification.classList.remove("show")
  }, 3000)
}

// Scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0
  const floatingNav = document.getElementById("floatingNav")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Floating nav hide/show on scroll
    if (floatingNav) {
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        floatingNav.style.transform = "translateX(-50%) translateY(-100px)"
      } else {
        floatingNav.style.transform = "translateX(-50%) translateY(0)"
      }
    }

    lastScrollTop = scrollTop

    // Add scroll-to-top button
    if (scrollTop > 500) {
      if (!document.querySelector(".scroll-to-top")) {
        const scrollBtn = document.createElement("button")
        scrollBtn.className = "scroll-to-top"
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'
        scrollBtn.style.cssText = `
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: 1.2rem;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          transition: all var(--transition-normal);
        `

        scrollBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        })

        scrollBtn.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-5px)"
          this.style.boxShadow = "var(--shadow-xl)"
        })

        scrollBtn.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0)"
          this.style.boxShadow = "var(--shadow-lg)"
        })

        document.body.appendChild(scrollBtn)
      }
    } else {
      const scrollBtn = document.querySelector(".scroll-to-top")
      if (scrollBtn) {
        scrollBtn.remove()
      }
    }
  })
}

// Make functions globally available
window.toggleUserMenu = toggleUserMenu
window.showAccountPanel = showAccountPanel
window.showWishlist = showWishlist
window.closeModal = closeModal
window.confirmDeleteAccount = confirmDeleteAccount
window.logout = logout
window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.updateQuantity = updateQuantity
window.toggleWishlist = toggleWishlist
window.removeFromWishlist = removeFromWishlist
window.quickView = quickView
window.scrollToProducts = scrollToProducts

// Export for registration page
window.database = database
window.ref = ref
window.push = push
window.set = set
