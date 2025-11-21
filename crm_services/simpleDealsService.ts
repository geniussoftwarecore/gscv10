import { db } from "../server/db";

// Simple deals service for Kanban functionality
export interface DealDTO {
  id: string;
  name: string;
  value?: number;
  currency: string;
  probability: number;
  expectedCloseDate?: Date;
  stageId: string;
  stageName?: string;
  stageColor?: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  ownerId?: string;
  ownerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DealStageDTO {
  id: string;
  name: string;
  position: number;
  probability: number;
  color: string;
  isClosed: boolean;
  isWon: boolean;
}

export interface DealCreateInput {
  name: string;
  value?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: Date;
  stageId: string;
  companyId?: string;
  contactId?: string;
  ownerId?: string;
}

export interface KanbanData {
  stages: DealStageDTO[];
  deals: DealDTO[];
  statistics: {
    totalDeals: number;
    totalValue: number;
    winRate: number;
    avgDealSize: number;
  };
}

class SimpleDealsService {
  async getDealStages(): Promise<DealStageDTO[]> {
    try {
      const result = await db.execute(`
        SELECT id, name, position, probability, color, is_closed, is_won
        FROM crm_deal_stages 
        ORDER BY position ASC
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        position: row.position,
        probability: row.probability,
        color: row.color,
        isClosed: row.is_closed,
        isWon: row.is_won
      }));
    } catch (error) {
      console.error('Error fetching deal stages:', error);
      return [];
    }
  }

  async getAllDeals(): Promise<DealDTO[]> {
    try {
      const result = await db.execute(`
        SELECT 
          d.id, d.name, d.value, d.currency, d.probability, 
          d.expected_close_date, d.stage_id, d.company_id, 
          d.contact_id, d.owner_id, d.created_at, d.updated_at,
          s.name as stage_name, s.color as stage_color,
          c.name as company_name,
          CONCAT(ct.first_name, ' ', ct.last_name) as contact_name,
          u.name as owner_name
        FROM crm_deals d
        LEFT JOIN crm_deal_stages s ON d.stage_id = s.id
        LEFT JOIN crm_companies c ON d.company_id = c.id
        LEFT JOIN crm_contacts ct ON d.contact_id = ct.id
        LEFT JOIN users u ON d.owner_id = u.id
        ORDER BY d.updated_at DESC
      `);

      return result.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        value: row.value,
        currency: row.currency || 'USD',
        probability: row.probability || 0,
        expectedCloseDate: row.expected_close_date ? new Date(row.expected_close_date) : undefined,
        stageId: row.stage_id,
        stageName: row.stage_name,
        stageColor: row.stage_color,
        companyId: row.company_id,
        companyName: row.company_name,
        contactId: row.contact_id,
        contactName: row.contact_name,
        ownerId: row.owner_id,
        ownerName: row.owner_name,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      }));
    } catch (error) {
      console.error('Error fetching deals:', error);
      return [];
    }
  }

  async getKanbanData(): Promise<KanbanData> {
    try {
      const [stages, deals] = await Promise.all([
        this.getDealStages(),
        this.getAllDeals()
      ]);

      // Calculate statistics
      const totalDeals = deals.length;
      const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const wonDeals = deals.filter(deal => 
        stages.find(stage => stage.id === deal.stageId)?.isWon
      );
      const winRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;
      const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;

      return {
        stages,
        deals,
        statistics: {
          totalDeals,
          totalValue,
          winRate,
          avgDealSize
        }
      };
    } catch (error) {
      console.error('Error fetching kanban data:', error);
      return {
        stages: [],
        deals: [],
        statistics: { totalDeals: 0, totalValue: 0, winRate: 0, avgDealSize: 0 }
      };
    }
  }

  async updateDealStage(dealId: string, newStageId: string): Promise<DealDTO | null> {
    try {
      const result = await db.execute(`
        UPDATE crm_deals 
        SET stage_id = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, value, currency, probability, 
                  expected_close_date, stage_id, company_id, 
                  contact_id, owner_id, created_at, updated_at
      `, [newStageId, dealId]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        value: row.value,
        currency: row.currency || 'USD',
        probability: row.probability || 0,
        expectedCloseDate: row.expected_close_date ? new Date(row.expected_close_date) : undefined,
        stageId: row.stage_id,
        companyId: row.company_id,
        contactId: row.contact_id,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error updating deal stage:', error);
      return null;
    }
  }

  async createDeal(input: DealCreateInput): Promise<DealDTO | null> {
    try {
      const result = await db.execute(`
        INSERT INTO crm_deals (
          name, value, currency, probability, expected_close_date,
          stage_id, company_id, contact_id, owner_id, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING id, name, value, currency, probability, 
                  expected_close_date, stage_id, company_id, 
                  contact_id, owner_id, created_at, updated_at
      `, [
        input.name,
        input.value,
        input.currency || 'USD',
        input.probability || 0,
        input.expectedCloseDate,
        input.stageId,
        input.companyId,
        input.contactId,
        input.ownerId
      ]);

      if (!result.rows.length) return null;

      const row = result.rows[0] as any;
      return {
        id: row.id,
        name: row.name,
        value: row.value,
        currency: row.currency || 'USD',
        probability: row.probability || 0,
        expectedCloseDate: row.expected_close_date ? new Date(row.expected_close_date) : undefined,
        stageId: row.stage_id,
        companyId: row.company_id,
        contactId: row.contact_id,
        ownerId: row.owner_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at)
      };
    } catch (error) {
      console.error('Error creating deal:', error);
      return null;
    }
  }

  async deleteDeal(id: string): Promise<boolean> {
    try {
      const result = await db.execute(`DELETE FROM crm_deals WHERE id = $1`, [id]);
      return (result as any).rowCount > 0;
    } catch (error) {
      console.error('Error deleting deal:', error);
      return false;
    }
  }

  async getDealsByStage(stageId: string): Promise<DealDTO[]> {
    try {
      const deals = await this.getAllDeals();
      return deals.filter(deal => deal.stageId === stageId);
    } catch (error) {
      console.error('Error fetching deals by stage:', error);
      return [];
    }
  }
}

export const simpleDealsService = new SimpleDealsService();