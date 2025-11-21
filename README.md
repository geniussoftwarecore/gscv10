# GSC (Genius Software Core) Platform

A comprehensive software development and CRM system with enterprise-grade mobile app service wizard, built with modern web technologies and full Arabic/RTL support.

## Stack & Design Profile (Auto-detected)

**Framework:** React 18 + Vite + TypeScript  
**UI System:** TailwindCSS + shadcn/ui + Radix UI components  
**Font:** Cairo (Local @fontsource) - ✅ *Self-hosted for production*  
**Theme/Palette:** Custom design system with CSS variables
- Primary: `hsl(213, 94%, 68%)` (GSC Light Blue)
- Primary Dark: `hsl(213, 87%, 60%)` (GSC Darker Blue)  
- Brand Sky: `hsl(204, 100%, 90%)` to `hsl(200, 100%, 73%)`
- Full dark/light mode support with CSS variables

**Architecture:** Full-stack TypeScript
- Backend: Express.js + PostgreSQL + Drizzle ORM
- Frontend: React + Wouter routing + Framer Motion animations
- Language: Arabic/English bilingual with complete RTL support
- Styling: Design tokens system (`shared/ui/tokens.ts`)

**✅ Production Ready:** All fonts are self-hosted using @fontsource/cairo for offline compatibility.

## 🚀 Mobile App Service Wizard

### Enterprise-Grade 3-Step Workflow

The GSC platform includes a comprehensive mobile app service wizard that meets enterprise standards:

**Step 1: App Type Selection**
- Interactive radio cards for app categories (business, ecommerce, education, healthcare, entertainment)
- Real-time feature suggestions based on selected type
- Fully accessible with keyboard navigation and screen reader support

**Step 2: Features Selection** 
- Dynamic feature lists tailored to selected app type
- Multi-select checkboxes with descriptions
- Advanced features like AI integration, IoT connectivity, blockchain support

**Step 3: Contact & Requirements**
- Complete contact form with validation
- File upload support (images, documents, PDFs - max 10MB, 5 files)
- Project summary review before submission
- Real-time form validation with Arabic/English error messages

### Key Features

✅ **Full RTL/Arabic Support**: Complete right-to-left language support with Arabic font rendering  
✅ **File Upload Security**: Multer-based secure file handling with MIME type validation  
✅ **Form State Management**: React Hook Form with Zod validation and real-time error handling  
✅ **Database Persistence**: PostgreSQL with Drizzle ORM for reliable data storage  
✅ **API Compatibility**: Supports both JSON and multipart FormData requests  
✅ **Enterprise Testing**: Comprehensive data-testid attributes for automated testing  
✅ **Error Handling**: Structured error responses with cleanup on failures  
✅ **Security Measures**: File type validation, size limits, and secure filename generation  

### API Endpoints

```typescript
// Create mobile app order
POST /api/mobile-app-orders
Content-Type: application/json | multipart/form-data

// Example JSON request:
{
  "customerName": "Ahmed Hassan", 
  "customerEmail": "ahmed@example.com",
  "customerPhone": "+966501234567",
  "appType": "business",
  "selectedFeatures": ["user_auth", "push_notifications", "analytics"],
  "additionalRequirements": "We need integration with existing ERP system"
}
```

### Database Schema

The `mobile_app_orders` table includes:
- Customer contact information
- App type and selected features (JSON array)
- File attachments metadata
- Status tracking and assignment fields
- Audit trails with created/updated timestamps
- Proper indexing for performance at scale

## 🌐 Web & Platforms Development Service Wizard

### Comprehensive 4-Step Web Development Workflow

The GSC platform includes a complete web development service wizard that mirrors the mobile app wizard's UX and functionality:

**Step 1: Website Type Selection**
- Professional website categories (corporate, ecommerce, portfolio, platform, webapp, landing)
- Real-time feature recommendations based on selected type
- Interactive cards with comprehensive descriptions

**Step 2: Features & Integrations**
- Dynamic feature selection tailored to website type
- Advanced integrations (payment systems, analytics, CMS, APIs)
- Multi-language and accessibility options
- E-commerce capabilities, user management systems

**Step 3: Technical Specifications**
- Content scope and complexity selection
- Domain and hosting preferences (managed vs. self-hosted)
- Language support (Arabic, English, multiple languages)
- Performance and scalability requirements

**Step 4: Contact & Project Details**
- Complete contact form with validation
- File upload support (designs, documents, references - max 10MB, 5 files)
- Project timeline and budget preferences
- Comprehensive project summary review

### Web Wizard Key Features

✅ **Mirrored UX Design**: Identical styling and interaction patterns as mobile wizard  
✅ **Comprehensive Options**: Complete web development service coverage  
✅ **Advanced Integrations**: Payment systems, analytics, CMS, custom APIs  
✅ **Multi-language Support**: Arabic/English with RTL support  
✅ **File Upload Security**: Same secure file handling as mobile wizard  
✅ **Form Validation**: React Hook Form with Zod validation throughout  
✅ **Database Persistence**: Dedicated `web_orders` table with full audit trails  
✅ **Enterprise Testing**: Complete data-testid attributes for automation  

### Web Development API Endpoints

```typescript
// Create web development order
POST /api/web-orders
Content-Type: application/json | multipart/form-data

// Example JSON request:
{
  "customerName": "Sarah Al-Mahmoud",
  "customerEmail": "sarah@company.sa", 
  "customerPhone": "+966501234567",
  "siteType": "ecommerce",
  "contentScope": "Comprehensive e-commerce platform with multi-vendor support",
  "domainHosting": "managed", 
  "languages": ["ar", "en"],
  "integrations": ["payment_gateway", "analytics", "crm"],
  "selectedFeatures": ["product_catalog", "inventory", "multi_vendor"],
  "notes": "Multi-vendor marketplace with Arabic/English support and payment integration"
}

// Create web project order (enterprise projects)
POST /api/web-project-orders
Content-Type: application/json | multipart/form-data

// Example for complex enterprise projects:
{
  "customerName": "Mohammed bin Rashid",
  "customerEmail": "m.rashid@enterprise.sa",
  "customerPhone": "+966501234567",
  "customerCompany": "Rashid Holdings",
  "projectType": "platform", 
  "projectName": "Enterprise Resource Platform",
  "projectDescription": "Comprehensive B2B platform for resource management",
  "targetAudience": "B2B enterprise clients",
  "selectedFeatures": ["user_management", "api_integration", "scalability"],
  "additionalRequirements": "Integration with SAP and custom APIs",
  "estimatedBudget": "100000-250000",
  "preferredTimeline": "6-12 months"
}

// File Upload Examples (multipart/form-data):

// Web orders with files (field name: 'attachments')
curl -X POST http://localhost:5000/api/web-orders \
  -F "customerName=Sarah Al-Mahmoud" \
  -F "customerEmail=sarah@company.sa" \
  -F "customerPhone=+966501234567" \
  -F "siteType=ecommerce" \
  -F "contentScope=Comprehensive e-commerce platform" \
  -F "domainHosting=managed" \
  -F "languages=[\"ar\",\"en\"]" \
  -F "integrations=[\"payment_gateway\",\"analytics\"]" \
  -F "selectedFeatures=[\"product_catalog\",\"inventory\"]" \
  -F "notes=Multi-vendor marketplace requirements" \
  -F "attachments=@design.png" \
  -F "attachments=@requirements.pdf"

// Web project orders with files (field name: 'attachedFiles')  
curl -X POST http://localhost:5000/api/web-project-orders \
  -F "customerName=Mohammed bin Rashid" \
  -F "customerEmail=m.rashid@enterprise.sa" \
  -F "projectType=platform" \
  -F "projectName=Enterprise Resource Platform" \
  -F "selectedFeatures=[\"user_management\",\"api_integration\"]" \
  -F "attachedFiles=@specifications.pdf" \
  -F "attachedFiles=@wireframes.pdf"

// File Limits: Max 5 files, 10MB each. Supported: images, PDF, DOC, DOCX, TXT
```

### Web Orders Database Schema

**web_orders table** (Web & Platforms Development Service Wizard):
- Customer contact information (name, email, phone)
- Website type and technical specifications (siteType)
- Content scope and domain/hosting preferences  
- Language support and integration requirements (JSON arrays)
- Selected features array (JSON) with comprehensive options
- File attachments metadata (uploads as 'attachments' field)
- Additional notes and requirements
- Status management and assignment workflows
- Full audit trails with performance indexing

**web_project_orders table** (Enterprise Projects):
- Customer contact and company information  
- Project details (name, description, target audience)
- Selected features and additional requirements
- File attachments metadata (uploads as 'attachedFiles' field)
- Budget and timeline tracking (estimatedBudget, preferredTimeline)
- Priority and status management
- Assignment and audit trails

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Create admin user
./scripts/run.sh admin:create

# Start development server
npm run dev
```

## Admin User Management

### Initial Admin Setup

Create the primary admin user with secure password hashing:

```bash
# Set admin credentials in .env file
ADMIN_USERNAME=admin@yourcompany.com
ADMIN_PASSWORD=YourSecurePassword123!

# Create admin user
./scripts/run.sh admin:create
```

### Password Reset

Reset admin password securely:

```bash
# Interactive password reset
./scripts/run.sh admin:reset-password

# Non-interactive reset (for automation)
./scripts/run.sh admin:reset-password "NewSecurePassword123!"
```

### Demo Data

Seed demo data for development:

```bash
./scripts/run.sh seed:demo
```

## Security Features

- **Secure Password Hashing**: Uses argon2id with configurable parameters
- **Password Policy**: Enforces strong password requirements
- **Environment-based Configuration**: Sensitive data managed through environment variables
- **Separation of Concerns**: Demo data seeding separated from production admin creation

## Environment Variables

Key security-related environment variables:

```bash
# Admin Provisioning
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=Change!This!Strong!Password123
ADMIN_NAME=System Administrator
ADMIN_FORCE_CHANGE=true

# Password Security (argon2)
ARGON2_MEMORY_COST=65536
ARGON2_TIME_COST=3
ARGON2_PARALLELISM=4
ARGON2_HASH_LENGTH=32
```

## Database

The application supports PostgreSQL with automatic fallback to in-memory storage for development.

```bash
# Database setup
DATABASE_URL=postgresql://user:password@localhost:5432/gsc

# Run migrations
./scripts/run.sh db:migrate
```

## Development

```bash
# Development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build
```

## System Health

Run preflight checks to validate system health:

```bash
./scripts/run.sh preflight
```

## User Provisioning

### Setup Requirements

1. **Copy environment configuration:**
   ```bash
   cp .env.example .env
   ```
   
2. **Fill in database and admin variables in `.env`:**
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=Change!This!Strong!Password123
   ADMIN_NAME=System Administrator
   ADMIN_FORCE_CHANGE=true
   ```

3. **Run database migrations:**
   ```bash
   npm run db:push
   ```

### Create Admin User

Create admin user using two methods:

#### Method 1: Environment-driven (Recommended)
```bash
# Set variables in .env file, then run:
tsx scripts/admin-create.ts
```

#### Method 2: CLI-driven
```bash
tsx scripts/admin-create.ts --email admin@yourdomain.com --password "S7rong!Pass" --forceChange
```

### Reset Admin Password

Reset admin password when needed:

```bash
tsx scripts/admin-reset.ts --email admin@yourdomain.com --password "N3w!StrongPass" --forceChange
```

### Demo Data (Optional)

Add sample data for development (does NOT touch admin users):

```bash
tsx scripts/seed-demo.ts
```

### Password Policy

Passwords must meet these requirements:
- At least 8 characters long
- Contains uppercase letters (A-Z)
- Contains lowercase letters (a-z)
- Contains numbers (0-9)
- Contains special characters (!@#$%^&*()_+-=[]{}|;':",./<>?)
- Does not contain common patterns (password, admin, 123456, etc.)

**Example strong passwords:**
- `MyS3cur3P@ssw0rd!`
- `Tr0ub4dor&3`
- `C0mplex!Pa$$w0rd2024`

### Authentication Integration

The login system uses `verifyPassword()` from `server/security/password.ts` and enforces the `force_password_change` flag. When this flag is set to true, users must change their password on first login.

---

## 🏗️ Mobile App Wizard Architecture 

### Technical Implementation

**Frontend Architecture:**
- **React Hook Form**: State management with Zod validation
- **Step-by-step wizard**: Progressive disclosure with smooth transitions
- **File Upload Component**: Drag & drop with progress indicators
- **RTL Support**: Complete Arabic language integration with Cairo font
- **Responsive Design**: Mobile-first approach with TailwindCSS + shadcn/ui

**Backend Architecture:**
- **Express.js API**: RESTful endpoints with structured error handling
- **Multer File Processing**: Secure multipart FormData handling
- **PostgreSQL Database**: Drizzle ORM with proper indexing and relationships
- **Security Measures**: File type validation, size limits, secure filename generation

**Key Files:**
```
client/src/pages/services/mobile.tsx           # Main wizard page
client/src/components/services/mobile/wizard/  # Wizard components
server/routes.ts                               # API endpoints
shared/schema.ts                              # Database schemas
uploads/mobile-app-orders/                    # File storage directory
```

### Security Features Implemented

✅ **File Upload Security:**
- MIME type validation (images, PDFs, documents only)
- File size limits (10MB per file, max 5 files)
- Secure filename generation with timestamps
- Upload directory sandboxing
- Error cleanup on failed uploads

✅ **Data Validation:**
- Zod schemas for type-safe validation
- JSON string parsing for selectedFeatures array
- SQL injection prevention via ORM
- Structured error responses

✅ **Enterprise Standards:**
- Comprehensive data-testid attributes for automation
- Both JSON and multipart FormData API support
- Database persistence with audit trails
- Form state synchronization bug fixes

### Future Enhancements (Recommended)

The architect review identified optional security hardening opportunities:

1. **File Type Verification**: Magic byte validation instead of relying on MIME types
2. **Malware Scanning**: AV integration for uploaded files  
3. **Rate Limiting**: Per-IP request throttling and CAPTCHA integration
4. **Scalability**: S3-compatible storage with signed URLs

For detailed documentation, see the `/docs` directory.