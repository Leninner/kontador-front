export interface Declaration {
  id: string
  formType: string
  items: DeclarationItem[]
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
  customerId: string
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
  submittedDate?: string
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

export const FORM_101: DeclarationForm = {
  id: '101',
  title: 'Declaración del Impuesto a la Renta para Sociedades',
  description: 'Formulario para la declaración anual del impuesto a la renta',
  sections: [
    {
      title: 'Ingresos',
      description: 'Registre los ingresos obtenidos durante el periodo fiscal',
      fields: [
        {
          code: '6001',
          label: 'Ventas locales netas de bienes',
          type: 'number',
          category: 'income',
          required: true,
          defaultValue: 0,
        },
        {
          code: '6003',
          label: 'Exportaciones netas de bienes',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '6005',
          label: 'Prestación de servicios',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '6007',
          label: 'Rendimientos financieros',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '6099',
          label: 'Total ingresos',
          type: 'number',
          category: 'income',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Costos y Gastos',
      description: 'Registre los costos y gastos deducibles',
      fields: [
        {
          code: '7001',
          label: 'Costos de ventas',
          type: 'number',
          category: 'expense',
          required: true,
          defaultValue: 0,
        },
        {
          code: '7004',
          label: 'Sueldos y salarios',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '7010',
          label: 'Beneficios sociales',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '7013',
          label: 'Honorarios profesionales',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '7017',
          label: 'Gastos de viaje',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '7020',
          label: 'Arrendamiento de inmuebles',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '7099',
          label: 'Total costos y gastos',
          type: 'number',
          category: 'expense',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Conciliación Tributaria',
      description: 'Cálculo de la base imponible',
      fields: [
        {
          code: '801',
          label: 'Utilidad del ejercicio',
          type: 'number',
          category: 'info',
          required: true,
          defaultValue: 0,
        },
        {
          code: '803',
          label: 'Participación trabajadores',
          type: 'number',
          category: 'info',
          required: false,
          defaultValue: 0,
        },
        {
          code: '806',
          label: 'Gastos no deducibles',
          type: 'number',
          category: 'info',
          required: false,
          defaultValue: 0,
        },
        {
          code: '835',
          label: 'Utilidad gravable',
          type: 'number',
          category: 'info',
          required: true,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Impuesto a la Renta',
      description: 'Cálculo del impuesto a pagar',
      fields: [
        {
          code: '849',
          label: 'Impuesto a la renta causado',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
        {
          code: '850',
          label: 'Anticipo determinado para el ejercicio fiscal',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '855',
          label: 'Retenciones en la fuente realizadas en el ejercicio fiscal',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '869',
          label: 'Impuesto a la renta a pagar',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
      ],
    },
  ],
}

export const FORM_102: DeclarationForm = {
  id: '102',
  title: 'Declaración del Impuesto a la Renta para Personas Naturales',
  description: 'Formulario para la declaración anual del impuesto a la renta',
  sections: [
    {
      title: 'Identificación y Domicilio',
      description: 'Información del contribuyente',
      fields: [
        {
          code: '201',
          label: 'Cédula de Identidad o Pasaporte',
          type: 'text',
          category: 'info',
          required: true,
          defaultValue: '',
        },
        {
          code: '202',
          label: 'Apellidos y Nombres Completos',
          type: 'text',
          category: 'info',
          required: true,
          defaultValue: '',
        },
      ],
    },
    {
      title: 'Rentas Gravadas de Trabajo',
      description: 'Ingresos en relación de dependencia y otros',
      fields: [
        {
          code: '501',
          label: 'Ingresos líquidos en relación de dependencia',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '511',
          label: 'Ingresos líquidos por servicios profesionales',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '521',
          label: 'Ingresos líquidos por arriendo de bienes inmuebles',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Rentas Gravadas de Capital',
      description: 'Ingresos financieros y otros',
      fields: [
        {
          code: '571',
          label: 'Rendimientos financieros',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
        {
          code: '581',
          label: 'Dividendos recibidos',
          type: 'number',
          category: 'income',
          required: false,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Gastos Deducibles',
      description: 'Gastos personales deducibles',
      fields: [
        {
          code: '701',
          label: 'Salud',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '702',
          label: 'Educación',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '703',
          label: 'Alimentación',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '704',
          label: 'Vivienda',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '705',
          label: 'Vestimenta',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
        {
          code: '759',
          label: 'Total gastos personales',
          type: 'number',
          category: 'expense',
          required: false,
          defaultValue: 0,
        },
      ],
    },
    {
      title: 'Resumen Impositivo',
      description: 'Cálculo del impuesto a pagar',
      fields: [
        {
          code: '832',
          label: 'Base imponible gravada',
          type: 'number',
          category: 'info',
          required: true,
          defaultValue: 0,
        },
        {
          code: '839',
          label: 'Impuesto a la renta causado',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
        {
          code: '845',
          label: 'Retenciones en la fuente que le realizaron',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
        {
          code: '859',
          label: 'Impuesto a la renta a pagar',
          type: 'number',
          category: 'tax',
          required: true,
          defaultValue: 0,
        },
        {
          code: '869',
          label: 'Saldo a favor del contribuyente',
          type: 'number',
          category: 'tax',
          required: false,
          defaultValue: 0,
        },
      ],
    },
  ],
}

export const DECLARATION_FORMS = {
  '104': FORM_104,
  '103': FORM_103,
  '101': FORM_101,
  '102': FORM_102,
}
