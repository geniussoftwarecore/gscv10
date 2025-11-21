import { storage } from "../server/storage";
import type { CrmActivity, InsertCrmActivity, User } from "@shared/schema";

// DTOs for API responses
export interface ActivityDTO {
  id: string;
  type: string;
  title: string;
  subject?: string;
  description?: string;
  actorId: string;
  actorName?: string;
  againstType: string;
  againstId: string;
  outcome?: string;
  durationSec?: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  dueAt?: Date;
  reminderAt?: Date;
  completedAt?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineResponse {
  activities: ActivityDTO[];
  total: number;
  hasMore: boolean;
}

export interface ActivityFilters {
  entityType?: string;
  entityId?: string;
  actorId?: string;
  type?: string;
  isCompleted?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ActivityCreateInput {
  type: string;
  title: string;
  subject?: string;
  description?: string;
  actorId: string;
  againstType: string;
  againstId: string;
  outcome?: string;
  durationSec?: number;
  dueAt?: Date;
  reminderAt?: Date;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
}

export interface ActivityUpdateInput extends Partial<ActivityCreateInput> {
  completedAt?: Date;
  isCompleted?: boolean;
}

class ActivitiesService {
  async getActivities(
    filters: ActivityFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<TimelineResponse> {
    const allActivities = await storage.instance.getAllActivities();
    const allUsers = await storage.instance.getAllUsers();
    
    const usersMap = new Map(allUsers.map(user => [user.id, user]));

    // Filter activities
    let filteredActivities = allActivities;

    if (filters.entityType && filters.entityId) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.relatedTo === filters.entityType && activity.relatedId === filters.entityId
      );
    }

    if (filters.actorId) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.userId === filters.actorId
      );
    }

    if (filters.type) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.type === filters.type
      );
    }

    if (filters.isCompleted !== undefined) {
      filteredActivities = filteredActivities.filter(activity => 
        activity.completedAt ? true : false === filters.isCompleted
      );
    }

    // Sort by creation date (newest first)
    filteredActivities.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Paginate
    const total = filteredActivities.length;
    const offset = (page - 1) * limit;
    const paginatedActivities = filteredActivities.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    // Transform to DTOs
    const activityDTOs: ActivityDTO[] = paginatedActivities.map(activity => {
      const actor = usersMap.get(activity.userId || '');

      return {
        id: activity.id,
        type: activity.type,
        title: activity.title,
        subject: activity.description, // Using description as subject for compatibility
        description: activity.description,
        actorId: activity.userId || '',
        actorName: actor?.name,
        againstType: activity.relatedTo || '',
        againstId: activity.relatedId || '',
        outcome: activity.outcome,
        durationSec: parseInt(activity.duration || '0') * 60, // Convert minutes to seconds
        dueAt: activity.scheduledAt,
        completedAt: activity.completedAt,
        isCompleted: !!activity.completedAt,
        createdAt: activity.createdAt,
        updatedAt: activity.createdAt // Using createdAt as updatedAt since we don't have updatedAt
      };
    });

    return {
      activities: activityDTOs,
      total,
      hasMore
    };
  }

  async getActivitiesByEntity(
    entityType: string,
    entityId: string,
    limit: number = 50
  ): Promise<ActivityDTO[]> {
    const result = await this.getActivities(
      { entityType, entityId },
      1,
      limit
    );
    return result.activities;
  }

  async createActivity(input: ActivityCreateInput): Promise<ActivityDTO | null> {
    const activityData: InsertCrmActivity = {
      type: input.type,
      title: input.title,
      description: input.description,
      userId: input.actorId,
      relatedTo: input.againstType,
      relatedId: input.againstId,
      outcome: input.outcome,
      duration: input.durationSec ? (input.durationSec / 60).toString() : undefined, // Convert seconds to minutes
      scheduledAt: input.dueAt,
      completedAt: input.type === 'note' ? new Date() : undefined // Auto-complete notes
    };

    const activity = await storage.instance.createActivity(activityData);
    
    // Get the created activity with user details
    const result = await this.getActivities({ entityType: input.againstType, entityId: input.againstId }, 1, 1);
    return result.activities.find(a => a.id === activity.id) || null;
  }

  async updateActivity(id: string, input: ActivityUpdateInput): Promise<ActivityDTO | null> {
    // For now, return null since we don't have update implementation in storage
    return null;
  }

  async deleteActivity(id: string): Promise<boolean> {
    // Placeholder - not implemented in storage interface
    return false;
  }

  async completeActivity(id: string): Promise<ActivityDTO | null> {
    return this.updateActivity(id, { 
      completedAt: new Date(),
      isCompleted: true 
    });
  }
}

export const activitiesService = new ActivitiesService();