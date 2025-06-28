"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Heart, User, Search, Menu, MapPin, Phone, Mail } from "lucide-react"
import ProductCard from "./components/ProductCard"
import Cart from "./components/Cart"
import UserRegistration from "./components/UserRegistration"
import Wishlist from "./components/Wishlist"
import type { Product, CartItem, User as UserType } from "./types"

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isNew: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    price: 399.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isPopular: true,
  },
  {
    id: "3",
    name: "Luxury Leather Jacket",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    discount: 15,
  },
  {
    id: "4",
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    isNew: true,
  },
  {
    id: "5",
    name: "Professional Camera Lens",
    price: 599.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Photography",
  },
  {
    id: "6",
    name: "Comfortable Running Shoes",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports",
    isPopular: true,
    discount: 25,
  },
]

export default function HomePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<string[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWishlist, setShowWishlist] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setShowUserModal(true)
    }

    // Load cart items
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Load wishlist items
    const savedWishlist = localStorage.getItem("wishlistItems")
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist))
    }
  }, [])

  const handleUserRegistration = (userData: UserType) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setShowUserModal(false)
  }

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.product.id === product.id)
    let newCartItems: CartItem[]

    if (existingItem) {
      newCartItems = cartItems.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      )
    } else {
      newCartItems = [...cartItems, { product, quantity: 1 }]
    }

    setCartItems(newCartItems)
    localStorage.setItem("cartItems", JSON.stringify(newCartItems))
  }

  const toggleWishlist = (productId: string) => {
    let newWishlistItems: string[]

    if (wishlistItems.includes(productId)) {
      newWishlistItems = wishlistItems.filter((id) => id !== productId)
    } else {
      newWishlistItems = [...wishlistItems, productId]
    }

    setWishlistItems(newWishlistItems)
    localStorage.setItem("wishlistItems", JSON.stringify(newWishlistItems))
  }

  const removeFromCart = (productId: string) => {
    const newCartItems = cartItems.filter((item) => item.product.id !== productId)
    setCartItems(newCartItems)
    localStorage.setItem("cartItems", JSON.stringify(newCartItems))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newCartItems = cartItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    setCartItems(newCartItems)
    localStorage.setItem("cartItems", JSON.stringify(newCartItems))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem("cartItems")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Mega Sale - Up to 50% Off!</h2>
              <p className="text-lg mb-4">Discover amazing deals on premium products</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-blue-600">50,000+</h3>
                <p className="text-gray-600">Mamnun mijozlar</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-green-600">10,000+</h3>
                <p className="text-gray-600">Premium mahsulotlar</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold text-purple-600">99%</h3>
                <p className="text-gray-600">Qoniqish darajasi</p>
              </div>
            </div>

            {/* Products Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Barcha mahsulotlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sampleProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlistItems.includes(product.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h2>
            <p className="text-gray-600">Bu sahifa hozircha ishlab chiqilmoqda...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-1" /> +998 90 123 45 67
              </span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" /> info@shop.uz
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user && <span>Salom, {user.name}!</span>}
              <button onClick={() => setShowUserModal(true)} className="flex items-center hover:text-blue-600">
                <User className="w-4 h-4 mr-1" /> Akkaunt
              </button>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">ShopUZ</h1>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`hover:text-blue-600 ${currentPage === "home" ? "text-blue-600 font-semibold" : ""}`}
                >
                  Bosh sahifa
                </button>
                <button
                  onClick={() => setCurrentPage("categories")}
                  className={`hover:text-blue-600 ${currentPage === "categories" ? "text-blue-600 font-semibold" : ""}`}
                >
                  Toifalar
                </button>
                <button
                  onClick={() => setCurrentPage("new")}
                  className={`hover:text-blue-600 ${currentPage === "new" ? "text-blue-600 font-semibold" : ""}`}
                >
                  Yangi kelganlar
                </button>
                <button
                  onClick={() => setCurrentPage("popular")}
                  className={`hover:text-blue-600 ${currentPage === "popular" ? "text-blue-600 font-semibold" : ""}`}
                >
                  Ommabop
                </button>
                <button
                  onClick={() => setCurrentPage("sale")}
                  className={`hover:text-blue-600 ${currentPage === "sale" ? "text-blue-600 font-semibold" : ""}`}
                >
                  Chegirmalar
                </button>
              </nav>
            </div>

            {/* Search and actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input type="text" placeholder="Qidirish..." className="bg-transparent outline-none" />
              </div>

              <button onClick={() => setShowWishlist(true)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="w-6 h-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              <button onClick={() => setShowCart(true)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{renderPage()}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShopUZ</h3>
              <p className="text-gray-300 mb-4">Eng sifatli mahsulotlar va professional xizmat</p>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-2" />
                Toshkent, O'zbekiston
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ma'lumot</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button className="hover:text-white">Biz haqimizda</button>
                </li>
                <li>
                  <button className="hover:text-white">O'lcham qo'llanmasi</button>
                </li>
                <li>
                  <button className="hover:text-white">Yetkazib berish</button>
                </li>
                <li>
                  <button className="hover:text-white">Qaytarish siyosati</button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Yordam</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button className="hover:text-white">FAQ</button>
                </li>
                <li>
                  <button className="hover:text-white">Maxfiylik siyosati</button>
                </li>
                <li>
                  <button className="hover:text-white">Foydalanish shartlari</button>
                </li>
                <li>
                  <button className="hover:text-white">Yordam markazi</button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Bog'lanish</h4>
              <ul className="space-y-2 text-gray-300">
                <li>+998 90 123 45 67</li>
                <li>info@shop.uz</li>
                <li>Ish vaqti: 9:00 - 18:00</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 ShopUZ. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showUserModal && (
        <UserRegistration
          onRegister={handleUserRegistration}
          onClose={() => setShowUserModal(false)}
          currentUser={user}
        />
      )}

      {showCart && (
        <Cart
          items={cartItems}
          onClose={() => setShowCart(false)}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClearCart={clearCart}
          user={user}
        />
      )}

      {showWishlist && (
        <Wishlist
          items={wishlistItems}
          products={sampleProducts}
          onClose={() => setShowWishlist(false)}
          onRemoveItem={toggleWishlist}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}
