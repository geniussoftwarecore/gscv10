import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  required?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  icon?: React.ReactNode
  actions?: React.ReactNode
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ 
    className, 
    title, 
    description, 
    required = false,
    collapsible = false,
    defaultCollapsed = false,
    icon,
    actions,
    children,
    ...props 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

    const toggleCollapse = () => {
      if (collapsible) {
        setIsCollapsed(!isCollapsed)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "space-y-4 border border-gray-200 rounded-lg p-4 bg-white",
          className
        )}
        {...props}
      >
        {/* Section Header */}
        <div 
          className={cn(
            "flex items-center justify-between",
            collapsible && "cursor-pointer"
          )}
          onClick={toggleCollapse}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {icon && (
              <div className="flex-shrink-0 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-secondary flex items-center gap-2">
                {title}
                {required && (
                  <span className="text-red-500 text-sm" title="Required section">
                    *
                  </span>
                )}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {actions && (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {actions}
              </div>
            )}
            
            {collapsible && (
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={isCollapsed ? "Expand section" : "Collapse section"}
              >
                <svg
                  className={cn(
                    "w-5 h-5 text-gray-500 transition-transform",
                    isCollapsed ? "rotate-0" : "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Section Content */}
        {!isCollapsed && (
          <div className="space-y-6">
            {children}
          </div>
        )}
        
        {/* Collapsed indicator */}
        {isCollapsed && (
          <div className="text-sm text-muted-foreground italic">
            Click to expand section
          </div>
        )}
      </div>
    )
  }
)

FormSection.displayName = "FormSection"

export { FormSection }