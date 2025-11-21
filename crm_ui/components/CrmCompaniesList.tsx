import React from 'react';
import { EnterpriseAccountsTable } from './tables/EnterpriseAccountsTable';
import { Card } from './base/Card';

interface CompaniesListProps {
  onCompanySelect?: (company: any) => void;
  onCreateCompany?: () => void;
}

export const CrmCompaniesList: React.FC<CompaniesListProps> = ({
  onCompanySelect,
  onCreateCompany
}) => {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">الشركات</h2>
        <button 
          onClick={onCreateCompany}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          data-testid="button-create-company"
        >
          <i className="fas fa-plus"></i>
          إضافة شركة
        </button>
      </div>

      {/* Enterprise Table */}
      <EnterpriseAccountsTable
        onRowClick={onCompanySelect}
        className="mt-4"
      />
    </Card>
  );
};