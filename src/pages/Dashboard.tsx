import { useAuthStore } from '@/store/useAuthStore'
import { Separator } from '@radix-ui/react-separator'
import { SectionCards } from '../components/section-cards'

export const Dashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className="p-6">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <div>
            <h1 className="text-2xl font-bold">Panel de control</h1>
            <p className="mt-4">Bienvenido, {user?.name}!</p>
          </div>

          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
        </div>
      </div>
    </div>
  )
}
