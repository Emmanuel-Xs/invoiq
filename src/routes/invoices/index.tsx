import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NewInvoiceButton } from '@/components/invoice/new-invoice-button'
import { FilterDropdown } from '@/components/invoice/filter-dropdown'
import { useInvoiceStore } from '@/store/invoice-store'
import emptyInvoices from '@/assets/empty-invoices.svg?url'

export const Route = createFileRoute('/invoices/')({
  component: InvoicesPage,
})

function InvoicesPage() {
  const { invoices, filter } = useInvoiceStore()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = invoices.filter((inv) =>
    filter === 'all' ? true : inv.status === filter,
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-14">
        <div>
          <h1 className="text-heading-l text-foreground">Invoices</h1>
          <p className="text-body text-muted-foreground mt-1">
            {invoices.length === 0
              ? 'No invoices'
              : `${filtered.length} invoice${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <FilterDropdown />
          <NewInvoiceButton onClick={() => setDrawerOpen(true)} />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-6 mt-25.5 md:mt-35 text-center">
          <img src={emptyInvoices} alt="No invoices" className="w-48 md:w-64" />
          <div>
            <h2 className="text-heading-m text-foreground mb-4">
              There is nothing here
            </h2>
            <p className="text-body text-muted-foreground max-w-[220px] mx-auto">
              Create an invoice by clicking the <strong>New Invoice</strong>{' '}
              button and get started
            </p>
          </div>
        </div>
      )}

      {/* Invoice list — we'll build InvoiceCard next */}
      {filtered.length > 0 && (
        <ul className="flex flex-col gap-4">
          {filtered.map((invoice) => (
            <li key={invoice.id}>{invoice.id}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
