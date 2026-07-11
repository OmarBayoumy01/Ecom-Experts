import { lazy, type ComponentType } from 'react'

export function lazyPage<P extends object>(
  importer: () => Promise<Record<string, ComponentType<P>>>,
  exportName: string,
): ReturnType<typeof lazy<ComponentType<P>>> {
  return lazy(() =>
    importer().then((m) => ({
      default: m[exportName],
    })),
  )
}
