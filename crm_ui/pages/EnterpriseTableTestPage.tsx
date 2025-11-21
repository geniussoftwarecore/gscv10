import React, { useState } from 'react';
import { Card } from '../components/base/Card';
import { Button } from '../components/base/Button';
import { EnterpriseContactsTable } from '../components/tables/EnterpriseContactsTable';
import { EnterpriseAccountsTable } from '../components/tables/EnterpriseAccountsTable';
import { EnterpriseOpportunitiesTable } from '../components/tables/EnterpriseOpportunitiesTable';
import { EnterpriseTicketsTable } from '../components/tables/EnterpriseTicketsTable';

const tables = [
  { id: 'contacts', label: 'جهات الاتصال', component: EnterpriseContactsTable },
  { id: 'accounts', label: 'الشركات', component: EnterpriseAccountsTable },
  { id: 'opportunities', label: 'الفرص التجارية', component: EnterpriseOpportunitiesTable },
  { id: 'tickets', label: 'التذاكر', component: EnterpriseTicketsTable }
];

export const EnterpriseTableTestPage: React.FC = () => {
  const [activeTable, setActiveTable] = useState('contacts');

  const ActiveTableComponent = tables.find(t => t.id === activeTable)?.component || EnterpriseContactsTable;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            اختبار الجداول المؤسسية المحسنة
          </h1>
          <p className="text-gray-600 mb-6">
            جداول بمميزات متقدمة: ترتيب متعدد، تصدير، فلاتر، بحث، وعروض محفوظة
          </p>
          
          {/* Table Selector */}
          <div className="flex gap-2 mb-6">
            {tables.map((table) => (
              <Button
                key={table.id}
                variant={activeTable === table.id ? 'default' : 'outline'}
                onClick={() => setActiveTable(table.id)}
                data-testid={`tab-${table.id}`}
              >
                {table.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Active Table */}
        <ActiveTableComponent
          onRowClick={(row) => {
            console.log('Row clicked:', row);
            alert(`تم النقر على الصف: ${JSON.stringify(row, null, 2)}`);
          }}
          onRowSelect={(rows) => {
            console.log('Rows selected:', rows);
          }}
        />
        
        {/* Test Instructions */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">ميزات للاختبار:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">ميزات البحث والفلترة:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>بحث عام في الحقول الرئيسية</li>
                <li>فلاتر متقدمة حسب الحقول</li>
                <li>ترتيب متعدد المستويات</li>
                <li>تحديد وإخفاء الأعمدة</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">ميزات التصدير والحفظ:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>تصدير CSV و PDF</li>
                <li>حفظ العروض المخصصة</li>
                <li>تحديد حجم الصفحة</li>
                <li>تنقل محسّن بين الصفحات</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};