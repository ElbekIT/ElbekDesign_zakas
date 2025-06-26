class AuthManager {
  constructor() {
    this.currentUser = null
    this.init()
  }

  init() {
    // Check if user is already registered
    const userData = localStorage.getItem("userData")
    if (userData) {
      this.currentUser = JSON.parse(userData)
      if (window.location.pathname.includes("register.html")) {
        window.location.href = "index.html"
      }
    } else {
      if (!window.location.pathname.includes("register.html")) {
        window.location.href = "register.html"
      }
    }
  }

  async register(name, phone) {
    try {
      // Create user data
      const userData = {
        id: this.generateUserId(),
        name: name.trim(),
        phone: phone.trim(),
        registeredAt: new Date().toISOString(),
      }

      // Declare db variable (assuming Firestore is initialized elsewhere)
      const db = firebase.firestore()

      // Save to Firestore
      await db.collection("users").doc(userData.id).set(userData)

      // Save to localStorage
      localStorage.setItem("userData", JSON.stringify(userData))

      this.currentUser = userData

      // Show success message
      this.showToast("Registration successful! Welcome to Elite Shop.", "success")

      // Redirect to main page
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)

      return true
    } catch (error) {
      console.error("Registration error:", error)
      this.showToast("Registration failed. Please try again.", "error")
      return false
    }
  }

  logout() {
    localStorage.removeItem("userData")
    localStorage.removeItem("cartItems")
    this.currentUser = null
    window.location.href = "register.html"
  }

  getCurrentUser() {
    return this.currentUser
  }

  generateUserId() {
    return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  }

  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toastContainer")
    if (!toastContainer) return

    const toast = document.createElement("div")
    toast.className = `toast ${type}`
    toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"}"></i>
                <span>${message}</span>
            </div>
        `

    toastContainer.appendChild(toast)

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }
}

// Initialize auth manager
const authManager = new AuthManager()

// Register form handler
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("fullName").value
    const phone = document.getElementById("phoneNumber").value

    if (!name || !phone) {
      authManager.showToast("Please fill in all fields.", "warning")
      return
    }

    if (phone.length < 10) {
      authManager.showToast("Please enter a valid phone number.", "warning")
      return
    }

    await authManager.register(name, phone)
  })
}

// Export for global use
window.authManager = authManager
