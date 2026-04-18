import { Router, Response } from "express";
import { storage } from "../storage";
import { requireAuth, requireRole, AuthenticatedRequest } from "../auth";
import { crmStorage } from "../../crm_services/crm-storage";

const router = Router();

// All routes here require authentication and customer role
router.use(requireAuth, requireRole("customer"));

// ──────────────────────────────────────────────────────────────────────────────
// Profile  –  GET /api/customer/profile
// ──────────────────────────────────────────────────────────────────────────────
router.get("/profile", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await storage.instance.getUser(req.user!.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const { password, password_hash, ...safeUser } = user as any;
    res.json({ success: true, profile: safeUser });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// Orders  –  GET /api/customer/orders
// Returns service requests that belong to the current customer.
// ──────────────────────────────────────────────────────────────────────────────
router.get("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const orders = await storage.instance.getServiceRequests(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// Tickets  –  GET /api/customer/tickets
// Returns support tickets that belong to the current customer.
// ──────────────────────────────────────────────────────────────────────────────
router.get("/tickets", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch user to get email for matching
    const user = await storage.instance.getUser(userId);
    const userEmail = (user as any)?.email || "";

    // Use CRM storage to get tickets (supports contactId filter)
    let tickets: any[] = [];
    try {
      const result = await crmStorage.getTickets({ contactId: userId });
      tickets = Array.isArray(result) ? result : (result as any)?.data || [];
    } catch {
      tickets = [];
    }

    // If no tickets found by contactId, also try matching by email in all tickets
    if (tickets.length === 0 && userEmail) {
      try {
        const allResult = await crmStorage.getTickets({});
        const allTickets = Array.isArray(allResult) ? allResult : (allResult as any)?.data || [];
        tickets = allTickets.filter(
          (t: any) =>
            t.reporterEmail === userEmail ||
            t.email === userEmail ||
            t.createdBy === userId ||
            t.contactId === userId
        );
      } catch {
        tickets = [];
      }
    }

    res.json({ success: true, tickets });
  } catch (error) {
    console.error("Error fetching customer tickets:", error);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
});

export default router;
