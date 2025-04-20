import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { useCustomers } from '@/modules/customers/useCustomers'
import { DeclarationForm } from '@/modules/declarations/declaration-form'
import { DeclarationList } from '@/modules/declarations/declaration-list'

export const DeclarationsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState('formularios')
  const [selectedFormType, setSelectedFormType] = useState<string | null>(null)
  const { customersData } = useCustomers({})

  const handleSelectForm = (formType: string) => {
    setSelectedFormType(formType)
    setActiveTab('crear')
  }

  const handleSubmitForm = () => {
    setSelectedFormType(null)
    setActiveTab('historial')
  }

  // Renderizado condicional para evitar el bucle infinito
  const renderContent = () => {
    switch (activeTab) {
      case 'formularios':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:bg-accent" onClick={() => handleSelectForm('104')}>
              <CardHeader>
                <CardTitle>Formulario 104</CardTitle>
                <CardDescription>Declaración del Impuesto al Valor Agregado (IVA)</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Para personas naturales y sociedades</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent" onClick={() => handleSelectForm('103')}>
              <CardHeader>
                <CardTitle>Formulario 103</CardTitle>
                <CardDescription>Retenciones en la Fuente del Impuesto a la Renta</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Para agentes de retención</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent" onClick={() => handleSelectForm('101')}>
              <CardHeader>
                <CardTitle>Formulario 101</CardTitle>
                <CardDescription>Impuesto a la Renta para Sociedades</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Declaración anual del impuesto a la renta</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent" onClick={() => handleSelectForm('102')}>
              <CardHeader>
                <CardTitle>Formulario 102</CardTitle>
                <CardDescription>Impuesto a la Renta Personas Naturales</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Declaración anual para personas naturales</p>
              </CardContent>
            </Card>
          </div>
        )
      case 'crear':
        return (
          selectedFormType && (
            <DeclarationForm
              formType={selectedFormType}
              period={selectedPeriod}
              customers={customersData.data}
              onSubmit={handleSubmitForm}
            />
          )
        )
      case 'historial':
        return <DeclarationList />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Declaraciones SRI</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Periodo Fiscal</CardTitle>
            <CardDescription>Seleccione el mes y año para la declaración</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedPeriod}
              onSelect={setSelectedPeriod}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="formularios">Formularios</TabsTrigger>
              <TabsTrigger value="crear">Crear Declaración</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>{renderContent()}</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
