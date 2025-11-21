import React, { useState } from 'react';
import { ContactsTable, CompaniesTable, DealsTable, TicketsTable } from '../components/tables';
import { Card } from '../components/base/Card';
import { Button } from '../components/base/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/base/Tabs';

const TableTestPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedEntity, setSelectedEntity] = useState('');

  const handleRowClick = (row: any) => {
    console.log('نقرة على الصف:', row);
  };

  const handleRowSelect = (rows: any[]) => {
    setSelectedRows(rows);
    console.log('صفوف محددة:', rows);
  };

  const testExport = async (endpoint: string, format: 'csv' | 'pdf') => {
    try {
      const response = await fetch(`${endpoint}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `test-export.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`${format.toUpperCase()} تم تصديره بنجاح`);
      } else {
        console.error('فشل في التصدير');
      }
    } catch (error) {
      console.error('خطأ في التصدير:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">اختبار الجداول المتقدمة</h1>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => testExport('/api/contacts', 'csv')}
          >
            تصدير CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={() => testExport('/api/contacts', 'pdf')}
          >
            تصدير PDF
          </Button>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <Card className="p-4 bg-blue-50">
          <p className="text-blue-700">
            تم تحديد {selectedRows.length} عنصر من {selectedEntity}
          </p>
        </Card>
      )}

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contacts" onClick={() => setSelectedEntity('جهات الاتصال')}>
            جهات الاتصال
          </TabsTrigger>
          <TabsTrigger value="companies" onClick={() => setSelectedEntity('الشركات')}>
            الشركات
          </TabsTrigger>
          <TabsTrigger value="deals" onClick={() => setSelectedEntity('الصفقات')}>
            الصفقات
          </TabsTrigger>
          <TabsTrigger value="tickets" onClick={() => setSelectedEntity('التذاكر')}>
            التذاكر
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جدول جهات الاتصال</h2>
              <div className="text-sm text-gray-600">
                ميزات: الترتيب المتعدد • الترقيم • التصدير • العروض المحفوظة
              </div>
            </div>
            <ContactsTable 
              onRowClick={handleRowClick}
              onRowSelect={handleRowSelect}
            />
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جدول الشركات</h2>
              <div className="text-sm text-gray-600">
                ميزات: تصفية متقدمة • إظهار/إخفاء الأعمدة • بحث فوري
              </div>
            </div>
            <CompaniesTable 
              onRowClick={handleRowClick}
              onRowSelect={handleRowSelect}
            />
          </Card>
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جدول الصفقات</h2>
              <div className="text-sm text-gray-600">
                ميزات: تنسيق العملة • عرض المراحل • حساب الاحتمالية
              </div>
            </div>
            <DealsTable 
              onRowClick={handleRowClick}
              onRowSelect={handleRowSelect}
            />
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جدول التذاكر</h2>
              <div className="text-sm text-gray-600">
                ميزات: تلوين الحالة • تصنيف الأولوية • تتبع التذاكر
              </div>
            </div>
            <TicketsTable 
              onRowClick={handleRowClick}
              onRowSelect={handleRowSelect}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Summary */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold mb-4">ميزات الجداول المتقدمة</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-blue-700 mb-2">ترقيم على الخادم</h4>
            <p className="text-sm text-gray-600">ترقيم فعال يدعم مجموعات البيانات الكبيرة</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-green-700 mb-2">ترتيب متعدد</h4>
            <p className="text-sm text-gray-600">ترتيب بعدة أعمدة في نفس الوقت</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-purple-700 mb-2">تصدير CSV/PDF</h4>
            <p className="text-sm text-gray-600">تصدير البيانات المفلترة مباشرة</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium text-orange-700 mb-2">عروض محفوظة</h4>
            <p className="text-sm text-gray-600">حفظ إعدادات الجدول المخصصة</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TableTestPage;