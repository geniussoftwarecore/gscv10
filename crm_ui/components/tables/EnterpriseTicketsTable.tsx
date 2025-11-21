import React from 'react';
import { EnterpriseTableController, TableColumn } from '../EnterpriseTableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  Ticket, 
  AlertTriangle, 
  Clock, 
  User, 
  Building, 
  Tag,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export interface TicketsTableProps {
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  className?: string;
}

export const EnterpriseTicketsTable: React.FC<TicketsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = ''
}) => {
  const columns: TableColumn[] = [
    {
      key: 'ticketNumber',
      label: 'رقم التذكرة',
      sortable: true,
      visible: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg ${getStatusColor(row.status)} flex items-center justify-center`}>
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900 font-mono">#{value}</div>
            <div className="text-sm text-gray-500">{getPriorityLabel(row.priority)}</div>
          </div>
        </div>
      ),
      exportRender: (value) => `#${value}`
    },
    {
      key: 'subject',
      label: 'الموضوع',
      sortable: true,
      visible: true,
      width: '300px',
      render: (value, row) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 line-clamp-2">{value}</div>
          {row.category && (
            <div className="flex items-center gap-1 mt-1">
              <Tag className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{getCategoryLabel(row.category)}</span>
            </div>
          )}
        </div>
      ),
      exportRender: (value) => value
    },
    {
      key: 'priority',
      label: 'الأولوية',
      sortable: true,
      visible: true,
      render: (value) => {
        const config = getPriorityConfig(value);
        return (
          <div className="flex items-center gap-2">
            {config.icon}
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
      exportRender: (value) => getPriorityLabel(value)
    },
    {
      key: 'status',
      label: 'الحالة',
      sortable: true,
      visible: true,
      render: (value) => {
        const config = getStatusConfig(value);
        return (
          <div className="flex items-center gap-2">
            {config.icon}
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
      exportRender: (value) => getStatusLabel(value)
    },
    {
      key: 'category',
      label: 'الفئة',
      sortable: true,
      visible: true,
      render: (value) => (
        <Badge variant="outline">
          {getCategoryLabel(value)}
        </Badge>
      ),
      exportRender: (value) => getCategoryLabel(value)
    },
    {
      key: 'assignedTo',
      label: 'المُكلَّف',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ) : <span className="text-gray-400">غير مُعيَّن</span>
    },
    {
      key: 'contactId',
      label: 'جهة الاتصال',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ) : <span className="text-gray-400">غير مرتبط</span>
    },
    {
      key: 'accountId',
      label: 'الشركة',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ) : <span className="text-gray-400">غير مرتبط</span>
    },
    {
      key: 'slaTarget',
      label: 'هدف اتفاقية مستوى الخدمة',
      sortable: true,
      visible: true,
      type: 'date',
      render: (value, row) => {
        if (!value) return <span className="text-gray-400">غير محدد</span>;
        
        const targetDate = new Date(value);
        const now = new Date();
        const isBreached = row.slaBreached || targetDate < now;
        
        return (
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isBreached ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={isBreached ? 'text-red-600 font-medium' : 'text-gray-900'}>
              {format(targetDate, 'dd/MM/yyyy HH:mm', { locale: ar })}
            </span>
            {isBreached && (
              <Badge variant="destructive" className="text-xs">متأخر</Badge>
            )}
          </div>
        );
      },
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    },
    {
      key: 'slaBreached',
      label: 'انتهاك اتفاقية مستوى الخدمة',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'destructive' : 'default'}>
          {value ? 'منتهك' : 'ملتزم'}
        </Badge>
      ),
      exportRender: (value) => value ? 'منتهك' : 'ملتزم'
    },
    {
      key: 'firstResponseAt',
      label: 'أول رد',
      sortable: true,
      visible: false,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : 
                                <span className="text-gray-400">لم يرد بعد</span>,
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    },
    {
      key: 'resolvedAt',
      label: 'تاريخ الحل',
      sortable: true,
      visible: false,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    },
    {
      key: 'satisfaction',
      label: 'تقييم الرضا',
      sortable: true,
      visible: true,
      type: 'number',
      render: (value) => {
        if (!value) return <span className="text-gray-400">غير مُقيَّم</span>;
        
        const stars = Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i} 
            className={`text-lg ${i < value ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ));
        
        return (
          <div className="flex items-center gap-1">
            {stars}
            <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
          </div>
        );
      },
      exportRender: (value) => value ? `${value}/5` : ''
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      sortable: true,
      visible: true,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    },
    {
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      visible: false,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    }
  ];

  return (
    <EnterpriseTableController
      endpoint="/api/tables/tickets"
      tableName="tickets"
      queryKey={['enterprise-tickets']}
      columns={columns}
      defaultPageSize={25}
      defaultSort={[
        { field: 'priority', direction: 'desc', priority: 0 },
        { field: 'createdAt', direction: 'desc', priority: 1 }
      ]}
      enableExport={true}
      enableSavedViews={true}
      enableColumnToggle={true}
      enableMultiSort={true}
      enableSearch={true}
      enableFilters={true}
      className={className}
      onRowClick={onRowClick}
      onRowSelect={onRowSelect}
    />
  );
};

// Helper functions
function getPriorityLabel(priority: string): string {
  const priorityMap = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    urgent: 'عاجلة'
  };
  return priorityMap[priority as keyof typeof priorityMap] || priority;
}

function getPriorityConfig(priority: string) {
  const configs = {
    low: { 
      label: 'منخفضة', 
      variant: 'secondary' as const,
      icon: <div className="w-2 h-2 rounded-full bg-green-500" />
    },
    medium: { 
      label: 'متوسطة', 
      variant: 'outline' as const,
      icon: <div className="w-2 h-2 rounded-full bg-yellow-500" />
    },
    high: { 
      label: 'عالية', 
      variant: 'default' as const,
      icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
    },
    urgent: { 
      label: 'عاجلة', 
      variant: 'destructive' as const,
      icon: <AlertCircle className="w-4 h-4 text-red-500" />
    }
  };
  return configs[priority as keyof typeof configs] || 
         { label: priority, variant: 'outline' as const, icon: null };
}

function getStatusLabel(status: string): string {
  const statusMap = {
    open: 'مفتوح',
    in_progress: 'قيد التنفيذ',
    pending: 'معلق',
    resolved: 'محلول',
    closed: 'مغلق'
  };
  return statusMap[status as keyof typeof statusMap] || status;
}

function getStatusConfig(status: string) {
  const configs = {
    open: { 
      label: 'مفتوح', 
      variant: 'outline' as const,
      icon: <AlertCircle className="w-4 h-4 text-blue-500" />
    },
    in_progress: { 
      label: 'قيد التنفيذ', 
      variant: 'default' as const,
      icon: <Clock className="w-4 h-4 text-blue-500" />
    },
    pending: { 
      label: 'معلق', 
      variant: 'secondary' as const,
      icon: <Clock className="w-4 h-4 text-yellow-500" />
    },
    resolved: { 
      label: 'محلول', 
      variant: 'default' as const,
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    closed: { 
      label: 'مغلق', 
      variant: 'outline' as const,
      icon: <XCircle className="w-4 h-4 text-gray-500" />
    }
  };
  return configs[status as keyof typeof configs] || 
         { label: status, variant: 'outline' as const, icon: null };
}

function getCategoryLabel(category: string): string {
  const categoryMap = {
    general: 'عام',
    technical: 'تقني',
    billing: 'فواتير',
    feature_request: 'طلب ميزة',
    bug: 'خطأ'
  };
  return categoryMap[category as keyof typeof categoryMap] || category;
}

function getStatusColor(status: string): string {
  const colorMap = {
    open: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    pending: 'bg-orange-500',
    resolved: 'bg-green-500',
    closed: 'bg-gray-500'
  };
  return colorMap[status as keyof typeof colorMap] || 'bg-gray-500';
}