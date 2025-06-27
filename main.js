// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// Global variables
let currentUser = null
let cart = JSON.parse(localStorage.getItem("nexusCart")) || []
let wishlist = JSON.parse(localStorage.getItem("nexusWishlist")) || []
let userLocation = null
let currentFilter = "all"
let displayedProducts = 8
let totalLikes = 0

// Product data
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
    description:
      "Experience crystal-clear audio with our premium wireless headphones featuring active noise cancellation.",
    likes: 0,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
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
    description: "Track your fitness goals with advanced health monitoring and GPS capabilities.",
    likes: 0,
    isNew: true,
    isBestSeller: false,
    isOnSale: true,
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
    description: "Elegant handcrafted leather handbag perfect for any occasion.",
    likes: 0,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
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
    description: "Capture stunning photos with this professional-grade camera system.",
    likes: 0,
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
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
    description: "Premium skincare collection for radiant and healthy skin.",
    likes: 0,
    isNew: true,
    isBestSeller: false,
    isOnSale: true,
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
    description: "Voice-controlled smart speaker with premium sound quality.",
    likes: 0,
    isNew: false,
    isBestSeller: false,
    isOnSale: true,
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
    description: "Modern dining set that combines style with functionality.",
    likes: 0,
    isNew: false,
    isBestSeller: false,
    isOnSale: true,
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
    description: "High-performance mechanical keyboard designed for gaming enthusiasts.",
    likes: 0,
    isNew: true,
    isBestSeller: true,
    isOnSale: false,
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
    description: "Sustainable and comfortable organic cotton t-shirt.",
    likes: 0,
    isNew: false,
    isBestSeller: false,
    isOnSale: true,
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
    description: "Create a relaxing atmosphere with this elegant aromatherapy diffuser.",
    likes: 0,
    isNew: true,
    isBestSeller: false,
    isOnSale: true,
  },
  {
    id: 11,
    title: "Luxury Watch",
    category: "jewelry",
    price: 799.99,
    originalPrice: 999.99,
    image: "img/product11.jpg",
    badge: "Premium",
    rating: 4.9,
    reviews: 234,
    description: "Elegant timepiece with premium materials and craftsmanship.",
    likes: 0,
    isNew: true,
    isBestSeller: true,
    isOnSale: true,
  },
  {
    id: 12,
    title: "Yoga Mat Set",
    category: "sports",
    price: 59.99,
    originalPrice: 79.99,
    image: "img/product12.jpg",
    badge: "Fitness",
    rating: 4.4,
    reviews: 567,
    description: "Premium yoga mat with accessories for your wellness journey.",
    likes: 0,
    isNew: false,
    isBestSeller: false,
    isOnSale: true,
  },
]

// DOM elements
const loadingScreen = document.getElementById("loadingScreen")
const userWelcome = document.getElementById("userWelcome")
const userName = document.getElementById("userName")
const logoutBtn = document.getElementById("logoutBtn")
const deleteAccountBtn = document.getElementById("deleteAccountBtn")
const cartBtn = document.getElementById("cartBtn")
const cartBadge = document.getElementById("cartBadge")
const cartTotal = document.getElementById("cartTotal")
const cartModal = document.getElementById("cartModal")
const cartBody = document.getElementById("cartBody")
const cartItems = document.getElementById("cartItems")
const cartFooter = document.getElementById("cartFooter")
const emptyCart = document.getElementById("emptyCart")
const cartSubtotal = document.getElementById("cartSubtotal")
const cartShipping = document.getElementById("cartShipping")
const cartTotalAmount = document.getElementById("cartTotalAmount")
const checkoutBtn = document.getElementById("checkoutBtn")
const wishlistBtn = document.getElementById("wishlistBtn")
const wishlistBadge = document.getElementById("wishlistBadge")
const wishlistModal = document.getElementById("wishlistModal")
const wishlistBody = document.getElementById("wishlistBody")
const wishlistItems = document.getElementById("wishlistItems")
const emptyWishlist = document.getElementById("emptyWishlist")
const productsGrid = document.getElementById("productsGrid")
const newArrivalsGrid = document.getElementById("newArrivalsGrid")
const bestSellersGrid = document.getElementById("bestSellersGrid")
const saleGrid = document.getElementById("saleGrid")
const loadMoreBtn = document.getElementById("loadMoreBtn")
const notification = document.getElementById("notification")
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const locationModal = document.getElementById("locationModal")
const shareLocationBtn = document.getElementById("shareLocationBtn")
const skipLocationBtn = document.getElementById("skipLocationBtn")
const totalLikesElement = document.getElementById("totalLikes")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    loadingScreen.classList.add("hidden")
    initializeApp()
  }, 2500)
})

async function initializeApp() {
  // Check if user is logged in
  const userData = localStorage.getItem("userData")
  if (!userData) {
    window.location.href = "registration.html"
    return
  }

  currentUser = JSON.parse(userData)

  // Show user welcome
  if (userWelcome && userName) {
    userName.textContent = currentUser.fullName
    userWelcome.style.display = "flex"
  }

  // Load products from Firebase or use local data
  await loadProducts()

  // Initialize UI
  updateCartUI()
  updateWishlistUI()
  updateStats()
  updateCategoryCounts()
  renderProducts()
  renderSectionProducts()

  // Initialize event listeners
  initializeEventListeners()
  initializeScrollEffects()

  // Initialize Firebase listeners
  initializeFirebaseListeners()

  // Load user's wishlist from Firebase
  await loadUserWishlist()

  // Update total likes
  await updateTotalLikes()
}

// Initialize event listeners
function initializeEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const section = e.target.dataset.section
      if (section) {
        showSection(section)
        updateActiveNavLink(e.target)
      }
    })
  })

  // Account menu
  document.querySelectorAll(".account-menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      const tab = e.target.dataset.tab
      if (tab) {
        showAccountTab(tab)
        updateActiveAccountTab(e.target)
      }
    })
  })

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout)
  }

  // Delete account
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", showDeleteAccountConfirmation)
  }

  // Delete account confirmation
  const deleteAccountConfirm = document.getElementById("deleteAccountConfirm")
  if (deleteAccountConfirm) {
    deleteAccountConfirm.addEventListener("click", deleteAccount)
  }

  // Cart functionality
  if (cartBtn) {
    cartBtn.addEventListener("click", toggleCart)
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout)
  }

  // Wishlist functionality
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", toggleWishlist)
  }

  // Search functionality
  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch()
    })
  }

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"))
      e.target.classList.add("active")
      currentFilter = e.target.dataset.filter
      displayedProducts = 8
      renderProducts()
    })
  })

  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMoreProducts)
  }

  // Location sharing
  if (shareLocationBtn) {
    shareLocationBtn.addEventListener("click", shareLocation)
  }
  if (skipLocationBtn) {
    skipLocationBtn.addEventListener("click", skipLocation)
  }

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // Close modals when clicking overlay
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-overlay")) {
      toggleCart()
    }
    if (e.target.classList.contains("wishlist-overlay")) {
      toggleWishlist()
    }
    if (e.target.classList.contains("location-overlay")) {
      closeLocationModal()
    }
  })

  // Close notification
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("notification-close")) {
      hideNotification()
    }
  })

  // Global functions
  window.scrollToProducts = scrollToProducts
  window.showSection = showSection
  window.filterProducts = filterProducts
  window.toggleCart = toggleCart
  window.toggleWishlist = toggleWishlist
  window.addToCart = addToCart
  window.removeFromCart = removeFromCart
  window.updateQuantity = updateQuantity
  window.toggleWishlistItem = toggleWishlistItem
  window.quickView = quickView

  // Close overlays on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (cartModal && cartModal.classList.contains("active")) {
        toggleCart()
      }
      if (wishlistModal && wishlistModal.classList.contains("active")) {
        toggleWishlist()
      }
      if (locationModal && locationModal.classList.contains("active")) {
        closeLocationModal()
      }
    }
  })
}

// Load products from Firebase
async function loadProducts() {
  try {
    if (window.db && window.firebaseModules) {
      const { collection, getDocs } = window.firebaseModules
      const querySnapshot = await getDocs(collection(window.db, "products"))

      if (!querySnapshot.empty) {
        const firebaseProducts = []
        querySnapshot.forEach((doc) => {
          firebaseProducts.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        // Merge with local products if needed
        if (firebaseProducts.length > 0) {
          products.splice(0, products.length, ...firebaseProducts)
        }
      } else {
        // Seed products to Firebase
        await seedProductsToFirebase()
      }
    }
  } catch (error) {
    console.error("Error loading products:", error)
  }
}

// Seed products to Firebase
async function seedProductsToFirebase() {
  try {
    if (window.db && window.firebaseModules) {
      const { collection, addDoc } = window.firebaseModules

      for (const product of products) {
        await addDoc(collection(window.db, "products"), product)
      }
    }
  } catch (error) {
    console.error("Error seeding products:", error)
  }
}

// Load user's wishlist from Firebase
async function loadUserWishlist() {
  try {
    if (window.db && window.firebaseModules && currentUser) {
      const { collection, query, where, getDocs } = window.firebaseModules
      const q = query(collection(window.db, "wishlists"), where("userId", "==", currentUser.id))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          wishlist = data.products || []
          localStorage.setItem("nexusWishlist", JSON.stringify(wishlist))
          updateWishlistUI()
        })
      }
    }
  } catch (error) {
    console.error("Error loading wishlist:", error)
  }
}

// Initialize Firebase listeners
function initializeFirebaseListeners() {
  try {
    if (window.db && window.firebaseModules) {
      const { collection, onSnapshot } = window.firebaseModules

      // Listen for product updates
      onSnapshot(collection(window.db, "products"), (snapshot) => {
        const updatedProducts = []
        snapshot.forEach((doc) => {
          updatedProducts.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        if (updatedProducts.length > 0) {
          products.splice(0, products.length, ...updatedProducts)
          renderProducts()
          renderSectionProducts()
          updateCategoryCounts()
          updateTotalLikes()
        }
      })

      // Listen for user wishlist updates
      if (currentUser) {
        const { query, where } = window.firebaseModules
        const q = query(collection(window.db, "wishlists"), where("userId", "==", currentUser.id))
        onSnapshot(q, (snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data()
            wishlist = data.products || []
            localStorage.setItem("nexusWishlist", JSON.stringify(wishlist))
            updateWishlistUI()
          })
        })
      }
    }
  } catch (error) {
    console.error("Error initializing Firebase listeners:", error)
  }
}

// Navigation functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Update account section if needed
  if (sectionId === "account") {
    loadAccountData()
  }
}

function updateActiveNavLink(activeLink) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  activeLink.classList.add("active")
}

function showAccountTab(tabId) {
  // Hide all tabs
  document.querySelectorAll(".account-tab").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show target tab
  const targetTab = document.getElementById(tabId === "wishlist" ? "wishlist-tab" : tabId)
  if (targetTab) {
    targetTab.classList.add("active")
  }

  // Load specific tab data
  if (tabId === "wishlist") {
    loadWishlistTab()
  }
}

function updateActiveAccountTab(activeTab) {
  document.querySelectorAll(".account-menu-item").forEach((item) => {
    item.classList.remove("active")
  })
  activeTab.classList.add("active")
}

// Load account data
function loadAccountData() {
  if (!currentUser) return

  const profileInfo = document.getElementById("profileInfo")
  if (profileInfo) {
    profileInfo.innerHTML = `
      <div class="profile-card">
        <div class="profile-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="profile-details">
          <h4>${currentUser.fullName}</h4>
          <p><i class="fas fa-phone"></i> ${currentUser.phoneNumber}</p>
          <p><i class="fab fa-telegram"></i> ${currentUser.telegramUsername}</p>
          ${currentUser.location ? `<p><i class="fas fa-map-marker-alt"></i> Location shared</p>` : ""}
          <p><i class="fas fa-calendar"></i> Member since ${new Date(currentUser.registrationDate).toLocaleDateString()}</p>
        </div>
      </div>
    `
  }
}

// Load wishlist tab
function loadWishlistTab() {
  const wishlistGrid = document.getElementById("wishlistGrid")
  if (!wishlistGrid) return

  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="empty-state">
        <i class="far fa-heart"></i>
        <h4>Your wishlist is empty</h4>
        <p>Start adding products to your wishlist</p>
      </div>
    `
  } else {
    wishlistGrid.innerHTML = wishlist
      .map((item) => {
        const product = products.find((p) => p.id === item.id)
        if (!product) return ""

        return `
          <div class="wishlist-product-card">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.svg?height=200&width=200'">
            </div>
            <div class="product-info">
              <h4>${product.title}</h4>
              <p class="product-price">$${product.price}</p>
              <div class="product-actions">
                <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn-secondary" onclick="toggleWishlistItem(${product.id})">Remove</button>
              </div>
            </div>
          </div>
        `
      })
      .join("")
  }
}

// Scroll to products section
function scrollToProducts() {
  const productsSection = document.getElementById("products")
  if (productsSection) {
    productsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Handle search
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase()
  if (!query) return

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query),
  )

  renderFilteredProducts(filteredProducts)
  showSection("home")
  scrollToProducts()
  showNotification(`Found ${filteredProducts.length} products for "${query}"`)
}

// Filter products by category
function filterProducts(category) {
  currentFilter = category
  displayedProducts = 8
  renderProducts()
  showSection("home")
  scrollToProducts()
}

// Update category counts
function updateCategoryCounts() {
  const categories = ["electronics", "fashion", "home", "beauty", "sports", "jewelry"]

  categories.forEach((category) => {
    const count = products.filter((product) => product.category === category).length
    const countElement = document.getElementById(`${category}Count`)
    if (countElement) {
      countElement.textContent = `${count} products`
    }
  })
}

// Render products
function renderProducts() {
  if (!productsGrid) return

  const filteredProducts =
    currentFilter === "all" ? products : products.filter((product) => product.category === currentFilter)

  const productsToShow = filteredProducts.slice(0, displayedProducts)

  productsGrid.innerHTML = productsToShow.map((product) => createProductCard(product)).join("")

  // Show/hide load more button
  if (loadMoreBtn) {
    loadMoreBtn.style.display = displayedProducts >= filteredProducts.length ? "none" : "inline-flex"
  }

  // Add animation to new products
  setTimeout(() => {
    document.querySelectorAll(".product-card").forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`
      card.classList.add("animate-fadeIn")
    })
  }, 100)
}

// Render section-specific products
function renderSectionProducts() {
  // New Arrivals
  if (newArrivalsGrid) {
    const newProducts = products.filter((product) => product.isNew)
    newArrivalsGrid.innerHTML = newProducts.map((product) => createProductCard(product)).join("")
  }

  // Best Sellers
  if (bestSellersGrid) {
    const bestSellers = products.filter((product) => product.isBestSeller)
    bestSellersGrid.innerHTML = bestSellers.map((product) => createProductCard(product)).join("")
  }

  // Sale Products
  if (saleGrid) {
    const saleProducts = products.filter((product) => product.isOnSale)
    saleGrid.innerHTML = saleProducts.map((product) => createProductCard(product)).join("")
  }
}

// Render filtered products
function renderFilteredProducts(filteredProducts) {
  if (!productsGrid) return

  productsGrid.innerHTML = filteredProducts.map((product) => createProductCard(product)).join("")

  if (loadMoreBtn) {
    loadMoreBtn.style.display = "none"
  }
}

// Create product card
function createProductCard(product) {
  const isInCart = cart.some((item) => item.id === product.id)
  const isInWishlist = wishlist.some((item) => item.id === product.id)
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" onerror="this.src='/placeholder.svg?height=300&width=300'">
        <div class="product-badge">${product.badge}</div>
        <div class="product-actions">
          <button class="action-btn-small" onclick="quickView(${product.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn-small ${isInWishlist ? "liked" : ""}" onclick="toggleWishlistItem(${product.id})">
            <i class="fa${isInWishlist ? "s" : "r"} fa-heart"></i>
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
          <span>${product.likes || 0} likes</span>
        </div>
        <button class="add-to-cart ${isInCart ? "in-cart" : ""}" onclick="addToCart(${product.id})">
          <i class="fas fa-${isInCart ? "check" : "shopping-cart"}"></i>
          <span>${isInCart ? "In Cart" : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  `
}

// Generate star rating
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

// Add product to cart
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

  // Update button state
  const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart`)
  if (button) {
    button.classList.add("in-cart")
    button.innerHTML = '<i class="fas fa-check"></i><span>In Cart</span>'
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  saveCartToStorage()
  showNotification("Product removed from cart", "error")

  // Update button state
  const button = document.querySelector(`[data-product-id="${productId}"] .add-to-cart`)
  if (button) {
    button.classList.remove("in-cart")
    button.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>'
  }
}

// Update item quantity
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

// Toggle wishlist item
async function toggleWishlistItem(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1)
    showNotification("Removed from wishlist", "info")

    // Decrease product likes
    await updateProductLikes(productId, -1)
  } else {
    // Add to wishlist
    wishlist.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      addedAt: new Date().toISOString(),
    })
    showNotification("Added to wishlist!", "success")

    // Increase product likes
    await updateProductLikes(productId, 1)
  }

  // Save to localStorage
  localStorage.setItem("nexusWishlist", JSON.stringify(wishlist))

  // Save to Firebase
  await saveWishlistToFirebase()

  // Update UI
  updateWishlistUI()
  renderProducts()
  renderSectionProducts()

  // Update button state
  const button = document.querySelector(`[data-product-id="${productId}"] .action-btn-small:last-child`)
  if (button) {
    const isInWishlist = wishlist.some((item) => item.id === productId)
    button.classList.toggle("liked", isInWishlist)
    button.innerHTML = `<i class="fa${isInWishlist ? "s" : "r"} fa-heart"></i>`
  }
}

// Update product likes in Firebase
async function updateProductLikes(productId, change) {
  try {
    if (window.db && window.firebaseModules) {
      const { collection, query, where, getDocs, updateDoc, doc } = window.firebaseModules

      // Find the product document in Firebase
      const q = query(collection(window.db, "products"), where("id", "==", productId))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (document) => {
          const productRef = doc(window.db, "products", document.id)
          const currentLikes = document.data().likes || 0
          const newLikes = Math.max(0, currentLikes + change)

          await updateDoc(productRef, {
            likes: newLikes,
          })

          // Update local product data
          const localProduct = products.find((p) => p.id === productId)
          if (localProduct) {
            localProduct.likes = newLikes
          }
        })
      }
    }
  } catch (error) {
    console.error("Error updating product likes:", error)
  }
}

// Save wishlist to Firebase
async function saveWishlistToFirebase() {
  try {
    if (window.db && window.firebaseModules && currentUser) {
      const { collection, doc, setDoc } = window.firebaseModules

      const wishlistRef = doc(window.db, "wishlists", currentUser.id)
      await setDoc(
        wishlistRef,
        {
          userId: currentUser.id,
          products: wishlist,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
    }
  } catch (error) {
    console.error("Error saving wishlist to Firebase:", error)
  }
}

// Update total likes display
async function updateTotalLikes() {
  try {
    const total = products.reduce((sum, product) => sum + (product.likes || 0), 0)
    totalLikes = total

    if (totalLikesElement) {
      totalLikesElement.textContent = total.toLocaleString()
    }
  } catch (error) {
    console.error("Error updating total likes:", error)
  }
}

// Update cart UI
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (cartBadge) cartBadge.textContent = totalItems
  if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`

  if (cart.length === 0) {
    if (emptyCart) emptyCart.style.display = "flex"
    if (cartItems) cartItems.style.display = "none"
    if (cartFooter) cartFooter.style.display = "none"
  } else {
    if (emptyCart) emptyCart.style.display = "none"
    if (cartItems) cartItems.style.display = "block"
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
            <button class="remove-item" onclick="removeFromCart(${item.id})">
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
    if (cartTotalAmount) cartTotalAmount.textContent = `$${total.toFixed(2)}`
  }
}

// Update wishlist UI
function updateWishlistUI() {
  if (wishlistBadge) {
    wishlistBadge.textContent = wishlist.length
  }

  if (wishlist.length === 0) {
    if (emptyWishlist) emptyWishlist.style.display = "flex"
    if (wishlistItems) wishlistItems.style.display = "none"
  } else {
    if (emptyWishlist) emptyWishlist.style.display = "none"
    if (wishlistItems) wishlistItems.style.display = "block"

    if (wishlistItems) {
      wishlistItems.innerHTML = wishlist
        .map((item) => {
          const product = products.find((p) => p.id === item.id)
          if (!product) return ""

          return `
            <div class="wishlist-item">
              <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.title}" onerror="this.src='/placeholder.svg?height=80&width=80'">
              </div>
              <div class="wishlist-item-details">
                <div class="wishlist-item-title">${item.title}</div>
                <div class="wishlist-item-price">$${item.price}</div>
                <div class="wishlist-item-actions">
                  <button class="add-to-cart-from-wishlist" onclick="addToCart(${item.id})">Add to Cart</button>
                  <button class="remove-from-wishlist" onclick="toggleWishlistItem(${item.id})">Remove</button>
                </div>
              </div>
            </div>
          `
        })
        .join("")
    }
  }
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem("nexusCart", JSON.stringify(cart))
}

// Update stats
function updateStats() {
  // These could be loaded from Firebase in a real application
  const stats = {
    customers: "50K+",
    products: "10K+",
    satisfaction: "99%",
  }

  const statCustomers = document.getElementById("statCustomers")
  const statProducts = document.getElementById("statProducts")
  const statSatisfaction = document.getElementById("statSatisfaction")

  if (statCustomers) statCustomers.textContent = stats.customers
  if (statProducts) statProducts.textContent = stats.products
  if (statSatisfaction) statSatisfaction.textContent = stats.satisfaction
}

// Toggle cart modal
function toggleCart() {
  if (cartModal) {
    cartModal.classList.toggle("active")
    document.body.style.overflow = cartModal.classList.contains("active") ? "hidden" : ""
  }
}

// Toggle wishlist modal
function toggleWishlist() {
  if (wishlistModal) {
    wishlistModal.classList.toggle("active")
    document.body.style.overflow = wishlistModal.classList.contains("active") ? "hidden" : ""
  }
}

// Handle checkout
async function handleCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  // Show location modal if location not shared
  if (!currentUser.location) {
    showLocationModal()
    return
  }

  await processCheckout()
}

// Show location modal
function showLocationModal() {
  if (locationModal) {
    locationModal.classList.add("active")
  }
}

// Close location modal
function closeLocationModal() {
  if (locationModal) {
    locationModal.classList.remove("active")
  }
}

// Share location
function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        }

        // Update user data
        currentUser.location = userLocation
        localStorage.setItem("userData", JSON.stringify(currentUser))

        // Update in Firebase
        await updateUserLocationInFirebase()

        closeLocationModal()
        await processCheckout()
      },
      (error) => {
        console.error("Location error:", error)
        showNotification("Unable to get location. Proceeding without location.", "warning")
        closeLocationModal()
        processCheckout()
      },
    )
  } else {
    showNotification("Geolocation is not supported by this browser.", "error")
    closeLocationModal()
    processCheckout()
  }
}

// Skip location
function skipLocation() {
  closeLocationModal()
  processCheckout()
}

// Update user location in Firebase
async function updateUserLocationInFirebase() {
  try {
    if (window.db && window.firebaseModules && currentUser.firebaseId) {
      const { doc, updateDoc } = window.firebaseModules
      const userRef = doc(window.db, "users", currentUser.firebaseId)

      await updateDoc(userRef, {
        location: userLocation,
        locationUpdatedAt: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error updating user location:", error)
  }
}

// Process checkout
async function processCheckout() {
  try {
    // Show loading state
    if (checkoutBtn) {
      checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>'
      checkoutBtn.disabled = true
    }

    // Prepare order data
    const orderData = {
      orderId: Date.now().toString(),
      customer: currentUser,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      timestamp: new Date().toISOString(),
      location: currentUser.location || userLocation,
    }

    // Save order to Firebase
    await saveOrderToFirebase(orderData)

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
      checkoutBtn.innerHTML = '<span>Checkout</span><i class="fas fa-lock"></i>'
      checkoutBtn.disabled = false
    }
  }
}

// Save order to Firebase
async function saveOrderToFirebase(orderData) {
  try {
    if (window.db && window.firebaseModules) {
      const { collection, addDoc, serverTimestamp } = window.firebaseModules

      await addDoc(collection(window.db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error saving order to Firebase:", error)
  }
}

// Send order to Telegram
async function sendOrderToTelegram(orderData) {
  const locationText = orderData.location
    ? `📍 Location: ${orderData.location.latitude.toFixed(4)}, ${orderData.location.longitude.toFixed(4)}`
    : "📍 Location: Not provided"

  const itemsList = orderData.items
    .map((item) => `• ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join("\n")

  const message = `🛒 New Order Received!

📦 Order ID: ${orderData.orderId}

👤 Customer Details:
• Name: ${orderData.customer.fullName}
• Phone: ${orderData.customer.phoneNumber}
• Telegram: ${orderData.customer.telegramUsername}
${locationText}

🛍️ Items:
${itemsList}

💰 Total: $${orderData.total.toFixed(2)}
📅 Date: ${new Date(orderData.timestamp).toLocaleString()}

---
Order from NEXUS Store 🏪`

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send order to Telegram")
  }

  // Send product images if available
  for (const item of orderData.items) {
    try {
      if (item.image && !item.image.includes("placeholder")) {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            photo: item.image,
            caption: `${item.title} - $${item.price} x${item.quantity}`,
          }),
        })
      }
    } catch (error) {
      console.error("Error sending product image:", error)
    }
  }
}

// Quick view function
function quickView(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  showNotification(`Quick view for ${product.title} - Feature coming soon!`, "info")
}

// Load more products
function loadMoreProducts() {
  displayedProducts += 8
  renderProducts()
}

// Handle contact form
function handleContactForm(e) {
  e.preventDefault()
  showNotification("Thank you for your message! We'll get back to you soon.", "success")
  e.target.reset()
}

// Logout function
function logout() {
  localStorage.removeItem("userData")
  localStorage.removeItem("nexusCart")
  localStorage.removeItem("nexusWishlist")
  window.location.href = "registration.html"
}

// Show delete account confirmation
function showDeleteAccountConfirmation() {
  const confirmed = confirm(
    "Are you sure you want to delete your account? This action cannot be undone and will remove all your data including wishlist and order history.",
  )

  if (confirmed) {
    const doubleConfirm = confirm(
      "This is your final warning. Are you absolutely sure you want to delete your account?",
    )

    if (doubleConfirm) {
      deleteAccount()
    }
  }
}

// Delete account
async function deleteAccount() {
  try {
    // Delete from Firebase
    if (window.db && window.firebaseModules && currentUser.firebaseId) {
      const { doc, deleteDoc } = window.firebaseModules

      // Delete user document
      await deleteDoc(doc(window.db, "users", currentUser.firebaseId))

      // Delete user's wishlist
      try {
        await deleteDoc(doc(window.db, "wishlists", currentUser.id))
      } catch (error) {
        console.log("No wishlist to delete")
      }
    }

    // Send deletion notification to Telegram
    await sendAccountDeletionToTelegram()

    // Clear local storage
    localStorage.removeItem("userData")
    localStorage.removeItem("nexusCart")
    localStorage.removeItem("nexusWishlist")

    alert("Your account has been successfully deleted.")
    window.location.href = "registration.html"
  } catch (error) {
    console.error("Error deleting account:", error)
    showNotification("Failed to delete account. Please try again.", "error")
  }
}

// Send account deletion notification to Telegram
async function sendAccountDeletionToTelegram() {
  const message = `❌ Account Deleted

👤 User: ${currentUser.fullName}
📱 Phone: ${currentUser.phoneNumber}
💬 Telegram: ${currentUser.telegramUsername}
📅 Deleted: ${new Date().toLocaleString()}

Account has been permanently deleted from NEXUS Store.`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })
  } catch (error) {
    console.error("Error sending deletion notification:", error)
  }
}

// Show notification
function showNotification(message, type = "success") {
  const notificationIcon = notification.querySelector(".notification-icon")
  const notificationText = notification.querySelector(".notification-text")

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  }

  if (notificationIcon) notificationIcon.className = `notification-icon ${icons[type] || icons.success}`
  if (notificationText) notificationText.textContent = message
  if (notification) notification.className = `notification ${type}`

  if (notification) notification.classList.add("show")

  setTimeout(() => {
    if (notification) notification.classList.remove("show")
  }, 4000)
}

// Hide notification
function hideNotification() {
  if (notification) notification.classList.remove("show")
}

// Initialize scroll effects
function initializeScrollEffects() {
  let lastScrollTop = 0
  const header = document.getElementById("header")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // Header hide/show on scroll
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      if (header) header.style.transform = "translateY(-100%)"
    } else {
      if (header) header.style.transform = "translateY(0)"
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
          width: 60px;
          height: 60px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: 1.25rem;
          box-shadow: var(--shadow-xl);
          z-index: 1000;
          transition: all var(--transition-normal);
        `

        scrollBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" })
        })

        scrollBtn.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-5px)"
          this.style.boxShadow = "var(--shadow-2xl)"
        })

        scrollBtn.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0)"
          this.style.boxShadow = "var(--shadow-xl)"
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

// Performance optimization - Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-fadeIn")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.querySelectorAll(".feature-card, .product-card, .category-card, .brand-card").forEach((el) => {
      observer.observe(el)
    })
  }, 3000)
})
