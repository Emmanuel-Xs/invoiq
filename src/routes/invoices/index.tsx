import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NewInvoiceButton } from '@/components/invoice/new-invoice-button'
import { FilterDropdown } from '@/components/invoice/filter-dropdown'
import { useInvoiceStore } from '@/store/invoice-store'
import emptyInvoices from '@/assets/empty-invoices.svg?url'
import { InvoiceCard } from '@/components/invoice/invoice-card'
import { InvoiceFormDrawer } from '@/components/invoice/invoice-form-drawer'
import { LayoutGrid, List } from 'lucide-react'

export const Route = createFileRoute('/invoices/')({
  component: InvoicesPage,
})

function InvoicesPage() {
  const { invoices, filter } = useInvoiceStore()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const filtered = invoices.filter((inv) =>
    filter === 'all' ? true : inv.status === filter,
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-14">
        <div>
          <h1 className="text-heading-m md:text-heading-l text-foreground">Invoices</h1>
          <p className="text-body text-muted-foreground mt-1">
            {invoices.length === 0
              ? 'No invoices'
              : `${filtered.length} invoice${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex items-center gap-1 bg-card rounded-lg p-1 mr-[-4px]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
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

      {filtered.length > 0 && (
        <ul className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6" 
            : "flex flex-col gap-4"
        }>
          {filtered.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} viewMode={viewMode} />
          ))}
        </ul>
      )}
      <InvoiceFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
