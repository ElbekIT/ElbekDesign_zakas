// Global Variables
let currentUser = null
let cartItems = []
let wishlistItems = []
let currentPage = "home"

// Sample Products Data
const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isNew: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    price: 399.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isPopular: true,
  },
  {
    id: "3",
    name: "Luxury Leather Jacket",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    discount: 15,
  },
  {
    id: "4",
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "5",
    name: "Professional Camera Lens",
    price: 599.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Photography",
  },
  {
    id: "6",
    name: "Comfortable Running Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports",
    isPopular: true,
    discount: 25,
  },
  {
    id: "7",
    name: "Wireless Bluetooth Speaker",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isNew: true,
    discount: 10,
  },
  {
    id: "8",
    name: "Designer Sunglasses",
    price: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    isPopular: true,
  },
]

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// DOM Elements
const elements = {
  // Navigation
  navBtns: document.querySelectorAll(".nav-btn"),
  pages: document.querySelectorAll(".page"),

  // User
  userGreeting: document.getElementById("user-greeting"),
  accountBtn: document.getElementById("account-btn"),
  userModal: document.getElementById("user-modal"),
  userModalTitle: document.getElementById("user-modal-title"),
  userForm: document.getElementById("user-form"),
  userNameInput: document.getElementById("user-name"),
  userPhoneInput: document.getElementById("user-phone"),
  saveUserBtn: document.getElementById("save-user-btn"),
  deleteAccountBtn: document.getElementById("delete-account-btn"),
  closeUserModal: document.getElementById("close-user-modal"),

  // Cart
  cartBtn: document.getElementById("cart-btn"),
  cartCount: document.getElementById("cart-count"),
  cartModal: document.getElementById("cart-modal"),
  cartItems: document.getElementById("cart-items"),
  cartItemsCount: document.getElementById("cart-items-count"),
  cartTotal: document.getElementById("cart-total"),
  cartFooter: document.getElementById("cart-footer"),
  emptyCart: document.getElementById("empty-cart"),
  clearCartBtn: document.getElementById("clear-cart-btn"),
  checkoutBtn: document.getElementById("checkout-btn"),
  closeCartModal: document.getElementById("close-cart-modal"),
  installationRequired: document.getElementById("installation-required"),
  shareLocation: document.getElementById("share-location"),
  locationInfo: document.getElementById("location-info"),

  // Wishlist
  wishlistBtn: document.getElementById("wishlist-btn"),
  wishlistCount: document.getElementById("wishlist-count"),
  wishlistModal: document.getElementById("wishlist-modal"),
  wishlistItems: document.getElementById("wishlist-items"),
  wishlistItemsCount: document.getElementById("wishlist-items-count"),
  emptyWishlist: document.getElementById("empty-wishlist"),
  closeWishlistModal: document.getElementById("close-wishlist-modal"),

  // Products
  productsGrid: document.getElementById("products-grid"),
  newProductsGrid: document.getElementById("new-products-grid"),
  popularProductsGrid: document.getElementById("popular-products-grid"),
  saleProductsGrid: document.getElementById("sale-products-grid"),

  // Search
  searchInput: document.getElementById("search-input"),

  // Loading
  loading: document.getElementById("loading"),

  // Toast
  toastContainer: document.getElementById("toast-container"),
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  loadUserData()
  loadCartData()
  loadWishlistData()
  setupEventListeners()
  renderProducts()
  updateUI()
})

// Load User Data from localStorage
function loadUserData() {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateUserGreeting()
  } else {
    showUserModal()
  }
}

// Load Cart Data from localStorage
function loadCartData() {
  const savedCart = localStorage.getItem("cartItems")
  if (savedCart) {
    cartItems = JSON.parse(savedCart)
  }
}

// Load Wishlist Data from localStorage
function loadWishlistData() {
  const savedWishlist = localStorage.getItem("wishlistItems")
  if (savedWishlist) {
    wishlistItems = JSON.parse(savedWishlist)
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Navigation
  elements.navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page
      switchPage(page)
    })
  })

  // User Modal
  elements.accountBtn.addEventListener("click", showUserModal)
  elements.closeUserModal.addEventListener("click", hideUserModal)
  elements.userForm.addEventListener("submit", handleUserRegistration)
  elements.deleteAccountBtn.addEventListener("click", handleDeleteAccount)

  // Cart Modal
  elements.cartBtn.addEventListener("click", showCartModal)
  elements.closeCartModal.addEventListener("click", hideCartModal)
  elements.clearCartBtn.addEventListener("click", clearCart)
  elements.checkoutBtn.addEventListener("click", handleCheckout)
  elements.shareLocation.addEventListener("change", handleLocationShare)

  // Wishlist Modal
  elements.wishlistBtn.addEventListener("click", showWishlistModal)
  elements.closeWishlistModal.addEventListener("click", hideWishlistModal)

  // Search
  elements.searchInput.addEventListener("input", handleSearch)

  // Close modals on backdrop click
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })
  })
}

// Switch Page
function switchPage(page) {
  currentPage = page

  // Update navigation
  elements.navBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page)
  })

  // Update pages
  elements.pages.forEach((pageEl) => {
    pageEl.classList.toggle("active", pageEl.id === `${page}-page`)
  })

  // Render products for specific pages
  if (page === "new") {
    renderFilteredProducts("new", elements.newProductsGrid)
  } else if (page === "popular") {
    renderFilteredProducts("popular", elements.popularProductsGrid)
  } else if (page === "sale") {
    renderFilteredProducts("sale", elements.saleProductsGrid)
  }
}

// Render Products
function renderProducts() {
  renderAllProducts(elements.productsGrid)
}

function renderAllProducts(container) {
  container.innerHTML = ""
  products.forEach((product) => {
    const productCard = createProductCard(product)
    container.appendChild(productCard)
  })
}

function renderFilteredProducts(filter, container) {
  container.innerHTML = ""
  let filteredProducts = []

  if (filter === "new") {
    filteredProducts = products.filter((p) => p.isNew)
  } else if (filter === "popular") {
    filteredProducts = products.filter((p) => p.isPopular)
  } else if (filter === "sale") {
    filteredProducts = products.filter((p) => p.discount)
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    container.appendChild(productCard)
  })
}

// Create Product Card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  const likes = getLikes(product.id)
  const hasLiked = hasUserLiked(product.id)
  const isInWishlist = wishlistItems.includes(product.id)

  card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='/placeholder.svg?height=200&width=280'">
            <div class="product-badges">
                ${product.isNew ? '<span class="product-badge badge-new">Yangi</span>' : ""}
                ${product.isPopular ? '<span class="product-badge badge-popular">Ommabop</span>' : ""}
                ${product.discount ? `<span class="product-badge badge-discount">-${product.discount}%</span>` : ""}
            </div>
            <button class="wishlist-btn ${isInWishlist ? "active" : ""}" onclick="toggleWishlist('${product.id}')">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <span class="rating-text">(4.8)</span>
            </div>
            <div class="product-price">
                <span class="price-current">$${discountedPrice.toFixed(2)}</span>
                ${product.discount ? `<span class="price-original">$${product.price.toFixed(2)}</span>` : ""}
            </div>
            <div class="product-likes">
                <button class="like-btn ${hasLiked ? "liked" : ""}" onclick="likeProduct('${product.id}')" ${hasLiked ? "disabled" : ""}>
                    <i class="fas fa-heart"></i>
                    <span>${likes}</span>
                </button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                <i class="fas fa-shopping-cart"></i>
                Savatchaga qo'shish
            </button>
        </div>
    `

  return card
}

// Product Functions
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cartItems.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.push({
      productId: productId,
      quantity: 1,
    })
  }

  saveCartData()
  updateUI()
  showToast("Mahsulot savatchaga qo'shildi!", "success")
}

function toggleWishlist(productId) {
  if (wishlistItems.includes(productId)) {
    wishlistItems = wishlistItems.filter((id) => id !== productId)
    showToast("Mahsulot yoqtirganlardan olib tashlandi", "warning")
  } else {
    wishlistItems.push(productId)
    showToast("Mahsulot yoqtirganlarga qo'shildi!", "success")
  }

  saveWishlistData()
  updateUI()
  renderProducts()

  // Update current page products if needed
  if (currentPage === "new") {
    renderFilteredProducts("new", elements.newProductsGrid)
  } else if (currentPage === "popular") {
    renderFilteredProducts("popular", elements.popularProductsGrid)
  } else if (currentPage === "sale") {
    renderFilteredProducts("sale", elements.saleProductsGrid)
  }
}

function likeProduct(productId) {
  if (hasUserLiked(productId)) return

  const currentLikes = getLikes(productId)
  const newLikes = currentLikes + 1

  localStorage.setItem(`likes_${productId}`, newLikes.toString())
  localStorage.setItem(`user_liked_${productId}`, "true")

  renderProducts()

  // Update current page products if needed
  if (currentPage === "new") {
    renderFilteredProducts("new", elements.newProductsGrid)
  } else if (currentPage === "popular") {
    renderFilteredProducts("popular", elements.popularProductsGrid)
  } else if (currentPage === "sale") {
    renderFilteredProducts("sale", elements.saleProductsGrid)
  }
}

function getLikes(productId) {
  const savedLikes = localStorage.getItem(`likes_${productId}`)
  return savedLikes ? Number.parseInt(savedLikes) : Math.floor(Math.random() * 100) + 10
}

function hasUserLiked(productId) {
  return localStorage.getItem(`user_liked_${productId}`) === "true"
}

// User Functions
function showUserModal() {
  if (currentUser) {
    elements.userModalTitle.textContent = "Akkaunt ma'lumotlari"
    elements.userNameInput.value = currentUser.name
    elements.userPhoneInput.value = currentUser.phone
    elements.saveUserBtn.textContent = "Yangilash"
    elements.deleteAccountBtn.style.display = "block"
  } else {
    elements.userModalTitle.textContent = "Ro'yxatdan o'tish"
    elements.userNameInput.value = ""
    elements.userPhoneInput.value = ""
    elements.saveUserBtn.textContent = "Saqlash"
    elements.deleteAccountBtn.style.display = "none"
  }

  elements.userModal.classList.add("active")
}

function hideUserModal() {
  elements.userModal.classList.remove("active")
}

function handleUserRegistration(e) {
  e.preventDefault()

  const name = elements.userNameInput.value.trim()
  const phone = elements.userPhoneInput.value.trim()

  if (!name || !phone) {
    showToast("Iltimos, barcha maydonlarni to'ldiring!", "error")
    return
  }

  currentUser = { name, phone }
  localStorage.setItem("user", JSON.stringify(currentUser))

  updateUserGreeting()
  hideUserModal()
  showToast("Ma'lumotlar saqlandi!", "success")
}

function handleDeleteAccount() {
  if (confirm("Haqiqatan ham akkauntni o'chirmoqchimisiz?")) {
    localStorage.removeItem("user")
    localStorage.removeItem("cartItems")
    localStorage.removeItem("wishlistItems")

    // Clear likes data
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("likes_") || key.startsWith("user_liked_")) {
        localStorage.removeItem(key)
      }
    })

    location.reload()
  }
}

function updateUserGreeting() {
  if (currentUser) {
    elements.userGreeting.textContent = `Salom, ${currentUser.name}!`
  } else {
    elements.userGreeting.textContent = ""
  }
}

// Cart Functions
function showCartModal() {
  renderCartItems()
  elements.cartModal.classList.add("active")
}

function hideCartModal() {
  elements.cartModal.classList.remove("active")
}

function renderCartItems() {
  if (cartItems.length === 0) {
    elements.emptyCart.style.display = "block"
    elements.cartFooter.style.display = "none"
    elements.cartItems.innerHTML = ""
    return
  }

  elements.emptyCart.style.display = "none"
  elements.cartFooter.style.display = "block"

  elements.cartItems.innerHTML = ""
  let total = 0

  cartItems.forEach((item) => {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return

    const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price
    const itemTotal = discountedPrice * item.quantity
    total += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-image" onerror="this.src='/placeholder.svg?height=60&width=60'">
            <div class="cart-item-info">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">$${discountedPrice.toFixed(2)}</div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.productId}')">
                <i class="fas fa-times"></i>
            </button>
        `

    elements.cartItems.appendChild(cartItem)
  })

  elements.cartTotal.textContent = `$${total.toFixed(2)}`
  elements.cartItemsCount.textContent = cartItems.length
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(productId)
    return
  }

  const item = cartItems.find((item) => item.productId === productId)
  if (item) {
    item.quantity = newQuantity
    saveCartData()
    renderCartItems()
    updateUI()
  }
}

function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.productId !== productId)
  saveCartData()
  renderCartItems()
  updateUI()
  showToast("Mahsulot savatchadan olib tashlandi", "warning")
}

function clearCart() {
  if (confirm("Savatchani tozalamoqchimisiz?")) {
    cartItems = []
    saveCartData()
    renderCartItems()
    updateUI()
    showToast("Savatcha tozalandi", "success")
  }
}

function handleLocationShare() {
  if (elements.shareLocation.checked) {
    if (navigator.geolocation) {
      showLoading()
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const locationText = `${latitude}, ${longitude}`
          elements.locationInfo.textContent = `Joylashuv: ${locationText}`
          elements.locationInfo.style.display = "block"
          hideLoading()
        },
        (error) => {
          console.error("Error getting location:", error)
          elements.locationInfo.textContent = "Joylashuv olinmadi"
          elements.locationInfo.style.display = "block"
          hideLoading()
          showToast("Joylashuvni olishda xatolik yuz berdi", "error")
        },
      )
    } else {
      elements.locationInfo.textContent = "Geolokatsiya qo'llab-quvvatlanmaydi"
      elements.locationInfo.style.display = "block"
      showToast("Geolokatsiya qo'llab-quvvatlanmaydi", "error")
    }
  } else {
    elements.locationInfo.style.display = "none"
  }
}

async function handleCheckout() {
    if (!elements.installationRequired.checked) {\
        showToast('Iltimos, "Ustanovka q
