import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from './status-badge'
import { formatDate, formatCurrency } from '@/lib/invoice'
import type { Invoice } from '@/types/invoice'

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <Link
      to="/invoices/$invoiceId"
      params={{ invoiceId: invoice.id }}
      className="group flex items-center bg-card rounded-lg px-6 py-5 border border-transparent hover:border-primary transition-colors cursor-pointer w-full"
    >
      {/* Mobile layout — up to md */}
      <div className="flex flex-col gap-6 w-full md:hidden">
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

      {/* Desktop layout — md and up */}
      <div className="hidden md:flex md:items-center md:w-full md:gap-6">
        <span className="text-heading-s text-foreground w-[110px] shrink-0">
          <span className="text-muted-foreground">#</span>
          {invoice.id}
        </span>
        <span className="text-body text-muted-foreground w-[130px] shrink-0">
          Due {formatDate(invoice.paymentDue)}
        </span>
        <span className="text-body text-muted-foreground flex-1">
          {invoice.clientName}
        </span>
        <span className="text-heading-s text-foreground w-[120px] text-right shrink-0">
          {formatCurrency(invoice.total)}
        </span>
        <div className="w-[110px] shrink-0 flex justify-center">
          <StatusBadge status={invoice.status} />
        </div>
        <ChevronRight size={16} className="text-primary shrink-0" />
      </div>
    </Link>
  )
}
