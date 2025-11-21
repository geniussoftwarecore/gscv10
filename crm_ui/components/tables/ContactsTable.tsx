import React from 'react';
import { TableController, type TableColumn } from '../TableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const contactColumns: TableColumn[] = [
  {
    key: 'name',
    label: 'الاسم',
    sortable: true,
    visible: true,
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
    key: 'jobTitle',
    label: 'المنصب',
    sortable: true,
    visible: true,
  },
  {
    key: 'department',
    label: 'القسم',
    sortable: true,
    visible: true,
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

interface ContactsTableProps {
  onRowClick?: (contact: any) => void;
  onRowSelect?: (selectedContacts: any[]) => void;
  className?: string;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  onRowClick,
  onRowSelect,
  className = '',
}) => {
  return (
    <TableController
      endpoint="/api/contacts"
      queryKey={['contacts']}
      columns={contactColumns}
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

export default ContactsTable;