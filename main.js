// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDlyb188VfYALM8FfjhoN5NAH80uIUIaMk",
  authDomain: "shopmagazina-988f7.firebaseapp.com",
  projectId: "shopmagazina-988f7",
  storageBucket: "shopmagazina-988f7.firebasestorage.app",
  messagingSenderId: "455847708477",
  appId: "1:455847708477:web:1282e7a719bd4f8314e754",
  measurementId: "G-P943SCYXTT",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// Sample Products Data
const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    originalPrice: 299.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Electronics",
    isNew: true,
    isBestSeller: true,
    isOnSale: true,
    likes: 0,
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Electronics",
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    likes: 0,
  },
  {
    id: 3,
    name: "Designer Leather Jacket",
    price: 149.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Fashion",
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    likes: 0,
  },
  {
    id: 4,
    name: "Organic Skincare Set",
    price: 79.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Beauty & Health",
    isNew: true,
    isBestSeller: false,
    isOnSale: false,
    likes: 0,
  },
  {
    id: 5,
    name: "Professional Camera",
    price: 899.99,
    originalPrice: 1199.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Electronics",
    isNew: false,
    isBestSeller: true,
    isOnSale: true,
    likes: 0,
  },
  {
    id: 6,
    name: "Luxury Handbag",
    price: 199.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Fashion",
    isNew: false,
    isBestSeller: true,
    isOnSale: false,
    likes: 0,
  },
  {
    id: 7,
    name: "Gaming Mechanical Keyboard",
    price: 129.99,
    originalPrice: 179.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Electronics",
    isNew: true,
    isBestSeller: false,
    isOnSale: true,
    likes: 0,
  },
  {
    id: 8,
    name: "Yoga Mat Premium",
    price: 49.99,
    image: "/placeholder.svg?height=250&width=280",
    category: "Sports & Outdoors",
    isNew: false,
    isBestSeller: false,
    isOnSale: false,
    likes: 0,
  },
]

// Global Variables
let currentUser = null
let cart = []
let wishlist = []
let userLocation = null

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  appInitializer()
})

async function appInitializer() {
  // Check if user is registered
  const userData = localStorage.getItem("shopmagazina_user")
  if (userData) {
    currentUser = JSON.parse(userData)
    updateUserInterface()
  } else {
    showRegistrationModal()
  }

  // Load cart from localStorage
  const savedCart = localStorage.getItem("shopmagazina_cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartUI()
  }

  // Load wishlist from localStorage
  const savedWishlist = localStorage.getItem("shopmagazina_wishlist")
  if (savedWishlist) {
    wishlist = JSON.parse(savedWishlist)
    updateWishlistUI()
  }

  // Initialize page-specific content
  initializePageContent()

  // Setup event listeners
  setupEventListeners()

  // Request location permission
  requestLocationPermission()
}

function initializePageContent() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "index.html":
    case "":
      loadFeaturedProducts()
      break
    case "new-arrivals.html":
      loadNewArrivals()
      break
    case "best-sellers.html":
      loadBestSellers()
      break
    case "sale.html":
      loadSaleProducts()
      break
    case "wishlist.html":
      loadWishlistPage()
      break
    case "account.html":
      loadAccountPage()
      break
  }
}

function setupEventListeners() {
  // Registration form
  const registrationForm = document.getElementById("registrationForm")
  if (registrationForm) {
    registrationForm.addEventListener("submit", handleRegistration)
  }

  // Cart button
  const cartBtn = document.getElementById("cartBtn")
  if (cartBtn) {
    cartBtn.addEventListener("click", showCartModal)
  }

  // Checkout button
  const checkoutBtn = document.getElementById("checkoutBtn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout)
  }

  // Modal close buttons
  const closeButtons = document.querySelectorAll(".close")
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal)
  })

  // Click outside modal to close
  window.addEventListener("click", (event) => {
    const modals = document.querySelectorAll(".modal")
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none"
      }
    })
  })

  // Account actions
  const deleteAccountBtn = document.getElementById("deleteAccountBtn")
  const logoutBtn = document.getElementById("logoutBtn")

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", handleDeleteAccount)
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout)
  }

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }
}

// Registration Functions
function showRegistrationModal() {
  const modal = document.getElementById("registrationModal")
  if (modal) {
    modal.style.display = "block"
  }
}

async function handleRegistration(event) {
  event.preventDefault()

  const fullName = document.getElementById("fullName").value
  const phoneNumber = document.getElementById("phoneNumber").value
  const telegramUsername = document.getElementById("telegramUsername").value

  if (!fullName || !phoneNumber) {
    showNotification("Please fill in all required fields", "error")
    return
  }

  const userData = {
    fullName,
    phoneNumber,
    telegramUsername,
    registrationDate: new Date().toISOString(),
    location: userLocation,
  }

  try {
    // Save to Firebase
    await addDoc(collection(db, "users"), userData)

    // Save to localStorage
    localStorage.setItem("shopmagazina_user", JSON.stringify(userData))
    currentUser = userData

    // Close modal and update UI
    closeModal()
    updateUserInterface()
    showNotification("Registration successful! Welcome to ShopMagazina!")
  } catch (error) {
    console.error("Registration error:", error)
    showNotification("Registration failed. Please try again.", "error")
  }
}

function updateUserInterface() {
  const userWelcome = document.getElementById("userWelcome")
  if (userWelcome && currentUser) {
    userWelcome.textContent = `Welcome, ${currentUser.fullName.split(" ")[0]}`
  }
}

// Product Loading Functions
function loadFeaturedProducts() {
  const productsGrid = document.getElementById("productsGrid")
  if (productsGrid) {
    productsGrid.innerHTML = ""
    sampleProducts.forEach((product) => {
      productsGrid.appendChild(createProductCard(product))
    })
  }
}

function loadNewArrivals() {
  const newArrivalsGrid = document.getElementById("newArrivalsGrid")
  if (newArrivalsGrid) {
    const newProducts = sampleProducts.filter((product) => product.isNew)
    newArrivalsGrid.innerHTML = ""
    newProducts.forEach((product) => {
      newArrivalsGrid.appendChild(createProductCard(product))
    })
  }
}

function loadBestSellers() {
  const bestSellersGrid = document.getElementById("bestSellersGrid")
  if (bestSellersGrid) {
    const bestSellers = sampleProducts.filter((product) => product.isBestSeller)
    bestSellersGrid.innerHTML = ""
    bestSellers.forEach((product) => {
      bestSellersGrid.appendChild(createProductCard(product))
    })
  }
}

function loadSaleProducts() {
  const saleGrid = document.getElementById("saleGrid")
  if (saleGrid) {
    const saleProducts = sampleProducts.filter((product) => product.isOnSale)
    saleGrid.innerHTML = ""
    saleProducts.forEach((product) => {
      saleGrid.appendChild(createProductCard(product))
    })
  }
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0
  const isLiked = wishlist.some((item) => item.id === product.id)

  card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ""}
            <button class="wishlist-icon ${isLiked ? "liked" : ""}" onclick="toggleWishlist(${product.id})">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ""}
                $${product.price}
            </div>
            <div class="like-count">
                <i class="fas fa-heart"></i>
                <span>${product.likes} likes</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `

  return card
}

// Cart Functions
function addToCart(productId) {
  const product = sampleProducts.find((p) => p.id === productId)
  if (product) {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    saveCartToStorage()
    updateCartUI()
    showNotification(`${product.name} added to cart!`)
  }
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  saveCartToStorage()
  updateCartUI()
  updateCartModal()
}

function saveCartToStorage() {
  localStorage.setItem("shopmagazina_cart", JSON.stringify(cart))
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

function showCartModal() {
  const modal = document.getElementById("cartModal")
  if (modal) {
    updateCartModal()
    modal.style.display = "block"
  }
}

function updateCartModal() {
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  if (!cartItems || !cartTotal) return

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #718096;">Your cart is empty</p>'
    cartTotal.textContent = "0.00"
    return
  }

  cartItems.innerHTML = ""
  let total = 0

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    total += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        `
    cartItems.appendChild(cartItem)
  })

  cartTotal.textContent = total.toFixed(2)
}

// Checkout Function
async function handleCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }

  if (!currentUser) {
    showNotification("Please register first!", "error")
    return
  }

  try {
    // Prepare order data
    const orderData = {
      user: currentUser,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderDate: new Date().toISOString(),
      location: userLocation,
    }

    // Save order to Firebase
    await addDoc(collection(db, "orders"), orderData)

    // Send to Telegram
    await sendOrderToTelegram(orderData)

    // Clear cart
    cart = []
    saveCartToStorage()
    updateCartUI()
    closeModal()

    showNotification("Order placed successfully! We will contact you soon.")
  } catch (error) {
    console.error("Checkout error:", error)
    showNotification("Order failed. Please try again.", "error")
  }
}

async function sendOrderToTelegram(orderData) {
  const message = `
🛒 New Order Received!

👤 Customer: ${orderData.user.fullName}
📱 Phone: ${orderData.user.phoneNumber}
${orderData.user.telegramUsername ? `📧 Telegram: @${orderData.user.telegramUsername}` : ""}

📦 Items:
${orderData.items.map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

💰 Total: $${orderData.total.toFixed(2)}

${orderData.location ? `📍 Location: ${orderData.location.latitude}, ${orderData.location.longitude}` : "📍 Location: Not shared"}

🕒 Order Time: ${new Date(orderData.orderDate).toLocaleString()}
    `

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  await fetch(telegramUrl, {
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
}

// Wishlist Functions
async function toggleWishlist(productId) {
  const product = sampleProducts.find((p) => p.id === productId)
  if (!product) return

  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  if (existingIndex > -1) {
    // Remove from wishlist
    wishlist.splice(existingIndex, 1)
    showNotification(`${product.name} removed from wishlist`)
  } else {
    // Add to wishlist
    wishlist.push(product)
    showNotification(`${product.name} added to wishlist!`)

    // Increment like count in Firebase
    try {
      const productRef = doc(db, "products", productId.toString())
      await updateDoc(productRef, {
        likes: increment(1),
      })
    } catch (error) {
      // If document doesn't exist, create it
      try {
        await addDoc(collection(db, "products"), {
          id: productId,
          likes: 1,
        })
      } catch (createError) {
        console.error("Error creating product document:", createError)
      }
    }
  }

  // Save to localStorage
  localStorage.setItem("shopmagazina_wishlist", JSON.stringify(wishlist))
  updateWishlistUI()

  // Update wishlist icons on current page
  updateWishlistIcons()
}

function updateWishlistUI() {
  const wishlistCount = document.getElementById("wishlistCount")
  if (wishlistCount) {
    wishlistCount.textContent = wishlist.length
  }
}

function updateWishlistIcons() {
  const wishlistIcons = document.querySelectorAll(".wishlist-icon")
  wishlistIcons.forEach((icon) => {
    const productId = Number.parseInt(icon.getAttribute("onclick").match(/\d+/)[0])
    const isLiked = wishlist.some((item) => item.id === productId)

    if (isLiked) {
      icon.classList.add("liked")
    } else {
      icon.classList.remove("liked")
    }
  })
}

function loadWishlistPage() {
  const wishlistContent = document.getElementById("wishlistContent")
  if (!wishlistContent) return

  if (wishlist.length === 0) {
    wishlistContent.innerHTML = `
            <div class="empty-wishlist">
                <i class="fas fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>Start adding products you love!</p>
                <a href="index.html" class="shop-now-btn">Shop Now</a>
            </div>
        `
    return
  }

  const wishlistGrid = document.createElement("div")
  wishlistGrid.className = "products-grid"

  wishlist.forEach((product) => {
    wishlistGrid.appendChild(createProductCard(product))
  })

  wishlistContent.innerHTML = ""
  wishlistContent.appendChild(wishlistGrid)
}

// Account Functions
function loadAccountPage() {
  if (!currentUser) {
    window.location.href = "index.html"
    return
  }

  const accountName = document.getElementById("accountName")
  const accountPhone = document.getElementById("accountPhone")
  const accountTelegram = document.getElementById("accountTelegram")

  if (accountName) accountName.textContent = currentUser.fullName
  if (accountPhone) accountPhone.textContent = currentUser.phoneNumber
  if (accountTelegram) accountTelegram.textContent = currentUser.telegramUsername || "Not provided"
}

function handleDeleteAccount() {
  if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    localStorage.removeItem("shopmagazina_user")
    localStorage.removeItem("shopmagazina_cart")
    localStorage.removeItem("shopmagazina_wishlist")

    currentUser = null
    cart = []
    wishlist = []

    showNotification("Account deleted successfully")
    window.location.href = "index.html"
  }
}

function handleLogout() {
  localStorage.removeItem("shopmagazina_user")
  currentUser = null
  showNotification("Logged out successfully")
  window.location.href = "index.html"
}

// Location Functions
function requestLocationPermission() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      },
      (error) => {
        console.log("Location access denied or unavailable")
      },
    )
  }
}

// Contact Form
function handleContactForm(event) {
  event.preventDefault()
  showNotification("Message sent successfully! We will get back to you soon.")
  event.target.reset()
}

// Utility Functions
function closeModal() {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.style.display = "none"
  })
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Make functions globally available
window.addToCart = addToCart
window.removeFromCart = removeFromCart
window.toggleWishlist = toggleWishlist
