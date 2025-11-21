import { storage } from "../server/storage";
import type { Opportunity, InsertOpportunity, DealStage, Contact, Account, User } from "@shared/schema";

// DTOs for API responses
export interface DealDTO {
  id: string;
  name: string;
  stageId?: string;
  stageName?: string;
  stageColor?: string;
  value?: number;
  currency: string;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  accountId?: string;
  accountName?: string;
  contactId?: string;
  contactName?: string;
  ownerId?: string;
  ownerName?: string;
  description?: string;
  nextStep?: string;
  tags: string[];
  leadSource?: string;
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

export interface KanbanDataDTO {
  stages: DealStageDTO[];
  deals: DealDTO[];
  statistics: {
    totalDeals: number;
    totalValue: number;
    winRate: number;
    avgDealSize: number;
  };
}

export interface DealListResponse {
  deals: DealDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DealFilters {
  search?: string;
  stageId?: string;
  accountId?: string;
  ownerId?: string;
  valueMin?: number;
  valueMax?: number;
  probabilityMin?: number;
  probabilityMax?: number;
  expectedCloseDateFrom?: Date;
  expectedCloseDateTo?: Date;
}

export interface DealCreateInput {
  name: string;
  stageId?: string;
  value?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: Date;
  accountId?: string;
  contactId?: string;
  ownerId: string;
  description?: string;
  nextStep?: string;
  leadSource?: string;
  tags?: string[];
}

export interface DealUpdateInput extends Partial<DealCreateInput> {
  actualCloseDate?: Date;
  lossReason?: string;
}

class DealsService {
  async getDeals(
    filters: DealFilters = {},
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'updated_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<DealListResponse> {
    const allDeals = await storage.instance.getAllOpportunities();
    const allAccounts = await storage.instance.getAllAccounts();
    const allContacts = await storage.instance.getAllContacts();
    const allUsers = await storage.instance.getAllUsers();
    const allStages = await storage.instance.getAllDealStages();
    
    // Create lookup maps
    const accountsMap = new Map(allAccounts.map(acc => [acc.id, acc]));
    const contactsMap = new Map(allContacts.map(cont => [cont.id, cont]));
    const usersMap = new Map(allUsers.map(user => [user.id, user]));
    const stagesMap = new Map(allStages.map(stage => [stage.id, stage]));
    
    // Filter deals
    let filteredDeals = allDeals.filter(deal => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          deal.name.toLowerCase().includes(searchLower) ||
          deal.description?.toLowerCase().includes(searchLower) ||
          accountsMap.get(deal.accountId || '')?.name.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    if (filters.stageId) {
      filteredDeals = filteredDeals.filter(deal => deal.stageId === filters.stageId);
    }

    if (filters.accountId) {
      filteredDeals = filteredDeals.filter(deal => deal.accountId === filters.accountId);
    }

    if (filters.ownerId) {
      filteredDeals = filteredDeals.filter(deal => deal.assignedTo === filters.ownerId);
    }

    if (filters.valueMin !== undefined) {
      filteredDeals = filteredDeals.filter(deal => {
        const value = parseFloat(deal.amount || '0');
        return value >= filters.valueMin!;
      });
    }

    if (filters.valueMax !== undefined) {
      filteredDeals = filteredDeals.filter(deal => {
        const value = parseFloat(deal.amount || '0');
        return value <= filters.valueMax!;
      });
    }

    // Sort deals
    filteredDeals.sort((a, b) => {
      let aValue: any = a.updatedAt;
      let bValue: any = b.updatedAt;
      
      if (sortBy === 'name') {
        aValue = a.name;
        bValue = b.name;
      } else if (sortBy === 'value') {
        aValue = parseFloat(a.amount || '0');
        bValue = parseFloat(b.amount || '0');
      } else if (sortBy === 'probability') {
        aValue = parseInt(a.probability || '0');
        bValue = parseInt(b.probability || '0');
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginate
    const total = filteredDeals.length;
    const offset = (page - 1) * limit;
    const paginatedDeals = filteredDeals.slice(offset, offset + limit);

    // Transform to DTOs
    const dealDTOs: DealDTO[] = paginatedDeals.map(deal => {
      const account = accountsMap.get(deal.accountId || '');
      const contact = contactsMap.get(deal.contactId || '');
      const owner = usersMap.get(deal.assignedTo || '');
      const stage = stagesMap.get(deal.stageId || '');

      return {
        id: deal.id,
        name: deal.name,
        stageId: deal.stageId,
        stageName: stage?.name,
        stageColor: stage?.color,
        value: parseFloat(deal.amount || '0'),
        currency: 'YER',
        probability: parseInt(deal.probability || '0'),
        expectedCloseDate: deal.expectedCloseDate,
        actualCloseDate: deal.actualCloseDate,
        accountId: deal.accountId,
        accountName: account?.name,
        contactId: deal.contactId,
        contactName: contact ? `${contact.name}` : undefined,
        ownerId: deal.assignedTo,
        ownerName: owner?.name,
        description: deal.description,
        nextStep: deal.nextStep,
        tags: deal.tags || [],
        leadSource: deal.leadSource,
        createdAt: deal.createdAt,
        updatedAt: deal.updatedAt
      };
    });

    return {
      deals: dealDTOs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getDealById(id: string): Promise<DealDTO | null> {
    const deal = await storage.instance.getOpportunityById(id);
    if (!deal) return null;

    const allAccounts = await storage.instance.getAllAccounts();
    const allContacts = await storage.instance.getAllContacts();
    const allUsers = await storage.instance.getAllUsers();
    const allStages = await storage.instance.getAllDealStages();
    
    const account = allAccounts.find(acc => acc.id === deal.accountId);
    const contact = allContacts.find(cont => cont.id === deal.contactId);
    const owner = allUsers.find(user => user.id === deal.assignedTo);
    const stage = allStages.find(stage => stage.id === deal.stageId);

    return {
      id: deal.id,
      name: deal.name,
      stageId: deal.stageId,
      stageName: stage?.name,
      stageColor: stage?.color,
      value: parseFloat(deal.amount || '0'),
      currency: 'YER',
      probability: parseInt(deal.probability || '0'),
      expectedCloseDate: deal.expectedCloseDate,
      actualCloseDate: deal.actualCloseDate,
      accountId: deal.accountId,
      accountName: account?.name,
      contactId: deal.contactId,
      contactName: contact ? `${contact.name}` : undefined,
      ownerId: deal.assignedTo,
      ownerName: owner?.name,
      description: deal.description,
      nextStep: deal.nextStep,
      tags: deal.tags || [],
      leadSource: deal.leadSource,
      createdAt: deal.createdAt,
      updatedAt: deal.updatedAt
    };
  }

  async getKanbanData(): Promise<KanbanDataDTO> {
    const stages = await storage.instance.getAllDealStages();
    const deals = await this.getDeals();
    
    // Transform stages to DTOs
    const stageDTOs: DealStageDTO[] = stages
      .sort((a, b) => parseInt(a.position) - parseInt(b.position))
      .map(stage => ({
        id: stage.id,
        name: stage.name,
        position: parseInt(stage.position),
        probability: parseInt(stage.probability),
        color: stage.color,
        isClosed: stage.isClosed === 'true',
        isWon: stage.isWon === 'true'
      }));

    // Calculate statistics
    const totalDeals = deals.total;
    const totalValue = deals.deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const wonDeals = deals.deals.filter(deal => {
      const stage = stageDTOs.find(s => s.id === deal.stageId);
      return stage?.isWon;
    });
    const winRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;

    return {
      stages: stageDTOs,
      deals: deals.deals,
      statistics: {
        totalDeals,
        totalValue,
        winRate,
        avgDealSize
      }
    };
  }

  async createDeal(input: DealCreateInput): Promise<DealDTO | null> {
    const dealData: InsertOpportunity = {
      name: input.name,
      stageId: input.stageId,
      amount: input.value?.toString(),
      probability: input.probability?.toString() || '0',
      expectedCloseDate: input.expectedCloseDate,
      accountId: input.accountId,
      contactId: input.contactId,
      assignedTo: input.ownerId,
      description: input.description,
      nextStep: input.nextStep,
      leadSource: input.leadSource,
      tags: input.tags || []
    };

    const deal = await storage.instance.createOpportunity(dealData);
    return this.getDealById(deal.id);
  }

  async updateDeal(id: string, input: DealUpdateInput): Promise<DealDTO | null> {
    const updates: Partial<Opportunity> = {};
    
    if (input.name !== undefined) updates.name = input.name;
    if (input.stageId !== undefined) updates.stageId = input.stageId;
    if (input.value !== undefined) updates.amount = input.value.toString();
    if (input.probability !== undefined) updates.probability = input.probability.toString();
    if (input.expectedCloseDate !== undefined) updates.expectedCloseDate = input.expectedCloseDate;
    if (input.actualCloseDate !== undefined) updates.actualCloseDate = input.actualCloseDate;
    if (input.accountId !== undefined) updates.accountId = input.accountId;
    if (input.contactId !== undefined) updates.contactId = input.contactId;
    if (input.ownerId !== undefined) updates.assignedTo = input.ownerId;
    if (input.description !== undefined) updates.description = input.description;
    if (input.nextStep !== undefined) updates.nextStep = input.nextStep;
    if (input.leadSource !== undefined) updates.leadSource = input.leadSource;
    if (input.tags !== undefined) updates.tags = input.tags;
    if (input.lossReason !== undefined) updates.lossReason = input.lossReason;

    const updatedDeal = await storage.instance.updateOpportunity(id, updates);
    return this.getDealById(updatedDeal.id);
  }

  async updateDealStage(id: string, stageId: string): Promise<DealDTO | null> {
    return this.updateDeal(id, { stageId });
  }

  async deleteDeal(id: string): Promise<boolean> {
    return storage.instance.deleteOpportunity(id);
  }

  async getDealStages(): Promise<DealStageDTO[]> {
    const stages = await storage.instance.getAllDealStages();
    return stages
      .sort((a, b) => parseInt(a.position) - parseInt(b.position))
      .map(stage => ({
        id: stage.id,
        name: stage.name,
        position: parseInt(stage.position),
        probability: parseInt(stage.probability),
        color: stage.color,
        isClosed: stage.isClosed === 'true',
        isWon: stage.isWon === 'true'
      }));
  }
}

export const dealsService = new DealsService();