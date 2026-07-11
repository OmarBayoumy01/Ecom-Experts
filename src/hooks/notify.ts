import { useMemo } from 'react'
import { toast } from 'sonner'

export function useNotify() {
  return useMemo(
    () => ({
      notify: {
        error: (message: string) => toast.error(message),
        success: (message: string) => toast.success(message),
        info: (message: string) => toast(message),
      },
    }),
    [],
  )
}
