import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { IconUser, IconKey } from '@tabler/icons-react'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect, useState } from 'react'
import { PhoneVerification } from '@/components/phone-verification'
import { IUser } from '@/modules/auth/auth.interface'

export function ProfilePage() {
  const { user, getUser, updateUser } = useAuthStore()
  const [formData, setFormData] = useState<Partial<IUser>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getUser()
  }, [getUser])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        licenseNumber: user.licenseNumber,
        taxIdentificationNumber: user.taxIdentificationNumber,
        specialization: user.specialization,
        yearsOfExperience: user.yearsOfExperience,
        languages: user.languages,
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      await updateUser({ ...user, ...formData })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configuración de perfil</h1>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <IconUser className="h-4 w-4" />
            <span className="hidden md:inline">Información personal</span>
          </TabsTrigger>
          <TabsTrigger value="professional" className="flex items-center gap-2">
            <IconKey className="h-4 w-4" />
            <span className="hidden md:inline">Información profesional</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="mt-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Actualiza tus datos personales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 mt-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || 'US'}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" value={formData.name || ''} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <PhoneVerification />
                      </div>
                      <div className="space-y-2">
                        <div className="rounded-lg border p-3 bg-muted/50">
                          <h4 className="font-medium mb-2">Beneficios al verificar tu teléfono:</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Creación de facturas con tecnología OCR</li>
                            <li>• Creación de tareas con AI mediante WhatsApp</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Professional Tab */}
        <TabsContent value="professional" className="mt-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Información profesional</CardTitle>
                <CardDescription>Tus credenciales profesionales y expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Número de licencia</Label>
                    <Input id="licenseNumber" value={formData.licenseNumber || ''} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxIdentificationNumber">Número de identificación fiscal</Label>
                    <Input
                      id="taxIdentificationNumber"
                      value={formData.taxIdentificationNumber || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Especialización</Label>
                    <Input id="specialization" value={formData.specialization || ''} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
