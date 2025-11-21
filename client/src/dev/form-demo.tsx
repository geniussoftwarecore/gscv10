import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Import our enterprise form components (using relative paths for now)
import { PhoneInput } from "../../../crm_ui/components/form/PhoneInput"
import { EmailInput } from "../../../crm_ui/components/form/EmailInput"
import { CurrencyInput } from "../../../crm_ui/components/form/CurrencyInput"
import { DateTimeInput } from "../../../crm_ui/components/form/DateTimeInput"
import { FormSection } from "../../../crm_ui/components/form/FormSection"

// Demo form schema
const demoFormSchema = z.object({
  // Personal Information
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  
  // Business Information
  company: z.string().optional(),
  position: z.string().optional(),
  industry: z.string().optional(),
  
  // Project Details
  projectType: z.string().min(1, "Project type is required"),
  budget: z.number().min(1, "Budget must be at least 1").max(10000000, "Budget is too large"),
  currency: z.string().default("YER"),
  
  // Timeline
  startDate: z.date({
    required_error: "Start date is required",
  }),
  deadline: z.date({
    required_error: "Deadline is required",
  }),
  
  // Additional Information
  description: z.string().min(10, "Please provide at least 10 characters").max(1000, "Description is too long"),
  requirements: z.string().optional(),
  
  // Preferences
  communicationMethod: z.string().optional(),
  newsletter: z.boolean().default(false),
}).refine(
  (data) => data.deadline >= data.startDate,
  {
    message: "Deadline must be after start date",
    path: ["deadline"],
  }
)

type DemoFormData = z.infer<typeof demoFormSchema>

export default function FormDemo() {
  const { toast } = useToast()
  const [emailValid, setEmailValid] = React.useState<boolean>(true)
  const [budgetCurrency, setBudgetCurrency] = React.useState<'YER' | 'USD' | 'SAR'>('YER')

  const form = useForm<DemoFormData>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      industry: "",
      projectType: "",
      budget: 0,
      currency: "YER",
      description: "",
      requirements: "",
      communicationMethod: "",
      newsletter: false,
    },
  })

  const onSubmit = (data: DemoFormData) => {
    console.log("Form submitted:", data)
    toast({
      title: "Form Submitted Successfully!",
      description: "All validation passed. Check console for form data.",
    })
  }

  const handleEmailValidation = (isValid: boolean, message?: string) => {
    setEmailValid(isValid)
    if (!isValid && message) {
      console.log("Email validation:", message)
    }
  }

  const handleBudgetChange = (value: number | null, formatted: string) => {
    if (value !== null) {
      form.setValue("budget", value)
    }
    console.log("Budget changed:", { value, formatted })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-secondary">Enterprise Form Components Demo</h1>
        <p className="text-muted-foreground">
          Showcase of enterprise-level form components with live validation, consistent styling, and enhanced UX.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Personal Information Section */}
          <FormSection
            title="Personal Information"
            description="Basic contact details and personal information"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Email Address *</FormLabel>
                    <FormControl>
                      <EmailInput
                        {...field}
                        onValidityChange={handleEmailValidation}
                        showValidation={true}
                      />
                    </FormControl>
                    <FormDescription>
                      We'll use this email for project communications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary font-medium">Phone Number *</FormLabel>
                  <FormControl>
                    <PhoneInput
                      {...field}
                      countryCode="+967"
                    />
                  </FormControl>
                  <FormDescription>
                    Include country code for international calls
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Business Information Section */}
          <FormSection
            title="Business Information"
            description="Company details and professional background"
            collapsible
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
              </svg>
            }
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your company or organization"
                        {...field}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Position/Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your job title or role"
                        {...field}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary font-medium">Industry</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Project Details Section */}
          <FormSection
            title="Project Details"
            description="Information about your project and budget"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Project Type *</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                          <SelectItem value="web-app">Web Application</SelectItem>
                          <SelectItem value="website">Website Development</SelectItem>
                          <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                          <SelectItem value="crm">CRM System</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Project Budget *</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        currency={budgetCurrency}
                        locale="ar-YE"
                        onChange={handleBudgetChange}
                        allowNegative={false}
                        maxDigits={8}
                      />
                    </FormControl>
                    <FormDescription>
                      <div className="flex gap-2 mt-2">
                        <button 
                          type="button"
                          onClick={() => setBudgetCurrency('YER')}
                          className={`text-xs px-2 py-1 rounded ${budgetCurrency === 'YER' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                        >
                          YER
                        </button>
                        <button 
                          type="button"
                          onClick={() => setBudgetCurrency('USD')}
                          className={`text-xs px-2 py-1 rounded ${budgetCurrency === 'USD' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                        >
                          USD
                        </button>
                        <button 
                          type="button"
                          onClick={() => setBudgetCurrency('SAR')}
                          className={`text-xs px-2 py-1 rounded ${budgetCurrency === 'SAR' ? 'bg-primary text-white' : 'bg-gray-100'}`}
                        >
                          SAR
                        </button>
                      </div>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          {/* Timeline Section */}
          <FormSection
            title="Project Timeline"
            description="Important dates for project planning"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Preferred Start Date *</FormLabel>
                    <FormControl>
                      <DateTimeInput
                        type="date"
                        minDate={new Date()}
                        onChange={(date) => field.onChange(date)}
                        showNow={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-secondary font-medium">Project Deadline *</FormLabel>
                    <FormControl>
                      <DateTimeInput
                        type="datetime-local"
                        minDate={new Date()}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormDescription>
                      When do you need the project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          {/* Additional Information Section */}
          <FormSection
            title="Additional Information"
            description="Project details and special requirements"
            collapsible
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary font-medium">Project Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe your project, goals, and key features..."
                      {...field}
                      className="focus:ring-2 focus:ring-primary resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum 10 characters. Be as detailed as possible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary font-medium">Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Any specific technical requirements, integrations, or constraints..."
                      {...field}
                      className="focus:ring-2 focus:ring-primary resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communicationMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-secondary font-medium">Preferred Communication</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="How would you like us to contact you?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Calls</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="video">Video Calls</SelectItem>
                        <SelectItem value="in-person">In-Person Meetings</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Submit Section */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <Button type="submit" className="btn-primary flex-1">
              Submit Project Request
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </Form>

      {/* Form State Debug */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Form State (Development)</h3>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div>
            <strong>Form Valid:</strong> {form.formState.isValid ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Email Valid:</strong> {emailValid ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Errors:</strong> {Object.keys(form.formState.errors).length}
          </div>
          <div>
            <strong>Touched Fields:</strong> {Object.keys(form.formState.touchedFields).length}
          </div>
        </div>
      </div>
    </div>
  )
}