// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
const TELEGRAM_CHAT_ID = "7702025887"

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

  if (!fullName) {
    alert("Please enter your name")
    return
  }

  if (fullName.length < 2) {
    alert("Please enter a valid name")
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
    alert(`Welcome ${fullName}! Enjoy your premium shopping experience!`)

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

// Send registration data to Telegram
async function sendRegistrationToTelegram(userData) {
  const message = `🎉 New User Registration!

👤 Name: ${userData.fullName}
📅 Date: ${new Date(userData.registrationDate).toLocaleString()}

Welcome to NEXUS Store! 🛍️`

  const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
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
      console.error("Failed to send registration notification to Telegram")
    }
  } catch (error) {
    console.error("Error sending to Telegram:", error)
  }
}
