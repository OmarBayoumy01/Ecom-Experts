import { Navigate, type RouteObject } from 'react-router-dom'
import { lazyPage } from '@/routes/lazy-page'
import AppLayout from './layout'

const DashboardController = lazyPage(
  () => import('./pages'),
  'DashboardController',
)

export const appRoute: RouteObject = {
  element: <AppLayout />,
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: 'dashboard', element: <DashboardController /> },
  ],
}
