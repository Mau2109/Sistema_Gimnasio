"use client"

import * as React from "react"

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className = "", ...props }, ref) => {
  const baseClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  const combinedClasses = `${baseClasses} ${className}`.trim()

  return <label ref={ref} className={combinedClasses} {...props} />
})
Label.displayName = "Label"

export { Label }
