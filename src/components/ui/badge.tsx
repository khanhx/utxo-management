import * as React from "react"
import { cn } from "@/lib/utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/10 text-white border border-white/10',
    success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    destructive: 'bg-red-500/20 text-red-300 border border-red-500/30',
    outline: 'border border-white/20 text-gray-300',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
