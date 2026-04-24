import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useInvoiceStore } from '@/store/invoice-store'
import { generateId, calcPaymentDue } from '@/lib/invoice'
import { InvoiceFormSchema, DraftFormSchema } from '@/lib/schema'
import { gooeyToast } from 'goey-toast'
import type { Invoice, InvoiceItem } from '@/types/invoice'

interface InvoiceFormDrawerProps {
  open: boolean
  onClose: () => void
  invoice?: Invoice
}

const DEFAULT_VALUES = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [] as InvoiceItem[],
}

function invoiceToValues(inv: Invoice) {
  return {
    senderAddress: { ...inv.senderAddress },
    clientName: inv.clientName,
    clientEmail: inv.clientEmail,
    clientAddress: { ...inv.clientAddress },
    createdAt: inv.createdAt,
    paymentTerms: inv.paymentTerms,
    description: inv.description,
    items: inv.items.map((i) => ({ ...i })),
  }
}

function inputCls(hasError: boolean) {
  return [
    'w-full h-12 px-4 rounded-md border text-body font-bold',
    'bg-card dark:bg-[hsl(233,30%,21%)]',
    'text-foreground placeholder:text-muted-foreground',
    'focus:outline-none focus:border-primary transition-colors',
    hasError ? 'border-destructive' : 'border-border hover:border-primary',
  ].join(' ')
}

function getError(errors: unknown[]): string | null {
  if (!errors?.length) return null
  const err = errors[0]
  if (typeof err === 'string') return err
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as { message: string }).message
  }
  return null
}

export function InvoiceFormDrawer({
  open,
  onClose,
  invoice,
}: InvoiceFormDrawerProps) {
  const isEdit = !!invoice
  const { addInvoice, updateInvoice } = useInvoiceStore()

  const form = useForm({
    defaultValues: invoice ? invoiceToValues(invoice) : DEFAULT_VALUES,
    onSubmit: async ({ value }) => {
      submitInvoice(value as typeof DEFAULT_VALUES, 'pending')
    },
  })

  // Lock scroll + ESC to close
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        form.reset()
        onClose()
      }
    }
    if (open) document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, form, onClose])

  function submitInvoice(
    value: typeof DEFAULT_VALUES,
    status: Invoice['status'],
  ) {
    const total = value.items.reduce((sum, i) => sum + i.total, 0)
    const built: Invoice = {
      id: invoice?.id ?? generateId(),
      status,
      createdAt: value.createdAt,
      paymentDue: calcPaymentDue(value.createdAt, value.paymentTerms),
      paymentTerms: value.paymentTerms,
      description: value.description,
      clientName: value.clientName,
      clientEmail: value.clientEmail,
      senderAddress: value.senderAddress,
      clientAddress: value.clientAddress,
      items: value.items,
      total,
    }
    if (isEdit) {
      updateInvoice(built.id, built)
      if (status !== 'draft') {
        gooeyToast.success(`Invoice #${built.id} has been updated.`)
      }
    } else {
      addInvoice(built)
      if (status !== 'draft') {
        gooeyToast.success(`Invoice #${built.id} has been successfully added.`)
      }
    }
    handleClose()
  }

  function handleDraft() {
    const value = form.state.values
    const result = DraftFormSchema.safeParse(value)
    if (result.success) {
      const data = result.data as typeof DEFAULT_VALUES
      submitInvoice(data, 'draft')
      gooeyToast.success(`Your invoice draft has been saved.`)
    }
  }

  function handleClose() {
    form.reset()
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/50',
          'transition-opacity duration-500',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? `Edit Invoice ${invoice?.id}` : 'New Invoice'}
        className={[
          'fixed top-0 bottom-0 left-0 lg:left-24 z-50',
          'w-full md:w-3/5 max-w-[500px]',
          'bg-background rounded-r-[20px]',
          'flex flex-col',
          'transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
          open ? 'translate-x-0' : '-translate-x-[200%]',
        ].join(' ')}
      >
        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 md:px-14 pt-14 pb-4 space-y-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Title */}
          <h2 className="text-heading-m text-foreground">
            {isEdit ? (
              <>
                <span className="text-muted-foreground">#</span>
                {invoice.id}
              </>
            ) : (
              'New Invoice'
            )}
          </h2>

          {/* ── Bill From ── */}
          <section className="space-y-6">
            <h3 className="text-body font-bold text-primary">Bill From</h3>

            <form.Field
              name="senderAddress.street"
              validators={{
                onChange: InvoiceFormSchema.shape.senderAddress.shape.street,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="senderAddress-street" className="text-body text-muted-foreground">
                      Street Address
                    </Label>
                  </div>
                  <input
                    id="senderAddress-street"
                    className={inputCls(!!field.state.meta.errors[0])}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {getError(field.state.meta.errors) && (
                    <span className="text-body text-destructive block">
                      {getError(field.state.meta.errors)}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-3 gap-4">
              {(
                [
                  { name: 'senderAddress.city', label: 'City' },
                  { name: 'senderAddress.postCode', label: 'Post Code' },
                  { name: 'senderAddress.country', label: 'Country' },
                ] as const
              ).map(({ name, label }) => (
                <form.Field
                  key={name}
                  name={name}
                  validators={{
                    onChange:
                      InvoiceFormSchema.shape.senderAddress.shape[
                        name.split('.')[1] as 'city' | 'postCode' | 'country'
                      ],
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-body text-muted-foreground">
                          {label}
                        </Label>
                      </div>
                      <input
                        className={inputCls(!!field.state.meta.errors[0])}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {getError(field.state.meta.errors) && (
                        <span className="text-body-s text-destructive block">
                          {getError(field.state.meta.errors)}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>
              ))}
            </div>
          </section>

          {/* ── Bill To ── */}
          <section className="space-y-6">
            <h3 className="text-body font-bold text-primary">Bill To</h3>

            <form.Field
              name="clientName"
              validators={{ onChange: InvoiceFormSchema.shape.clientName }}
            >
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="clientName" className="text-body text-muted-foreground">
                      Client's Name
                    </Label>
                  </div>
                  <input
                    id="clientName"
                    className={inputCls(!!field.state.meta.errors[0])}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {getError(field.state.meta.errors) && (
                    <span className="text-body text-destructive block">
                      {getError(field.state.meta.errors)}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="clientEmail"
              validators={{ onChange: InvoiceFormSchema.shape.clientEmail }}
            >
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="clientEmail" className="text-body text-muted-foreground">
                      Client's Email
                    </Label>
                  </div>
                  <input
                    id="clientEmail"
                    className={inputCls(!!field.state.meta.errors[0])}
                    placeholder="e.g. email@example.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {getError(field.state.meta.errors) && (
                    <span className="text-body text-destructive block">
                      {getError(field.state.meta.errors)}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="clientAddress.street"
              validators={{
                onChange: InvoiceFormSchema.shape.clientAddress.shape.street,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="clientAddress-street" className="text-body text-muted-foreground">
                      Street Address
                    </Label>
                  </div>
                  <input
                    id="clientAddress-street"
                    className={inputCls(!!field.state.meta.errors[0])}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {getError(field.state.meta.errors) && (
                    <span className="text-body text-destructive block">
                      {getError(field.state.meta.errors)}
                    </span>
                  )}
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-3 gap-4">
              {(
                [
                  { name: 'clientAddress.city', label: 'City' },
                  { name: 'clientAddress.postCode', label: 'Post Code' },
                  { name: 'clientAddress.country', label: 'Country' },
                ] as const
              ).map(({ name, label }) => (
                <form.Field
                  key={name}
                  name={name}
                  validators={{
                    onChange:
                      InvoiceFormSchema.shape.clientAddress.shape[
                        name.split('.')[1] as 'city' | 'postCode' | 'country'
                      ],
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-body text-muted-foreground">
                          {label}
                        </Label>
                      </div>
                      <input
                        className={inputCls(!!field.state.meta.errors[0])}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {getError(field.state.meta.errors) && (
                        <span className="text-body-s text-destructive block">
                          {getError(field.state.meta.errors)}
                        </span>
                      )}
                    </div>
                  )}
                </form.Field>
              ))}
            </div>
          </section>

          {/* ── Date + Terms + Description ── */}
          <section className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <form.Field name="createdAt">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="createdAt" className="text-body text-muted-foreground">
                      Invoice Date
                    </Label>
                    <input
                      id="createdAt"
                      type="date"
                      className={inputCls(false)}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isEdit}
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="paymentTerms">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms" className="text-body text-muted-foreground">
                      Payment Terms
                    </Label>
                    <select
                      id="paymentTerms"
                      className={`${inputCls(false)} appearance-none cursor-pointer`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number(e.target.value))
                      }
                    >
                      <option value={1}>Net 1 Day</option>
                      <option value={7}>Net 7 Days</option>
                      <option value={14}>Net 14 Days</option>
                      <option value={30}>Net 30 Days</option>
                    </select>
                  </div>
                )}
              </form.Field>
            </div>

            <form.Field
              name="description"
              validators={{ onChange: InvoiceFormSchema.shape.description }}
            >
              {(field) => (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="description" className="text-body text-muted-foreground">
                      Project Description
                    </Label>
                  </div>
                  <input
                    id="description"
                    className={inputCls(!!field.state.meta.errors[0])}
                    placeholder="e.g. Graphic Design"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {getError(field.state.meta.errors) && (
                    <span className="text-body text-destructive block">
                      {getError(field.state.meta.errors)}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          </section>

          {/* ── Item List ── */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-[hsl(231,20%,61%)]">
              Item List
            </h3>

            <form.Field name="items">
              {(itemsField) => (
                <div className="space-y-4">
                  {itemsField.state.value.length > 0 && (
                    <div className="hidden md:grid grid-cols-[1fr_60px_100px_80px_20px] gap-4">
                      {['Item Name', 'Qty.', 'Price', 'Total', ''].map((h) => (
                        <span
                          key={h}
                          className="text-body text-muted-foreground"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {itemsField.state.value.map((item, index) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[60px_1fr_1fr_20px] md:grid-cols-[1fr_60px_100px_80px_20px] gap-4 items-end md:items-center"
                    >
                      {/* Name - full width on mobile */}
                      <div className="col-span-4 md:col-span-1 space-y-2 md:space-y-0">
                        <span className="text-body text-muted-foreground md:hidden">Item Name</span>
                        <form.Field name={`items[${index}].name`}>
                          {(f) => (
                            <input
                              aria-label="Item name"
                              className={inputCls(!!f.state.meta.errors[0])}
                              placeholder="Item name"
                              value={f.state.value}
                              onBlur={f.handleBlur}
                              onChange={(e) => f.handleChange(e.target.value)}
                            />
                          )}
                        </form.Field>
                      </div>

                      {/* Qty */}
                      <div className="space-y-2 md:space-y-0">
                        <span className="text-body text-muted-foreground md:hidden">Qty.</span>
                        <form.Field name={`items[${index}].quantity`}>
                          {(f) => (
                            <input
                              aria-label="Item quantity"
                              type="number"
                              min={1}
                              className={inputCls(false)}
                              value={f.state.value}
                              onBlur={f.handleBlur}
                              onChange={(e) => {
                                const qty = Number(e.target.value)
                                f.handleChange(qty)
                                const price = itemsField.state.value[index].price
                                itemsField.handleChange(
                                  itemsField.state.value.map((it, i) =>
                                    i === index
                                      ? {
                                          ...it,
                                          quantity: qty,
                                          total: qty * price,
                                        }
                                      : it,
                                  ),
                                )
                              }}
                            />
                          )}
                        </form.Field>
                      </div>

                      {/* Price */}
                      <div className="space-y-2 md:space-y-0">
                        <span className="text-body text-muted-foreground md:hidden">Price</span>
                        <form.Field name={`items[${index}].price`}>
                          {(f) => (
                            <input
                              aria-label="Item price"
                              type="number"
                              min={0}
                              step={0.01}
                              className={inputCls(false)}
                              value={f.state.value}
                              onBlur={f.handleBlur}
                              onChange={(e) => {
                                const price = Number(e.target.value)
                                f.handleChange(price)
                                const qty = itemsField.state.value[index].quantity
                                itemsField.handleChange(
                                  itemsField.state.value.map((it, i) =>
                                    i === index
                                      ? { ...it, price, total: qty * price }
                                      : it,
                                  ),
                                )
                              }}
                            />
                          )}
                        </form.Field>
                      </div>

                      {/* Total */}
                      <div className="space-y-2 md:space-y-0 flex flex-col justify-end h-16 md:h-auto pb-4 md:pb-0">
                        <span className="text-body text-muted-foreground md:hidden mb-2">Total</span>
                        <span className="text-body text-muted-foreground font-bold">
                          {(itemsField.state.value[index].total ?? 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Delete */}
                      <div className="flex flex-col justify-end h-16 md:h-auto pb-4 md:pb-0 items-center">
                        <button
                          type="button"
                          onClick={() =>
                            itemsField.handleChange(
                              itemsField.state.value.filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                          className="text-muted-foreground hover:text-destructive transition-colors mt-8 md:mt-0"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {getError(itemsField.state.meta.errors) && (
                    <p className="text-body text-destructive">
                      {getError(itemsField.state.meta.errors)}
                    </p>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      itemsField.handleChange([
                        ...itemsField.state.value,
                        {
                          id: crypto.randomUUID(),
                          name: '',
                          quantity: 1,
                          price: 0,
                          total: 0,
                        },
                      ])
                    }
                    className="w-full h-12 text-body font-bold"
                  >
                    + Add New Item
                  </Button>
                </div>
              )}
            </form.Field>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 md:px-14 py-6 bg-background shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
          {isEdit ? (
            <div className="flex justify-end gap-3">
              <Button variant="edit" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                onClick={() => form.handleSubmit()}
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <Button variant="draft" type="button" onClick={handleClose}>
                Discard
              </Button>
              <div className="flex gap-3">
                <Button variant="draft" type="button" onClick={handleDraft}>
                  Save as Draft
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => form.handleSubmit()}
                >
                  Save & Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
