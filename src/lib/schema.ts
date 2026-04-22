import { z } from 'zod'

export const AddressSchema = z.object({
  street: z.string().min(1, "Can't be empty"),
  city: z.string().min(1, "Can't be empty"),
  postCode: z.string().min(1, "Can't be empty"),
  country: z.string().min(1, "Can't be empty"),
})

export const InvoiceItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name can't be empty"),
  quantity: z.number().min(1, 'Must be at least 1'),
  price: z.number().min(0.01, 'Must be greater than 0'),
  total: z.number(),
})

export const InvoiceFormSchema = z.object({
  description: z.string().min(1, "Can't be empty"),
  paymentTerms: z.number(),
  clientName: z.string().min(1, "Can't be empty"),
  clientEmail: z.email('Invalid email'),
  clientAddress: AddressSchema,
  senderAddress: AddressSchema,
  items: z.array(InvoiceItemSchema).min(1, 'Add at least one item'),
})

export type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>
