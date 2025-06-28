import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopUZ - Onlayn Do'kon",
  description: "Eng sifatli mahsulotlar va professional xizmat. Amazon va AliExpress kabi professional onlayn do'kon.",
  keywords: "onlayn dokon, mahsulotlar, sotib olish, uzbekistan, shop",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
