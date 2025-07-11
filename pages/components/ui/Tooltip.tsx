import { useState, useRef } from 'react'
import { useFloating, offset, shift, useHover, useInteractions } from '@floating-ui/react'

interface TooltipProps {
  children: React.ReactNode
  label: string
  placement?: 'right' | 'left' | 'top' | 'bottom'
}

export default function Tooltip({ children, label, placement = 'right' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const arrowRef = useRef(null)

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), shift()],
    placement,
  })

  const hover = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow-md transition-opacity duration-200"
        >
          {label}
        </div>
      )}
    </>
  )
}
