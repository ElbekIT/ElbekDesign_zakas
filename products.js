// Import necessary modules or declare variables here
const firebase = window.firebase // Declare firebase variable
const db = firebase.firestore() // Example declaration for db
const authManager = window.authManager // Example declaration for authManager
const cartManager = window.cartManager // Example declaration for cartManager

class ProductManager {
  constructor() {
    this.products = []
    this.filteredProducts = []
    this.currentFilter = "all"
    this.init()
  }

  async init() {
    await this.loadProducts()
    this.setupEventListeners()
    this.renderProducts()
  }

  async loadProducts() {
    try {
      this.showLoading(true)

      // Try to load from Firestore first
      const snapshot = await db.collection("products").get()

      if (snapshot.empty) {
        // If no products in Firestore, create sample products
        await this.createSampleProducts()
        // Reload after creating sample products
        const newSnapshot = await db.collection("products").get()
        this.products = newSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      } else {
        this.products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      }

      this.filteredProducts = [...this.products]
      this.showLoading(false)
    } catch (error) {
      console.error("Error loading products:", error)
      this.showLoading(false)
      authManager.showToast("Failed to load products. Please refresh the page.", "error")
    }
  }

  async createSampleProducts() {
    const sampleProducts = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        price: 299.99,
        category: "electronics",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Best Seller",
        likes: 0,
        comments: [],
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracking with heart rate monitor and GPS functionality.",
        price: 199.99,
        category: "electronics",
        image: "/placeholder.svg?height=300&width=300",
        badge: "New",
        likes: 0,
        comments: [],
      },
      {
        name: "Designer Casual Shirt",
        description: "Premium cotton casual shirt with modern fit and stylish design.",
        price: 79.99,
        category: "fashion",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Sale",
        likes: 0,
        comments: [],
      },
      {
        name: "Professional Running Shoes",
        description: "Lightweight running shoes with advanced cushioning technology.",
        price: 149.99,
        category: "sports",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Popular",
        likes: 0,
        comments: [],
      },
      {
        name: "Smart Home Speaker",
        description: "Voice-controlled smart speaker with premium audio and home automation.",
        price: 129.99,
        category: "electronics",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Featured",
        likes: 0,
        comments: [],
      },
      {
        name: "Luxury Handbag",
        description: "Elegant leather handbag with spacious interior and premium craftsmanship.",
        price: 249.99,
        category: "fashion",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Luxury",
        likes: 0,
        comments: [],
      },
      {
        name: "Modern Table Lamp",
        description: "Stylish LED table lamp with adjustable brightness and modern design.",
        price: 89.99,
        category: "home",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Eco-Friendly",
        likes: 0,
        comments: [],
      },
      {
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat with extra cushioning for comfortable practice.",
        price: 59.99,
        category: "sports",
        image: "/placeholder.svg?height=300&width=300",
        badge: "Bestseller",
        likes: 0,
        comments: [],
      },
    ]

    // Add products to Firestore
    for (const product of sampleProducts) {
      await db.collection("products").add(product)
    }
  }

  setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn")
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter
        this.filterProducts(filter)

        // Update active button
        filterButtons.forEach((b) => b.classList.remove("active"))
        btn.classList.add("active")
      })
    })

    // Category cards
    const categoryCards = document.querySelectorAll(".category-card")
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const category = card.dataset.category
        this.filterProducts(category)

        // Update filter button
        filterButtons.forEach((b) => b.classList.remove("active"))
        const targetBtn = document.querySelector(`[data-filter="${category}"]`)
        if (targetBtn) targetBtn.classList.add("active")
      })
    })

    // Search functionality
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchProducts(e.target.value)
      })
    }
  }

  filterProducts(filter) {
    this.currentFilter = filter
    if (filter === "all") {
      this.filteredProducts = [...this.products]
    } else {
      this.filteredProducts = this.products.filter((product) => product.category === filter)
    }
    this.renderProducts()
  }

  searchProducts(query) {
    const searchTerm = query.toLowerCase().trim()
    if (!searchTerm) {
      this.filterProducts(this.currentFilter)
      return
    }

    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    )
    this.renderProducts()
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid")
    if (!productsGrid) return

    if (this.filteredProducts.length === 0) {
      productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                    <p style="color: var(--text-secondary); font-size: 1.1rem;">No products found</p>
                </div>
            `
      return
    }

    productsGrid.innerHTML = this.filteredProducts
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                    </div>
                    <div class="product-interactions">
                        <button class="like-btn" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                            <span>${product.likes || 0}</span>
                        </button>
                        <button class="comment-btn" data-product-id="${product.id}">
                            <i class="fas fa-comment"></i>
                            <span>${product.comments ? product.comments.length : 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")

    // Add event listeners to new elements
    this.attachProductEventListeners()
  }

  attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const productId = btn.dataset.productId
        cartManager.addToCart(productId)
      })
    })

    // Like buttons
    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation()
        const productId = btn.dataset.productId
        await this.toggleLike(productId)
      })
    })

    // Comment buttons
    document.querySelectorAll(".comment-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        const productId = btn.dataset.productId
        this.showProductModal(productId)
      })
    })

    // Product cards
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.dataset.productId
        this.showProductModal(productId)
      })
    })
  }

  async toggleLike(productId) {
    try {
      const product = this.products.find((p) => p.id === productId)
      if (!product) return

      const userId = authManager.getCurrentUser()?.id
      if (!userId) return

      // Check if user already liked this product
      const userLikes = JSON.parse(localStorage.getItem("userLikes") || "{}")
      const hasLiked = userLikes[productId]

      if (hasLiked) {
        // Unlike
        product.likes = Math.max(0, (product.likes || 0) - 1)
        delete userLikes[productId]
      } else {
        // Like
        product.likes = (product.likes || 0) + 1
        userLikes[productId] = true
      }

      // Update localStorage
      localStorage.setItem("userLikes", JSON.stringify(userLikes))

      // Update Firestore
      await db.collection("products").doc(productId).update({
        likes: product.likes,
      })

      // Update UI
      const likeBtn = document.querySelector(`[data-product-id="${productId}"].like-btn`)
      if (likeBtn) {
        likeBtn.classList.toggle("liked", !hasLiked)
        likeBtn.querySelector("span").textContent = product.likes
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      authManager.showToast("Failed to update like. Please try again.", "error")
    }
  }

  showProductModal(productId) {
    const product = this.products.find((p) => p.id === productId)
    if (!product) return

    const modal = document.getElementById("productModal")
    const modalBody = document.getElementById("productModalBody")

    modalBody.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                <div>
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 0.5rem;">
                </div>
                <div>
                    <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem;">${product.name}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.6;">${product.description}</p>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--primary-color); margin-bottom: 2rem;">$${product.price.toFixed(2)}</div>
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                        <button class="add-to-cart-btn" data-product-id="${product.id}" style="flex: 1;">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="like-btn ${this.isLiked(productId) ? "liked" : ""}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                            <span>${product.likes || 0}</span>
                        </button>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <h3 style="margin-bottom: 1rem;">Comments</h3>
                        <div class="comments-section" id="commentsSection">
                            ${this.renderComments(product.comments || [])}
                        </div>
                        <div style="margin-top: 1rem;">
                            <textarea placeholder="Add a comment..." style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.25rem; resize: vertical;" id="commentInput"></textarea>
                            <button onclick="productManager.addComment('${productId}')" style="margin-top: 0.5rem; background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer;">Add Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        `

    modal.classList.add("show")

    // Re-attach event listeners for modal content
    modalBody.querySelector(".add-to-cart-btn").addEventListener("click", (e) => {
      e.stopPropagation()
      cartManager.addToCart(productId)
    })

    modalBody.querySelector(".like-btn").addEventListener("click", async (e) => {
      e.stopPropagation()
      await this.toggleLike(productId)
    })
  }

  renderComments(comments) {
    if (!comments || comments.length === 0) {
      return '<p style="color: var(--text-secondary); font-style: italic;">No comments yet.</p>'
    }

    return comments
      .map(
        (comment) => `
            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.5rem;">
                <div style="font-weight: 600; margin-bottom: 0.25rem;">${comment.userName}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">${comment.text}</div>
                <div style="color: var(--text-light); font-size: 0.8rem; margin-top: 0.25rem;">${new Date(comment.timestamp).toLocaleDateString()}</div>
            </div>
        `,
      )
      .join("")
  }

  async addComment(productId) {
    const commentInput = document.getElementById("commentInput")
    const commentText = commentInput.value.trim()

    if (!commentText) {
      authManager.showToast("Please enter a comment.", "warning")
      return
    }

    const user = authManager.getCurrentUser()
    if (!user) return

    try {
      const product = this.products.find((p) => p.id === productId)
      if (!product) return

      const comment = {
        userName: user.name,
        userId: user.id,
        text: commentText,
        timestamp: new Date().toISOString(),
      }

      if (!product.comments) product.comments = []
      product.comments.push(comment)

      // Update Firestore
      await db.collection("products").doc(productId).update({
        comments: product.comments,
      })

      // Update UI
      const commentsSection = document.getElementById("commentsSection")
      if (commentsSection) {
        commentsSection.innerHTML = this.renderComments(product.comments)
      }

      // Update comment count in product grid
      const commentBtn = document.querySelector(`[data-product-id="${productId}"].comment-btn`)
      if (commentBtn) {
        commentBtn.querySelector("span").textContent = product.comments.length
      }

      commentInput.value = ""
      authManager.showToast("Comment added successfully!", "success")
    } catch (error) {
      console.error("Error adding comment:", error)
      authManager.showToast("Failed to add comment. Please try again.", "error")
    }
  }

  isLiked(productId) {
    const userLikes = JSON.parse(localStorage.getItem("userLikes") || "{}")
    return !!userLikes[productId]
  }

  showLoading(show) {
    const loading = document.getElementById("loading")
    if (loading) {
      loading.classList.toggle("show", show)
    }
  }

  getProductById(productId) {
    return this.products.find((p) => p.id === productId)
  }
}

// Initialize product manager
const productManager = new ProductManager()

// Export for global use
window.productManager = productManager
