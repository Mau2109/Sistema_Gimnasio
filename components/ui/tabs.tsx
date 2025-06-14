"use client"

import * as React from "react"

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className = "", value: controlledValue, defaultValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")

    const value = controlledValue ?? internalValue
    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const baseClasses = "w-full"
    const combinedClasses = `${baseClasses} ${className}`.trim()

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={combinedClasses} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  },
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const baseClasses = "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600"
    const combinedClasses = `${baseClasses} ${className}`.trim()

    return <div ref={ref} className={combinedClasses} {...props} />
  },
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className = "", value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext()
    const isSelected = selectedValue === value

    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    const selectedClasses = isSelected ? "bg-white text-gray-900 shadow-sm" : "hover:bg-gray-200 hover:text-gray-900"
    const combinedClasses = `${baseClasses} ${selectedClasses} ${className}`.trim()

    return (
      <button ref={ref} className={combinedClasses} onClick={() => onValueChange(value)} {...props}>
        {children}
      </button>
    )
  },
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className = "", value, children, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext()

    if (selectedValue !== value) {
      return null
    }

    const baseClasses =
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    const combinedClasses = `${baseClasses} ${className}`.trim()

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    )
  },
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
