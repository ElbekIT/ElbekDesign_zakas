"use client"

import { X, ShoppingCart, Heart } from "lucide-react"
import type { Product } from "../types"

interface WishlistProps {
  items: string[]
  products: Product[]
  onClose: () => void
  onRemoveItem: (productId: string) => void
  onAddToCart: (product: Product) => void
}

export default function Wishlist({ items, products, onClose, onRemoveItem, onAddToCart }: WishlistProps) {
  const wishlistProducts = products.filter((product) => items.includes(product.id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-500" />
            Yoqtirganlar ({items.length})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96 p-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Hozircha yoqtirgan mahsulotlar yo'q</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-lg font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Savatchaga qo'shish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
