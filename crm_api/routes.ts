import { Router } from "express";
import { z } from "zod";
import { crmStorage } from "../crm_services/crm-storage";
import { requireAuth, requireRole } from "../server/middleware/requireAuth";

const router = Router();

// Input validation schemas
const leadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  leadSource: z.string().optional(),
  leadRating: z.enum(['hot', 'warm', 'cold']).optional(),
  estimatedValue: z.string().optional(),
  assignedTo: z.string().optional(),
  teamId: z.string().optional(),
  utm: z.any().optional(),
  description: z.string().optional(),
});

const accountSchema = z.object({
  legalName: z.string().min(1),
  industry: z.string().optional(),
  sizeTier: z.enum(['micro', 'smb', 'ent']).optional(),
  region: z.string().optional(),
  ownerId: z.string().optional(),
  ownerTeamId: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  description: z.string().optional(),
});

const contactSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  primaryEmail: z.string().email().optional(),
  phones: z.array(z.string()).optional(),
  accountId: z.string().optional(),
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  isPrimary: z.boolean().optional(),
  utm: z.any().optional(),
  optInStatus: z.enum(['opted_in', 'opted_out', 'pending']).optional(),
  optInSource: z.string().optional(),
});

const opportunitySchema = z.object({
  name: z.string().min(1),
  accountId: z.string().optional(),
  contactId: z.string().optional(),
  stage: z.enum(['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost']).optional(),
  expectedValue: z.string().optional(),
  closeDate: z.string().optional(),
  winProbability: z.number().min(0).max(100).optional(),
  leadSource: z.string().optional(),
  description: z.string().optional(),
  ownerId: z.string().optional(),
  teamId: z.string().optional(),
});

const activitySchema = z.object({
  type: z.enum(['call', 'meeting', 'task', 'message', 'note', 'attachment']),
  title: z.string().min(1),
  subject: z.string().optional(),
  description: z.string().optional(),
  actorId: z.string().optional(),
  againstType: z.enum(['contact', 'account', 'deal', 'lead']),
  againstId: z.string(),
  outcome: z.string().optional(),
  durationSec: z.number().optional(),
  attachments: z.array(z.any()).optional(),
  dueAt: z.string().optional(),
  reminderAt: z.string().optional(),
});

const ticketSchema = z.object({
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug']).optional(),
  contactId: z.string().optional(),
  accountId: z.string().optional(),
  assignedTo: z.string().optional(),
  ownerId: z.string().optional(),
  teamId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Feature Flags
router.get("/feature-flags/:name", async (req, res) => {
  try {
    const enabled = await crmStorage.getFeatureFlag(req.params.name);
    res.json({ name: req.params.name, enabled });
  } catch (error) {
    console.error('Error getting feature flag:', error);
    res.status(500).json({ error: "Failed to get feature flag" });
  }
});

router.put("/feature-flags/:name", async (req, res) => {
  try {
    const { enabled } = req.body;
    await crmStorage.setFeatureFlag(req.params.name, enabled);
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting feature flag:', error);
    res.status(500).json({ error: "Failed to set feature flag" });
  }
});

// Users
router.get("/users", async (req, res) => {
  try {
    const { teamId, role, isActive } = req.query;
    const users = await crmStorage.getCrmUsers({
      teamId: teamId as string,
      role: role as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined
    });
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const user = await crmStorage.getCrmUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Accounts
router.get("/accounts", async (req, res) => {
  try {
    const { ownerId, industry, sizeTier, search, isActive, limit, offset } = req.query;
    const result = await crmStorage.getAccounts({
      ownerId: ownerId as string,
      industry: industry as string,
      sizeTier: sizeTier as string,
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ error: "Failed to get accounts" });
  }
});

router.post("/accounts", async (req, res) => {
  try {
    const data = accountSchema.parse(req.body);
    const account = await crmStorage.createAccount(data);
    res.status(201).json(account);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating account:', error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.get("/accounts/:id", async (req, res) => {
  try {
    const account = await crmStorage.getAccountById(req.params.id);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    console.error('Error getting account:', error);
    res.status(500).json({ error: "Failed to get account" });
  }
});

router.put("/accounts/:id", async (req, res) => {
  try {
    const data = accountSchema.partial().parse(req.body);
    const account = await crmStorage.updateAccount(req.params.id, data);
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(account);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error updating account:', error);
    res.status(500).json({ error: "Failed to update account" });
  }
});

router.delete("/accounts/:id", async (req, res) => {
  try {
    const success = await crmStorage.softDeleteAccount(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// Contacts
router.get("/contacts", async (req, res) => {
  try {
    const { accountId, search, isActive, limit, offset } = req.query;
    const result = await crmStorage.getContacts({
      accountId: accountId as string,
      search: search as string,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: "Failed to get contacts" });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    const contact = await crmStorage.createContact(data);
    res.status(201).json(contact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating contact:', error);
    res.status(500).json({ error: "Failed to create contact" });
  }
});

router.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await crmStorage.getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error getting contact:', error);
    res.status(500).json({ error: "Failed to get contact" });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  try {
    const success = await crmStorage.softDeleteContact(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Contact not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// Leads
router.get("/leads", async (req, res) => {
  try {
    const { assignedTo, status, rating, source, search, limit, offset } = req.query;
    const result = await crmStorage.getLeads({
      assignedTo: assignedTo as string,
      status: status as string,
      rating: rating as string,
      source: source as string,
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({ error: "Failed to get leads" });
  }
});

router.post("/leads", async (req, res) => {
  try {
    const data = leadSchema.parse(req.body);
    const lead = await crmStorage.createLead(data);
    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating lead:', error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

router.get("/leads/:id", async (req, res) => {
  try {
    const lead = await crmStorage.getLeadById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    console.error('Error getting lead:', error);
    res.status(500).json({ error: "Failed to get lead" });
  }
});

router.put("/leads/:id", async (req, res) => {
  try {
    const data = leadSchema.partial().parse(req.body);
    const lead = await crmStorage.updateLead(req.params.id, data);
    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error updating lead:', error);
    res.status(500).json({ error: "Failed to update lead" });
  }
});

router.delete("/leads/:id", async (req, res) => {
  try {
    const success = await crmStorage.softDeleteLead(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Lead not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: "Failed to delete lead" });
  }
});

// Opportunities
router.get("/opportunities", async (req, res) => {
  try {
    const { ownerId, accountId, stage, isClosed, search, limit, offset } = req.query;
    const result = await crmStorage.getOpportunities({
      ownerId: ownerId as string,
      accountId: accountId as string,
      stage: stage as string,
      isClosed: isClosed === 'true' ? true : isClosed === 'false' ? false : undefined,
      search: search as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting opportunities:', error);
    res.status(500).json({ error: "Failed to get opportunities" });
  }
});

router.post("/opportunities", async (req, res) => {
  try {
    const data = opportunitySchema.parse(req.body);
    const opportunity = await crmStorage.createOpportunity(data);
    res.status(201).json(opportunity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating opportunity:', error);
    res.status(500).json({ error: "Failed to create opportunity" });
  }
});

// Activities
router.get("/activities", async (req, res) => {
  try {
    const { actorId, againstType, againstId, type, isCompleted, limit, offset } = req.query;
    const result = await crmStorage.getActivities({
      actorId: actorId as string,
      againstType: againstType as string,
      againstId: againstId as string,
      type: type as string,
      isCompleted: isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ error: "Failed to get activities" });
  }
});

router.post("/activities", async (req, res) => {
  try {
    const data = activitySchema.parse(req.body);
    const activity = await crmStorage.createActivity(data);
    res.status(201).json(activity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating activity:', error);
    res.status(500).json({ error: "Failed to create activity" });
  }
});

// Tickets
router.get("/tickets", async (req, res) => {
  try {
    const { assignedTo, status, priority, contactId, accountId, limit, offset } = req.query;
    const result = await crmStorage.getTickets({
      assignedTo: assignedTo as string,
      status: status as string,
      priority: priority as string,
      contactId: contactId as string,
      accountId: accountId as string,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });
    res.json(result);
  } catch (error) {
    console.error('Error getting tickets:', error);
    res.status(500).json({ error: "Failed to get tickets" });
  }
});

router.post("/tickets", async (req, res) => {
  try {
    const data = ticketSchema.parse(req.body);
    const ticket = await crmStorage.createTicket(data);
    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Timeline
router.get("/timeline/:entityType/:entityId", async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit } = req.query;
    const timeline = await crmStorage.getTimeline(
      entityType,
      entityId,
      limit ? parseInt(limit as string) : undefined
    );
    res.json(timeline);
  } catch (error) {
    console.error('Error getting timeline:', error);
    res.status(500).json({ error: "Failed to get timeline" });
  }
});

export default router;