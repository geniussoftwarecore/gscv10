import React, { useState } from 'react';
import { Card } from './base/Card';
import { Button } from './base/Button';
import { EnterpriseOpportunitiesTable } from './tables/EnterpriseOpportunitiesTable';
import { DealsKanban } from './DealsKanban';
import { Grid, List } from 'lucide-react';

interface DealsKanbanWithTableProps {
  onDealSelect?: (deal: any) => void;
  onCreateDeal?: () => void;
}

export const DealsKanbanWithTable: React.FC<DealsKanbanWithTableProps> = ({
  onDealSelect,
  onCreateDeal
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">الفرص التجارية</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="flex items-center gap-2"
              data-testid="kanban-view"
            >
              <Grid className="w-4 h-4" />
              كانبان
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="flex items-center gap-2"
              data-testid="table-view"
            >
              <List className="w-4 h-4" />
              جدول
            </Button>
          </div>
          
          <button 
            onClick={onCreateDeal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            data-testid="button-create-deal"
          >
            <i className="fas fa-plus"></i>
            إضافة فرصة
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'kanban' ? (
        <DealsKanban 
          onDealSelect={onDealSelect}
          onCreateDeal={onCreateDeal}
        />
      ) : (
        <EnterpriseOpportunitiesTable
          onRowClick={onDealSelect}
          className="mt-4"
        />
      )}
    </Card>
  );
};