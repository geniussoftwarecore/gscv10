import React from 'react';
import { TableController, type TableColumn } from '../TableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const companyColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'اسم الشركة',
    sortable: true,
    visible: true,
  },
  {
    key: 'industry',
    label: 'الصناعة',
    sortable: true,
    visible: true,
  },
  {
    key: 'type',
    label: 'نوع الشركة',
    sortable: true,
    visible: true,
    render: (value: string) => {
      const typeLabels: Record<string, string> = {
        'customer': 'عميل',
        'prospect': 'عميل محتمل',
        'partner': 'شريك',
        'vendor': 'مورد',
        'competitor': 'منافس'
      };
      return typeLabels[value] || value;
    },
  },
  {
    key: 'email',
    label: 'البريد الإلكتروني',
    sortable: true,
    visible: true,
  },
  {
    key: 'phone',
    label: 'الهاتف',
    sortable: true,
    visible: true,
  },
  {
    key: 'website',
    label: 'الموقع الإلكتروني',
    sortable: true,
    visible: true,
    render: (value: string) => {
      if (!value) return '—';
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      );
    },
  },
  {
    key: 'isActive',
    label: 'الحالة',
    sortable: true,
    visible: true,
    render: (value: string) => (
      <Badge variant={value === 'true' ? 'default' : 'secondary'}>
        {value === 'true' ? 'نشط' : 'غير نشط'}
      </Badge>
    ),
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

interface CompaniesTableProps {
  onRowClick?: (company: any) => void;
  onRowSelect?: (selectedCompanies: any[]) => void;
  className?: string;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  onRowClick,
  onRowSelect,
  className = '',
}) => {
  return (
    <TableController
      endpoint="/api/companies"
      queryKey={['companies']}
      columns={companyColumns}
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

export default CompaniesTable;