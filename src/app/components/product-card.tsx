import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Minus, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { isProductChosen, variantKey, type Product } from '@/app/data/catalog'
import { adjustQtyAtom, quantitiesAtom } from '@/app/state/quantities'

const swatchColor: Record<string, string> = {
  White: 'bg-white border-neutral-300',
  Grey: 'bg-neutral-400 border-neutral-400',
  Black: 'bg-neutral-900 border-neutral-900',
}

const money = (n: number) => `$${n.toFixed(2)}`

type ProductCardProps = {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const quantities = useAtomValue(quantitiesAtom)
  const adjustQty = useSetAtom(adjustQtyAtom)

  // The stepper is bound to whichever variant is currently selected.
  const [variant, setVariant] = useState<string | undefined>(
    product.colors?.[0],
  )

  const qty = quantities[variantKey(product.id, variant)] ?? 0
  const chosen = isProductChosen(product, quantities)

  const Icon = product.icon
  const suffix = product.monthly ? '/mo' : ''
  const isFree = product.unitSale === 0
  const showOrig = product.unitOrig > product.unitSale

  return (
    <Card
      className={cn(
        'relative gap-2 border-2 p-3 shadow-none ring-0',
        // A selected card (any variant chosen) gets the purple border.
        chosen ? 'border-[rgba(78,47,210,0.7)]' : 'border-transparent',
      )}
    >
      {product.save ? (
        <Badge className="absolute top-3 left-3 z-10">
          Save {product.save}%
        </Badge>
      ) : null}

      <div className="flex h-20 items-center justify-center overflow-hidden rounded-lg bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full scale-125 object-contain"
          />
        ) : (
          <Icon
            className="text-muted-foreground/40 size-10"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div>
        <h3 className="text-sm font-bold">
          {product.name}
          {product.nameAccent && (
            <span className="text-primary"> {product.nameAccent}</span>
          )}
        </h3>
        {product.description && (
          <p className="text-muted-foreground mt-1 text-xs leading-snug">
            {product.description}{' '}
            <a
              href="#"
              className="font-medium text-[#0000ee] underline underline-offset-2"
            >
              Learn More
            </a>
          </p>
        )}
      </div>

      {product.colors && product.colors.length > 0 && (
        <div className="mt-auto flex flex-nowrap gap-1.5">
          {product.colors.map((c) => {
            const active = variant === c
            const chipImage = product.colorImages?.[c] ?? product.image
            return (
              <button
                key={c}
                type="button"
                onClick={() => setVariant(c)}
                className={cn(
                  'flex h-[26px] shrink-0 items-center justify-center gap-1 rounded-[2px] border-[0.5px] px-1.5 text-[10px] leading-none tracking-[0.6px] whitespace-nowrap text-[#1f1f1f]',
                  active
                    ? 'border-[#0aa288] bg-[rgba(29,240,187,0.04)]'
                    : 'border-[#ccc] bg-white',
                )}
              >
                {chipImage ? (
                  <img
                    src={chipImage}
                    alt=""
                    className="size-[22px] shrink-0 rounded-[5px] object-contain"
                  />
                ) : (
                  <span
                    className={cn(
                      'size-[22px] shrink-0 rounded-[5px] border',
                      swatchColor[c] ?? 'border-neutral-300 bg-neutral-300',
                    )}
                  />
                )}
                <span>{c}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-2 pt-1">
        <div className="flex shrink-0 items-center gap-2.5 py-1">
          <button
            type="button"
            onClick={() =>
              adjustQty({ productId: product.id, variant, delta: -1 })
            }
            disabled={product.required || qty === 0}
            aria-label="Decrease quantity"
            className={cn(
              'flex size-5 items-center justify-center rounded-[4px] border-2 transition-colors disabled:cursor-not-allowed',
              qty === 0 || product.required
                ? 'border-[#f0f4f7] bg-[#f0f4f7]'
                : 'border-[#e6ebf0] bg-white',
            )}
          >
            <Minus className="size-2.5 text-[#0b0d10]" strokeWidth={2.5} />
          </button>
          <span className="text-base leading-5 font-medium text-[#0b0d10]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() =>
              adjustQty({ productId: product.id, variant, delta: 1 })
            }
            disabled={product.required}
            aria-label="Increase quantity"
            className="flex size-5 items-center justify-center rounded-[4px] bg-[#f0f4f7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="size-2.5 text-[#0b0d10]" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-base whitespace-nowrap">
          {showOrig && (
            <span className="text-[#d8392b] line-through">
              {money(product.unitOrig)}
              {suffix}
            </span>
          )}
          {isFree ? (
            <span className="text-primary font-semibold">FREE</span>
          ) : (
            <span className="text-[#575757]">
              {money(product.unitSale)}
              {suffix}
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}
