import { atom } from 'jotai'

import {
  defaultQuantities,
  products,
  variantKey,
  type Product,
} from '@/app/data/catalog'

const STORAGE_KEY = 'ecom-saved-system'

const loadQuantities = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultQuantities
    const saved = JSON.parse(raw) as Record<string, number>
    return { ...defaultQuantities, ...saved }
  } catch {
    return defaultQuantities
  }
}

export const quantitiesAtom = atom<Record<string, number>>(loadQuantities())

export const saveSystemAtom = atom(null, (get) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(get(quantitiesAtom)))
})

export const adjustQtyAtom = atom(
  null,
  (
    get,
    set,
    {
      productId,
      variant,
      delta,
    }: { productId: string; variant?: string; delta: number },
  ) => {
    const key = variantKey(productId, variant)
    const q = get(quantitiesAtom)
    set(quantitiesAtom, { ...q, [key]: Math.max(0, (q[key] ?? 0) + delta) })
  },
)

export type SelectedLine = {
  key: string
  product: Product
  variant?: string
  qty: number
}

/** One entry per variant with qty > 0, in catalog order — drives the review
 *  panel (each variant is its own line). */
export const selectedLinesAtom = atom<SelectedLine[]>((get) => {
  const q = get(quantitiesAtom)
  const lines: SelectedLine[] = []
  for (const product of products) {
    const variants = product.colors?.length ? product.colors : [undefined]
    for (const variant of variants) {
      const key = variantKey(product.id, variant)
      const qty = q[key] ?? 0
      if (qty > 0) lines.push({ key, product, variant, qty })
    }
  }
  return lines
})

/** Live order totals for the summary, derived from every one-time variant. */
export const orderTotalsAtom = atom((get) => {
  const lines = get(selectedLinesAtom).filter((l) => !l.product.monthly)
  let orig = 0
  let sale = 0
  for (const l of lines) {
    orig += l.product.unitOrig * l.qty
    sale += l.product.unitSale * l.qty
  }
  return { orig, sale, savings: orig - sale }
})
