import { useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Loader2, Minus, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotify } from '@/hooks/notify'
import { categoryLabels, type Category } from '@/app/data/catalog'
import {
  adjustQtyAtom,
  orderTotalsAtom,
  saveSystemAtom,
  selectedLinesAtom,
  type SelectedLine,
} from '@/app/state/quantities'

const money = (n: number) => `$${n.toFixed(2)}`

const summaryOrder: Category[] = ['cameras', 'sensors', 'accessories', 'plan']

const SummaryLine = ({ line }: { line: SelectedLine }) => {
  const { product, variant, qty } = line
  const adjustQty = useSetAtom(adjustQtyAtom)

  const Icon = product.icon
  const isFree = product.unitSale === 0
  const suffix = product.monthly ? '/mo' : ''
  const showStepper = product.category !== 'plan'
  const saleLabel = isFree
    ? 'FREE'
    : `${money(product.monthly ? product.unitSale : product.unitSale * qty)}${suffix}`
  const showOrig = product.unitOrig > product.unitSale
  const origLabel = `${money(
    product.monthly ? product.unitOrig : product.unitOrig * qty,
  )}${suffix}`

  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              'object-contain',
              product.imageClassName ?? 'size-full',
            )}
          />
        ) : (
          <Icon className="text-muted-foreground size-5" strokeWidth={1.75} />
        )}
      </span>

      <span className="min-w-0 flex-1 text-sm">
        {product.name}
        {product.nameAccent && (
          <span className="text-primary font-bold"> {product.nameAccent}</span>
        )}
        {variant && <span className="text-muted-foreground"> · {variant}</span>}
      </span>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {showStepper && (
          <div
            className={cn(
              'flex items-center rounded-md border',
              product.required && 'opacity-60',
            )}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-md"
              onClick={() =>
                adjustQty({ productId: product.id, variant, delta: -1 })
              }
              disabled={product.required || qty === 0}
              aria-label="Decrease quantity"
            >
              <Minus />
            </Button>
            <span className="w-5 text-center text-sm font-medium">{qty}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-md"
              onClick={() =>
                adjustQty({ productId: product.id, variant, delta: 1 })
              }
              disabled={product.required}
              aria-label="Increase quantity"
            >
              <Plus />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm whitespace-nowrap">
          {showOrig && (
            <span className="text-muted-foreground line-through">
              {origLabel}
            </span>
          )}
          <span className="text-primary font-semibold">{saleLabel}</span>
        </div>
      </div>
    </div>
  )
}

export const OrderSummary = () => {
  const lines = useAtomValue(selectedLinesAtom)
  const { orig, sale, savings } = useAtomValue(orderTotalsAtom)
  const saveSystem = useSetAtom(saveSystemAtom)
  const { notify } = useNotify()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    saveSystem()
    // brief pause so the spinner is perceptible before we confirm
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSaving(false)
    notify.success('Your items have been saved')
  }

  const visibleGroups = summaryOrder
    .map((category) => ({
      category,
      lines: lines.filter((l) => l.product.category === category),
    }))
    .filter((g) => g.lines.length > 0)

  return (
    <div className="bg-accent grid grid-cols-1 gap-10 rounded-xl p-6 lg:grid-cols-[1.15fr_1fr] lg:p-8">
      {/* Left — itemized system */}
      <div>
        <h2 className="text-2xl font-bold">Your security system</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Review your personalized protection system designed to keep what
          matters most safe.
        </p>

        <div className="mt-5 space-y-5">
          {visibleGroups.map((group) => (
            <div
              key={group.category}
              className="border-t border-[#ced6de] pt-4"
            >
              <p className="mb-2 text-[11px] font-medium tracking-wider text-[#a8b2bd] uppercase">
                {categoryLabels[group.category]}
              </p>
              <div className="space-y-3">
                {group.lines.map((line, i) => (
                  <div
                    key={line.key}
                    className={cn(
                      group.category === 'plan' &&
                        i > 0 &&
                        'border-t border-[#ced6de] pt-3',
                    )}
                  >
                    <SummaryLine line={line} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — guarantee + checkout */}
      <div>
        <div className=" gap-5 hidden md:flex">
          <img
            src="/products/satisfaction-badge.png"
            alt="100% Wyze satisfaction guarantee"
            className="size-28 shrink-0 object-contain"
          />
          <div className="">
            <h3 className="text-lg font-bold">30-day hassle-free returns</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              If you’re not totally in love with the product, we will refund you
              100%.
            </p>
          </div>
        </div>
        <div className="flex md:block justify-between">
          <img
            src="/products/satisfaction-badge.png"
            alt="100% Wyze satisfaction guarantee"
            className="size-28 shrink-0 object-contain md:hidden"
          />
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <Badge className="rounded-md">as low as $19.19/mo</Badge>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-lg line-through">
                {money(orig)}
              </span>
              <span className="text-primary text-2xl font-bold">
                {money(sale)}
              </span>
            </div>
          </div>
        </div>

        <p className=" mt-2 text-center md:text-right text-sm font-medium text-green-600">
          Congrats! You’re saving {money(savings)} on your security bundle!
        </p>

        <Button
          size="lg"
          className="mt-4 h-12 w-full text-base font-semibold"
          onClick={() =>
            notify.success(`Order placed — ${money(sale)} total. Thank you!`)
          }
        >
          Checkout
        </Button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="text-muted-foreground hover:text-foreground mx-auto mt-4 flex items-center gap-2 text-sm italic underline underline-offset-2 disabled:opacity-70"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {saving ? 'Saving…' : 'Save my system for later'}
        </button>
      </div>
    </div>
  )
}
