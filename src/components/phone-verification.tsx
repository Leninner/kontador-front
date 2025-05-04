import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/useAuthStore'
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IVerifyPhoneDto } from '@/modules/auth/auth.interface'

export const PhoneVerification = () => {
  const { user, verifyPhone, isLoading } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<IVerifyPhoneDto>({
    countryCode: '57',
    phoneNumber: '',
  })
  console.log('user', user)

  // Parse the phone number if the user already has one
  useEffect(() => {
    if (user?.phone) {
      console.log('user?.phone', user?.phone)
      // Assuming the phone is stored as countryCode + number (e.g. 573128901234)
      const phoneRegex = /^(\d{1,3})(\d+)$/
      const match = user.phone.match(phoneRegex)

      if (match) {
        setFormData({
          countryCode: match[1],
          phoneNumber: match[2],
        })
      }
    }
  }, [user?.phone])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyPhone(formData)
    setIsOpen(false)
  }

  // Format phone number for display
  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return ''
    const phoneRegex = /^(\d{1,3})(\d+)$/
    const match = phone.match(phoneRegex)

    if (match) {
      const countryCode = match[1]
      const number = match[2]
      return `+${countryCode} ${number}`
    }

    return phone
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <Input
            id="phone"
            value={formatPhoneNumber(user?.phone) || ''}
            readOnly
            className={user?.phoneVerified ? 'border-green-500 pr-10' : 'border-yellow-500 pr-10'}
          />
          {user?.phoneVerified ? (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-500" />
          )}
        </div>

        {user?.phoneVerified ? (
          <Badge variant="outline" className="text-green-500 border-green-500 gap-1 whitespace-nowrap">
            Verificado
          </Badge>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="whitespace-nowrap">
                Verificar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Verificar número de teléfono</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="countryCode">Código</Label>
                    <div className="flex items-center">
                      <span className="mr-1">+</span>
                      <Input
                        id="countryCode"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        placeholder="57"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phoneNumber">Número</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="3123456789"
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Te enviaremos un mensaje de WhatsApp para verificar tu número.
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Verificar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  )
}
