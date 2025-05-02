import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useInvoices } from './useInvoices'

const formSchema = z.object({
  number: z.string().min(1, 'Número es requerido'),
  date: z.string().min(1, 'Fecha es requerida'),
  amount: z.number().min(0, 'Monto debe ser positivo'),
  tax: z.number().min(0, 'Impuesto debe ser positivo'),
  iva: z.number().min(0, 'IVA debe ser positivo'),
})

interface InvoiceFormProps {
  customerId: string
  onSubmit: () => void
}

export const InvoiceForm = ({ customerId, onSubmit }: InvoiceFormProps) => {
  const { createInvoice } = useInvoices(customerId)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: '',
      date: '',
      amount: 0,
      tax: 0,
      iva: 0,
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createInvoice.mutateAsync({
        customerId,
        ...values,
      })
      onSubmit()
    } catch (error) {
      console.error('Failed to create invoice:', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Número de factura" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monto</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impuesto</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iva"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IVA</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={createInvoice.isPending}>
          Crear Factura
        </Button>
      </form>
    </Form>
  )
}
