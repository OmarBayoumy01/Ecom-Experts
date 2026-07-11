import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { lazyPage } from '@/routes/lazy-page'
import { appRoute } from '@/app/routes'

const Error404Page = lazyPage(() => import('@/error-pages/404'), 'Error404Page')

export function createAppRoutes(): RouteObject[] {
  return [
    { path: '/', ...appRoute },
    { path: '*', element: <Error404Page /> },
  ]
}

export const router = createBrowserRouter(createAppRoutes())
