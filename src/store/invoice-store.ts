import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Invoice } from '@/types/invoice'

interface InvoiceStore {
  invoices: Invoice[]
  filter: 'all' | 'draft' | 'pending' | 'paid'
  setFilter: (filter: InvoiceStore['filter']) => void
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  markAsPaid: (id: string) => void
  getById: (id: string) => Invoice | undefined
}

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      filter: 'all',
      setFilter: (filter) => set({ filter }),
      addInvoice: (invoice) =>
        set((s) => ({ invoices: [...s.invoices, invoice] })),
      updateInvoice: (id, data) =>
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...data } : inv,
          ),
        })),
      deleteInvoice: (id) =>
        set((s) => ({
          invoices: s.invoices.filter((inv) => inv.id !== id),
        })),
      markAsPaid: (id) =>
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id ? { ...inv, status: 'paid' } : inv,
          ),
        })),
      getById: (id) => get().invoices.find((inv) => inv.id === id),
    }),
    { name: 'invoiq-invoices' },
  ),
)
