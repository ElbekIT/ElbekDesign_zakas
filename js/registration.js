// Check if user is already registered
document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("userData")
  if (userData) {
    window.location.href = "index.html"
  }
})

// Registration form handler
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const fullName = document.getElementById("fullName").value.trim()
  const phoneNumber = document.getElementById("phoneNumber").value.trim()

  // Validation
  if (!fullName || !phoneNumber) {
    alert("Please fill in all fields")
    return
  }

  if (fullName.length < 2) {
    alert("Please enter a valid full name")
    return
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phoneNumber)) {
    alert("Please enter a valid phone number")
    return
  }

  const submitBtn = document.querySelector(".register-btn")
  const btnText = document.querySelector(".btn-text")
  const loadingSpinner = document.querySelector(".loading-spinner")

  // Show loading state
  submitBtn.disabled = true
  btnText.style.display = "none"
  loadingSpinner.style.display = "block"

  try {
    // Save to Firebase Realtime Database
    const { ref, push, set } = window.firebaseModules
    const usersRef = ref(window.database, "users")
    const newUserRef = push(usersRef)

    await set(newUserRef, {
      fullName: fullName,
      phoneNumber: phoneNumber,
      registrationDate: new Date().toISOString(),
      isActive: true,
    })

    // Save to localStorage
    const userData = {
      id: newUserRef.key,
      fullName: fullName,
      phoneNumber: phoneNumber,
      registrationDate: new Date().toISOString(),
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Show success message
    showSuccessMessage("Registration successful! Welcome to NEXUS Store!")

    // Redirect to main page after a short delay
    setTimeout(() => {
      window.location.href = "index.html"
    }, 1500)
  } catch (error) {
    console.error("Registration error:", error)
    alert("Registration failed. Please try again.")

    // Reset button state
    submitBtn.disabled = false
    btnText.style.display = "block"
    loadingSpinner.style.display = "none"
  }
})

// Phone number formatting
document.getElementById("phoneNumber").addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "")
  if (value.length > 0 && !value.startsWith("+")) {
    value = "+" + value
  }
  e.target.value = value
})

// Enhanced form validation
document.getElementById("fullName").addEventListener("input", (e) => {
  const value = e.target.value
  const isValid = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value)

  e.target.style.borderColor = isValid ? "#10b981" : "#ef4444"
})

document.getElementById("phoneNumber").addEventListener("input", (e) => {
  const value = e.target.value
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  const isValid = phoneRegex.test(value) && value.length >= 8

  e.target.style.borderColor = isValid ? "#10b981" : "#ef4444"
})

// Success message function
function showSuccessMessage(message) {
  // Create success overlay
  const successOverlay = document.createElement("div")
  successOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(16, 185, 129, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    backdrop-filter: blur(10px);
  `

  successOverlay.innerHTML = `
    <div style="
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 400px;
      margin: 0 20px;
    ">
      <div style="
        width: 60px;
        height: 60px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        color: white;
        font-size: 24px;
      ">
        ✓
      </div>
      <h3 style="color: #1f2937; margin-bottom: 0.5rem; font-size: 1.25rem;">${message}</h3>
      <p style="color: #6b7280; font-size: 0.875rem;">Redirecting you to the store...</p>
    </div>
  `

  document.body.appendChild(successOverlay)

  // Remove overlay after redirect
  setTimeout(() => {
    successOverlay.remove()
  }, 2000)
}

// Add some visual enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Add focus effects to form inputs
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.style.transform = "translateY(-2px)"
      input.parentElement.style.boxShadow = "0 10px 25px rgba(102, 126, 234, 0.15)"
    })

    input.addEventListener("blur", () => {
      input.parentElement.style.transform = "translateY(0)"
      input.parentElement.style.boxShadow = "none"
    })
  })

  // Add hover effect to register button
  const registerBtn = document.querySelector(".register-btn")
  registerBtn.addEventListener("mouseenter", () => {
    registerBtn.style.transform = "translateY(-2px)"
    registerBtn.style.boxShadow = "0 10px 20px rgba(102, 126, 234, 0.3)"
  })

  registerBtn.addEventListener("mouseleave", () => {
    if (!registerBtn.disabled) {
      registerBtn.style.transform = "translateY(0)"
      registerBtn.style.boxShadow = "none"
    }
  })
})
