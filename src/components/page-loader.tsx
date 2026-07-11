import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullScreen ? 'min-h-svh' : 'p-8',
      )}
    >
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
