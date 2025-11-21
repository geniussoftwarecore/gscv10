import React from 'react';
import { EnterpriseContactsTable } from './tables/EnterpriseContactsTable';
import { Card } from './base/Card';

interface ContactsListProps {
  onContactSelect?: (contact: any) => void;
  onCreateContact?: () => void;
}

export const CrmContactsList: React.FC<ContactsListProps> = ({
  onContactSelect,
  onCreateContact
}) => {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">جهات الاتصال</h2>
        <button 
          onClick={onCreateContact}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          data-testid="button-create-contact"
        >
          <i className="fas fa-plus"></i>
          إضافة جهة اتصال
        </button>
      </div>

      {/* Enterprise Table */}
      <EnterpriseContactsTable
        onRowClick={onContactSelect}
        className="mt-4"
      />
    </Card>
  );
};