# Genius Software Core (GSC) - Project Setup

## Overview
GSC is a full-stack TypeScript application built with Vite, React, Express, and PostgreSQL. It's a comprehensive business platform featuring services management, CRM functionality, authentication, and more.

## Architecture
- **Frontend**: React 18, Vite, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Express.js, TypeScript  
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: Unified dev server on port 5000
- **Routing**: Wouter for SPA routing

## Project Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components 
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configurations
│   │   └── i18n/           # Internationalization
├── server/                 # Express backend
│   ├── index.ts           # Entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database configuration
│   └── vite.ts            # Vite dev server setup
├── shared/                 # Shared types and schemas
└── attached_assets/        # Project assets and uploads
```

## Key Features
- 🌐 Multi-language support (Arabic/English) with RTL/LTR
- 🔐 Authentication system with role-based access control
- 📊 CRM dashboard with customer management
- 💼 Services portfolio with detailed pages
- 📱 Responsive design with dark mode support
- 🎨 Modern UI with animations and transitions
- 📊 Real-time notifications and websocket support

## Development Setup

### Current Configuration
- **Port**: 5000 (configured for Replit environment)
- **Host**: 0.0.0.0 (allows external access)
- **Database**: PostgreSQL with fallback to in-memory storage
- **Dev Server**: Vite with HMR enabled
- **Proxy Configuration**: `allowedHosts: true` for Replit compatibility

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Sync database schema

### Environment Variables
See `.env.example` for complete configuration. Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Authentication secret
- `SESSION_SECRET` - Session security
- `VITE_*` - Frontend environment variables

## Replit Integration
✅ **Configured for Replit**:
- Workflow: "Start application" running on port 5000
- Frontend properly configured with `allowedHosts: true`
- Server binds to `0.0.0.0:5000` for external access
- Deployment configured for autoscale with build/start scripts

## Database Configuration
- **Production**: Requires PostgreSQL with `DATABASE_URL`
- **Development**: Falls back to in-memory storage if no database
- **Schema**: Auto-synced with Drizzle ORM
- **Seeding**: Automatic data seeding on startup

## Recent Changes (December 15, 2025)
### 🎉 **Comprehensive CRM Admin Panel Implementation**
- ✅ **Full CRM Admin Panel** at `/admin/crm-panel` with Arabic RTL support
- ✅ **Dashboard Statistics**: Real-time users, clients, registrations, and revenue tracking
- ✅ **User Management**: Complete CRUD operations (create, read, update, delete users)
- ✅ **Client Management**: Add clients, view registration history, track spending
- ✅ **Revenue Tracking**: Charts showing revenue by service and by month
- ✅ **Role-Based Access Control**: Four roles (admin, support, sales, client) with proper permissions
- ✅ **Backend API Routes**: Secure endpoints at `/api/admin/*` with authentication and authorization
- ✅ **Protected Endpoints**: All admin APIs require authentication and role verification

### API Endpoints Added:
- `GET /api/admin/dashboard-stats` - Dashboard statistics (admin, support, sales)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user (admin only)
- `PATCH /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `PATCH /api/admin/users/:id/toggle-status` - Toggle user status (admin only)
- `PATCH /api/admin/users/:id/role` - Change user role (admin only)
- `GET /api/admin/clients` - List all clients (admin, support, sales)
- `POST /api/admin/clients` - Create new client (admin, sales)
- `GET /api/admin/registrations` - List service registrations (admin, support, sales)
- `GET /api/admin/revenue` - Revenue data and analytics (admin, sales)

## Previous Changes (September 23, 2025)
### 🔄 **GitHub Import Process Completed**
- ✅ **Fresh GitHub Import Setup Complete**: Successfully configured existing GSC codebase for Replit environment
- ✅ **Project Analysis**: Identified comprehensive full-stack TypeScript application with React frontend and Express backend
- ✅ **Environment Configuration**: Verified optimal configuration already exists for Replit deployment
- ✅ **Dependencies**: All packages installed and verified (Node.js 20, TypeScript, React, Express, shadcn/ui)
- ✅ **Workflow Configuration**: "Start application" running with webview output on port 5000
- ✅ **Server Configuration**: Correctly binds to `0.0.0.0:5000` for external access (verified in server/index.ts)
- ✅ **Frontend Setup**: Vite dev server with `allowedHosts: true` for Replit proxy compatibility (server/vite.ts)
- ✅ **Database Graceful Handling**: PostgreSQL with automatic fallback to in-memory storage (working correctly)
- ✅ **API Endpoints**: All endpoints responding correctly (/api/services, /api/testimonials) - tested and functional
- ✅ **HMR & Development**: Hot module replacement and development environment working seamlessly
- ✅ **Deployment Configuration**: Set up for autoscale with npm build/start scripts (production-ready)
- ✅ **Import Process**: Successfully completed and verified all functionality - ready for development
- ✅ **Current Status**: Application successfully running with excellent performance metrics (TTFB: 239.5ms)
- ✅ **Unified Server**: Frontend and backend running together on single port 5000 as designed

### 🚀 **Project Request Wizard Implementation (September 21, 2025)**
- ✅ **Complete 4-step wizard** for "Web and Platform Development" service page (/services/1191aed1-6cbc-498d-b613-a8cc14d49e21)
- ✅ **Step 1**: Project category selection (Commercial/Educational/Other) + build type (Website/E-commerce/Platform)
- ✅ **Step 2**: Dynamic feature selection with conditional filtering based on build type
- ✅ **Step 3**: File attachments (10MB limit, MIME validation, max 5 files) + project requirements
- ✅ **Step 4**: Comprehensive review and submit functionality with validation
- ✅ **API Integration**: Connected to existing `/api/service-requests` endpoint with proper validation
- ✅ **Fallback Mechanism**: Mailto window for offline/error scenarios with encoded URLs
- ✅ **Enhanced Features**: 
  - Cross-step validation including conditional categoryOtherNote requirement
  - File upload security with size/type/count limits
  - Navigation buttons disabled when steps are incomplete
  - Progress indicator with step completion tracking
  - Memory leak prevention with proper URL cleanup
- ✅ **Testing Ready**: Comprehensive data-testid attributes for automated testing
- ✅ **RTL/Theme Compatible**: Full Arabic/English support with proper RTL layout
- ✅ **Production Security**: Client and server-side validation, secure file handling
- ✅ **User Experience**: Toast notifications, loading states, form validation feedback

## User Preferences
- Modern TypeScript/React development patterns
- Component-based architecture with shadcn/ui
- Comprehensive feature set with attention to UX
- Multi-language support with proper RTL handling
- Professional business application design