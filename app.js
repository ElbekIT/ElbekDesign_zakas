import { db } from "./firebase-config.js"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

// Global variables
let currentUser = null
let cart = []
let products = []

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// DOM Elements
const registrationModal = document.getElementById("registrationModal")
const mainSite = document.getElementById("mainSite")
const loadingSpinner = document.getElementById("loadingSpinner")
const registrationForm = document.getElementById("registrationForm")
const userNameDisplay = document.getElementById("userNameDisplay")
const productsGrid = document.getElementById("productsGrid")
const cartIcon = document.getElementById("cartIcon")
const cartSidebar = document.getElementById("cartSidebar")
const cartOverlay = document.getElementById("cartOverlay")
const closeCart = document.getElementById("closeCart")
const cartItems = document.getElementById("cartItems")
const cartCount = document.getElementById("cartCount")
const cartTotal = document.getElementById("cartTotal")
const placeOrderBtn = document.getElementById("placeOrderBtn")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  checkUserRegistration()
  setupEventListeners()
  loadProducts()
})

// Check if user is already registered
function checkUserRegistration() {
  const userData = localStorage.getItem("userData")
  if (userData) {
    currentUser = JSON.parse(userData)
    showMainSite()
  } else {
    showRegistrationModal()
  }
}

// Show registration modal
function showRegistrationModal() {
  hideLoadingSpinner()
  registrationModal.style.display = "flex"
  mainSite.style.display = "none"
}

// Show main site
function showMainSite() {
  hideLoadingSpinner()
  registrationModal.style.display = "none"
  mainSite.style.display = "block"
  userNameDisplay.textContent = currentUser.name
  loadCartFromStorage()
}

// Hide loading spinner
function hideLoadingSpinner() {
  loadingSpinner.style.display = "none"
}

// Setup event listeners
function setupEventListeners() {
  registrationForm.addEventListener("submit", handleRegistration)
  cartIcon.addEventListener("click", toggleCart)
  closeCart.addEventListener("click", toggleCart)
  cartOverlay.addEventListener("click", toggleCart)
  placeOrderBtn.addEventListener("click", handlePlaceOrder)
}

// Handle user registration
async function handleRegistration(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const userData = {
    name: formData.get("userName").trim(),
    phone: formData.get("userPhone").trim(),
    registeredAt: new Date().toISOString(),
  }

  if (!userData.name || !userData.phone) {
    alert("Please fill in all fields")
    return
  }

  showLoadingSpinner()

  try {
    // Save to Firebase Firestore
    await addDoc(collection(db, "users"), userData)

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(userData))

    // Send to Telegram Bot
    await sendToTelegramBot(userData)

    currentUser = userData
    showMainSite()
  } catch (error) {
    console.error("Registration error:", error)
    alert("Registration failed. Please try again.")
    hideLoadingSpinner()
  }
}

// Send registration data to Telegram Bot
async function sendToTelegramBot(userData) {
  const message = `🆕 New User Registered\n👤 Name: ${userData.name}\n📱 Phone: ${userData.phone}`

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
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
  } catch (error) {
    console.error("Telegram notification error:", error)
    // Don't block registration if Telegram fails
  }
}

// Load products from Firebase
async function loadProducts() {
  try {
    // First, seed some sample products if collection is empty
    await seedSampleProducts()

    // Listen for real-time updates
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      products = []
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() })
      })
      displayProducts()
    })
  } catch (error) {
    console.error("Error loading products:", error)
    displayProducts() // Show empty state or cached products
  }
}

// Seed sample products
async function seedSampleProducts() {
  try {
    const productsSnapshot = await getDocs(collection(db, "products"))

    if (productsSnapshot.empty) {
      const sampleProducts = [
        {
          name: "HyperX Cloud III Red Wireless",
          brand: "HyperX",
          price: 199.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
        {
          name: "Razer BlackWidow V3 Pro",
          brand: "Razer",
          price: 229.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
        {
          name: "Logitech G Pro X Superlight",
          brand: "Logitech",
          price: 149.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
        {
          name: "SteelSeries Arctis 7P",
          brand: "SteelSeries",
          price: 179.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
        {
          name: "Corsair K95 RGB Platinum",
          brand: "Corsair",
          price: 199.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
        {
          name: "ASUS ROG Strix Scope",
          brand: "ASUS",
          price: 129.99,
          image: "/placeholder.svg?height=300&width=300",
          likes: 0,
          comments: [],
        },
      ]

      for (const product of sampleProducts) {
        await addDoc(collection(db, "products"), product)
      }
    }
  } catch (error) {
    console.error("Error seeding products:", error)
  }
}

// Display products
function displayProducts() {
  if (!productsGrid) return

  productsGrid.innerHTML = ""

  products.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"

  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCart('${product.id}')">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="product-like ${product.userLiked ? "liked" : ""}" onclick="toggleLike('${product.id}')">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="product-stats">
            <span><i class="fas fa-heart"></i> ${product.likes || 0}</span>
            <span><i class="fas fa-comment"></i> ${product.comments ? product.comments.length : 0}</span>
        </div>
    `

  return card
}

// Add product to cart
window.addToCart = (productId) => {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  updateCartDisplay()
  saveCartToStorage()

  // Show brief animation or notification
  showAddToCartNotification()
}

// Toggle product like
window.toggleLike = async (productId) => {
  try {
    const productRef = doc(db, "products", productId)
    await updateDoc(productRef, {
      likes: increment(1),
    })
  } catch (error) {
    console.error("Error updating likes:", error)
  }
}

// Show add to cart notification
function showAddToCartNotification() {
  // Simple notification - you can enhance this
  const notification = document.createElement("div")
  notification.textContent = "Product added to cart!"
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Toggle cart sidebar
function toggleCart() {
  cartSidebar.classList.toggle("open")
  cartOverlay.classList.toggle("active")
}

// Update cart display
function updateCartDisplay() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  // Update cart items
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px 0;">Your cart is empty</p>'
  } else {
    cart.forEach((item) => {
      const cartItem = createCartItem(item)
      cartItems.appendChild(cartItem)
    })
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartTotal.textContent = total.toFixed(2)
}

// Create cart item element
function createCartItem(item) {
  const cartItem = document.createElement("div")
  cartItem.className = "cart-item"

  cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                <button class="qty-btn" onclick="window.removeFromCart('${item.id}')" style="margin-left: 10px; color: #e91e63;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `

  return cartItem
}

// Update item quantity
window.updateQuantity = (productId, change) => {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    window.removeFromCart(productId)
  } else {
    updateCartDisplay()
    saveCartToStorage()
  }
}

// Remove item from cart
window.removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId)
  updateCartDisplay()
  saveCartToStorage()
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Load cart from localStorage
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartDisplay()
  }
}

// Handle place order
async function handlePlaceOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  showLoadingSpinner()

  try {
    // Create order message for Telegram
    let orderMessage = `🛒 New Order from ${currentUser.name}\n`
    orderMessage += `📱 Phone: ${currentUser.phone}\n\n`
    orderMessage += `📦 Order Details:\n`

    let total = 0
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      total += itemTotal
      orderMessage += `${index + 1}. ${item.name}\n`
      orderMessage += `   Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n\n`
    })

    orderMessage += `💰 Total: $${total.toFixed(2)}`

    // Send order to Telegram
    await sendOrderToTelegram(orderMessage)

    // Save order to Firebase
    await addDoc(collection(db, "orders"), {
      userId: currentUser.name,
      userPhone: currentUser.phone,
      items: cart,
      total: total,
      orderDate: new Date().toISOString(),
      status: "pending",
    })

    // Clear cart
    cart = []
    updateCartDisplay()
    saveCartToStorage()
    toggleCart()

    alert("Order placed successfully! We will contact you soon.")
  } catch (error) {
    console.error("Error placing order:", error)
    alert("Failed to place order. Please try again.")
  } finally {
    hideLoadingSpinner()
  }
}

// Send order to Telegram
async function sendOrderToTelegram(message) {
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

// Show loading spinner
function showLoadingSpinner() {
  loadingSpinner.style.display = "flex"
}

// Add CSS animation for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)
