export type InvoiceStatus = 'draft' | 'pending' | 'paid'

export interface Address {
  street: string
  city: string
  postCode: string
  country: string
}

export interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  status: InvoiceStatus
  createdAt: string
  paymentDue: string
  paymentTerms: number
  description: string
  clientName: string
  clientEmail: string
  clientAddress: Address
  senderAddress: Address
  items: InvoiceItem[]
  total: number
}
