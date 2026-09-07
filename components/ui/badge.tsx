import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--primary-light)] text-[var(--primary-active)] [a&]:hover:bg-[var(--primary-lighter)]',
        secondary:
          'border-transparent bg-[var(--success-light)] text-[var(--success)] [a&]:hover:bg-[var(--success-light)]',
        destructive:
          'border-transparent bg-[var(--danger-light)] text-destructive [a&]:hover:bg-[var(--danger-light)] focus-visible:ring-destructive/20',
        outline:
          'border-border bg-card text-foreground [a&]:hover:bg-[var(--surface-hover)]',
        warning:
          'border-transparent bg-[var(--warning-light)] text-[var(--warning)] [a&]:hover:bg-[var(--warning-light)]',
        info:
          'border-transparent bg-[var(--info-light)] text-[var(--info)] [a&]:hover:bg-[var(--info-light)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
