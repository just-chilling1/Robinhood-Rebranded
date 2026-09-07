import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-[var(--border-strong)] placeholder:text-[var(--text-muted)] focus-visible:border-primary focus-visible:ring-primary/25 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border-[1.5px] bg-card px-3 py-2 text-base text-foreground shadow-field transition-[color,box-shadow,border-color] outline-none focus-visible:ring-[3px] hover:border-[var(--ds-sapphire-300)] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-nested disabled:border-border disabled:text-[var(--text-disabled)] md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
