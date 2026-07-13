import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Cctv, LayoutGrid, Radar, ShieldCheck } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/app/components/product-card'
import { OrderSummary } from '@/app/components/order-summary'
import {
  isProductChosen,
  productsByCategory,
  type Category,
} from '@/app/data/catalog'
import { quantitiesAtom } from '@/app/state/quantities'

type Step = {
  id: string
  title: string
  icon: typeof Cctv
  category: Category
  nextLabel: string
}

const steps: Step[] = [
  {
    id: 'step-1',
    title: 'Choose your cameras',
    icon: Cctv,
    category: 'cameras',
    nextLabel: 'Next: Choose your plan',
  },
  {
    id: 'step-2',
    title: 'Choose your plan',
    icon: ShieldCheck,
    category: 'plan',
    nextLabel: 'Next: Choose your sensors',
  },
  {
    id: 'step-3',
    title: 'Choose your sensors',
    icon: Radar,
    category: 'sensors',
    nextLabel: 'Next: Add extra protection',
  },
  {
    id: 'step-4',
    title: 'Add extra protection',
    icon: LayoutGrid,
    category: 'accessories',
    nextLabel: 'Finish',
  },
]

export const DashboardController = () => {
  const [current, setCurrent] = useState(0)
  const quantities = useAtomValue(quantitiesAtom)

  const goNext = () => setCurrent((c) => Math.min(c + 1, steps.length - 1))
  const goBack = () => setCurrent((c) => Math.max(c - 1, 0))

  return (
    <div className="mx-auto w-full max-w-7xl overflow-x-hidden md:p-4">
      <Accordion
        type="single"
        value={steps[current].id}
        onValueChange={(value) => {
          if (!value) return
          const next = steps.findIndex((s) => s.id === value)
          if (next !== -1 && next <= current) setCurrent(next)
        }}
        className="rounded-none border-0"
      >
        {steps.map((step, index) => {
          const isActive = index === current
          const Icon = step.icon
          const items = productsByCategory(step.category)
          const selectedCount = items.filter((p) =>
            isProductChosen(p, quantities),
          ).length

          return (
            <AccordionItem
              key={step.id}
              value={step.id}
              className="border-b data-open:rounded-xl data-open:bg-accent"
            >
              <div className="text-muted-foreground border-b px-6 py-2 text-[11px] font-medium tracking-wider uppercase">
                Step {index + 1} of {steps.length}
              </div>

              <AccordionTrigger className="items-center px-4 py-4 hover:no-underline sm:px-6 **:data-[slot=accordion-trigger-icon]:text-primary">
                <span className="flex flex-1 items-center gap-3">
                  <Icon className="text-foreground size-6 shrink-0" />
                  <span className="min-w-0 text-base font-bold sm:text-xl">
                    {step.title}
                  </span>
                  {isActive && selectedCount > 0 && (
                    <span className="text-primary ml-auto shrink-0 text-sm font-medium whitespace-nowrap">
                      {selectedCount} selected
                    </span>
                  )}
                </span>
              </AccordionTrigger>

              <AccordionContent className="h-auto px-2 pb-1">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(225px,1fr))] gap-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="my-3 flex items-center justify-center gap-3">
                  {index > 0 && (
                    <Button variant="ghost" onClick={goBack}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground rounded-md min-w-[266px] cursor-pointer"
                    onClick={index === steps.length - 1 ? undefined : goNext}
                  >
                    {step.nextLabel}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <div className="mt-6">
        <OrderSummary />
      </div>
    </div>
  )
}
