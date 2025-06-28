export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
  isPopular?: boolean
  discount?: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  name: string
  phone: string
}
