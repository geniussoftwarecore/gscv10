import React from 'react';
import { TableController, type TableColumn } from '../TableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const dealColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'اسم الصفقة',
    sortable: true,
    visible: true,
  },
  {
    key: 'stage',
    label: 'المرحلة',
    sortable: true,
    visible: true,
    render: (value: string) => {
      const stageLabels: Record<string, string> = {
        'prospecting': 'استطلاع',
        'qualification': 'تأهيل',
        'proposal': 'اقتراح',
        'negotiation': 'تفاوض',
        'closed-won': 'مغلقة - فازت',
        'closed-lost': 'مغلقة - خسرت'
      };
      const stageColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
        'prospecting': 'outline',
        'qualification': 'default',
        'proposal': 'secondary',
        'negotiation': 'secondary',
        'closed-won': 'default',
        'closed-lost': 'destructive'
      };
      return (
        <Badge variant={stageColors[value] || 'default'}>
          {stageLabels[value] || value}
        </Badge>
      );
    },
  },
  {
    key: 'amount',
    label: 'القيمة',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      const amount = parseFloat(value);
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
      }).format(amount);
    },
  },
  {
    key: 'probability',
    label: 'احتمالية النجاح',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return `${value}%`;
    },
  },
  {
    key: 'expectedCloseDate',
    label: 'تاريخ الإغلاق المتوقع',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return format(new Date(value), 'dd/MM/yyyy', { locale: ar });
    },
  },
  {
    key: 'leadSource',
    label: 'مصدر العميل المحتمل',
    sortable: true,
    visible: true,
  },
  {
    key: 'assignedTo',
    label: 'المسؤول',
    sortable: true,
    visible: true,
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
];

interface DealsTableProps {
  onRowClick?: (deal: any) => void;
  onRowSelect?: (selectedDeals: any[]) => void;
  className?: string;
}

export const DealsTable: React.FC<DealsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = '',
}) => {
  return (
    <TableController
      endpoint="/api/deals"
      queryKey={['deals']}
      columns={dealColumns}
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

export default DealsTable;