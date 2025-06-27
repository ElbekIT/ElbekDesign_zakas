// Global variables
let currentUser = null
let cart = []
let products = []

// Telegram Bot Configuration (replace with your bot token and chat ID)
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  // Check if user is logged in
  const userData = localStorage.getItem("userData")
  if (!userData) {
    window.location.href = "registration.html"
    return
  }

  currentUser = JSON.parse(userData)
  document.getElementById("userName").textContent = currentUser.fullName

  // Load cart from localStorage
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)
    updateCartUI()
  }

  // Load products
  await loadProducts()

  // Initialize real-time listeners
  initializeRealtimeListeners()
}

async function loadProducts() {
  showLoading(true)

  try {
    // First, seed some sample products if none exist
    await seedSampleProducts()

    const { collection, getDocs } = window.firebaseModules
    const querySnapshot = await getDocs(collection(window.db, "products"))

    products = []
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    renderProducts()
  } catch (error) {
    console.error("Error loading products:", error)
    alert("Failed to load products. Please refresh the page.")
  } finally {
    showLoading(false)
  }
}

async function seedSampleProducts() {
  const { collection, getDocs, addDoc } = window.firebaseModules
  const querySnapshot = await getDocs(collection(window.db, "products"))

  // If products already exist, don't seed
  if (!querySnapshot.empty) {
    return
  }

  const sampleProducts = [
    {
      name: "Premium Wireless Headphones",
      price: 299.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "High-quality wireless headphones with noise cancellation",
      likes: 0,
      comments: [],
    },
    {
      name: "Smart Fitness Watch",
      price: 199.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "Advanced fitness tracking with heart rate monitor",
      likes: 0,
      comments: [],
    },
    {
      name: "Professional Camera",
      price: 899.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "DSLR camera perfect for professional photography",
      likes: 0,
      comments: [],
    },
    {
      name: "Gaming Laptop",
      price: 1299.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "High-performance laptop for gaming and work",
      likes: 0,
      comments: [],
    },
    {
      name: "Bluetooth Speaker",
      price: 79.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "Portable speaker with excellent sound quality",
      likes: 0,
      comments: [],
    },
    {
      name: "Smartphone",
      price: 699.99,
      image: "/placeholder.svg?height=250&width=300",
      description: "Latest smartphone with advanced features",
      likes: 0,
      comments: [],
    },
  ]

  // Add sample products to Firestore
  for (const product of sampleProducts) {
    await addDoc(collection(window.db, "products"), product)
  }
}

function renderProducts() {
  const productsGrid = document.getElementById("productsGrid")
  productsGrid.innerHTML = ""

  products.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="like-btn ${hasUserLiked(product) ? "liked" : ""}" onclick="toggleLike('${product.id}')">
                    <i class="fas fa-heart"></i> ${product.likes || 0}
                </button>
            </div>
            <div class="product-interactions">
                <div class="likes-count">${product.likes || 0} likes</div>
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Add a comment..." id="comment-${product.id}">
                    <button class="comment-btn" onclick="addComment('${product.id}')">Post</button>
                </div>
                <div class="comments-list" id="comments-${product.id}">
                    ${renderComments(product.comments || [])}
                </div>
            </div>
        </div>
    `

  return card
}

function renderComments(comments) {
  return comments
    .map(
      (comment) => `
        <div class="comment">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
        </div>
    `,
    )
    .join("")
}

function hasUserLiked(product) {
  return product.likedBy && product.likedBy.includes(currentUser.id)
}

async function toggleLike(productId) {
  try {
    const { doc, updateDoc, increment } = window.firebaseModules
    const product = products.find((p) => p.id === productId)
    const productRef = doc(window.db, "products", productId)

    const hasLiked = hasUserLiked(product)
    const likedBy = product.likedBy || []

    if (hasLiked) {
      // Remove like
      const updatedLikedBy = likedBy.filter((id) => id !== currentUser.id)
      await updateDoc(productRef, {
        likes: increment(-1),
        likedBy: updatedLikedBy,
      })
    } else {
      // Add like
      await updateDoc(productRef, {
        likes: increment(1),
        likedBy: [...likedBy, currentUser.id],
      })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    alert("Failed to update like. Please try again.")
  }
}

async function addComment(productId) {
  const commentInput = document.getElementById(`comment-${productId}`)
  const commentText = commentInput.value.trim()

  if (!commentText) {
    alert("Please enter a comment")
    return
  }

  try {
    const { doc, updateDoc } = window.firebaseModules
    const product = products.find((p) => p.id === productId)
    const productRef = doc(window.db, "products", productId)

    const newComment = {
      author: currentUser.fullName,
      text: commentText,
      timestamp: new Date().toISOString(),
    }

    const updatedComments = [...(product.comments || []), newComment]

    await updateDoc(productRef, {
      comments: updatedComments,
    })

    commentInput.value = ""
  } catch (error) {
    console.error("Error adding comment:", error)
    alert("Failed to add comment. Please try again.")
  }
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  updateCartUI()
  saveCartToStorage()

  // Show success feedback
  showNotification("Product added to cart!")
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCartUI()
  saveCartToStorage()
}

function updateCartUI() {
  const cartCount = document.getElementById("cartCount")
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  cartCount.textContent = totalItems
  cartTotal.textContent = totalPrice.toFixed(2)

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  cartSidebar.classList.toggle("open")
}

async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }

  try {
    showLoading(true)

    // Prepare order data
    const orderData = {
      customer: currentUser,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      orderDate: new Date().toISOString(),
    }

    // Send to Telegram
    await sendOrderToTelegram(orderData)

    // Save order to Firebase
    const { collection, addDoc } = window.firebaseModules
    await addDoc(collection(window.db, "orders"), orderData)

    // Clear cart
    cart = []
    updateCartUI()
    saveCartToStorage()
    toggleCart()

    alert("Order placed successfully! You will receive a confirmation soon.")
  } catch (error) {
    console.error("Error placing order:", error)
    alert("Failed to place order. Please try again.")
  } finally {
    showLoading(false)
  }
}

async function sendOrderToTelegram(orderData) {
  const message = `
🛍️ *New Order Received!*

👤 *Customer:* ${orderData.customer.fullName}
📱 *Phone:* ${orderData.customer.phoneNumber}

📦 *Items:*
${orderData.items.map((item) => `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n")}

💰 *Total:* $${orderData.total.toFixed(2)}
📅 *Date:* ${new Date(orderData.orderDate).toLocaleString()}
    `

  const telegramUrl = `https://api.telegram.org/bot7557876194:AAHtiOEqq8aJaaIApVXkurm1lNwmJpEoKXo/sendMessage`

  const response = await fetch(telegramUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: 7702025887,
      text: message,
      parse_mode: "Markdown",
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to send order to Telegram")
  }
}

function initializeRealtimeListeners() {
  const { collection, onSnapshot } = window.firebaseModules

  // Listen for product updates
  onSnapshot(collection(window.db, "products"), (snapshot) => {
    products = []
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    renderProducts()
  })
}

function logout() {
  localStorage.removeItem("userData")
  localStorage.removeItem("cart")
  window.location.href = "registration.html"
}

function showLoading(show) {
  const loadingOverlay = document.getElementById("loadingOverlay")
  loadingOverlay.style.display = show ? "flex" : "none"
}

function showNotification(message) {
  // Create a simple notification
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Close cart when clicking outside
document.addEventListener("click", (e) => {
  const cartSidebar = document.getElementById("cartSidebar")
  const cartBtn = document.querySelector(".cart-btn")

  if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
    cartSidebar.classList.remove("open")
  }
})
