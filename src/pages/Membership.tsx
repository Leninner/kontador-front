import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { IconCreditCard, IconCheck, IconX } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'

const membershipData = {
  currentPlan: {
    name: 'Pro',
    price: '$49.99',
    status: 'active',
    renewalDate: '28 Dec 2023',
    features: [
      { name: 'Declaraciones ilimitadas', included: true },
      { name: 'Soporte prioritario', included: true },
      { name: 'Información financiera', included: true },
      { name: 'Declaración automática', included: false },
    ],
  },
  paymentMethod: {
    type: 'Tarjeta de crédito',
    cardNumber: '**** **** **** 4242',
    expiryDate: '09/2025',
    name: 'Carlos Navarro',
  },
  billingHistory: [
    { id: 1, date: '28 Nov 2023', amount: '$49.99', status: 'paid' },
    { id: 2, date: '28 Oct 2023', amount: '$49.99', status: 'paid' },
    { id: 3, date: '28 Sep 2023', amount: '$49.99', status: 'paid' },
  ],
}

export function MembershipPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membresía y facturación</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Plan actual</CardTitle>
            <CardDescription>Detalles sobre tu membresía actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{membershipData.currentPlan.name}</h3>
                <p className="text-sm text-muted-foreground">{membershipData.currentPlan.price} / mes</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Activo
              </Badge>
            </div>
            <p className="text-sm">Renueva el {membershipData.currentPlan.renewalDate}</p>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Características del plan:</h4>
              <ul className="space-y-1">
                {membershipData.currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <IconCheck className="text-green-500 h-4 w-4" />
                    ) : (
                      <IconX className="text-gray-300 h-4 w-4" />
                    )}
                    <span className={feature.included ? '' : 'text-gray-400'}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Cambiar plan</Button>
          </CardFooter>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Método de pago</CardTitle>
            <CardDescription>Tu método de pago actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <IconCreditCard className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-medium">{membershipData.paymentMethod.type}</h3>
                <p className="text-sm text-muted-foreground">{membershipData.paymentMethod.cardNumber}</p>
                <p className="text-sm text-muted-foreground">Expira el {membershipData.paymentMethod.expiryDate}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Actualizar</Button>
            <Button variant="ghost" className="text-destructive">
              Eliminar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de facturación</CardTitle>
          <CardDescription>Tus últimas facturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Fecha</th>
                  <th className="py-3 text-left font-medium">Monto</th>
                  <th className="py-3 text-left font-medium">Estado</th>
                  <th className="py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {membershipData.billingHistory.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-3">{invoice.date}</td>
                    <td className="py-3">{invoice.amount}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
