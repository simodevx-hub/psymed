
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg',
            secondary: 'bg-primary-100 text-primary-900 hover:bg-primary-200',
            outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
            ghost: 'text-primary-600 hover:bg-primary-50',
            danger: 'bg-red-600 text-white hover:bg-red-700',
        }

        const sizes = {
            sm: 'h-9 px-4 text-sm',
            md: 'h-11 px-6 text-base',
            lg: 'h-14 px-8 text-lg',
        }

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
                    variants[variant],
                    sizes[size],
                    (isLoading || disabled) && 'opacity-50 cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'
