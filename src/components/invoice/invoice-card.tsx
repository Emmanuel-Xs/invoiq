import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from './status-badge'
import { formatDate, formatCurrency } from '@/lib/invoice'
import type { Invoice } from '@/types/invoice'

export function InvoiceCard({
  invoice,
  viewMode = 'list',
}: {
  invoice: Invoice
  viewMode?: 'list' | 'grid'
}) {
  return (
    <Link
      to="/invoices/$invoiceId"
      params={{ invoiceId: invoice.id }}
      className={`group flex bg-card rounded-lg px-6 py-5 border border-transparent hover:border-primary transition-colors cursor-pointer w-full ${
        viewMode === 'grid' ? 'flex-col gap-6' : 'items-center'
      }`}
    >
      {/* Grid Layout OR Mobile List Layout */}
      <div
        className={`flex flex-col gap-6 w-full ${viewMode === 'list' ? 'md:hidden' : ''}`}
      >
        <div className="flex justify-between items-center">
          <span className="text-heading-s text-foreground">
            <span className="text-muted-foreground">#</span>
            {invoice.id}
          </span>
          <span className="text-body text-muted-foreground">
            {invoice.clientName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-body text-muted-foreground">
              Due {formatDate(invoice.paymentDue)}
            </span>
            <span className="text-heading-s text-foreground">
              {formatCurrency(invoice.total)}
            </span>
          </div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Desktop List Layout */}
      {viewMode === 'list' && (
        <div className="hidden md:flex md:items-center md:w-full md:gap-4">
          <span className="text-heading-s text-foreground w-[100px] shrink-0">
            <span className="text-muted-foreground">#</span>
            {invoice.id}
          </span>
          <span className="text-body text-muted-foreground w-[140px] shrink-0">
            Due {formatDate(invoice.paymentDue)}
          </span>
          <span className="text-body text-muted-foreground flex-1 min-w-0">
            {invoice.clientName}
          </span>
          <span className="text-heading-s text-foreground shrink-0 ml-4">
            {formatCurrency(invoice.total)}
          </span>
          <div className="w-[104px] shrink-0 flex justify-center ml-4">
            <StatusBadge status={invoice.status} />
          </div>
          <ChevronRight size={16} className="text-primary shrink-0 ml-2" />
        </div>
      )}
    </Link>
  )
}
