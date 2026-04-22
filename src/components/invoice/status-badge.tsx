import { cn } from '@/lib/utils'
import type { InvoiceStatus } from '@/types/invoice'

const config: Record<
  InvoiceStatus,
  { label: string; dot: string; text: string; bg: string }
> = {
  paid: {
    label: 'Paid',
    dot: 'bg-[var(--status-paid)]',
    text: 'text-[var(--status-paid)]',
    bg: 'bg-[var(--status-paid-bg)]',
  },
  pending: {
    label: 'Pending',
    dot: 'bg-[var(--status-pending)]',
    text: 'text-[var(--status-pending)]',
    bg: 'bg-[var(--status-pending-bg)]',
  },
  draft: {
    label: 'Draft',
    dot: 'bg-[var(--status-draft)]',
    text: 'text-[var(--status-draft)]',
    bg: 'bg-[var(--status-draft-bg)]',
  },
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, dot, text, bg } = config[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-3 rounded-md font-bold text-body min-w-[104px] justify-center',
        bg,
        text,
      )}
    >
      <span className={cn('w-2 h-2 rounded-full', dot)} />
      {label}
    </span>
  )
}
