"use client"

import { useState } from "react"
import { X, Plus, Minus, MapPin, Check } from "lucide-react"
import type { CartItem, User } from "../types"

interface CartProps {
  items: CartItem[]
  onClose: () => void
  onRemoveItem: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number) => void
  onClearCart: () => void
  user: User | null
}

export default function Cart({ items, onClose, onRemoveItem, onUpdateQuantity, onClearCart, user }: CartProps) {
  const [installationRequired, setInstallationRequired] = useState(false)
  const [shareLocation, setShareLocation] = useState(false)
  const [location, setLocation] = useState<string>("")

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude}, ${longitude}`)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocation("Joylashuv olinmadi")
        },
      )
    } else {
      setLocation("Geolokatsiya qo'llab-quvvatlanmaydi")
    }
  }

  const sendToTelegram = async () => {
    if (!installationRequired) {
      alert('Iltimos, "Ustanovka qilib berilsin" ni belgilang!')
      return
    }

    if (!user) {
      alert("Iltimos, avval ro'yxatdan o'ting!")
      return
    }

    const botToken = "8122147889:AAFCQwTvyB9DuDm7qkXpjBFqjtWJKadmDlw"
    const chatId = "7702025887"

    let message = "🛒 Yangi buyurtma!\n\n"
    message += `👤 Mijoz: ${user.name}\n`
    message += `📞 Telefon: ${user.phone}\n\n`
    message += "📦 Mahsulotlar:\n"

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`
      message += `   💰 Narx: $${item.product.price.toFixed(2)}\n`
      message += `   📊 Miqdor: ${item.quantity}\n`
      message += `   💵 Jami: $${(item.product.price * item.quantity).toFixed(2)}\n\n`
    })

    message += `💰 Umumiy summa: $${total.toFixed(2)}\n`
    message += `✅ Ustanovka: ${installationRequired ? "Ha" : "Yo'q"}\n`

    if (shareLocation && location) {
      message += `📍 Joylashuv: ${location}\n`
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      })

      if (response.ok) {
        alert("Buyurtma muvaffaqiyatli yuborildi!")
        onClearCart()
        onClose()
      } else {
        throw new Error("Telegram API error")
      }
    } catch (error) {
      console.error("Error sending to Telegram:", error)
      alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.")
    }
  }

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Savatcha</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <p className="text-gray-500">Savatcha bo'sh</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Savatcha ({items.length})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96 p-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-4 py-4 border-b">
              <img
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-blue-600 font-bold">${item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => onRemoveItem(item.product.id)} className="text-red-500 hover:text-red-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t space-y-4">
          {/* Installation checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={installationRequired}
              onChange={(e) => setInstallationRequired(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">
              <Check className="w-4 h-4 inline mr-1" />
              Ustanovka qilib berilsin (majburiy)
            </span>
          </label>

          {/* Location checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shareLocation}
              onChange={(e) => {
                setShareLocation(e.target.checked)
                if (e.target.checked) {
                  getLocation()
                }
              }}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm">
              <MapPin className="w-4 h-4 inline mr-1" />
              Mening joylashuvimni yuborish (ixtiyoriy)
            </span>
          </label>

          {shareLocation && location && <p className="text-xs text-gray-500 ml-6">Joylashuv: {location}</p>}

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Jami:</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onClearCart}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tozalash
            </button>
            <button
              onClick={sendToTelegram}
              className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                installationRequired
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
