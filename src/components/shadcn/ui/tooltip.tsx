import * as React from 'react'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import { cn } from '../utils'

const TooltipProvider = RadixTooltip.Provider
const TooltipRoot = RadixTooltip.Root
const TooltipTrigger = RadixTooltip.Trigger
const TooltipPortal = RadixTooltip.Portal
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof RadixTooltip.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTooltip.Content> & { className?: string }
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPortal>
    <RadixTooltip.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-black/90 px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 data-[state=delayed-open]:slide-in-from-top-2',
        className
      )}
      {...props}
    />
  </TooltipPortal>
))
TooltipContent.displayName = RadixTooltip.Content.displayName

const Tooltip = ({ children, ...props }: RadixTooltip.TooltipProps) => (
  <TooltipRoot {...props}>{children}</TooltipRoot>
)

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } 