import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "../base/Input"

export interface EmailInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onValidityChange?: (isValid: boolean, message?: string) => void
  showValidation?: boolean
}

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
  ({ className, onChange, onValidityChange, showValidation = true, value, ...props }, ref) => {
    const [validationState, setValidationState] = React.useState<{
      isValid: boolean
      message: string
      isEmpty: boolean
    }>({
      isValid: true,
      message: "",
      isEmpty: true
    })

    // Email validation regex - more comprehensive
    const validateEmail = (email: string) => {
      if (!email || email.trim() === '') {
        return { isValid: true, message: "", isEmpty: true }
      }

      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      
      if (!emailRegex.test(email)) {
        return { 
          isValid: false, 
          message: "Please enter a valid email address", 
          isEmpty: false 
        }
      }

      // Additional checks
      const parts = email.split('@')
      if (parts.length !== 2) {
        return { 
          isValid: false, 
          message: "Email must contain exactly one @ symbol", 
          isEmpty: false 
        }
      }

      const [localPart, domain] = parts
      
      if (localPart.length > 64) {
        return { 
          isValid: false, 
          message: "Email address is too long", 
          isEmpty: false 
        }
      }

      if (domain.length > 253) {
        return { 
          isValid: false, 
          message: "Domain name is too long", 
          isEmpty: false 
        }
      }

      // Check for consecutive dots
      if (email.includes('..')) {
        return { 
          isValid: false, 
          message: "Email cannot contain consecutive dots", 
          isEmpty: false 
        }
      }

      return { isValid: true, message: "Valid email address", isEmpty: false }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const validation = validateEmail(inputValue)
      
      setValidationState(validation)
      
      if (onValidityChange) {
        onValidityChange(validation.isValid, validation.message)
      }
      
      if (onChange) {
        onChange(e)
      }
    }

    // Validate on mount if there's an initial value
    React.useEffect(() => {
      if (value) {
        const validation = validateEmail(String(value))
        setValidationState(validation)
        if (onValidityChange) {
          onValidityChange(validation.isValid, validation.message)
        }
      }
    }, [value, onValidityChange])

    const getInputClassName = () => {
      let baseClass = "focus:ring-2 focus:ring-primary transition-colors"
      
      if (showValidation && !validationState.isEmpty) {
        if (validationState.isValid) {
          baseClass += " border-green-500 focus:border-green-500"
        } else {
          baseClass += " border-red-500 focus:border-red-500"
        }
      }
      
      return cn(baseClass, className)
    }

    return (
      <div className="relative">
        <Input
          type="email"
          className={getInputClassName()}
          onChange={handleChange}
          value={value}
          placeholder="example@email.com"
          ref={ref}
          {...props}
        />
        
        {showValidation && !validationState.isEmpty && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validationState.isValid ? (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
        
        {showValidation && !validationState.isEmpty && validationState.message && (
          <p className={cn(
            "text-xs mt-1 font-medium",
            validationState.isValid ? "text-green-600" : "text-red-600"
          )}>
            {validationState.message}
          </p>
        )}
      </div>
    )
  }
)

EmailInput.displayName = "EmailInput"

export { EmailInput }