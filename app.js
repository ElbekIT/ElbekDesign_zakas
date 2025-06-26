import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// Global variables
let currentUser = null
let cart = []
let products = []

// DOM Elements
const registrationModal = document.getElementById("registrationModal")
const cartModal = document.getElementById("cartModal")
const productModal = document.getElementById("productModal")
const userInfo = document.getElementById("userInfo")
const userName = document.getElementById("userName")
const cartIcon = document.getElementById("cartIcon")
const cartCount = document.getElementById("cartCount")
const loading = document.getElementById("loading")
const toast = document.getElementById("toast")

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  checkUserRegistration()
  setupEventListeners()
  if (currentUser) {
    loadProducts()
  }
})

// Check if user is already registered
function checkUserRegistration() {
  const userData = localStorage.getItem("userData")
  if (userData) {
    currentUser = JSON.parse(userData)
    showUserInfo()
    loadProducts()
  } else {
    showRegistrationModal()
  }
}

// Show user info in header
function showUserInfo() {
  userInfo.style.display = "flex"
  userName.textContent = currentUser.name
}

// Show registration modal
function showRegistrationModal() {
  registrationModal.classList.add("active")
}

// Setup event listeners
function setupEventListeners() {
  // Registration form
  document.getElementById("registrationForm").addEventListener("submit", handleRegistration)

  // Cart icon
  cartIcon.addEventListener("click", showCart)

  // Close buttons
  document.getElementById("closeCart").addEventListener("click", () => {
    cartModal.classList.remove("active")
  })

  document.getElementById("closeProductModal").addEventListener("click", () => {
    productModal.classList.remove("active")
  })

  // Place order button
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder)

  // Search functionality
  document.getElementById("searchInput").addEventListener("input", handleSearch)

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("active")
    }
  })
}

// Handle user registration
async function handleRegistration(e) {
  e.preventDefault()

  const name = document.getElementById("userNameInput").value.trim()
  const phone = document.getElementById("userPhoneInput").value.trim()

  if (!name || !phone) {
    showToast("Please fill in all fields", "error")
    return
  }

  showLoading(true)

  try {
    const userData = { name, phone, registeredAt: new Date() }

    // Save to Firebase
    await addDoc(collection(window.db, "users"), userData)

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(userData))

    // Send to Telegram
    await sendToTelegram(`🆕 New User Registered\n👤 Name: ${name}\n📱 Phone: ${phone}`)

    currentUser = userData
    registrationModal.classList.remove("active")
    showUserInfo()
    loadProducts()
    showToast("Registration successful! Welcome to Premium Shop!")
  } catch (error) {
    console.error("Registration error:", error)
    showToast("Registration failed. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

// Send message to Telegram
async function sendToTelegram(message) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
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
      throw new Error("Failed to send telegram message")
    }
  } catch (error) {
    console.error("Telegram error:", error)
  }
}

// Load products from Firebase
async function loadProducts() {
  showLoading(true)

  try {
    // First, seed some sample products if collection is empty
    await seedSampleProducts()

    // Listen for real-time updates
    const unsubscribe = onSnapshot(collection(window.db, "products"), (snapshot) => {
      products = []
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() })
      })
      displayProducts(products)
    })
  } catch (error) {
    console.error("Error loading products:", error)
    showToast("Failed to load products", "error")
  } finally {
    showLoading(false)
  }
}

// Seed sample products
async function seedSampleProducts() {
  try {
    const productsSnapshot = await getDocs(collection(window.db, "products"))

    if (productsSnapshot.empty) {
      const sampleProducts = [
        {
          name: "Premium Wireless Headphones",
          price: 199.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
          category: "Electronics",
          likes: 0,
          comments: [],
        },
        {
          name: "Smart Fitness Watch",
          price: 299.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "Advanced fitness tracking with heart rate monitoring and GPS functionality.",
          category: "Electronics",
          likes: 0,
          comments: [],
        },
        {
          name: "Designer Backpack",
          price: 89.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "Stylish and functional backpack perfect for work, travel, or everyday use.",
          category: "Fashion",
          likes: 0,
          comments: [],
        },
        {
          name: "Organic Coffee Beans",
          price: 24.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "Premium organic coffee beans sourced from sustainable farms.",
          category: "Food",
          likes: 0,
          comments: [],
        },
        {
          name: "Yoga Mat Pro",
          price: 49.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "Professional-grade yoga mat with superior grip and comfort.",
          category: "Sports",
          likes: 0,
          comments: [],
        },
        {
          name: "Bluetooth Speaker",
          price: 79.99,
          image: "/placeholder.svg?height=300&width=300",
          description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
          category: "Electronics",
          likes: 0,
          comments: [],
        },
      ]

      for (const product of sampleProducts) {
        await addDoc(collection(window.db, "products"), product)
      }
    }
  } catch (error) {
    console.error("Error seeding products:", error)
  }
}

// Display products
function displayProducts(productsToShow) {
  const productsGrid = document.getElementById("productsGrid")
  productsGrid.innerHTML = ""

  productsToShow.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
            <div class="product-interactions">
                <button class="like-btn" onclick="toggleLike('${product.id}')">
                    <i class="fas fa-heart"></i>
                    <span>${product.likes || 0}</span>
                </button>
                <button class="comment-btn" onclick="showProductModal('${product.id}')">
                    <i class="fas fa-comment"></i>
                    <span>${product.comments ? product.comments.length : 0}</span>
                </button>
            </div>
        </div>
    `

  return card
}

// Add to cart
window.addToCart = (productId) => {
  const product = products.find((p) => p.id === productId)
  if (product) {
    const existingItem = cart.find((item) => item.id === productId)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }
    updateCartUI()
    showToast(`${product.name} added to cart!`)
  }
}

// Update cart UI
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Show cart
function showCart() {
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align: center; color: #64748b;">Your cart is empty</p>'
    cartTotal.textContent = "0.00"
  } else {
    cartItems.innerHTML = ""
    let total = 0

    cart.forEach((item) => {
      total += item.price * item.quantity
      const cartItem = document.createElement("div")
      cartItem.className = "cart-item"
      cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
                    Remove
                </button>
            `
      cartItems.appendChild(cartItem)
    })

    cartTotal.textContent = total.toFixed(2)
  }

  cartModal.classList.add("active")
}

// Remove from cart
window.removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  showCart() // Refresh cart display
  showToast("Item removed from cart")
}

// Place order
async function placeOrder() {
  if (cart.length === 0) {
    showToast("Your cart is empty", "error")
    return
  }

  showLoading(true)

  try {
    const orderDetails = cart.map((item) => `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`).join("\n")

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const orderMessage = `🛒 New Order Placed!\n\n👤 Customer: ${currentUser.name}\n📱 Phone: ${currentUser.phone}\n\n📦 Order Details:\n${orderDetails}\n\n💰 Total: $${total.toFixed(2)}`

    await sendToTelegram(orderMessage)

    // Save order to Firebase
    await addDoc(collection(window.db, "orders"), {
      customer: currentUser,
      items: cart,
      total: total,
      orderDate: new Date(),
      status: "pending",
    })

    cart = []
    updateCartUI()
    cartModal.classList.remove("active")
    showToast("Order placed successfully! We will contact you soon.")
  } catch (error) {
    console.error("Order error:", error)
    showToast("Failed to place order. Please try again.", "error")
  } finally {
    showLoading(false)
  }
}

// Toggle like
window.toggleLike = async (productId) => {
  try {
    const productRef = doc(window.db, "products", productId)
    await updateDoc(productRef, {
      likes: increment(1),
    })
    showToast("Liked!")
  } catch (error) {
    console.error("Like error:", error)
    showToast("Failed to like product", "error")
  }
}

// Show product modal
window.showProductModal = (productId) => {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const productDetails = document.getElementById("productDetails")
  productDetails.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                <div class="product-detail-description">${product.description}</div>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
                <div class="product-interactions" style="margin-top: 1rem;">
                    <button class="like-btn" onclick="toggleLike('${product.id}')">
                        <i class="fas fa-heart"></i>
                        <span>${product.likes || 0}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="comments-section">
            <h3>Comments</h3>
            <div class="comment-form">
                <input type="text" class="comment-input" placeholder="Add a comment..." id="commentInput-${product.id}">
                <button class="comment-submit" onclick="addComment('${product.id}')">Post</button>
            </div>
            <div class="comments-list" id="comments-${product.id}">
                ${(product.comments || [])
                  .map(
                    (comment) => `
                    <div class="comment">
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-text">${comment.text}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `

  productModal.classList.add("active")
}

// Add comment
window.addComment = async (productId) => {
  const commentInput = document.getElementById(`commentInput-${productId}`)
  const commentText = commentInput.value.trim()

  if (!commentText) {
    showToast("Please enter a comment", "error")
    return
  }

  try {
    const comment = {
      author: currentUser.name,
      text: commentText,
      date: new Date(),
    }

    const productRef = doc(window.db, "products", productId)
    await updateDoc(productRef, {
      comments: arrayUnion(comment),
    })

    commentInput.value = ""
    showToast("Comment added!")
  } catch (error) {
    console.error("Comment error:", error)
    showToast("Failed to add comment", "error")
  }
}

// Handle search
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase()
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm),
  )
  displayProducts(filteredProducts)
}

// Show loading
function showLoading(show) {
  if (show) {
    loading.classList.add("active")
  } else {
    loading.classList.remove("active")
  }
}

// Show toast notification
function showToast(message, type = "success") {
  toast.textContent = message
  toast.className = `toast ${type}`
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}
