import {
  BatteryFull,
  Bell,
  Cctv,
  Lightbulb,
  MemoryStick,
  Radar,
  Router,
  ShieldCheck,
  Truck,
  Video,
  type LucideIcon,
} from 'lucide-react'

import rawProducts from '@/app/data/products.json'

export type Category = 'cameras' | 'sensors' | 'accessories' | 'plan'

export type Product = {
  id: string
  category: Category
  name: string
  nameAccent?: string
  description?: string
  /** Path to the real product photo (served from /public). Falls back to `icon`. */
  image?: string
  /** Optional per-product override for the image's sizing classes. */
  imageClassName?: string
  icon: LucideIcon
  colors?: string[]
  /** Per-color thumbnail photos shown inside each color chip. */
  colorImages?: Record<string, string>
  save?: number
  unitOrig: number
  unitSale: number
  monthly?: boolean
  required?: boolean
  defaultQty: number
}

/** The shape as stored in products.json — `icon` is a lucide icon *name* rather
 *  than a component, since JSON can't hold a React component. */
type RawProduct = Omit<Product, 'icon' | 'category'> & {
  icon: string
  category: string
}

/** Resolves the icon names used in products.json to lucide components. */
const iconMap: Record<string, LucideIcon> = {
  BatteryFull,
  Bell,
  Cctv,
  Lightbulb,
  MemoryStick,
  Radar,
  Router,
  ShieldCheck,
  Truck,
  Video,
}

export const products: Product[] = (rawProducts as RawProduct[]).map((p) => ({
  ...p,
  category: p.category as Category,
  icon: iconMap[p.icon] ?? Cctv,
}))

export const variantKey = (productId: string, variant?: string) =>
  variant ? `${productId}__${variant}` : productId

export const productVariantKeys = (product: Product): string[] =>
  product.colors?.length
    ? product.colors.map((c) => variantKey(product.id, c))
    : [variantKey(product.id)]

export const defaultQuantities: Record<string, number> = Object.fromEntries(
  products.map((p) => [
    p.colors?.length ? variantKey(p.id, p.colors[0]) : variantKey(p.id),
    p.defaultQty,
  ]),
)

export const productsByCategory = (category: Category) =>
  products.filter((p) => p.category === category)

/** True when any variant of the product has a quantity above zero. */
export const isProductChosen = (
  product: Product,
  quantities: Record<string, number>,
) => productVariantKeys(product).some((k) => (quantities[k] ?? 0) > 0)

export const categoryLabels: Record<Category, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
  plan: 'Plan',
}
