import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "../base/Input"

export interface DateTimeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  type?: 'date' | 'time' | 'datetime' | 'datetime-local'
  format?: '12h' | '24h'
  locale?: string
  minDate?: Date
  maxDate?: Date
  onChange?: (value: Date | null, formattedValue: string) => void
  showNow?: boolean
}

const DateTimeInput = React.forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ 
    className, 
    type = 'datetime-local',
    format = '24h',
    locale = 'ar-YE',
    minDate,
    maxDate,
    onChange, 
    value, 
    showNow = true,
    placeholder,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")
    const [inputType, setInputType] = React.useState<'date' | 'time' | 'datetime-local'>('datetime-local')

    // Convert date to input format
    const formatDateForInput = (date: Date | null): string => {
      if (!date) return ""
      
      switch (type) {
        case 'date':
          return date.toISOString().split('T')[0]
        case 'time':
          const hours = date.getHours().toString().padStart(2, '0')
          const minutes = date.getMinutes().toString().padStart(2, '0')
          return `${hours}:${minutes}`
        case 'datetime':
        case 'datetime-local':
          return date.toISOString().slice(0, 16)
        default:
          return ""
      }
    }

    // Parse input value to Date
    const parseInputValue = (inputStr: string): Date | null => {
      if (!inputStr) return null
      
      try {
        switch (type) {
          case 'date':
            return new Date(inputStr + 'T00:00:00')
          case 'time':
            const today = new Date()
            const [hours, minutes] = inputStr.split(':').map(Number)
            today.setHours(hours, minutes, 0, 0)
            return today
          case 'datetime':
          case 'datetime-local':
            return new Date(inputStr)
          default:
            return new Date(inputStr)
        }
      } catch {
        return null
      }
    }

    // Format date for display
    const formatDateForDisplay = (date: Date | null): string => {
      if (!date) return ""
      
      const options: Intl.DateTimeFormatOptions = {}
      
      switch (type) {
        case 'date':
          options.year = 'numeric'
          options.month = 'long'
          options.day = 'numeric'
          break
        case 'time':
          options.hour = '2-digit'
          options.minute = '2-digit'
          options.hour12 = format === '12h'
          break
        case 'datetime':
        case 'datetime-local':
          options.year = 'numeric'
          options.month = 'short'
          options.day = 'numeric'
          options.hour = '2-digit'
          options.minute = '2-digit'
          options.hour12 = format === '12h'
          break
      }
      
      return new Intl.DateTimeFormat(locale, options).format(date)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)
      
      const parsed = parseInputValue(inputValue)
      
      if (onChange) {
        const formatted = formatDateForDisplay(parsed)
        onChange(parsed, formatted)
      }
    }

    const setNow = () => {
      const now = new Date()
      const formatted = formatDateForInput(now)
      setDisplayValue(formatted)
      
      if (onChange) {
        const displayFormatted = formatDateForDisplay(now)
        onChange(now, displayFormatted)
      }
    }

    // Set input type based on type prop
    React.useEffect(() => {
      switch (type) {
        case 'datetime':
        case 'datetime-local':
          setInputType('datetime-local')
          break
        case 'date':
          setInputType('date')
          break
        case 'time':
          setInputType('time')
          break
        default:
          setInputType('datetime-local')
      }
    }, [type])

    // Handle initial value
    React.useEffect(() => {
      if (value) {
        const dateValue = value instanceof Date ? value : new Date(value as string)
        const formatted = formatDateForInput(dateValue)
        setDisplayValue(formatted)
      } else {
        setDisplayValue("")
      }
    }, [value, type])

    const getConstraints = () => {
      const constraints: any = {}
      
      if (minDate) {
        constraints.min = formatDateForInput(minDate)
      }
      
      if (maxDate) {
        constraints.max = formatDateForInput(maxDate)
      }
      
      return constraints
    }

    const getPlaceholder = () => {
      if (placeholder) return placeholder
      
      switch (type) {
        case 'date':
          return locale.startsWith('ar') ? 'اختر التاريخ' : 'Select date'
        case 'time':
          return locale.startsWith('ar') ? 'اختر الوقت' : 'Select time'
        case 'datetime':
        case 'datetime-local':
          return locale.startsWith('ar') ? 'اختر التاريخ والوقت' : 'Select date & time'
        default:
          return 'Select date & time'
      }
    }

    return (
      <div className="relative">
        <Input
          type={inputType}
          className={cn(
            "focus:ring-2 focus:ring-primary",
            locale.startsWith('ar') ? "text-right" : "text-left",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          {...getConstraints()}
          ref={ref}
          {...props}
        />
        
        {/* Now button */}
        {showNow && (type === 'datetime' || type === 'datetime-local' || type === 'time') && (
          <button
            type="button"
            onClick={setNow}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 text-gray-600 transition-colors"
          >
            {locale.startsWith('ar') ? 'الآن' : 'Now'}
          </button>
        )}
        
        {/* Formatted display */}
        {displayValue && (
          <div className="text-xs text-muted-foreground mt-1">
            {formatDateForDisplay(parseInputValue(displayValue))}
          </div>
        )}
      </div>
    )
  }
)

DateTimeInput.displayName = "DateTimeInput"

export { DateTimeInput }