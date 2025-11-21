import React, { useState, useEffect } from 'react';
import { Card } from './base/Card';
import { Badge } from './base/Badge';

interface TimelineActivity {
  id: string;
  type: 'call' | 'meeting' | 'task' | 'message' | 'note' | 'attachment';
  title: string;
  subject?: string;
  description?: string;
  actorId?: string;
  outcome?: string;
  durationSec?: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }>;
  dueAt?: string;
  reminderAt?: string;
  completedAt?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CrmTimelineProps {
  entityType: 'contact' | 'account' | 'deal' | 'lead';
  entityId: string;
  onAddActivity?: () => void;
}

export const CrmTimeline: React.FC<CrmTimelineProps> = ({
  entityType,
  entityId,
  onAddActivity
}) => {
  const [activities, setActivities] = useState<TimelineActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [entityType, entityId]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crm/activities/${entityType}/${entityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return 'fas fa-phone';
      case 'meeting': return 'fas fa-calendar';
      case 'task': return 'fas fa-tasks';
      case 'message': return 'fas fa-envelope';
      case 'note': return 'fas fa-sticky-note';
      case 'attachment': return 'fas fa-paperclip';
      default: return 'fas fa-circle';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-100';
      case 'meeting': return 'text-purple-600 bg-purple-100';
      case 'task': return 'text-green-600 bg-green-100';
      case 'message': return 'text-orange-600 bg-orange-100';
      case 'note': return 'text-yellow-600 bg-yellow-100';
      case 'attachment': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call': return 'مكالمة';
      case 'meeting': return 'اجتماع';
      case 'task': return 'مهمة';
      case 'message': return 'رسالة';
      case 'note': return 'ملاحظة';
      case 'attachment': return 'مرفق';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}س ${minutes}د`;
    }
    return `${minutes}د`;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-secondary">الجدول الزمني للأنشطة</h3>
        {onAddActivity && (
          <button
            onClick={onAddActivity}
            className="text-primary hover:text-primary/80 text-sm font-medium"
            data-testid="button-add-activity"
          >
            <i className="fas fa-plus ml-1"></i>
            إضافة نشاط
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <i className="fas fa-history text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أنشطة</h3>
            <p className="text-gray-500">لم يتم تسجيل أي أنشطة بعد</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="relative flex gap-4"
              data-testid={`timeline-item-${activity.id}`}
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute right-4 top-10 w-0.5 h-full bg-gray-200"></div>
              )}
              
              {/* Activity icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <i className={`${getActivityIcon(activity.type)} text-sm`}></i>
              </div>
              
              {/* Activity content */}
              <div className="flex-1 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(activity.type)}
                        </Badge>
                        {activity.isCompleted && (
                          <Badge variant="success" className="text-xs">
                            <i className="fas fa-check mr-1"></i>
                            مكتملة
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-secondary text-sm">
                        {activity.title}
                      </h4>
                      {activity.subject && (
                        <p className="text-sm text-muted-foreground">
                          {activity.subject}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground text-left">
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                  
                  {/* Description */}
                  {activity.description && (
                    <div className="mb-3 text-sm text-muted-foreground">
                      {activity.description}
                    </div>
                  )}
                  
                  {/* Duration */}
                  {activity.durationSec && (
                    <div className="mb-2 text-sm text-muted-foreground">
                      <i className="fas fa-clock ml-1"></i>
                      المدة: {formatDuration(activity.durationSec)}
                    </div>
                  )}
                  
                  {/* Outcome */}
                  {activity.outcome && (
                    <div className="mb-2 text-sm">
                      <span className="font-medium text-secondary">النتيجة:</span>
                      <span className="text-muted-foreground mr-2">{activity.outcome}</span>
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {activity.attachments && activity.attachments.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-secondary mb-2">المرفقات:</div>
                      <div className="space-y-1">
                        {activity.attachments.map((attachment) => (
                          <div 
                            key={attachment.id} 
                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                          >
                            <i className="fas fa-file text-xs"></i>
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {attachment.name}
                            </a>
                            <span className="text-xs text-muted-foreground">
                              ({(attachment.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Due date */}
                  {activity.dueAt && (
                    <div className="mt-2 text-sm text-orange-600">
                      <i className="fas fa-clock ml-1"></i>
                      موعد الاستحقاق: {formatDate(activity.dueAt)}
                    </div>
                  )}
                  
                  {/* Completion date */}
                  {activity.completedAt && (
                    <div className="mt-2 text-sm text-green-600">
                      <i className="fas fa-check ml-1"></i>
                      تم إنجازه في: {formatDate(activity.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
