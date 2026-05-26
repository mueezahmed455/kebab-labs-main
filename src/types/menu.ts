export interface MenuVariant {
  label: string
  price: number
}

export interface MenuItem {
  id: string
  cat: string
  name: string
  desc: string
  price: number
  badge?: string
  vegetarian?: boolean
  vegan?: boolean
  spicy?: boolean
  sizes?: MenuVariant[]
}

export interface Category {
  id: string
  name: string
  icon: string
  accentColor: string
  description?: string
}


