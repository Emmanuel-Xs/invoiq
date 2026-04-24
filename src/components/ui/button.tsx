import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap',
  {
    variants: {
      variant: {
        // Button 1 & 2 — primary purple pill
        primary:
          'bg-primary hover:bg-primary-hover text-primary-foreground rounded-full',
        // Button 3 — Edit
        edit: 'bg-[#F9FAFE] hover:bg-[#DFE3FA] text-[#7E88C3] dark:bg-[#252945] dark:hover:bg-[#FFFFFF] dark:text-[#DFE3FA] dark:hover:text-[#7E88C3] rounded-full',
        // Button 4 — Save as Draft
        draft:
          'bg-[#373B53] hover:bg-[#0C0E16] text-[#888EB0] dark:bg-[#373B53] dark:hover:bg-[#1E2139] dark:text-[#DFE3FA] dark:hover:text-[#DFE3FA] rounded-full',
        // Button 5 — Delete
        destructive:
          'bg-destructive hover:bg-destructive-hover text-white rounded-full',
        // Button 6 — Add New Item
        ghost:
          'bg-[#F9FAFE] hover:bg-[#DFE3FA] text-[#7E88C3] dark:bg-[#252945] dark:hover:bg-[#FFFFFF] dark:text-[#DFE3FA] dark:hover:text-[#7E88C3] rounded-full w-full',
      },
      size: {
        default: 'h-12 px-6 text-body',
        sm: 'h-10 px-5 text-body',
        icon: 'h-12 pl-2 pr-6 gap-4 text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
