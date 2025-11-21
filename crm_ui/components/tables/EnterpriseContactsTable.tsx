import React from 'react';
import { EnterpriseTableController, TableColumn } from '../EnterpriseTableController';
import { Badge } from '../base/Badge';
import { Button } from '../base/Button';
import { format } from 'date-fns';
import { Mail, Phone, Building, User } from 'lucide-react';

export interface ContactsTableProps {
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  className?: string;
}

export const EnterpriseContactsTable: React.FC<ContactsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = ''
}) => {
  const columns: TableColumn[] = [
    {
      key: 'firstName',
      label: 'الاسم الأول',
      sortable: true,
      visible: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {value} {row.lastName}
            </div>
            {row.jobTitle && (
              <div className="text-sm text-gray-500">{row.jobTitle}</div>
            )}
          </div>
        </div>
      ),
      exportRender: (value, row) => `${value} ${row.lastName}`
    },
    {
      key: 'lastName',
      label: 'الاسم الأخير',
      sortable: true,
      visible: false // Hidden by default since included in firstName render
    },
    {
      key: 'primaryEmail',
      label: 'البريد الإلكتروني',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <a 
            href={`mailto:${value}`} 
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        </div>
      ) : <span className="text-gray-400">غير متوفر</span>
    },
    {
      key: 'jobTitle',
      label: 'المسمى الوظيفي',
      sortable: true,
      visible: true,
      render: (value) => value || <span className="text-gray-400">غير محدد</span>
    },
    {
      key: 'department',
      label: 'القسم',
      sortable: true,
      visible: true,
      render: (value) => value || <span className="text-gray-400">غير محدد</span>
    },
    {
      key: 'accountId',
      label: 'الشركة',
      sortable: true,
      visible: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value || 'غير مرتبط'}</span>
        </div>
      )
    },
    {
      key: 'phones',
      label: 'الهاتف',
      sortable: false,
      visible: true,
      render: (value) => {
        if (!value || !Array.isArray(value) || value.length === 0) {
          return <span className="text-gray-400">غير متوفر</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a 
              href={`tel:${value[0]}`}
              className="text-blue-600 hover:text-blue-800"
              onClick={(e) => e.stopPropagation()}
            >
              {value[0]}
            </a>
            {value.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 1}
              </Badge>
            )}
          </div>
        );
      },
      exportRender: (value) => Array.isArray(value) ? value.join(', ') : ''
    },
    {
      key: 'optInStatus',
      label: 'حالة الاشتراك',
      sortable: true,
      visible: true,
      render: (value) => {
        const statusMap = {
          opted_in: { label: 'مشترك', variant: 'default' as const },
          opted_out: { label: 'غير مشترك', variant: 'destructive' as const },
          pending: { label: 'معلق', variant: 'secondary' as const }
        };
        const status = statusMap[value as keyof typeof statusMap] || statusMap.pending;
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
      exportRender: (value) => {
        const statusMap = {
          opted_in: 'مشترك',
          opted_out: 'غير مشترك',  
          pending: 'معلق'
        };
        return statusMap[value as keyof typeof statusMap] || 'معلق';
      }
    },
    {
      key: 'isPrimary',
      label: 'جهة اتصال رئيسية',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'نعم' : 'لا'}
        </Badge>
      ),
      exportRender: (value) => value ? 'نعم' : 'لا'
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
      endpoint="/api/tables/contacts"
      tableName="contacts"
      queryKey={['enterprise-contacts']}
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