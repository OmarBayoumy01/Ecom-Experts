import { Outlet } from 'react-router-dom'
import { ModeToggle } from '@/components/mode-toggle'

const AppLayout = () => {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-360 items-center justify-between p-4">
          <span className="text-lg font-semibold">Ecom Experts</span>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-360 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
