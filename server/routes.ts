import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { AuthenticatedRequest, requireAuth, requireRole, loginUser } from "./auth";
import { DatabaseStorage } from "./database-storage";
import crmRoutes from "../crm_api/routes";
import authRoutes from "./routes/auth";
import billingRoutes from "./routes/billing";
import stripeWebhookRoutes from "./routes/stripeWebhook";
import healthRoutes, { trackMetrics } from "./routes/health";
import enhancedCrmRoutes from "../crm_api/crmRoutes";
import exportsRoutes from "./routes/exports";
import savedViewsRoutes from "./routes/savedViews";
import enterpriseTableRoutes from "./routes/enterpriseTableRoutes";
import { 
  insertContactSubmissionSchema, 
  insertServiceRequestSchema,
  insertServiceSchema,
  insertLeadSchema,
  insertContactSchema,
  insertAccountSchema,
  insertOpportunitySchema,
  insertTaskSchema,
  insertCrmActivitySchema,
  insertUserSchema,
  insertSavedFilterSchema,
  insertMobileAppOrderSchema,
  insertWebProjectOrderSchema,
  insertWebOrderSchema,
  insertDesktopOrderSchema,
  insertGraphicsDesignRequestSchema
} from "@shared/schema";
import { z } from "zod";
import { createObjectCsvWriter } from 'csv-writer';
import { generateToken } from "./auth";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads/mobile-app-orders');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const webProjectUploadsDir = path.join(process.cwd(), 'uploads/web-project-orders');
if (!fs.existsSync(webProjectUploadsDir)) {
  fs.mkdirSync(webProjectUploadsDir, { recursive: true });
}

const webUploadsDir = path.join(process.cwd(), 'uploads/web-orders');
if (!fs.existsSync(webUploadsDir)) {
  fs.mkdirSync(webUploadsDir, { recursive: true });
}

const desktopUploadsDir = path.join(process.cwd(), 'uploads/desktop-orders');
if (!fs.existsSync(desktopUploadsDir)) {
  fs.mkdirSync(desktopUploadsDir, { recursive: true });
}

const graphicsDesignUploadsDir = path.join(process.cwd(), 'uploads/graphics-design-orders');
if (!fs.existsSync(graphicsDesignUploadsDir)) {
  fs.mkdirSync(graphicsDesignUploadsDir, { recursive: true });
}

// Configure multer for mobile app orders
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExtension}`);
  }
});

// File validation
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files
  }
});

// Configure multer for web project orders
const webProjectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, webProjectUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExtension}`);
  }
});

const webProjectUpload = multer({
  storage: webProjectStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files
  }
});

// Configure multer for web orders (Web & Platforms Development Service Wizard)
const webOrderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, webUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExtension}`);
  }
});

const webUpload = multer({
  storage: webOrderStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files
  }
});

// Configure multer for desktop orders
const desktopOrderStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, desktopUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExtension}`);
  }
});

const desktopUpload = multer({
  storage: desktopOrderStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files
  }
});

// Configure multer for graphics design orders
const graphicsDesignStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, graphicsDesignUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
    cb(null, `${cleanBaseName}-${uniqueSuffix}${fileExtension}`);
  }
});

const uploadGraphicsDesign = multer({
  storage: graphicsDesignStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files
  }
});

// Error codes enum for consistent error handling
enum ServiceErrorCodes {
  SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND',
  SERVICE_DUPLICATE = 'SERVICE_DUPLICATE',
  SERVICE_DELETED = 'SERVICE_DELETED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR'
}

// Helper function for structured error responses
function createErrorResponse(
  success: boolean = false,
  message: string,
  code: ServiceErrorCodes,
  details?: any,
  errors?: any[]
) {
  return {
    success,
    message,
    code,
    details,
    errors,
    timestamp: new Date().toISOString()
  };
}

// Helper function to map database errors to structured responses
function mapDatabaseError(error: any): { status: number; response: any } {
  // Generate a unique error ID for server-side tracking
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Log the full error details server-side for debugging
  console.error(`Database error [${errorId}]:`, {
    message: error.message,
    code: error.code,
    constraint: error.constraint,
    detail: error.detail,
    stack: error.stack
  });
  
  // PostgreSQL specific error code mapping
  if (error.code === '23505') { // unique_violation
    return {
      status: 409,
      response: createErrorResponse(
        false,
        "A service with this title and category already exists",
        ServiceErrorCodes.SERVICE_DUPLICATE,
        errorId
      )
    };
  }
  
  if (error.code === '23503') { // foreign_key_violation
    return {
      status: 400,
      response: createErrorResponse(
        false,
        "Invalid reference to related data",
        ServiceErrorCodes.VALIDATION_ERROR,
        errorId
      )
    };
  }
  
  if (error.code === '23502') { // not_null_violation
    return {
      status: 400,
      response: createErrorResponse(
        false,
        "Required field is missing",
        ServiceErrorCodes.VALIDATION_ERROR,
        errorId
      )
    };
  }
  
  // Application-level error handling
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('not found') || message.includes('deleted')) {
    return {
      status: 404,
      response: createErrorResponse(
        false,
        "Service not found or has been deleted",
        ServiceErrorCodes.SERVICE_NOT_FOUND,
        errorId
      )
    };
  }
  
  // Default to internal server error for unknown cases
  return {
    status: 500,
    response: createErrorResponse(
      false,
      "Database operation failed",
      ServiceErrorCodes.DATABASE_ERROR,
      errorId
    )
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  console.log('=== REGISTERING ALL ROUTES ===');
  
  // Add metrics tracking middleware
  app.use(trackMetrics());

  // Authentication endpoints
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const result = await loginUser(username, password, storage.instance as DatabaseStorage);
      
      if (!result) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json(result);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.extend({
        password: z.string().min(6, "Password must be at least 6 characters")
      }).parse(req.body);
      
      const existingUser = await storage.instance.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.instance.createUser(validatedData);
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        success: true, 
        data: userWithoutPassword,
        message: "User created successfully" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  app.get("/api/me", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.instance.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", (req, res) => {
    // Redirect to Google OAuth
    const googleClientId = process.env.GOOGLE_CLIENT_ID || 'demo-client-id';
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const scope = 'email profile';
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code&access_type=offline`;
    
    res.redirect(googleAuthUrl);
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      const { code } = req.query;
      
      if (!code) {
        return res.redirect('/login?error=oauth_cancelled');
      }

      // For demo purposes, we'll simulate successful OAuth
      // In production, you would exchange the code for tokens and get user info
      const demoUser = {
        id: 'google-user-123',
        email: 'user@gmail.com',
        name: 'Google User',
        role: 'client' as const
      };

      const token = generateToken(demoUser);
      
      // Redirect to frontend with token
      res.redirect(`/dashboard?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect('/login?error=oauth_failed');
    }
  });

  // Mount new authentication and billing routes
  app.use("/api/auth", authRoutes);
  app.use("/api/billing", billingRoutes);
  app.use("/api/stripe", stripeWebhookRoutes);
  app.use("/api/health", healthRoutes);
  
  // Mount new CRM routes
  app.use("/api/crm", crmRoutes);
  app.use("/api/crm", enhancedCrmRoutes);
  
  // Mount export and saved views routes
  app.use("/api", exportsRoutes);
  app.use("/api", savedViewsRoutes);
  
  // Contact form submission - Creates CRM Lead
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      // Create the contact submission for record keeping
      const submission = await storage.instance.createContactSubmission(validatedData);
      
      // Create a CRM Lead from the contact form with enhanced data
      try {
        const leadData = {
          firstName: validatedData.name.split(' ')[0] || validatedData.name,
          lastName: validatedData.name.split(' ').slice(1).join(' ') || '',
          primaryEmail: validatedData.email,
          phones: validatedData.phone ? [validatedData.phone] : [],
          company: validatedData.company || '',
          jobTitle: '',
          leadSource: validatedData.leadSource || 'website_contact_form',
          leadStatus: 'new',
          leadRating: 'warm',
          leadScore: 50, // Default score for website leads
          estimatedValue: validatedData.budget ? parseFloat(validatedData.budget.replace(/[^\d.]/g, '')) : 0,
          description: validatedData.message,
          utm: validatedData.utm || {
            source: 'direct',
            medium: 'website'
          }
        };

        if (storage.instance.createLead) {
          const lead = await storage.instance.createLead(leadData);
          console.log('CRM Lead created successfully:', lead.id);
        }
      } catch (leadError) {
        // Don't fail the entire request if lead creation fails
        console.error('Failed to create CRM lead from contact form:', leadError);
      }
      
      res.json({ success: true, data: submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Mobile App Orders - Create new mobile app order
  app.post("/api/mobile-app-orders", upload.array('attachedFiles', 5), async (req, res) => {
    try {
      let validatedData;
      
      // Handle both FormData (with files) and regular JSON data
      if (req.is('multipart/form-data')) {
        // Extract form data and files
        const formData = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Parse selectedFeatures from JSON string to array
        let selectedFeatures: string[] = [];
        if (formData.selectedFeatures) {
          try {
            selectedFeatures = JSON.parse(formData.selectedFeatures);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid selectedFeatures format. Must be valid JSON array."
            });
          }
        }
        
        // Process uploaded files
        const attachedFiles = files?.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date().toISOString()
        })) || [];
        
        // Prepare data for validation
        const requestData = {
          ...formData,
          selectedFeatures,
          attachedFiles
        };
        
        // Validate with Zod schema
        validatedData = insertMobileAppOrderSchema.parse(requestData);
        
      } else {
        // Regular JSON data
        validatedData = insertMobileAppOrderSchema.parse(req.body);
      }
        
      // Create the mobile app order
      const order = await storage.instance.createMobileAppOrder(validatedData);
      
      res.json({ 
        success: true, 
        data: order,
        message: "Mobile app order created successfully"
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) console.error('Failed to delete uploaded file:', unlinkError);
          });
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB per file."
          });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            success: false,
            message: "Too many files. Maximum 5 files allowed."
          });
        } else {
          res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
          });
        }
      } else {
        console.error('Mobile app order creation error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });


  // Web Project Orders - Create new web project order  
  app.post("/api/web-project-orders", webProjectUpload.array('attachedFiles', 5), async (req, res) => {
    try {
      let validatedData;
      
      // Handle both FormData (with files) and regular JSON data
      if (req.is('multipart/form-data')) {
        // Extract form data and files
        const formData = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Parse selectedFeatures from JSON string to array
        let selectedFeatures: string[] = [];
        if (formData.selectedFeatures) {
          try {
            selectedFeatures = JSON.parse(formData.selectedFeatures);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid selectedFeatures format. Must be valid JSON array."
            });
          }
        }
        
        // Process uploaded files
        const attachedFiles = files?.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date().toISOString()
        })) || [];
        
        // Prepare data for validation
        const requestData = {
          ...formData,
          selectedFeatures,
          attachedFiles
        };
        
        // Validate with Zod schema
        validatedData = insertWebProjectOrderSchema.parse(requestData);
        
      } else {
        // Regular JSON data
        validatedData = insertWebProjectOrderSchema.parse(req.body);
      }
        
      // Create the web project order
      const order = await storage.instance.createWebProjectOrder(validatedData);
      
      res.json({ 
        success: true, 
        data: order,
        message: "Web project order created successfully"
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) console.error('Failed to delete uploaded file:', unlinkError);
          });
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB per file."
          });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            success: false,
            message: "Too many files. Maximum 5 files allowed."
          });
        } else {
          res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
          });
        }
      } else {
        console.error('Web project order creation error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Web Orders - Create new web order (for Web & Platforms Development Service Wizard)
  app.post("/api/web-orders", webUpload.array('attachments', 5), async (req, res) => {
    try {
      let validatedData;
      
      // Handle both FormData (with files) and regular JSON data
      if (req.is('multipart/form-data')) {
        // Extract form data and files
        const formData = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Parse selectedFeatures from JSON string to array
        let selectedFeatures: string[] = [];
        if (formData.selectedFeatures) {
          try {
            selectedFeatures = JSON.parse(formData.selectedFeatures);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid selectedFeatures format. Must be valid JSON array."
            });
          }
        }

        // Parse languages from JSON string to array
        let languages: string[] = ["ar"];
        if (formData.languages) {
          try {
            languages = JSON.parse(formData.languages);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid languages format. Must be valid JSON array."
            });
          }
        }

        // Parse integrations from JSON string to array
        let integrations: string[] = [];
        if (formData.integrations) {
          try {
            integrations = JSON.parse(formData.integrations);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid integrations format. Must be valid JSON array."
            });
          }
        }
        
        // Process uploaded files
        const attachments = files?.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date().toISOString()
        })) || [];
        
        // Prepare data for validation
        const requestData = {
          ...formData,
          selectedFeatures,
          languages,
          integrations,
          attachments
        };
        
        // Validate with Zod schema
        validatedData = insertWebOrderSchema.parse(requestData);
        
      } else {
        // Regular JSON data
        validatedData = insertWebOrderSchema.parse(req.body);
      }
        
      // Create the web order
      const order = await storage.instance.createWebOrder(validatedData);
      
      res.json({ 
        success: true, 
        data: order,
        message: "Web order created successfully"
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) console.error('Failed to delete uploaded file:', unlinkError);
          });
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB per file."
          });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            success: false,
            message: "Too many files. Maximum 5 files allowed."
          });
        } else {
          res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
          });
        }
      } else {
        console.error('Web order creation error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Desktop Orders - Create new desktop order
  app.post("/api/desktop-orders", desktopUpload.array('attachments', 5), async (req, res) => {
    try {
      let validatedData;
      
      // Handle both FormData (with files) and regular JSON data
      if (req.is('multipart/form-data')) {
        // Extract form data and files
        const formData = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Parse selectedFeatures from JSON string to array
        let selectedFeatures: string[] = [];
        if (formData.selectedFeatures) {
          try {
            selectedFeatures = JSON.parse(formData.selectedFeatures);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid selectedFeatures format. Must be valid JSON array."
            });
          }
        }
        
        // Process uploaded files
        const attachments = files?.map(file => ({
          id: Math.random().toString(36).substr(2, 9),
          filename: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date().toISOString()
        })) || [];
        
        // Prepare data for validation
        const requestData = {
          ...formData,
          selectedFeatures,
          attachments
        };
        
        // Validate with Zod schema
        validatedData = insertDesktopOrderSchema.parse(requestData);
        
      } else {
        // Regular JSON data
        validatedData = insertDesktopOrderSchema.parse(req.body);
      }
        
      // Create the desktop order
      const order = await storage.instance.createDesktopOrder(validatedData);
      
      res.json({ 
        success: true, 
        data: order,
        message: "Desktop order created successfully"
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) console.error('Failed to delete uploaded file:', unlinkError);
          });
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB per file."
          });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            success: false,
            message: "Too many files. Maximum 5 files allowed."
          });
        } else {
          res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
          });
        }
      } else {
        console.error('Desktop order creation error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Graphics Design Orders - Create new graphics design request
  app.post("/api/graphics-design-orders", uploadGraphicsDesign.array('attachments', 5), async (req, res) => {
    try {
      let validatedData;
      
      // Handle both FormData (with files) and regular JSON data
      if (req.is('multipart/form-data')) {
        // Extract form data and files
        const formData = req.body;
        const files = req.files as Express.Multer.File[];
        
        // Parse selectedFeatures from JSON string to array
        let selectedFeatures: string[] = [];
        if (formData.selectedFeatures) {
          try {
            selectedFeatures = JSON.parse(formData.selectedFeatures);
          } catch (parseError) {
            return res.status(400).json({
              success: false,
              message: "Invalid selectedFeatures format. Must be valid JSON array."
            });
          }
        }
        
        // Process uploaded files
        const attachments = files?.map(file => file.filename) || [];
        
        // Prepare data for validation
        const requestData = {
          ...formData,
          selectedFeatures,
          attachments
        };
        
        // Validate with Zod schema
        validatedData = insertGraphicsDesignRequestSchema.parse(requestData);
        
      } else {
        // Regular JSON data
        validatedData = insertGraphicsDesignRequestSchema.parse(req.body);
      }
        
      // Create the graphics design request
      const request = await storage.instance.createGraphicsDesignRequest(validatedData);
      
      res.json({ 
        success: true, 
        data: request,
        message: "Graphics design request created successfully"
      });
    } catch (error) {
      // Clean up uploaded files on error
      if (req.files) {
        const files = req.files as Express.Multer.File[];
        files.forEach(file => {
          fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) console.error('Failed to delete uploaded file:', unlinkError);
          });
        });
      }
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 10MB per file."
          });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          res.status(400).json({
            success: false,
            message: "Too many files. Maximum 5 files allowed."
          });
        } else {
          res.status(400).json({
            success: false,
            message: `File upload error: ${error.message}`
          });
        }
      } else {
        console.error('Graphics design request creation error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get graphics design requests
  app.get("/api/graphics-design-orders", requireAuth, async (req, res) => {
    try {
      const requests = await storage.instance.getGraphicsDesignRequests();
      res.json({ 
        success: true, 
        data: requests 
      });
    } catch (error) {
      console.error('Graphics design requests fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch graphics design requests" 
      });
    }
  });

  // MOVED TO AFTER SPECIFIC SERVICE ENDPOINT

  // Get all portfolio items
  app.get("/api/portfolio", async (req, res) => {
    try {
      const { category } = req.query;
      let portfolioItems;
      
      if (category && typeof category === 'string') {
        portfolioItems = await storage.instance.getPortfolioItemsByCategory(category);
      } else {
        portfolioItems = await storage.instance.getAllPortfolioItems();
      }
      
      res.json(portfolioItems);
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch portfolio items" 
      });
    }
  });

  // Get portfolio item by slug
  app.get("/api/portfolio/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const portfolioItems = await storage.instance.getAllPortfolioItems();
      const item = portfolioItems.find(p => p.slug === slug);
      
      if (!item) {
        return res.status(404).json({ 
          success: false, 
          message: "Portfolio item not found" 
        });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Portfolio item fetch error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch portfolio item" 
      });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.instance.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch testimonials" 
      });
    }
  });

  console.log('Registering /api/services/:id endpoint');
  
  // Get service by ID - MOVED TO TOP
  app.get("/api/services/:id", async (req, res) => {
    console.log('=== SERVICE BY ID REQUEST RECEIVED ===');
    try {
      const { id } = req.params;
      console.log('Looking for service ID:', id);
      console.log('Storage instance type:', storage.instance.constructor.name);
      
      // Check if getAllServices method exists
      if (typeof storage.instance.getAllServices !== 'function') {
        console.error('getAllServices method not found on storage instance');
        return res.status(500).json({ 
          success: false, 
          message: "Storage method not available" 
        });
      }
      
      const services = await storage.instance.getAllServices();
      console.log('Found services count:', services.length);
      const service = services.find(s => s.id === id);
      
      if (!service) {
        console.log('Service not found with ID:', id);
        return res.status(404).json(createErrorResponse(
          false,
          "Service not found",
          ServiceErrorCodes.SERVICE_NOT_FOUND,
          `Service with ID ${id} not found`
        ));
      }
      
      console.log('Found service:', service.title);
      res.json(service);
    } catch (error) {
      console.error('Service fetch error:', error);
      res.status(500).json(createErrorResponse(
        false,
        "Failed to fetch service",
        ServiceErrorCodes.INTERNAL_ERROR,
        'Service retrieval failed'
      ));
    }
  });
  
  // Get all services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.instance.getAllServices();
      res.json({
        success: true,
        data: services,
        total: services.length
      });
    } catch (error) {
      console.error('Get all services error:', error);
      res.status(500).json(createErrorResponse(
        false,
        "Failed to fetch services",
        ServiceErrorCodes.INTERNAL_ERROR,
        'Services retrieval failed'
      ));
    }
  });

  // Create new service - Requires authentication and admin/manager role
  app.post("/api/services", requireAuth, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res) => {
    try {
      // Validate request body
      const validatedData = insertServiceSchema.parse(req.body);
      
      // Prepare audit information
      const auditInfo = {
        userId: req.user?.id,
        userName: req.user?.username,
        userRole: req.user?.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        reason: req.body.reason || 'Service created via API'
      };

      // Create service with audit logging
      const service = await storage.instance.createService(validatedData, auditInfo);
      
      res.status(201).json({
        success: true,
        data: service,
        message: "Service created successfully"
      });
    } catch (error) {
      console.error('Create service error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse(
          false,
          "Validation error",
          ServiceErrorCodes.VALIDATION_ERROR,
          error.issues,
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        ));
      }
      
      if (error instanceof Error) {
        const mappedError = mapDatabaseError(error);
        return res.status(mappedError.status).json(mappedError.response);
      }
      
      res.status(500).json(createErrorResponse(
        false,
        "Failed to create service",
        ServiceErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  });

  // Update service - Requires authentication and admin/manager role
  app.put("/api/services/:id", requireAuth, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body (partial update)
      const validatedData = insertServiceSchema.partial().parse(req.body);
      
      // Prepare audit information
      const auditInfo = {
        userId: req.user?.id,
        userName: req.user?.username,
        userRole: req.user?.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        reason: req.body.reason || 'Service updated via API'
      };

      // Update service with audit logging
      const service = await storage.instance.updateService(id, validatedData, auditInfo);
      
      res.json({
        success: true,
        data: service,
        message: "Service updated successfully"
      });
    } catch (error) {
      console.error('Update service error:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json(createErrorResponse(
          false,
          "Validation error",
          ServiceErrorCodes.VALIDATION_ERROR,
          error.issues,
          error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        ));
      }
      
      if (error instanceof Error) {
        const mappedError = mapDatabaseError(error);
        return res.status(mappedError.status).json(mappedError.response);
      }
      
      res.status(500).json(createErrorResponse(
        false,
        "Failed to update service",
        ServiceErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  });

  // Delete service (soft delete) - Requires authentication and admin/manager role
  app.delete("/api/services/:id", requireAuth, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      // Prepare audit information
      const auditInfo = {
        userId: req.user?.id,
        userName: req.user?.username,
        userRole: req.user?.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        reason: req.body.reason || 'Service deleted via API'
      };

      // Delete service with audit logging
      const success = await storage.instance.deleteService(id, auditInfo);
      
      if (!success) {
        return res.status(404).json(createErrorResponse(
          false,
          "Service not found or already deleted",
          ServiceErrorCodes.SERVICE_NOT_FOUND,
          'Service deletion failed - service not found or already deleted'
        ));
      }
      
      res.json({
        success: true,
        message: "Service deleted successfully"
      });
    } catch (error) {
      console.error('Delete service error:', error);
      
      if (error instanceof Error) {
        const mappedError = mapDatabaseError(error);
        return res.status(mappedError.status).json(mappedError.response);
      }
      
      res.status(500).json(createErrorResponse(
        false,
        "Failed to delete service",
        ServiceErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  });

  // Restore service - Requires authentication and admin/manager role
  app.post("/api/services/:id/restore", requireAuth, requireRole(['admin', 'manager']), async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      // Prepare audit information
      const auditInfo = {
        userId: req.user?.id,
        userName: req.user?.username,
        userRole: req.user?.role,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        reason: req.body.reason || 'Service restored via API'
      };

      // Restore service with audit logging
      const service = await storage.instance.restoreService(id, auditInfo);
      
      res.json({
        success: true,
        data: service,
        message: "Service restored successfully"
      });
    } catch (error) {
      console.error('Restore service error:', error);
      
      if (error instanceof Error) {
        const mappedError = mapDatabaseError(error);
        return res.status(mappedError.status).json(mappedError.response);
      }
      
      res.status(500).json(createErrorResponse(
        false,
        "Failed to restore service",
        ServiceErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  });

  // Service Subcategories API Routes
  
  // Get all service subcategories
  app.get("/api/service-subcategories", async (req, res) => {
    try {
      const subcategories = await storage.instance.getAllServiceSubcategories();
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch service subcategories" 
      });
    }
  });

  // Get service subcategories by service ID
  app.get("/api/service-subcategories/by-service/:serviceId", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const subcategories = await storage.instance.getServiceSubcategoriesByService(serviceId);
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch service subcategories" 
      });
    }
  });

  // Get service subcategories by category
  app.get("/api/service-subcategories/by-category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const subcategories = await storage.instance.getServiceSubcategoriesByCategory(category);
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch service subcategories" 
      });
    }
  });

  // Get single service subcategory by ID
  app.get("/api/service-subcategories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const subcategory = await storage.instance.getServiceSubcategoryById(id);
      
      if (!subcategory) {
        return res.status(404).json({ 
          success: false, 
          message: "Service subcategory not found" 
        });
      }
      
      res.json(subcategory);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch service subcategory" 
      });
    }
  });

  // Get all subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const { serviceId } = req.query;
      let plans;
      
      if (serviceId && typeof serviceId === 'string') {
        plans = await storage.getSubscriptionPlansByService(serviceId);
      } else {
        plans = await storage.getAllSubscriptionPlans();
      }
      
      res.json(plans);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch subscription plans" 
      });
    }
  });

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required"
        });
      }

      const user = await storage.getUserByUsername(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Create user response without password
      const userResponse = {
        id: user.id,
        name: user.username.split('@')[0], // Use username part as name
        email: user.username,
        role: user.role,
        token: `jwt-token-${user.id}` // Mock JWT token
      };

      res.json({
        success: true,
        user: userResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Login failed"
      });
    }
  });

  // Logout route
  app.post("/api/auth/logout", async (req, res) => {
    res.json({ success: true });
  });

  // Create service request
  app.post("/api/service-requests", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const request = await storage.createServiceRequest(validatedData);
      res.json({ success: true, data: request });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get service requests
  app.get("/api/service-requests", async (req, res) => {
    try {
      const { userId } = req.query;
      const requests = await storage.getServiceRequests(userId as string);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch service requests" 
      });
    }
  });

  // Get user subscriptions
  app.get("/api/user-subscriptions", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: "User ID is required" 
        });
      }
      const subscriptions = await storage.getUserSubscriptions(userId as string);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch user subscriptions" 
      });
    }
  });

  // Dashboard analytics endpoint - batched data for KPIs and charts
  app.get("/api/dashboard/analytics", async (req, res) => {
    try {
      const { period = 'month' } = req.query;
      
      // Fetch all required data in parallel for efficiency
      const [leads, accounts, contacts, opportunities, tickets] = await Promise.all([
        storage.getAllLeads(),
        storage.getAllAccounts(), 
        storage.getAllContacts(),
        storage.getAllOpportunities(),
        storage.getAllTickets()
      ]);

      // Calculate KPIs based on data
      const totalDeals = opportunities.length;
      const pipelineValue = opportunities
        .filter(o => o.stage !== 'closed-lost')
        .reduce((sum, o) => sum + parseFloat(o.expected_value || '0'), 0);
      
      const closedWonDeals = opportunities.filter(o => o.stage === 'closed-won').length;
      const conversionRate = totalDeals > 0 ? (closedWonDeals / totalDeals) * 100 : 0;
      
      const resolvedTickets = tickets.filter(t => t.status === 'resolved');
      const avgResolutionTime = resolvedTickets.length > 0 ? 
        resolvedTickets.reduce((sum, t) => {
          const created = new Date(t.created_at).getTime();
          const resolved = new Date().getTime(); // Mock resolution time
          return sum + ((resolved - created) / (1000 * 60 * 60 * 24)); // Convert to days
        }, 0) / resolvedTickets.length : 0;

      // Generate chart data
      const dealsByStage = [
        { stage: 'استطلاع', count: opportunities.filter(o => o.stage === 'prospecting').length, value: 0 },
        { stage: 'تأهيل', count: opportunities.filter(o => o.stage === 'qualification').length, value: 0 },
        { stage: 'عرض', count: opportunities.filter(o => o.stage === 'proposal').length, value: 0 },
        { stage: 'تفاوض', count: opportunities.filter(o => o.stage === 'negotiation').length, value: 0 },
        { stage: 'مغلقة-فوز', count: opportunities.filter(o => o.stage === 'closed-won').length, value: 0 },
        { stage: 'مغلقة-خسارة', count: opportunities.filter(o => o.stage === 'closed-lost').length, value: 0 }
      ];

      const monthlyTrend = [
        { month: 'يناير', deals: 12, value: 45000 },
        { month: 'فبراير', deals: 18, value: 52000 },
        { month: 'مارس', deals: 15, value: 48000 },
        { month: 'أبريل', deals: 22, value: 61000 },
        { month: 'مايو', deals: 25, value: 68000 },
        { month: 'يونيو', deals: totalDeals, value: pipelineValue }
      ];

      const ticketResolution = [
        { day: 'الاثنين', resolved: 8, avg_time: 2.3 },
        { day: 'الثلاثاء', resolved: 12, avg_time: 1.8 },
        { day: 'الأربعاء', resolved: 10, avg_time: 2.1 },
        { day: 'الخميس', resolved: 15, avg_time: 1.5 },
        { day: 'الجمعة', resolved: 9, avg_time: 2.7 },
        { day: 'السبت', resolved: 6, avg_time: 3.2 },
        { day: 'الأحد', resolved: 4, avg_time: 2.8 }
      ];

      const response = {
        kpis: {
          totalDeals,
          pipelineValue: Math.round(pipelineValue),
          conversionRate: Math.round(conversionRate * 10) / 10,
          avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
        },
        charts: {
          dealsByStage,
          monthlyTrend,
          ticketResolution
        },
        summary: {
          totalContacts: contacts.length,
          totalAccounts: accounts.length,
          totalOpportunities: opportunities.length,
          totalTickets: tickets.length,
          totalTasks: 0
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch dashboard analytics" 
      });
    }
  });

  // Create user subscription
  app.post("/api/user-subscriptions", async (req, res) => {
    try {
      const subscription = await storage.createUserSubscription(req.body);
      res.json({ success: true, data: subscription });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to create subscription" 
      });
    }
  });

  // =============================================================================
  // Enterprise Table API Routes
  app.use("/api/tables", enterpriseTableRoutes);
  app.use("/api", enterpriseTableRoutes);  // For saved-views endpoints
  
  // =============================================================================
  // TABLE CONTROLLER ENDPOINTS
  // =============================================================================

  // Enhanced contacts endpoint with table features
  app.get("/api/table/contacts", async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        search = '',
        sorts = '[]',
        filters = '[]',
        columns = '[]'
      } = req.query;

      const pageNum = parseInt(page as string);
      const pageSizeNum = parseInt(pageSize as string);
      const sortData = JSON.parse(sorts as string);
      const filterData = JSON.parse(filters as string);
      
      let contacts = await storage.getAllContacts();
      
      // Apply search
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        contacts = contacts.filter(contact =>
          contact.first_name.toLowerCase().includes(searchTerm) ||
          contact.last_name.toLowerCase().includes(searchTerm) ||
          contact.primary_email?.toLowerCase().includes(searchTerm) ||
          contact.job_title?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sortData.length > 0) {
        contacts.sort((a: any, b: any) => {
          for (const sort of sortData) {
            const aVal = a[sort.field] || '';
            const bVal = b[sort.field] || '';
            const comparison = aVal.toString().localeCompare(bVal.toString());
            if (comparison !== 0) {
              return sort.direction === 'asc' ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      const total = contacts.length;
      const totalPages = Math.ceil(total / pageSizeNum);
      const start = (pageNum - 1) * pageSizeNum;
      const paginatedContacts = contacts.slice(start, start + pageSizeNum);

      res.json({
        data: paginatedContacts,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }
  });

  // Enhanced companies endpoint with table features
  app.get("/api/table/accounts", async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        search = '',
        sorts = '[]',
        filters = '[]',
        columns = '[]'
      } = req.query;

      const pageNum = parseInt(page as string);
      const pageSizeNum = parseInt(pageSize as string);
      const sortData = JSON.parse(sorts as string);
      
      let accounts = await storage.getAllAccounts();
      
      // Apply search
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        accounts = accounts.filter(account =>
          account.legal_name.toLowerCase().includes(searchTerm) ||
          account.industry?.toLowerCase().includes(searchTerm) ||
          account.website?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sortData.length > 0) {
        accounts.sort((a: any, b: any) => {
          for (const sort of sortData) {
            const aVal = a[sort.field] || '';
            const bVal = b[sort.field] || '';
            const comparison = aVal.toString().localeCompare(bVal.toString());
            if (comparison !== 0) {
              return sort.direction === 'asc' ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      const total = accounts.length;
      const totalPages = Math.ceil(total / pageSizeNum);
      const start = (pageNum - 1) * pageSizeNum;
      const paginatedAccounts = accounts.slice(start, start + pageSizeNum);

      res.json({
        data: paginatedAccounts,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch accounts" });
    }
  });

  // Enhanced opportunities endpoint with table features
  app.get("/api/table/opportunities", async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        search = '',
        sorts = '[]',
        filters = '[]',
        columns = '[]'
      } = req.query;

      const pageNum = parseInt(page as string);
      const pageSizeNum = parseInt(pageSize as string);
      const sortData = JSON.parse(sorts as string);
      
      let opportunities = await storage.getAllOpportunities();
      
      // Apply search
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        opportunities = opportunities.filter(opp =>
          opp.name.toLowerCase().includes(searchTerm) ||
          opp.stage?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sortData.length > 0) {
        opportunities.sort((a: any, b: any) => {
          for (const sort of sortData) {
            const aVal = a[sort.field] || '';
            const bVal = b[sort.field] || '';
            if (sort.field === 'expected_value') {
              return sort.direction === 'asc' 
                ? parseFloat(aVal) - parseFloat(bVal)
                : parseFloat(bVal) - parseFloat(aVal);
            }
            const comparison = aVal.toString().localeCompare(bVal.toString());
            if (comparison !== 0) {
              return sort.direction === 'asc' ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      const total = opportunities.length;
      const totalPages = Math.ceil(total / pageSizeNum);
      const start = (pageNum - 1) * pageSizeNum;
      const paginatedOpportunities = opportunities.slice(start, start + pageSizeNum);

      res.json({
        data: paginatedOpportunities,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch opportunities" });
    }
  });

  // Enhanced tickets endpoint with table features
  app.get("/api/table/tickets", async (req, res) => {
    try {
      const {
        page = 1,
        pageSize = 25,
        search = '',
        sorts = '[]',
        filters = '[]',
        columns = '[]'
      } = req.query;

      const pageNum = parseInt(page as string);
      const pageSizeNum = parseInt(pageSize as string);
      const sortData = JSON.parse(sorts as string);
      
      let tickets = await storage.getAllTickets();
      
      // Apply search
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        tickets = tickets.filter(ticket =>
          ticket.ticket_number.toLowerCase().includes(searchTerm) ||
          ticket.subject.toLowerCase().includes(searchTerm) ||
          ticket.priority?.toLowerCase().includes(searchTerm) ||
          ticket.status?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply sorting
      if (sortData.length > 0) {
        tickets.sort((a: any, b: any) => {
          for (const sort of sortData) {
            const aVal = a[sort.field] || '';
            const bVal = b[sort.field] || '';
            const comparison = aVal.toString().localeCompare(bVal.toString());
            if (comparison !== 0) {
              return sort.direction === 'asc' ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      const total = tickets.length;
      const totalPages = Math.ceil(total / pageSizeNum);
      const start = (pageNum - 1) * pageSizeNum;
      const paginatedTickets = tickets.slice(start, start + pageSizeNum);

      res.json({
        data: paginatedTickets,
        pagination: {
          page: pageNum,
          pageSize: pageSizeNum,
          total,
          totalPages
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch tickets" });
    }
  });

  // Export endpoints
  app.get("/api/table/contacts/export", async (req, res) => {
    try {
      const { format, search = '', sorts = '[]', filters = '[]', columns = '[]' } = req.query;
      
      let contacts = await storage.getAllContacts();
      
      // Apply search and filters (same as above)
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        contacts = contacts.filter(contact =>
          contact.first_name.toLowerCase().includes(searchTerm) ||
          contact.last_name.toLowerCase().includes(searchTerm) ||
          contact.primary_email?.toLowerCase().includes(searchTerm)
        );
      }

      if (format === 'csv') {
        const csv = convertToCSV(contacts, [
          { key: 'first_name', label: 'الاسم الأول' },
          { key: 'last_name', label: 'الاسم الأخير' },
          { key: 'primary_email', label: 'البريد الإلكتروني' },
          { key: 'job_title', label: 'المنصب' },
          { key: 'created_at', label: 'تاريخ الإنشاء' }
        ]);
        
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        res.send(csv);
      } else if (format === 'pdf') {
        // Simple PDF generation (in production, use proper PDF library)
        const html = generateHTMLTable(contacts, [
          { key: 'first_name', label: 'الاسم الأول' },
          { key: 'last_name', label: 'الاسم الأخير' },
          { key: 'primary_email', label: 'البريد الإلكتروني' },
          { key: 'job_title', label: 'المنصب' }
        ]);
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.html');
        res.send(html);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Export failed" });
    }
  });

  // Export endpoints for other entities
  app.get("/api/table/accounts/export", async (req, res) => {
    try {
      const { format, search = '', sorts = '[]', filters = '[]', columns = '[]' } = req.query;
      let accounts = await storage.getAllAccounts();
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        accounts = accounts.filter(account =>
          account.legal_name.toLowerCase().includes(searchTerm) ||
          account.industry?.toLowerCase().includes(searchTerm)
        );
      }

      const columnsConfig = [
        { key: 'legal_name', label: 'اسم الشركة' },
        { key: 'industry', label: 'القطاع' },
        { key: 'size_tier', label: 'الحجم' },
        { key: 'website', label: 'الموقع' },
        { key: 'primary_email', label: 'البريد الإلكتروني' }
      ];

      if (format === 'csv') {
        const csv = convertToCSV(accounts, columnsConfig);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=accounts.csv');
        res.send(csv);
      } else if (format === 'pdf') {
        const html = generateHTMLTable(accounts, columnsConfig);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=accounts.html');
        res.send(html);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Export failed" });
    }
  });

  app.get("/api/table/opportunities/export", async (req, res) => {
    try {
      const { format, search = '', sorts = '[]', filters = '[]', columns = '[]' } = req.query;
      let opportunities = await storage.getAllOpportunities();
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        opportunities = opportunities.filter(opp =>
          opp.name.toLowerCase().includes(searchTerm) ||
          opp.stage?.toLowerCase().includes(searchTerm)
        );
      }

      const columnsConfig = [
        { key: 'name', label: 'اسم الفرصة' },
        { key: 'stage', label: 'المرحلة' },
        { key: 'expected_value', label: 'القيمة المتوقعة' },
        { key: 'probability', label: 'الاحتمالية' },
        { key: 'close_date', label: 'تاريخ الإغلاق' }
      ];

      if (format === 'csv') {
        const csv = convertToCSV(opportunities, columnsConfig);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=opportunities.csv');
        res.send(csv);
      } else if (format === 'pdf') {
        const html = generateHTMLTable(opportunities, columnsConfig);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=opportunities.html');
        res.send(html);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Export failed" });
    }
  });

  app.get("/api/table/tickets/export", async (req, res) => {
    try {
      const { format, search = '', sorts = '[]', filters = '[]', columns = '[]' } = req.query;
      let tickets = await storage.getAllTickets();
      
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        tickets = tickets.filter(ticket =>
          ticket.ticket_number.toLowerCase().includes(searchTerm) ||
          ticket.subject.toLowerCase().includes(searchTerm) ||
          ticket.priority?.toLowerCase().includes(searchTerm)
        );
      }

      const columnsConfig = [
        { key: 'ticket_number', label: 'رقم التذكرة' },
        { key: 'subject', label: 'الموضوع' },
        { key: 'category', label: 'الفئة' },
        { key: 'priority', label: 'الأولوية' },
        { key: 'status', label: 'الحالة' },
        { key: 'created_at', label: 'تاريخ الإنشاء' }
      ];

      if (format === 'csv') {
        const csv = convertToCSV(tickets, columnsConfig);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=tickets.csv');
        res.send(csv);
      } else if (format === 'pdf') {
        const html = generateHTMLTable(tickets, columnsConfig);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=tickets.html');
        res.send(html);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Export failed" });
    }
  });

  // Saved views endpoints
  app.get("/api/saved-views", async (req, res) => {
    try {
      const { endpoint } = req.query;
      // In a real app, fetch from database
      const savedViews = [
        {
          id: '1',
          name: 'جهات الاتصال النشطة',
          columns: ['first_name', 'last_name', 'primary_email', 'job_title'],
          sorts: [{ field: 'created_at', direction: 'desc' }],
          filters: [],
          pageSize: 25
        }
      ];
      res.json(savedViews);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch saved views" });
    }
  });

  app.post("/api/saved-views", async (req, res) => {
    try {
      const { name, columns, sorts, filters, pageSize, endpoint } = req.body;
      // In a real app, save to database
      const savedView = {
        id: Date.now().toString(),
        name,
        columns,
        sorts,
        filters,
        pageSize
      };
      res.json(savedView);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to save view" });
    }
  });

  // Helper functions for export
  function convertToCSV(data: any[], columns: any[]) {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.key] || '';
        return `"${value.toString().replace(/"/g, '""')}"`;
      }).join(',')
    );
    return '\uFEFF' + headers + '\\n' + rows.join('\\n');
  }

  function generateHTMLTable(data: any[], columns: any[]) {
    const headers = columns.map(col => `<th>${col.label}</th>`).join('');
    const rows = data.map(row => 
      '<tr>' + columns.map(col => `<td>${row[col.key] || ''}</td>`).join('') + '</tr>'
    ).join('');
    
    return `
      <html dir="rtl">
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; font-family: Arial; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
  }

  // =============================================================================
  // CRM API ENDPOINTS
  // =============================================================================

  // USERS MANAGEMENT
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      res.json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update user" });
    }
  });

  // LEADS MANAGEMENT
  app.get("/api/leads", async (req, res) => {
    try {
      const { assignedTo } = req.query;
      let leads;
      if (assignedTo && typeof assignedTo === 'string') {
        leads = await storage.getLeadsByAssignee(assignedTo);
      } else {
        leads = await storage.getAllLeads();
      }
      res.json(leads);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch leads" });
    }
  });

  app.get("/api/leads/:id", async (req, res) => {
    try {
      const lead = await storage.getLeadById(req.params.id);
      if (!lead) {
        return res.status(404).json({ success: false, message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch lead" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.json({ success: true, data: lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create lead" });
      }
    }
  });

  app.put("/api/leads/:id", async (req, res) => {
    try {
      const updates = req.body;
      const lead = await storage.updateLead(req.params.id, updates);
      res.json({ success: true, data: lead });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update lead" });
    }
  });

  app.delete("/api/leads/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteLead(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Lead not found" });
      }
      res.json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete lead" });
    }
  });

  app.post("/api/leads/:id/convert", async (req, res) => {
    try {
      const { accountId } = req.body;
      const contact = await storage.convertLeadToContact(req.params.id, accountId);
      res.json({ success: true, data: contact });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to convert lead" });
    }
  });

  // CONTACTS MANAGEMENT
  app.get("/api/contacts", async (req, res) => {
    try {
      const { accountId } = req.query;
      let contacts;
      if (accountId && typeof accountId === 'string') {
        contacts = await storage.getContactsByAccount(accountId);
      } else {
        contacts = await storage.getAllContacts();
      }
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, data: contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create contact" });
      }
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const contact = await storage.updateContact(req.params.id, updates);
      res.json({ success: true, data: contact });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Contact not found" });
      }
      res.json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete contact" });
    }
  });

  // ACCOUNTS MANAGEMENT
  app.get("/api/accounts", async (req, res) => {
    try {
      const { assignedTo } = req.query;
      let accounts;
      if (assignedTo && typeof assignedTo === 'string') {
        accounts = await storage.getAccountsByAssignee(assignedTo);
      } else {
        accounts = await storage.getAllAccounts();
      }
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccountById(req.params.id);
      if (!account) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch account" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.json({ success: true, data: account });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create account" });
      }
    }
  });

  app.put("/api/accounts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const account = await storage.updateAccount(req.params.id, updates);
      res.json({ success: true, data: account });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update account" });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAccount(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
      res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete account" });
    }
  });

  // OPPORTUNITIES MANAGEMENT
  app.get("/api/opportunities", async (req, res) => {
    try {
      const { accountId, assignedTo } = req.query;
      let opportunities;
      if (accountId && typeof accountId === 'string') {
        opportunities = await storage.getOpportunitiesByAccount(accountId);
      } else if (assignedTo && typeof assignedTo === 'string') {
        opportunities = await storage.getOpportunitiesByAssignee(assignedTo);
      } else {
        opportunities = await storage.getAllOpportunities();
      }
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch opportunities" });
    }
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    try {
      const opportunity = await storage.getOpportunityById(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      res.json(opportunity);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch opportunity" });
    }
  });

  app.post("/api/opportunities", async (req, res) => {
    try {
      const validatedData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity(validatedData);
      res.json({ success: true, data: opportunity });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create opportunity" });
      }
    }
  });

  app.put("/api/opportunities/:id", async (req, res) => {
    try {
      const updates = req.body;
      const opportunity = await storage.updateOpportunity(req.params.id, updates);
      res.json({ success: true, data: opportunity });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update opportunity" });
    }
  });

  app.delete("/api/opportunities/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteOpportunity(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Opportunity not found" });
      }
      res.json({ success: true, message: "Opportunity deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete opportunity" });
    }
  });

  // TASKS MANAGEMENT
  app.get("/api/tasks", async (req, res) => {
    try {
      const { assignedTo, relatedTo, relatedId } = req.query;
      let tasks;
      if (relatedTo && relatedId && typeof relatedTo === 'string' && typeof relatedId === 'string') {
        tasks = await storage.getTasksByRelatedEntity(relatedTo, relatedId);
      } else if (assignedTo && typeof assignedTo === 'string') {
        tasks = await storage.getTasksByAssignee(assignedTo);
      } else {
        tasks = await storage.getAllTasks();
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.json({ success: true, data: task });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create task" });
      }
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const updates = req.body;
      const task = await storage.updateTask(req.params.id, updates);
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Task not found" });
      }
      res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete task" });
    }
  });

  // CRM ACTIVITIES
  app.get("/api/activities", async (req, res) => {
    try {
      const { userId, relatedTo, relatedId } = req.query;
      let activities;
      if (relatedTo && relatedId && typeof relatedTo === 'string' && typeof relatedId === 'string') {
        activities = await storage.getActivitiesByRelatedEntity(relatedTo, relatedId);
      } else if (userId && typeof userId === 'string') {
        activities = await storage.getActivitiesByUser(userId);
      } else {
        activities = await storage.getAllActivities();
      }
      res.json(activities);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/:id", async (req, res) => {
    try {
      const activity = await storage.getActivityById(req.params.id);
      if (!activity) {
        return res.status(404).json({ success: false, message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch activity" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertCrmActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.json({ success: true, data: activity });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create activity" });
      }
    }
  });

  // Dashboard Analytics endpoint (batched)
  app.get("/api/dashboard/analytics", async (req, res) => {
    try {
      const period = req.query.period as string || 'month';
      
      // Get all required data in parallel
      const [contacts, accounts, opportunities, tickets, tasks] = await Promise.all([
        storage.getAllContacts(),
        storage.getAllAccounts(), 
        storage.getAllOpportunities(),
        storage.getSupportTickets?.() || [],
        storage.getAllTasks()
      ]);

      // Calculate date ranges
      const now = new Date();
      let startDate: Date;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default: // month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      // Calculate KPIs
      const totalDeals = opportunities.length;
      const pipelineValue = opportunities
        .filter((opp: any) => opp.stage !== 'closed-lost')
        .reduce((sum: number, opp: any) => sum + parseFloat(opp.expected_value || '0'), 0);
      
      const closedWonDeals = opportunities.filter((opp: any) => opp.stage === 'closed-won');
      const totalLeads = contacts.length + accounts.length;
      const conversionRate = totalLeads > 0 ? (closedWonDeals.length / totalLeads * 100) : 0;
      
      const resolvedTickets = Array.isArray(tickets) ? 
        tickets.filter((ticket: any) => ticket.status === 'resolved') : [];
      const avgResolutionTime = resolvedTickets.length > 0 ? 2.5 : 0; // Mock average in days

      // Prepare chart data
      const chartData = {
        dealsByStage: opportunities.reduce((acc: any, opp: any) => {
          acc[opp.stage] = (acc[opp.stage] || 0) + 1;
          return acc;
        }, {}),
        
        monthlyTrend: Array.from({length: 6}, (_, i) => {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthOpps = opportunities.filter((opp: any) => {
            const oppDate = new Date(opp.createdAt || opp.created_at);
            return oppDate.getMonth() === month.getMonth() && 
                   oppDate.getFullYear() === month.getFullYear();
          });
          return {
            month: month.toLocaleDateString('ar-SA', { month: 'short' }),
            deals: monthOpps.length,
            value: monthOpps.reduce((sum: number, opp: any) => 
              sum + parseFloat(opp.expected_value || '0'), 0)
          };
        }).reverse(),

        ticketStatus: Array.isArray(tickets) ? tickets.reduce((acc: any, ticket: any) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {}) : {}
      };

      res.json({
        success: true,
        period,
        kpis: {
          totalDeals,
          pipelineValue,
          conversionRate: Math.round(conversionRate * 100) / 100,
          avgResolutionTime: Math.round(avgResolutionTime * 10) / 10
        },
        chartData,
        summary: {
          totalContacts: contacts.length,
          totalAccounts: accounts.length,
          totalOpportunities: opportunities.length,
          totalTickets: Array.isArray(tickets) ? tickets.length : 0,
          totalTasks: tasks.length
        }
      });
    } catch (error) {
      console.error("Dashboard analytics error:", error);
      res.status(500).json({ success: false, message: "Failed to load dashboard analytics" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const entitiesParam = req.query.entities as string;
      
      if (!query || query.trim().length < 2) {
        return res.json([]);
      }

      const entities = entitiesParam ? entitiesParam.split(',') : ['contacts', 'accounts', 'deals', 'tickets'];
      
      const results = await storage.searchEntities(query.trim(), entities);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ success: false, message: "Search failed" });
    }
  });

  // Saved Filters endpoints
  app.get("/api/saved-filters", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const filters = await storage.getSavedFilters(req.user!.id);
      res.json(filters);
    } catch (error) {
      console.error("Get saved filters error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch saved filters" });
    }
  });

  app.post("/api/saved-filters", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertSavedFilterSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      const filter = await storage.createSavedFilter(validatedData);
      res.json({ success: true, data: filter });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
      } else {
        console.error("Create saved filter error:", error);
        res.status(500).json({ success: false, message: "Failed to save filter" });
      }
    }
  });

  app.put("/api/saved-filters/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;
      const filter = await storage.updateSavedFilter(req.params.id, updates);
      res.json({ success: true, data: filter });
    } catch (error) {
      console.error("Update saved filter error:", error);
      res.status(500).json({ success: false, message: "Failed to update filter" });
    }
  });

  app.delete("/api/saved-filters/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.deleteSavedFilter(req.params.id);
      if (success) {
        res.json({ success: true, message: "Filter deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Filter not found" });
      }
    } catch (error) {
      console.error("Delete saved filter error:", error);
      res.status(500).json({ success: false, message: "Failed to delete filter" });
    }
  });

  // Enhanced table endpoints with pagination, sorting, and filtering
  const createTableEndpoint = (entity: string, tableName: string) => {
    app.get(`/api/${entity}`, requireAuth, async (req: AuthenticatedRequest, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 25;
        const search = req.query.search as string || '';
        const sorts = req.query.sorts ? JSON.parse(req.query.sorts as string) : [];
        const filters = req.query.filters ? JSON.parse(req.query.filters as string) : [];
        const columns = req.query.columns ? JSON.parse(req.query.columns as string) : null;

        const offset = (page - 1) * pageSize;
        
        // Get data from storage with pagination and filtering
        const result = await storage.instance.getTableData(tableName, {
          offset,
          limit: pageSize,
          search,
          sorts,
          filters,
          columns
        });

        res.json({
          success: true,
          data: result.data,
          pagination: {
            page,
            pageSize,
            total: result.total,
            totalPages: Math.ceil(result.total / pageSize)
          }
        });
      } catch (error) {
        console.error(`${entity} table error:`, error);
        res.status(500).json({ success: false, message: `Failed to load ${entity}` });
      }
    });

    // Export endpoint for CSV and PDF
    app.get(`/api/${entity}/export`, requireAuth, async (req: AuthenticatedRequest, res) => {
      try {
        const format = req.query.format as string;
        const search = req.query.search as string || '';
        const sorts = req.query.sorts ? JSON.parse(req.query.sorts as string) : [];
        const filters = req.query.filters ? JSON.parse(req.query.filters as string) : [];
        const columns = req.query.columns ? JSON.parse(req.query.columns as string) : null;

        // Get all data for export (no pagination)
        const result = await storage.instance.getTableData(tableName, {
          search,
          sorts,
          filters,
          columns,
          export: true
        });

        if (format === 'csv') {
          const csvWriter = createObjectCsvWriter({
            path: `/tmp/${entity}-export-${Date.now()}.csv`,
            header: Object.keys(result.data[0] || {}).map(key => ({ id: key, title: key }))
          });
          
          await csvWriter.writeRecords(result.data);
          
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename="${entity}-export.csv"`);
          
          const fs = require('fs');
          const csvContent = fs.readFileSync(csvWriter.path);
          res.send(csvContent);
          
          // Cleanup temp file
          fs.unlinkSync(csvWriter.path);
        } else if (format === 'pdf') {
          // Generate PDF export
          const puppeteer = require('puppeteer');
          const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
          const page = await browser.newPage();
          
          // Create HTML table
          const html = generateTableHTML(result.data, entity);
          await page.setContent(html);
          
          const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
          });
          
          await browser.close();
          
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename="${entity}-export.pdf"`);
          res.send(pdf);
        } else {
          res.status(400).json({ success: false, message: 'Invalid export format' });
        }
      } catch (error) {
        console.error(`${entity} export error:`, error);
        res.status(500).json({ success: false, message: `Export failed for ${entity}` });
      }
    });
  };

  // Helper function to generate HTML for PDF export
  const generateTableHTML = (data: any[], entityName: string) => {
    if (!data.length) return '<html><body><h1>No data to export</h1></body></html>';
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => 
      headers.map(header => row[header] || '').join('</td><td>')
    ).join('</tr><tr><td>');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${entityName} Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${entityName.charAt(0).toUpperCase() + entityName.slice(1)} Export</h1>
        <table>
          <thead>
            <tr><th>${headers.join('</th><th>')}</th></tr>
          </thead>
          <tbody>
            <tr><td>${rows}</td></tr>
          </tbody>
        </table>
      </body>
      </html>
    `;
  };

  // Create table endpoints for all entities
  createTableEndpoint('contacts', 'contacts');
  createTableEndpoint('companies', 'accounts');
  createTableEndpoint('deals', 'opportunities');
  createTableEndpoint('tickets', 'supportTickets');

  // Saved Views endpoints
  app.get("/api/saved-views", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const endpoint = req.query.endpoint as string;
      const views = await storage.instance.getSavedViews(req.user!.id, endpoint);
      res.json(views);
    } catch (error) {
      console.error("Get saved views error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch saved views" });
    }
  });

  app.post("/api/saved-views", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const viewData = {
        ...req.body,
        userId: req.user!.id,
        id: `view-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      const view = await storage.instance.createSavedView(viewData);
      res.json({ success: true, data: view });
    } catch (error) {
      console.error("Create saved view error:", error);
      res.status(500).json({ success: false, message: "Failed to save view" });
    }
  });

  app.delete("/api/saved-views/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const success = await storage.instance.deleteSavedView(req.params.id, req.user!.id);
      if (success) {
        res.json({ success: true, message: "View deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "View not found" });
      }
    } catch (error) {
      console.error("Delete saved view error:", error);
      res.status(500).json({ success: false, message: "Failed to delete view" });
    }
  });

  // Cross-entity search endpoint
  app.get("/api/global-search", async (req, res) => {
    try {
      const { q = '', entities = 'contacts,companies,deals,tickets' } = req.query;
      const searchTerm = (q as string).toLowerCase().trim();
      const entityTypes = (entities as string).split(',').map(e => e.trim());
      
      if (!searchTerm) {
        return res.json({ results: [], totalResults: 0 });
      }

      const results: any[] = [];
      const startTime = Date.now();

      // For now, return mock results until storage methods are properly available
      if (entityTypes.includes('contacts')) {
        results.push({
          id: 'contact-1',
          type: 'contact',
          title: 'John Doe',
          subtitle: 'Software Engineer',
          description: 'john@example.com',
          metadata: {
            email: 'john@example.com',
            jobTitle: 'Software Engineer'
          }
        });
      }

      if (entityTypes.includes('companies')) {
        results.push({
          id: 'company-1',
          type: 'company',
          title: 'Tech Solutions Inc',
          subtitle: 'Technology',
          description: 'techsolutions.com',
          metadata: {
            industry: 'Technology',
            website: 'techsolutions.com'
          }
        });
      }

      if (entityTypes.includes('deals')) {
        results.push({
          id: 'deal-1',
          type: 'deal',
          title: 'Software Development Project',
          subtitle: 'negotiation - $50,000',
          description: 'Custom software development for client',
          metadata: {
            stage: 'negotiation',
            value: '50000',
            probability: '75'
          }
        });
      }

      if (entityTypes.includes('tickets')) {
        results.push({
          id: 'ticket-1',
          type: 'ticket',
          title: 'Login Issues',
          subtitle: 'open - high',
          description: 'User cannot login to system',
          metadata: {
            status: 'open',
            priority: 'high'
          }
        });
      }

      const searchTime = Date.now() - startTime;
      
      res.json({
        results: results.filter(r => 
          r.title.toLowerCase().includes(searchTerm) ||
          r.subtitle.toLowerCase().includes(searchTerm) ||
          r.description.toLowerCase().includes(searchTerm)
        ).slice(0, 50),
        totalResults: results.length,
        searchTime: `${searchTime}ms`,
        query: searchTerm,
        entities: entityTypes
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Search failed" 
      });
    }
  });

  // Mobile App Planning API
  app.post("/api/mobile-app-planning", upload.array('files', 5), async (req, res) => {
    try {
      const { appType, features, specializations, projectDetails, contactInfo } = req.body;
      
      // Parse JSON strings
      const parsedFeatures = features ? JSON.parse(features) : [];
      const parsedSpecializations = specializations ? JSON.parse(specializations) : [];
      const parsedProjectDetails = projectDetails ? JSON.parse(projectDetails) : {};
      const parsedContactInfo = contactInfo ? JSON.parse(contactInfo) : {};
      
      // Process uploaded files
      const uploadedFiles = (req.files as Express.Multer.File[]) || [];
      const fileInfo = uploadedFiles.map(file => ({
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path
      }));

      // Create mobile app order record
      const orderData = {
        appType: appType || '',
        features: parsedFeatures,
        specializations: parsedSpecializations,
        projectDetails: parsedProjectDetails,
        contactInfo: parsedContactInfo,
        files: fileInfo,
        status: 'pending',
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };

      // Here you would typically save to database
      // For now, we'll just log the order
      console.log('Mobile App Planning Request:', {
        ...orderData,
        filesCount: fileInfo.length
      });

      res.json({
        success: true,
        message: 'Mobile app planning request submitted successfully',
        orderId: `APP_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        filesUploaded: fileInfo.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Mobile app planning submission error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit mobile app planning request',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  });

  // Mount CRM routes
  app.use("/api/crm", crmRoutes);
  
  const httpServer = createServer(app);
  return httpServer;
}
