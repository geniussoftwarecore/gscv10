import React from 'react';
import { TableController, type TableColumn } from '../TableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const ticketColumns: TableColumn[] = [
  {
    key: 'subject',
    label: 'الموضوع',
    sortable: true,
    visible: true,
  },
  {
    key: 'status',
    label: 'الحالة',
    sortable: true,
    visible: true,
    render: (value: string) => {
      const statusLabels: Record<string, string> = {
        'open': 'مفتوح',
        'in-progress': 'قيد المعالجة',
        'resolved': 'محلول',
        'closed': 'مغلق'
      };
      const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        'open': 'destructive',
        'in-progress': 'secondary',
        'resolved': 'default',
        'closed': 'outline'
      };
      return (
        <Badge variant={statusColors[value] || 'default'}>
          {statusLabels[value] || value}
        </Badge>
      );
    },
  },
  {
    key: 'priority',
    label: 'الأولوية',
    sortable: true,
    visible: true,
    render: (value: string) => {
      const priorityLabels: Record<string, string> = {
        'low': 'منخفضة',
        'medium': 'متوسطة',
        'high': 'عالية',
        'urgent': 'عاجلة'
      };
      const priorityColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        'low': 'outline',
        'medium': 'default',
        'high': 'secondary',
        'urgent': 'destructive'
      };
      return (
        <Badge variant={priorityColors[value] || 'default'}>
          {priorityLabels[value] || value}
        </Badge>
      );
    },
  },
  {
    key: 'category',
    label: 'الفئة',
    sortable: true,
    visible: true,
    render: (value: string) => {
      const categoryLabels: Record<string, string> = {
        'general': 'عام',
        'technical': 'فني',
        'billing': 'فوترة',
        'feature-request': 'طلب ميزة'
      };
      return categoryLabels[value] || value;
    },
  },
  {
    key: 'assignedTo',
    label: 'المسؤول',
    sortable: true,
    visible: true,
  },
  {
    key: 'description',
    label: 'الوصف',
    sortable: false,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    },
  },
  {
    key: 'createdAt',
    label: 'تاريخ الإنشاء',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return format(new Date(value), 'dd/MM/yyyy', { locale: ar });
    },
  },
  {
    key: 'updatedAt',
    label: 'آخر تحديث',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return format(new Date(value), 'dd/MM/yyyy', { locale: ar });
    },
  },
];

interface TicketsTableProps {
  onRowClick?: (ticket: any) => void;
  onRowSelect?: (selectedTickets: any[]) => void;
  className?: string;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = '',
}) => {
  return (
    <TableController
      endpoint="/api/tickets"
      queryKey={['tickets']}
      columns={ticketColumns}
      defaultPageSize={25}
      defaultSort={[{ field: 'createdAt', direction: 'desc' }]}
      enableExport={true}
      enableSavedViews={true}
      enableColumnToggle={true}
      onRowClick={onRowClick}
      onRowSelect={onRowSelect}
      className={className}
    />
  );
};

export default TicketsTable;