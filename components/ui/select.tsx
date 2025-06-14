"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function CustomSelect({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function DefaultSelect({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <select
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors",
          className,
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Componentes simplificados para compatibilidad
export const Select = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>

export const SelectGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

export const SelectValue = ({
  placeholder,
  ...props
}: { placeholder?: string } & React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{placeholder}</div>

export const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)
SelectTrigger.displayName = "SelectTrigger"

export const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

export const SelectLabel = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

export const SelectItem = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

export const SelectSeparator = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

export const SelectScrollUpButton = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

export const SelectScrollDownButton = ({ ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />
