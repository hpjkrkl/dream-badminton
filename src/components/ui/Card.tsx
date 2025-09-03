import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "rounded-2xl border transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-card border-gray-200 dark:border-border shadow-sm hover:shadow-md",
        glass: "bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 shadow-2xl hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/20 dark:hover:border-white/20 hover:shadow-3xl",
        "glass-strong": "bg-white/10 dark:bg-white/10 backdrop-blur-2xl border-white/20 dark:border-white/20 shadow-2xl hover:bg-white/15 dark:hover:bg-white/15 hover:border-white/30 dark:hover:border-white/30",
        gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-muted border-gray-200 dark:border-border shadow-sm hover:shadow-md",
        feature: "bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200/50 dark:border-primary-800/50 shadow-sm hover:shadow-md",
        mockup: "bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-gray-700/50 dark:border-gray-800/50 shadow-2xl overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }