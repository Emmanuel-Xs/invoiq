import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useInvoiceStore } from '@/store/invoice-store'
import { StatusBadge } from '@/components/invoice/status-badge'
import { InvoiceFormDrawer } from '@/components/invoice/invoice-form-drawer'
import { Button } from '@/components/ui/button'
import { formatDate, formatCurrency } from '@/lib/invoice'

export const Route = createFileRoute('/invoices/$invoiceId')({
  component: InvoiceDetailPage,
})

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams()
  const router = useRouter()
  const { getById, deleteInvoice, markAsPaid } = useInvoiceStore()
  const invoice = getById(invoiceId)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  if (!invoice) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-14 text-center">
        <p className="text-heading-m text-foreground mb-4">Invoice not found</p>
        <Button
          variant="primary"
          onClick={() => router.navigate({ to: '/invoices' })}
        >
          Go back
        </Button>
      </div>
    )
  }

  function handleDelete() {
    deleteInvoice(invoiceId)
    router.navigate({ to: '/invoices' })
  }

  function handleMarkAsPaid() {
    markAsPaid(invoiceId)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-14 space-y-6">
      {/* ── Back ── */}
      <button
        onClick={() => router.navigate({ to: '/invoices' })}
        className="flex items-center gap-4 text-heading-s text-foreground hover:text-muted-foreground transition-colors group"
      >
        <ChevronLeft
          size={16}
          className="text-primary group-hover:text-primary/70"
        />
        Go back
      </button>

      {/* ── Status bar ── */}
      <div className="flex items-center justify-between bg-card rounded-lg px-6 py-5">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <span className="text-body text-muted-foreground">Status</span>
          <StatusBadge status={invoice.status} />
        </div>

        {/* Action buttons — hidden on mobile, shown in footer instead */}
        <div className="hidden md:flex items-center gap-3">
          {invoice.status !== 'paid' && (
            <Button variant="edit" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
          )}
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
          {invoice.status === 'pending' && (
            <Button variant="primary" onClick={handleMarkAsPaid}>
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* ── Invoice details card ── */}
      <div className="bg-card rounded-lg px-6 md:px-12 py-10 space-y-10">
        {/* Top — ID + description + addresses */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          <div>
            <p className="text-heading-s text-foreground mb-1">
              <span className="text-muted-foreground">#</span>
              {invoice.id}
            </p>
            <p className="text-body text-muted-foreground">
              {invoice.description}
            </p>
          </div>
          <div className="text-body text-muted-foreground md:text-right">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
        </div>

        {/* Middle — dates + client info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div>
              <p className="text-body text-muted-foreground mb-3">
                Invoice Date
              </p>
              <p className="text-heading-s text-foreground">
                {formatDate(invoice.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-body text-muted-foreground mb-3">
                Payment Due
              </p>
              <p className="text-heading-s text-foreground">
                {formatDate(invoice.paymentDue)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-body text-muted-foreground mb-3">Bill To</p>
            <p className="text-heading-s text-foreground mb-2">
              {invoice.clientName}
            </p>
            <div className="text-body text-muted-foreground">
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </div>
          </div>

          <div>
            <p className="text-body text-muted-foreground mb-3">Sent To</p>
            <p className="text-heading-s text-foreground">
              {invoice.clientEmail}
            </p>
          </div>
        </div>

        {/* ── Items table ── */}
        <div className="bg-[hsl(231,73%,93%)] dark:bg-[hsl(233,30%,21%)] rounded-t-lg overflow-hidden">
          {/* Header — desktop only */}
          <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] gap-4 px-8 pt-8 pb-4">
            <span className="text-body text-muted-foreground">Item Name</span>
            <span className="text-body text-muted-foreground text-center">
              QTY.
            </span>
            <span className="text-body text-muted-foreground text-right">
              Price
            </span>
            <span className="text-body text-muted-foreground text-right">
              Total
            </span>
          </div>

          {/* Items */}
          <div className="px-8 pb-8 space-y-4">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="flex md:grid md:grid-cols-[1fr_80px_120px_120px] items-center gap-4"
              >
                {/* Mobile */}
                <div className="flex flex-col gap-1 flex-1 md:hidden">
                  <span className="text-heading-s text-foreground">
                    {item.name}
                  </span>
                  <span className="text-heading-s text-muted-foreground">
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>
                <span className="text-heading-s text-foreground md:hidden ml-auto">
                  {formatCurrency(item.total)}
                </span>

                {/* Desktop */}
                <span className="hidden md:block text-heading-s text-foreground">
                  {item.name}
                </span>
                <span className="hidden md:block text-heading-s text-muted-foreground text-center">
                  {item.quantity}
                </span>
                <span className="hidden md:block text-body text-muted-foreground text-right">
                  {formatCurrency(item.price)}
                </span>
                <span className="hidden md:block text-heading-s text-foreground text-right">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Grand total ── */}
        <div className="bg-[hsl(233,31%,17%)] dark:bg-[hsl(228,29%,7%)] rounded-b-lg px-8 py-6 flex items-center justify-between -mt-10">
          <span className="text-body text-white">Amount Due</span>
          <span className="text-heading-m text-white">
            {formatCurrency(invoice.total)}
          </span>
        </div>
      </div>

      {/* ── Mobile footer actions ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card px-6 py-5 flex items-center justify-end gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        {invoice.status !== 'paid' && (
          <Button variant="edit" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
        )}
        <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
        {invoice.status === 'pending' && (
          <Button variant="primary" onClick={handleMarkAsPaid}>
            Mark as Paid
          </Button>
        )}
      </div>

      {/* ── Delete modal ── */}
      {deleteOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteOpen(false)}
            aria-hidden="true"
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-card rounded-lg p-12 w-full max-w-[480px] shadow-2xl"
          >
            <h2
              id="delete-title"
              className="text-heading-m text-foreground mb-3"
            >
              Confirm Deletion
            </h2>
            <p className="text-body text-muted-foreground mb-8">
              Are you sure you want to delete invoice{' '}
              <strong className="text-foreground">#{invoice.id}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="edit" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Edit drawer ── */}
      <InvoiceFormDrawer
        open={editOpen}
        onClose={() => setEditOpen(false)}
        invoice={invoice}
      />
    </div>
  )
}
