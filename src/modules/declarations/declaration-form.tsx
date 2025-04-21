import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Customer } from '@/modules/customers/customers.interface'
import { DeclarationForm as IDeclarationForm, DECLARATION_FORMS, FormSection } from './declarations.interface'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInvoices } from '@/modules/invoices/useInvoices'
import { Invoice } from '@/modules/invoices/invoices.interface'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDeclarations } from './useDeclarations'

interface Props {
  formType: string
  period?: Date
  customers: Customer[]
  onSubmit: () => void
}

export const DeclarationForm = ({ formType, period, customers, onSubmit }: Props) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [formValues, setFormValues] = useState<Record<string, number>>({})
  const [formDefinition, setFormDefinition] = useState<IDeclarationForm | null>(null)
  const [activeSection, setActiveSection] = useState<string>('')
  const { invoicesData } = useInvoices(selectedCustomer)
  const { createDeclaration } = useDeclarations()

  useEffect(() => {
    const form = DECLARATION_FORMS[formType as keyof typeof DECLARATION_FORMS]
    if (form) {
      setFormDefinition(form)
      if (form.sections.length > 0) {
        setActiveSection(form.sections[0].title)
      }

      const initialValues: Record<string, number> = {}
      form.sections.forEach((section) => {
        section.fields.forEach((field) => {
          initialValues[field.code] = (field.defaultValue as number) || 0
        })
      })
      setFormValues(initialValues)
    }
  }, [formType])

  const calculateFieldsFromInvoices = (invoices: Invoice[]) => {
    const newValues = { ...formValues }

    if (formType === '104') {
      // Sales with 12% IVA
      const salesWith12 = invoices
        .filter((invoice) => invoice.iva > 0)
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      // Sales with 0% IVA
      const salesWith0 = invoices
        .filter((invoice) => invoice.iva === 0)
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      // IVA value from sales
      const ivaFromSales = invoices.reduce((sum, invoice) => sum + invoice.iva, 0)

      // Update form values
      newValues['401'] = salesWith12
      newValues['403'] = salesWith0
      newValues['409'] = ivaFromSales
      newValues['601'] = Math.max(0, ivaFromSales - (newValues['519'] || 0))
      newValues['699'] = Math.max(0, newValues['601'] - (newValues['605'] || 0))
    }

    setFormValues(newValues)
  }

  useEffect(() => {
    if (invoicesData.data.length > 0) {
      calculateFieldsFromInvoices(invoicesData.data)
    }
  }, [invoicesData.data])

  const handleInputChange = (code: string, value: string) => {
    const numValue = parseFloat(value) || 0
    const newValues = { ...formValues, [code]: numValue }

    // Recalculate derived fields based on formType
    if (formType === '104') {
      if (['409', '519'].includes(code)) {
        // Recalculate tax fields
        newValues['601'] = Math.max(0, newValues['409'] - newValues['519'])
        newValues['699'] = Math.max(0, newValues['601'] - (newValues['605'] || 0))
      } else if (code === '605') {
        newValues['699'] = Math.max(0, newValues['601'] - newValues['605'])
      }
    }

    setFormValues(newValues)
  }

  const getTaxPercentage = (code: string) => {
    if (code === '401') return 12
    if (code === '403') return 0
    if (code === '409') return 12
    if (code === '519') return 12
    return 0
  }

  const handleSubmit = async () => {
    try {
      // Prepare items from form values
      const items = Object.entries(formValues).map(([code, amount]) => {
        const fieldDef = findFieldDefinition(code)
        return {
          code,
          description: fieldDef?.label || code,
          amount: typeof amount === 'number' ? amount : Number(amount || 0),
          taxPercentage: getTaxPercentage(code),
          type: fieldDef?.category === 'income' ? ('income' as const) : ('expense' as const),
        }
      })

      await createDeclaration.mutateAsync({
        formType,
        period: period ? format(period, 'yyyy-MM') : format(new Date(), 'yyyy-MM'),
        customerId: selectedCustomer,
        items,
      })

      onSubmit()
    } catch (error) {
      console.error('Error submitting declaration:', error)
    }
  }

  const findFieldDefinition = (code: string) => {
    if (!formDefinition) return null

    for (const section of formDefinition.sections) {
      const field = section.fields.find((f) => f.code === code)
      if (field) return field
    }

    return null
  }

  if (!formDefinition) {
    return <div>Cargando formulario...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{formDefinition.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{formDefinition.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="period">Periodo Fiscal</Label>
              <Input id="period" value={period ? format(period, 'MMMM yyyy', { locale: es }) : ''} disabled />
            </div>
            <div>
              <Label htmlFor="customer">Cliente</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList
          className="grid"
          style={{ gridTemplateColumns: `repeat(${formDefinition.sections.length}, minmax(0, 1fr))` }}
        >
          {formDefinition.sections.map((section) => (
            <TabsTrigger key={section.title} value={section.title}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {formDefinition.sections.map((section: FormSection) => (
          <TabsContent key={section.title} value={section.title}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.code} className="grid grid-cols-3 items-center gap-4">
                      <div className="col-span-2">
                        <Label htmlFor={field.code} className="text-sm">
                          {field.code} - {field.label}
                        </Label>
                      </div>
                      <Input
                        id={field.code}
                        type="number"
                        value={formValues[field.code] || 0}
                        onChange={(e) => handleInputChange(field.code, e.target.value)}
                        className="text-right"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Guardar Borrador</Button>
        <Button onClick={handleSubmit}>Presentar Declaración</Button>
      </div>
    </div>
  )
}
