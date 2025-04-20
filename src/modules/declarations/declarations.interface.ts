export interface Declaration {
  id: string
  formType: string
  period: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedDate?: string
  totalIncome: number
  totalExpenses: number
  totalTax: number
  documentUrl?: string
  createdAt: string
  updatedAt: string
}

export interface DeclarationItem {
  id: string
  declarationId: string
  description: string
  code: string
  amount: number
  taxPercentage: number
  taxAmount: number
  type: 'income' | 'expense'
}

export interface CreateDeclarationDto {
  formType: string
  period: string
  items: {
    description: string
    code: string
    amount: number
    taxPercentage: number
    type: 'income' | 'expense'
  }[]
}

export interface UpdateDeclarationDto {
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedDate?: string
  documentUrl?: string
  items?: {
    id?: string
    description?: string
    code?: string
    amount?: number
    taxPercentage?: number
    taxAmount?: number
    type?: 'income' | 'expense'
  }[]
}

export interface FindAllDeclarationsDto extends Record<string, unknown> {
  search?: string
  page?: number
  limit?: number
  status?: string
  formType?: string
  period?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FormField {
  code: string
  label: string
  description?: string
  type: 'number' | 'text' | 'select' | 'date'
  options?: { label: string; value: string }[]
  category: 'income' | 'expense' | 'tax' | 'info'
  required?: boolean
  defaultValue?: string | number
}

export interface FormSection {
  title: string
  description?: string
  fields: FormField[]
}

export interface DeclarationForm {
  id: string
  title: string
  description: string
  sections: FormSection[]
}

// Form definitions for SRI Ecuador
export const FORM_104: DeclarationForm = {
  id: '104',
  title: 'Declaración del Impuesto al Valor Agregado (IVA)',
  description: 'Formulario para la declaración mensual o semestral del IVA',
  sections: [
    {
      title: 'Ventas y Otras Operaciones',
      description: 'Registre las ventas según el tipo y tarifa',
      fields: [
        {
          code: '401',
          label: 'Ventas locales (excluye activos fijos) gravadas tarifa 12%',
          type: 'number',
          category: 'income',
          required: true,
          defaultValue: 0,
        },
        {
          code: '403',
          label: 'Ventas locales (excluye activos fijos) gravadas tarifa 0%',
          type: 'number',
          category: 'income',
          required: true,
          defaultValue: 0,
        },
        {
          code: '405',
          label: 'Ventas de activos fijos gravadas tarifa 12%',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '409',
          label: 'IVA generado en ventas (12%)',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Compras y Adquisiciones',
      description: 'Registre las compras según tipo y derecho a crédito tributario',
      fields: [
        {
          code: '500',
          label: 'Adquisiciones y pagos (excluye activos fijos) gravados tarifa 12%',
          type: 'number',
          category: 'expense',
          required: true,
          defaultValue: 0,
        },
        {
          code: '502',
          label: 'Adquisiciones locales de activos fijos gravados tarifa 12%',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '507',
          label: 'Adquisiciones y pagos (incluye activos fijos) gravados tarifa 0%',
          type: 'number',
          category: 'expense',
          required: true,
          defaultValue: 0,
        },
        {
          code: '519',
          label: 'IVA pagado en compras (Crédito Tributario)',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Resumen Impositivo',
      description: 'Resumen del impuesto a pagar o crédito tributario',
      fields: [
        {
          code: '601',
          label: 'Impuesto causado',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
        {
          code: '605',
          label: 'Crédito tributario del mes',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '699',
          label: 'Impuesto a pagar',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
      ],
    },
  ],
}

export const FORM_103: DeclarationForm = {
  id: '103',
  title: 'Retenciones en la Fuente del Impuesto a la Renta',
  description: 'Formulario para la declaración de retenciones en la fuente',
  sections: [
    {
      title: 'Retenciones por pagos en el país',
      fields: [
        {
          code: '302',
          label: 'En relación de dependencia que supera o no la base gravada',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '303',
          label: 'Honorarios profesionales',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '310',
          label: 'Servicios predomina la mano de obra',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '312',
          label: 'Transferencia de bienes muebles de naturaleza corporal',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Valores retenidos',
      fields: [
        {
          code: '352',
          label: 'Retención del 1%',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '353',
          label: 'Retención del 2%',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '354',
          label: 'Retención del 8%',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '902',
          label: 'Total impuesto a pagar',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
      ],
    },
  ],
}

export const DECLARATION_FORMS = {
  '104': FORM_104,
  '103': FORM_103,
}
