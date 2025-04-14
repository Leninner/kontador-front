import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { SidebarInset, SidebarTrigger } from './sidebar'
import { SidebarProvider } from './sidebar'
import { AppSidebar } from '../app-sidebar'
import { Separator } from './separator'

interface LayoutProps {
  children: ReactNode
  requireAuth?: boolean
}

export function AppLayout({ children, requireAuth = true }: LayoutProps) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />

      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <h1 className="text-base font-medium">Plataforma</h1>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
