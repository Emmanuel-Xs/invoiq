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
        // Button 3 — Edit (light: muted bg, dark: card bg)
        edit: 'bg-[hsl(231,73%,93%)] hover:bg-muted text-[hsl(231,37%,63%)] dark:bg-[hsl(233,30%,21%)] dark:hover:bg-card dark:text-[hsl(231,73%,93%)] rounded-full',
        // Button 4 — Save as Draft
        draft:
          'bg-[hsl(231,20%,27%)] hover:bg-[hsl(233,31%,17%)] text-[hsl(231,20%,61%)] dark:bg-[hsl(233,30%,21%)] dark:hover:bg-[hsl(233,31%,17%)] dark:text-[hsl(231,73%,93%)] rounded-full',
        // Button 5 — Delete
        destructive:
          'bg-destructive hover:bg-destructive-hover text-white rounded-full',
        // Button 6 — Add New Item
        ghost:
          'bg-[hsl(231,73%,93%)] hover:bg-muted text-[hsl(231,37%,63%)] dark:bg-[hsl(233,30%,21%)] dark:hover:bg-[hsl(233,31%,17%)] dark:text-[hsl(231,73%,93%)] rounded-full w-full',
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
