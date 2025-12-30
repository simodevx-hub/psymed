
import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-2xl border border-gray-100 bg-white/80 text-gray-950 shadow-sm backdrop-blur-sm',
                className
            )}
            {...props}
        />
    )
)
Card.displayName = 'Card'
