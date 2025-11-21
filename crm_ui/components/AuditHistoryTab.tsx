import React, { useState, useEffect } from 'react';
import { Badge } from './base/Badge';
import { Button } from './base/Button';
import { Card, CardHeader, CardTitle, CardContent } from './base/Card';

interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  diff?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changed?: string[];
  };
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    source?: string;
    requestId?: string;
    sessionId?: string;
  };
  createdAt: string;
  actorName?: string; // Will be populated from user lookup
}

interface AuditHistoryTabProps {
  entityType: string;
  entityId: string;
  entityName?: string;
  className?: string;
}

export const AuditHistoryTab: React.FC<AuditHistoryTabProps> = ({
  entityType,
  entityId,
  entityName,
  className = ''
}) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    loadAuditLogs();
  }, [entityType, entityId, page]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/audit-logs?entityType=${entityType}&entityId=${entityId}&page=${page}&limit=20`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data.logs);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeVariant = (action: string): "default" | "secondary" | "success" | "warning" | "danger" => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'success';
      case 'update':
      case 'edit':
        return 'default';
      case 'delete':
        return 'danger';
      case 'export':
        return 'warning';
      case 'view':
        return 'secondary';
      case 'assign':
      case 'escalate':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getActionIcon = (action: string): string => {
    switch (action.toLowerCase()) {
      case 'create':
        return '➕';
      case 'update':
      case 'edit':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'export':
        return '📤';
      case 'view':
        return '👁️';
      case 'assign':
        return '👤';
      case 'escalate':
        return '⬆️';
      default:
        return '📝';
    }
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} يوم${diffDays > 1 ? '' : ''} مضى`;
    } else if (diffHours > 0) {
      return `${diffHours} ساعة${diffHours > 1 ? '' : ''} مضت`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} دقيقة${diffMinutes > 1 ? '' : ''} مضت`;
    } else {
      return 'الآن';
    }
  };

  const renderFieldChange = (field: string, before: any, after: any) => {
    const beforeValue = before?.[field];
    const afterValue = after?.[field];

    if (beforeValue === afterValue) return null;

    return (
      <div key={field} className="border-r-2 border-blue-200 pr-3 mb-2 text-sm">
        <div className="font-medium text-gray-700 mb-1">{field}</div>
        <div className="space-y-1">
          {beforeValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xs">من:</span>
              <span className="bg-red-50 text-red-800 px-2 py-1 rounded text-xs">
                {String(beforeValue) || '(فارغ)'}
              </span>
            </div>
          )}
          {afterValue !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-xs">إلى:</span>
              <span className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs">
                {String(afterValue) || '(فارغ)'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && auditLogs.length === 0) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">جاري تحميل السجل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">سجل النشاطات</h3>
          <p className="text-sm text-gray-600">
            جميع التغييرات والأنشطة المتعلقة بـ {entityName || entityId}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAuditLogs}
          disabled={loading}
        >
          تحديث
        </Button>
      </div>

      {/* Audit Timeline */}
      <div className="space-y-3">
        {auditLogs.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">
                <div className="text-4xl mb-4">📋</div>
                <div className="text-lg font-medium mb-2">لا توجد أنشطة بعد</div>
                <div className="text-sm">
                  سيظهر هنا سجل بجميع التغييرات والأنشطة المتعلقة بهذا العنصر
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          auditLogs.map((log, index) => (
            <Card key={log.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                      {getActionIcon(log.action)}
                    </div>
                    {index < auditLogs.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Event details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        بواسطة {log.actorName || log.actorId}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(log.createdAt)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-800 mb-2">
                      {log.action === 'create' && 'تم إنشاء العنصر'}
                      {log.action === 'update' && 'تم تحديث العنصر'}
                      {log.action === 'delete' && 'تم حذف العنصر'}
                      {log.action === 'export' && 'تم تصدير البيانات'}
                      {log.action === 'view' && 'تم عرض العنصر'}
                      {log.action === 'assign' && 'تم تعيين العنصر'}
                      {log.action === 'escalate' && 'تم تصعيد العنصر'}
                    </div>

                    {/* Show changed fields if available */}
                    {log.diff?.changed && log.diff.changed.length > 0 && (
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => 
                            setExpandedLog(expandedLog === log.id ? null : log.id)
                          }
                          className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          {expandedLog === log.id ? 'إخفاء' : 'عرض'} التغييرات ({log.diff.changed.length})
                        </Button>

                        {expandedLog === log.id && (
                          <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2">
                            {log.diff.changed.map(field => 
                              renderFieldChange(field, log.diff?.before, log.diff?.after)
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    {log.metadata && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
                        {log.metadata.source && (
                          <span>المصدر: {log.metadata.source}</span>
                        )}
                        {log.metadata.ipAddress && (
                          <span>IP: {log.metadata.ipAddress}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            السابق
          </Button>
          
          <span className="text-sm text-gray-600 px-3">
            صفحة {page} من {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            التالي
          </Button>
        </div>
      )}
    </div>
  );
};