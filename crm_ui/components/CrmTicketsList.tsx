import React from 'react';
import { EnterpriseTicketsTable } from './tables/EnterpriseTicketsTable';
import { Card } from './base/Card';

interface TicketsListProps {
  onTicketSelect?: (ticket: any) => void;
  onCreateTicket?: () => void;
}

export const CrmTicketsList: React.FC<TicketsListProps> = ({
  onTicketSelect,
  onCreateTicket
}) => {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">التذاكر</h2>
        <button 
          onClick={onCreateTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          data-testid="button-create-ticket"
        >
          <i className="fas fa-plus"></i>
          إضافة تذكرة
        </button>
      </div>

      {/* Enterprise Table */}
      <EnterpriseTicketsTable
        onRowClick={onTicketSelect}
        className="mt-4"
      />
    </Card>
  );
};