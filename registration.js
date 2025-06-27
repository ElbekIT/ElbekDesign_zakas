// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

let userLocation = null

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
  const telegramUsername = document.getElementById("telegramUsername").value.trim()

  if (!fullName || !phoneNumber || !telegramUsername) {
    alert("Please fill in all required fields")
    return
  }

  // Validate phone number (basic validation)
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phoneNumber)) {
    alert("Please enter a valid phone number")
    return
  }

  // Validate Telegram username
  if (!telegramUsername.startsWith("@")) {
    alert("Telegram username must start with @")
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
    // Generate unique user ID
    const userId = Date.now().toString()

    // Prepare user data
    const userData = {
      id: userId,
      fullName: fullName,
      phoneNumber: phoneNumber,
      telegramUsername: telegramUsername,
      location: userLocation,
      registrationDate: new Date().toISOString(),
      isActive: true,
    }

    // Save to Firebase
    const { collection, addDoc, serverTimestamp } = window.firebaseModules
    const docRef = await addDoc(collection(window.db, "users"), {
      ...userData,
      registrationDate: serverTimestamp(),
    })

    // Update user data with Firebase document ID
    userData.firebaseId = docRef.id

    // Save to localStorage
    localStorage.setItem("userData", JSON.stringify(userData))

    // Send registration notification to Telegram
    await sendRegistrationToTelegram(userData)

    // Show success message
    alert("Registration successful! Welcome to NEXUS Store!")

    // Redirect to main page
    window.location.href = "index.html"
  } catch (error) {
    console.error("Registration error:", error)
    alert("Registration failed. Please try again.")

    // Reset button state
    submitBtn.disabled = false
    btnText.style.display = "block"
    loadingSpinner.style.display = "none"
  }
})

// Location functionality
document.getElementById("getLocationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString(),
        }

        // Show location captured
        document.getElementById("getLocationBtn").style.display = "none"
        document.getElementById("locationInfo").style.display = "flex"
        document.getElementById("locationText").textContent = `Location captured (${userLocation.latitude.toFixed(
          4,
        )}, ${userLocation.longitude.toFixed(4)})`
      },
      (error) => {
        console.error("Location error:", error)
        alert("Unable to get location. You can continue without sharing location.")
      },
    )
  } else {
    alert("Geolocation is not supported by this browser.")
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

// Telegram username formatting
document.getElementById("telegramUsername").addEventListener("input", (e) => {
  let value = e.target.value
  if (value.length > 0 && !value.startsWith("@")) {
    value = "@" + value
  }
  e.target.value = value
})

// Send registration data to Telegram
async function sendRegistrationToTelegram(userData) {
  const locationText = userData.location
    ? `📍 Location: ${userData.location.latitude.toFixed(4)}, ${userData.location.longitude.toFixed(4)}`
    : "📍 Location: Not provided"

  const message = `🎉 New User Registration!

👤 Name: ${userData.fullName}
📱 Phone: ${userData.phoneNumber}
💬 Telegram: ${userData.telegramUsername}
${locationText}
📅 Date: ${new Date(userData.registrationDate).toLocaleString()}

Welcome to NEXUS Store! 🛍️`

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
    throw new Error("Failed to send registration notification to Telegram")
  }
}
