import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/invoices/$invoiceId')({
  component: InvoiceDetailPage,
})

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams()
  return (
    <div className="max-w-3xl mx-auto px-6 py-8 md:py-14">
      <p className="text-body text-muted-foreground">Invoice {invoiceId}</p>
    </div>
  )
}
