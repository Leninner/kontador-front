import * as React from 'react'
import { Command, Home, LifeBuoy, List, Send, Users, File } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '../store/useAuthStore'
import { IUser } from '../modules/auth/auth.interface'
import { Link } from 'react-router-dom'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Tablero',
      url: '/board',
      icon: List,
    },
    {
      title: 'Clientes',
      url: '/customers',
      icon: Users,
    },
    {
      title: 'Declaraciones',
      url: '/declarations',
      icon: File,
    },
  ],
  navSecondary: [
    {
      title: 'Soporte',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  // projects: [
  // 	{
  // 		name: "Design Engineering",
  // 		url: "#",
  // 		icon: Frame,
  // 	},
  // 	{
  // 		name: "Sales & Marketing",
  // 		url: "#",
  // 		icon: PieChart,
  // 	},
  // 	{
  // 		name: "Travel",
  // 		url: "#",
  // 		icon: Map,
  // 	},
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore()

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Kontador</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            data.navMain as { title: string; url: string; icon?: import('@tabler/icons-react').Icon | undefined }[]
          }
        />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary
          items={data.navSecondary as { title: string; url: string; icon: import('@tabler/icons-react').Icon }[]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user as IUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
