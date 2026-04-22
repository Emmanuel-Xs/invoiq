import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useInvoiceStore } from '@/store/invoice-store'
import { cn } from '@/lib/utils'

const OPTIONS = ['all', 'draft', 'pending', 'paid'] as const

export function FilterDropdown() {
  const { filter, setFilter } = useInvoiceStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 text-heading-s text-foreground hover:text-primary transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="hidden md:inline">Filter by status</span>
        <span className="md:hidden">Filter</span>
        <ChevronDown
          size={12}
          strokeWidth={3}
          className={cn(
            'text-primary transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-48 bg-card dark:bg-popover rounded-lg shadow-xl p-6 flex flex-col gap-4 z-50"
        >
          {OPTIONS.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filter === option}
                onChange={() => {
                  setFilter(option)
                  setOpen(false)
                }}
                className="hidden"
              />
              <span
                className={cn(
                  'w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors',
                  filter === option
                    ? 'bg-primary border-primary'
                    : 'border-[hsl(231,73%,93%)] dark:border-[hsl(233,30%,21%)] group-hover:border-primary',
                )}
              >
                {filter === option && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-heading-s text-foreground capitalize">
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
