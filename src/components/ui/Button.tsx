import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl",
        secondary: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-lg hover:shadow-xl",
        outline: "border border-primary-200 bg-transparent text-primary-700 hover:bg-primary-50 hover:text-primary-800",
        ghost: "text-primary-700 hover:bg-primary-50 hover:text-primary-800",
        link: "text-primary-600 underline-offset-4 hover:underline",
        accent: "bg-gradient-secondary text-white hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl",
        "glass-primary": "bg-white/15 backdrop-blur-xl text-white border border-white/20 hover:bg-white/25 hover:border-white/30 shadow-xl hover:shadow-2xl",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4",
        lg: "h-16 px-10 text-lg font-semibold",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }