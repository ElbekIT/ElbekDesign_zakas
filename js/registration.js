// Check if user is already registered
document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    window.location.href = "index.html";
  }
});

// Registration form handler
const registrationForm = document.getElementById("registrationForm");
if (registrationForm) {
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();

    if (!fullName || !phoneNumber) {
      alert("Please fill in all fields");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[1-9]\d{7,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      alert("Please enter a valid phone number");
      return;
    }

    const submitBtn = document.querySelector(".register-btn");
    const btnText = document.querySelector(".btn-text");
    const loadingSpinner = document.querySelector(".loading-spinner");

    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (loadingSpinner) loadingSpinner.style.display = "block";

    try {
      // Save to Firebase
      const { collection, addDoc, serverTimestamp } = window.firebaseModules;
      const docRef = await addDoc(collection(window.db, "users"), {
        fullName: fullName,
        phoneNumber: phoneNumber,
        registrationDate: serverTimestamp(),
        isActive: true,
      });

      // Save to localStorage
      const userData = {
        id: docRef.id,
        fullName: fullName,
        phoneNumber: phoneNumber,
        registrationDate: new Date().toISOString(),
      };

      localStorage.setItem("userData", JSON.stringify(userData));

      alert("Registration successful! Welcome to Professional Shop!");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
      // Reset button state
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.style.display = "block";
      if (loadingSpinner) loadingSpinner.style.display = "none";
    }
  });
}

// Phone number formatting
const phoneInput = document.getElementById("phoneNumber");
if (phoneInput) {
  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = "+" + value;
    }
    e.target.value = value;
  });
}
