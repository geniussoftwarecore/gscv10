import { z } from "zod"

// Base validation schemas that can be reused
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+\d{1,4}\s?\d{1,14}$/, "Please enter a valid phone number with country code")

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(254, "Email address is too long")

export const currencySchema = z
  .number()
  .min(0, "Amount must be positive")
  .max(999999999, "Amount is too large")

export const dateSchema = z
  .date()
  .refine((date) => date <= new Date(), "Date cannot be in the future")

export const futureDateSchema = z
  .date()
  .refine((date) => date >= new Date(), "Date must be in the future")

export const requiredStringSchema = z
  .string()
  .min(1, "This field is required")
  .max(255, "Text is too long")

export const optionalStringSchema = z
  .string()
  .max(255, "Text is too long")
  .optional()

export const textAreaSchema = z
  .string()
  .min(1, "This field is required")
  .max(2000, "Text is too long (maximum 2000 characters)")

export const urlSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""))

// Enhanced validation with custom messages
export const createEnhancedEmailSchema = (fieldName = "Email") => 
  z.string()
    .min(1, `${fieldName} is required`)
    .email(`Please enter a valid ${fieldName.toLowerCase()}`)
    .refine((email) => !email.includes('..'), "Email cannot contain consecutive dots")
    .refine((email) => email.split('@')[0].length <= 64, "Email username is too long")
    .refine((email) => email.split('@')[1]?.length <= 253, "Email domain is too long")

export const createEnhancedPhoneSchema = (countryCode = "+967", fieldName = "Phone number") =>
  z.string()
    .min(1, `${fieldName} is required`)
    .regex(
      new RegExp(`^\\${countryCode}\\s?\\d{8,9}$`), 
      `Please enter a valid ${fieldName.toLowerCase()} (${countryCode} format)`
    )

export const createCurrencySchema = (
  currency = "YER", 
  min = 0, 
  max = 999999999, 
  fieldName = "Amount"
) =>
  z.number({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a number`,
  })
    .min(min, `${fieldName} must be at least ${min} ${currency}`)
    .max(max, `${fieldName} cannot exceed ${max} ${currency}`)

export const createDateRangeSchema = (fieldName = "Date") => 
  z.object({
    startDate: z.date({
      required_error: `Start ${fieldName.toLowerCase()} is required`,
    }),
    endDate: z.date({
      required_error: `End ${fieldName.toLowerCase()} is required`,
    }),
  }).refine(
    (data) => data.endDate >= data.startDate,
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )

// Common form schemas
export const contactFormSchema = z.object({
  name: requiredStringSchema,
  email: createEnhancedEmailSchema(),
  phone: createEnhancedPhoneSchema(),
  company: optionalStringSchema,
  message: textAreaSchema,
})

export const leadFormSchema = z.object({
  name: requiredStringSchema,
  email: createEnhancedEmailSchema(),
  phone: createEnhancedPhoneSchema(),
  company: optionalStringSchema,
  jobTitle: optionalStringSchema,
  leadSource: z.enum(["website", "referral", "advertising", "cold-call", "social-media"]),
  estimatedValue: createCurrencySchema().optional(),
  expectedCloseDate: futureDateSchema.optional(),
  notes: z.string().max(1000, "Notes are too long").optional(),
})

export const opportunityFormSchema = z.object({
  name: requiredStringSchema,
  accountId: z.string().min(1, "Account is required"),
  contactId: z.string().min(1, "Contact is required"),
  stage: z.enum(["prospecting", "qualification", "proposal", "negotiation", "closed-won", "closed-lost"]),
  amount: createCurrencySchema(),
  probability: z.number().min(0).max(100),
  expectedCloseDate: futureDateSchema,
  description: textAreaSchema.optional(),
  nextStep: optionalStringSchema,
})

export const taskFormSchema = z.object({
  title: requiredStringSchema,
  description: z.string().max(1000, "Description is too long").optional(),
  type: z.enum(["call", "email", "meeting", "follow-up", "demo", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().min(1, "Assignee is required"),
  dueDate: futureDateSchema,
  estimatedDuration: z.number().min(1, "Duration must be at least 1 minute").optional(),
})

// Type exports for TypeScript
export type ContactFormData = z.infer<typeof contactFormSchema>
export type LeadFormData = z.infer<typeof leadFormSchema>
export type OpportunityFormData = z.infer<typeof opportunityFormSchema>
export type TaskFormData = z.infer<typeof taskFormSchema>

// Form validation helpers
export const validateFormData = <T,>(schema: z.ZodSchema<T>, data: unknown): { 
  success: boolean
  data?: T
  errors?: z.ZodError
} => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}

export const getFieldError = (errors: z.ZodError | undefined, fieldName: string): string | undefined => {
  if (!errors) return undefined
  
  const fieldError = errors.errors.find(error => 
    error.path.join('.') === fieldName
  )
  
  return fieldError?.message
}