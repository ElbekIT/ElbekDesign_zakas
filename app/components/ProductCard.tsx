"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import type { Product } from "../types"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onToggleWishlist: (productId: string) => void
  isInWishlist: boolean
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const [likes, setLikes] = useState(() => {
    const savedLikes = localStorage.getItem(`likes_${product.id}`)
    return savedLikes ? Number.parseInt(savedLikes) : Math.floor(Math.random() * 100) + 10
  })

  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem(`user_liked_${product.id}`) === "true"
  })

  const handleLike = () => {
    if (!hasLiked) {
      const newLikes = likes + 1
      setLikes(newLikes)
      setHasLiked(true)
      localStorage.setItem(`likes_${product.id}`, newLikes.toString())
      localStorage.setItem(`user_liked_${product.id}`, "true")
    }
  }

  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Yangi</span>
          )}
          {product.isPopular && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">Ommabop</span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">-{product.discount}%</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isInWishlist ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">(4.8)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">${discountedPrice.toFixed(2)}</span>
            {product.discount && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Likes */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center space-x-1 text-sm ${
              hasLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </button>
        </div>

        {/* Add to cart button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Savatchaga qo'shish</span>
        </button>
      </div>
    </div>
  )
}
