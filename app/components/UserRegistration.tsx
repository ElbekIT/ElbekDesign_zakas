"use client"

import type React from "react"

import { useState } from "react"
import { X, User, Phone, Trash2 } from "lucide-react"
import type { User as UserType } from "../types"

interface UserRegistrationProps {
  onRegister: (user: UserType) => void
  onClose: () => void
  currentUser: UserType | null
}

export default function UserRegistration({ onRegister, onClose, currentUser }: UserRegistrationProps) {
  const [name, setName] = useState(currentUser?.name || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && phone.trim()) {
      onRegister({ name: name.trim(), phone: phone.trim() })
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("Haqiqatan ham akkauntni o'chirmoqchimisiz?")) {
      localStorage.removeItem("user")
      localStorage.removeItem("cartItems")
      localStorage.removeItem("wishlistItems")
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{currentUser ? "Akkaunt ma'lumotlari" : "Ro'yxatdan o'tish"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Ismingiz
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ismingizni kiriting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Telefon raqami
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+998 90 123 45 67"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentUser ? "Yangilash" : "Saqlash"}
            </button>

            {currentUser && (
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {!currentUser && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Bu ma'lumotlar xavfsiz saqlanadi va faqat buyurtmalar uchun ishlatiladi.
          </p>
        )}
      </div>
    </div>
  )
}
