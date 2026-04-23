import { Button } from '@/components/ui/button'

interface NewInvoiceButtonProps {
  onClick: () => void
}

export function NewInvoiceButton({ onClick }: NewInvoiceButtonProps) {
  return (
    <Button
      variant="primary"
      size="icon"
      onClick={onClick}
      className="text-primary-foreground"
    >
      {/* Plus circle */}
      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <path
            d="M6.313 0v4.688H11v1.624H6.313V11H4.688V6.312H0V4.688h4.688V0z"
            fill="hsl(252, 94%, 67%)"
          />
        </svg>
      </span>
      <span className="hidden md:inline">New Invoice</span>
      <span className="md:hidden">New</span>
    </Button>
  )
}
