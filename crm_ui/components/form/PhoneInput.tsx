import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "../base/Input"

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  countryCode?: string
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, countryCode = "+967", onChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState("")

    // Phone number formatting for Yemen (+967) and international numbers
    const formatPhoneNumber = (input: string) => {
      // Remove all non-numeric characters except +
      const cleaned = input.replace(/[^\d+]/g, '')
      
      // Handle different country codes
      if (cleaned.startsWith('+967')) {
        // Yemen format: +967 X XXX XXXX
        const number = cleaned.substring(4)
        if (number.length >= 9) {
          return `+967 ${number.substring(0, 1)} ${number.substring(1, 4)} ${number.substring(4, 8)}`
        } else if (number.length >= 4) {
          return `+967 ${number.substring(0, 1)} ${number.substring(1, 4)} ${number.substring(4)}`
        } else if (number.length >= 1) {
          return `+967 ${number.substring(0, 1)} ${number.substring(1)}`
        } else {
          return `+967 `
        }
      } else if (cleaned.startsWith('+966')) {
        // Saudi Arabia format: +966 XX XXX XXXX
        const number = cleaned.substring(4)
        if (number.length >= 9) {
          return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5, 9)}`
        } else if (number.length >= 5) {
          return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
        } else if (number.length >= 2) {
          return `+966 ${number.substring(0, 2)} ${number.substring(2)}`
        } else {
          return `+966 ${number}`
        }
      } else if (cleaned.startsWith('+1')) {
        // US format: +1 XXX XXX XXXX
        const number = cleaned.substring(2)
        if (number.length >= 10) {
          return `+1 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)}`
        } else if (number.length >= 6) {
          return `+1 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
        } else if (number.length >= 3) {
          return `+1 ${number.substring(0, 3)} ${number.substring(3)}`
        } else {
          return `+1 ${number}`
        }
      } else if (cleaned.startsWith('+')) {
        // Generic international format
        return cleaned
      } else if (cleaned.length > 0) {
        // Default to Yemen if no country code provided
        return formatPhoneNumber(countryCode + cleaned)
      }
      
      return countryCode + ' '
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatPhoneNumber(inputValue)
      
      setDisplayValue(formatted)
      
      // Call original onChange with cleaned number
      if (onChange) {
        const cleaned = formatted.replace(/[^\d+]/g, '')
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: cleaned
          }
        }
        onChange(syntheticEvent)
      }
    }

    React.useEffect(() => {
      if (value) {
        setDisplayValue(formatPhoneNumber(String(value)))
      } else {
        setDisplayValue(countryCode + ' ')
      }
    }, [value, countryCode])

    return (
      <Input
        type="tel"
        className={cn(
          "focus:ring-2 focus:ring-primary",
          className
        )}
        value={displayValue}
        onChange={handleChange}
        placeholder={`${countryCode} XX XXX XXXX`}
        ref={ref}
        {...props}
      />
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export { PhoneInput }