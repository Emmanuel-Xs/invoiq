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
  senderAddress: AddressSchema,
  clientName: z.string().min(1, "Can't be empty"),
  clientEmail: z.email('Invalid email'),
  clientAddress: AddressSchema,
  createdAt: z.string().min(1, "Can't be empty"),
  paymentTerms: z.number(),
  description: z.string().min(1, "Can't be empty"),
  items: z.array(InvoiceItemSchema).min(1, 'Add at least one item'),
})

export const DraftFormSchema = z.object({
  senderAddress: z.object({
    street: z.string(),
    city: z.string(),
    postCode: z.string(),
    country: z.string(),
  }),
  clientName: z.string(),
  clientEmail: z.string(),
  clientAddress: z.object({
    street: z.string(),
    city: z.string(),
    postCode: z.string(),
    country: z.string(),
  }),
  createdAt: z.string(),
  paymentTerms: z.number(),
  description: z.string(),
  items: z.array(InvoiceItemSchema),
})

export type InvoiceFormValues = z.infer<typeof InvoiceFormSchema>
