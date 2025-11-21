import React from 'react';
import { EnterpriseTableController, TableColumn } from '../EnterpriseTableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { Building, Globe, DollarSign, Users, MapPin } from 'lucide-react';

export interface AccountsTableProps {
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  className?: string;
}

export const EnterpriseAccountsTable: React.FC<AccountsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = ''
}) => {
  const columns: TableColumn[] = [
    {
      key: 'legalName',
      label: 'اسم الشركة',
      sortable: true,
      visible: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            {row.industry && (
              <div className="text-sm text-gray-500">{row.industry}</div>
            )}
          </div>
        </div>
      ),
      exportRender: (value) => value
    },
    {
      key: 'industry',
      label: 'الصناعة',
      sortable: true,
      visible: true,
      render: (value) => value || <span className="text-gray-400">غير محدد</span>
    },
    {
      key: 'sizeTier',
      label: 'حجم الشركة',
      sortable: true,
      visible: true,
      render: (value) => {
        const sizeMap = {
          startup: { label: 'شركة ناشئة', variant: 'secondary' as const },
          small: { label: 'صغيرة', variant: 'outline' as const },
          medium: { label: 'متوسطة', variant: 'default' as const },
          large: { label: 'كبيرة', variant: 'destructive' as const },
          enterprise: { label: 'مؤسسة', variant: 'default' as const }
        };
        const size = sizeMap[value as keyof typeof sizeMap] || { label: 'غير محدد', variant: 'outline' as const };
        return <Badge variant={size.variant}>{size.label}</Badge>;
      },
      exportRender: (value) => {
        const sizeMap = {
          startup: 'شركة ناشئة',
          small: 'صغيرة',
          medium: 'متوسطة',
          large: 'كبيرة',
          enterprise: 'مؤسسة'
        };
        return sizeMap[value as keyof typeof sizeMap] || 'غير محدد';
      }
    },
    {
      key: 'website',
      label: 'الموقع الإلكتروني',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <a 
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        </div>
      ) : <span className="text-gray-400">غير متوفر</span>
    },
    {
      key: 'annualRevenue',
      label: 'الإيرادات السنوية',
      sortable: true,
      visible: true,
      type: 'currency',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-600">
            ${value?.toLocaleString()}
          </span>
        </div>
      ) : <span className="text-gray-400">غير محدد</span>,
      exportRender: (value) => value ? `$${value.toLocaleString()}` : ''
    },
    {
      key: 'numberOfEmployees',
      label: 'عدد الموظفين',
      sortable: true,
      visible: true,
      type: 'number',
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{value?.toLocaleString()}</span>
        </div>
      ) : <span className="text-gray-400">غير محدد</span>,
      exportRender: (value) => value ? value.toString() : ''
    },
    {
      key: 'billingAddress',
      label: 'عنوان الفواتير',
      sortable: false,
      visible: true,
      render: (value) => {
        if (!value || typeof value !== 'object') {
          return <span className="text-gray-400">غير متوفر</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              {[value.city, value.state, value.country].filter(Boolean).join(', ')}
            </div>
          </div>
        );
      },
      exportRender: (value) => {
        if (!value || typeof value !== 'object') return '';
        return [value.street, value.city, value.state, value.postalCode, value.country]
          .filter(Boolean).join(', ');
      }
    },
    {
      key: 'parentAccountId',
      label: 'الشركة الأم',
      sortable: true,
      visible: false,
      render: (value) => value ? (
        <Badge variant="outline">مرتبط</Badge>
      ) : <span className="text-gray-400">مستقل</span>,
      exportRender: (value) => value ? 'مرتبط' : 'مستقل'
    },
    {
      key: 'isPartner',
      label: 'شريك',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'شريك' : 'عميل'}
        </Badge>
      ),
      exportRender: (value) => value ? 'شريك' : 'عميل'
    },
    {
      key: 'isActive',
      label: 'نشط',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'نشط' : 'غير نشط'}
        </Badge>
      ),
      exportRender: (value) => value ? 'نشط' : 'غير نشط'
    },
    {
      key: 'ownerId',
      label: 'مدير الحساب',
      sortable: true,
      visible: true,
      render: (value) => value || <span className="text-gray-400">غير مُعيَّن</span>
    },
    {
      key: 'createdAt',
      label: 'تاريخ الإنشاء',
      sortable: true,
      visible: true,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    },
    {
      key: 'updatedAt',
      label: 'آخر تحديث',
      sortable: true,
      visible: false,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : ''
    }
  ];

  return (
    <EnterpriseTableController
      endpoint="/api/tables/accounts"
      tableName="accounts"
      queryKey={['enterprise-accounts']}
      columns={columns}
      defaultPageSize={25}
      defaultSort={[{ field: 'createdAt', direction: 'desc' }]}
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