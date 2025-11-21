import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "../base/Input"

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  currency?: 'YER' | 'USD' | 'SAR' | 'EUR' | 'GBP'
  locale?: string
  onChange?: (value: number | null, formattedValue: string) => void
  allowNegative?: boolean
  maxDigits?: number
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    className, 
    currency = 'YER', 
    locale = 'ar-YE',
    onChange, 
    value, 
    allowNegative = false,
    maxDigits = 12,
    placeholder,
    ...props 
  }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")
    const [numericValue, setNumericValue] = React.useState<number | null>(null)

    // Currency symbols and formatting
    const currencySymbols = {
      YER: { symbol: 'ر.ي', position: 'after' },
      USD: { symbol: '$', position: 'before' },
      SAR: { symbol: 'ر.س', position: 'after' },
      EUR: { symbol: '€', position: 'after' },
      GBP: { symbol: '£', position: 'before' }
    }

    const formatNumber = (number: number, showSymbol: boolean = true) => {
      if (isNaN(number)) return ""
      
      const currencyInfo = currencySymbols[currency]
      
      // Format number with locale-specific formatting
      const formattedNumber = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(Math.abs(number))

      let result = formattedNumber
      
      if (showSymbol) {
        if (currencyInfo.position === 'before') {
          result = `${currencyInfo.symbol}${result}`
        } else {
          result = `${result} ${currencyInfo.symbol}`
        }
      }
      
      if (number < 0 && allowNegative) {
        result = `-${result}`
      }
      
      return result
    }

    const parseInputValue = (inputStr: string): number | null => {
      if (!inputStr) return null
      
      // Remove currency symbols and spaces
      let cleaned = inputStr
        .replace(/[^\d.,-]/g, '') // Keep only digits, dots, commas, and minus
        .replace(/,/g, '') // Remove thousand separators
      
      // Handle negative sign
      const isNegative = inputStr.includes('-') && allowNegative
      cleaned = cleaned.replace(/-/g, '')
      
      const parsed = parseFloat(cleaned)
      if (isNaN(parsed)) return null
      
      return isNegative ? -parsed : parsed
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const parsed = parseInputValue(inputValue)
      
      // Validate max digits
      if (parsed !== null && Math.abs(parsed) >= Math.pow(10, maxDigits)) {
        return // Don't update if exceeds max digits
      }
      
      setNumericValue(parsed)
      
      if (parsed !== null) {
        const formatted = formatNumber(parsed, false) // Don't show symbol in input
        setDisplayValue(formatted)
      } else {
        setDisplayValue("")
      }
      
      if (onChange) {
        const fullFormatted = parsed !== null ? formatNumber(parsed, true) : ""
        onChange(parsed, fullFormatted)
      }
    }

    // Handle initial value
    React.useEffect(() => {
      if (value !== undefined) {
        const numValue = typeof value === 'string' ? parseInputValue(value) : Number(value)
        setNumericValue(numValue)
        if (numValue !== null) {
          setDisplayValue(formatNumber(numValue, false))
        } else {
          setDisplayValue("")
        }
      }
    }, [value, currency, locale])

    const getPlaceholder = () => {
      if (placeholder) return placeholder
      
      const currencyInfo = currencySymbols[currency]
      const sampleFormat = formatNumber(1000, true)
      
      return `0 ${currencyInfo.symbol}`
    }

    return (
      <div className="relative">
        <Input
          type="text"
          inputMode="decimal"
          className={cn(
            "focus:ring-2 focus:ring-primary",
            currency === 'USD' || currency === 'GBP' ? "text-left" : "text-right",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          placeholder={getPlaceholder()}
          ref={ref}
          {...props}
        />
        
        {/* Currency symbol display */}
        <div className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground pointer-events-none",
          currencySymbols[currency].position === 'before' ? "left-3" : "right-3"
        )}>
          {displayValue && currencySymbols[currency].symbol}
        </div>
        
        {/* Value indicator */}
        {numericValue !== null && (
          <div className="text-xs text-muted-foreground mt-1">
            {formatNumber(numericValue, true)}
          </div>
        )}
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }