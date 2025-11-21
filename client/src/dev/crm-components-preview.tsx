import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { MetaTags } from '@/components/seo/meta-tags';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// Mock CRM data
const mockAccounts = [
  { id: '1', name: 'شركة التقنية المتقدمة', industry: 'Technology', revenue: 2500000, status: 'Active' },
  { id: '2', name: 'مؤسسة الابتكار التجاري', industry: 'Retail', revenue: 1800000, status: 'Prospect' },
  { id: '3', name: 'مجموعة الخدمات المالية', industry: 'Finance', revenue: 3200000, status: 'Active' }
];

const mockContacts = [
  { id: '1', name: 'أحمد محمد علي', email: 'ahmed@company.com', phone: '+966501234567', company: 'شركة التقنية المتقدمة' },
  { id: '2', name: 'فاطمة سعد الرحمن', email: 'fatima@innovation.com', phone: '+966507654321', company: 'مؤسسة الابتكار التجاري' },
  { id: '3', name: 'خالد عبدالله', email: 'khalid@finance.com', phone: '+966509876543', company: 'مجموعة الخدمات المالية' }
];

const mockDeals = [
  { id: '1', title: 'نظام إدارة المبيعات', value: 450000, stage: 'Negotiation', probability: 75, account: 'شركة التقنية المتقدمة' },
  { id: '2', title: 'منصة التجارة الإلكترونية', value: 320000, stage: 'Proposal', probability: 60, account: 'مؤسسة الابتكار التجاري' },
  { id: '3', title: 'تطبيق الخدمات المصرفية', value: 680000, stage: 'Qualified', probability: 40, account: 'مجموعة الخدمات المالية' }
];

const mockKanbanStages = [
  { id: 'lead', name: 'عميل محتمل', color: 'bg-gray-100 border-gray-300', deals: [mockDeals[2]] },
  { id: 'qualified', name: 'مؤهل', color: 'bg-blue-100 border-blue-300', deals: [] },
  { id: 'proposal', name: 'عرض مقدم', color: 'bg-yellow-100 border-yellow-300', deals: [mockDeals[1]] },
  { id: 'negotiation', name: 'تفاوض', color: 'bg-orange-100 border-orange-300', deals: [mockDeals[0]] },
  { id: 'closed', name: 'مكتمل', color: 'bg-green-100 border-green-300', deals: [] }
];

export default function CRMComponentsPreview() {
  const [draggedDeal, setDraggedDeal] = useState<any>(null);
  const [kanbanStages, setKanbanStages] = useState(mockKanbanStages);
  const [apiCalls, setApiCalls] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'agent' | 'viewer'>('agent');

  const handleDragStart = (deal: any) => {
    setDraggedDeal(deal);
  };

  const handleDrop = (targetStageId: string) => {
    if (!draggedDeal || draggedDeal.stage === targetStageId) {
      setDraggedDeal(null);
      return;
    }

    // Simulate API call logging
    const apiCall = `PUT /api/crm/deals/${draggedDeal.id}/stage - ${new Date().toLocaleTimeString()}`;
    setApiCalls(prev => [apiCall, ...prev.slice(0, 9)]); // Keep last 10 calls

    setKanbanStages(prev => 
      prev.map(stage => ({
        ...stage,
        deals: stage.id === targetStageId 
          ? [...stage.deals, { ...draggedDeal, stage: targetStageId }]
          : stage.deals.filter(deal => deal.id !== draggedDeal.id)
      }))
    );
    setDraggedDeal(null);
  };

  // RBAC field filtering simulation
  const filterEntityFields = (entity: any, role: string) => {
    const roleFields = {
      admin: ['*'], // All fields
      manager: ['id', 'name', 'email', 'phone', 'company', 'revenue', 'status'],
      agent: ['id', 'name', 'email', 'phone', 'company', 'status'], // No revenue
      viewer: ['id', 'name', 'company', 'status'] // Limited fields
    };
    
    const allowedFields = roleFields[role as keyof typeof roleFields] || [];
    if (allowedFields.includes('*')) return entity;
    
    const filtered: any = {};
    allowedFields.forEach(field => {
      if (entity[field] !== undefined) {
        filtered[field] = entity[field];
      }
    });
    return filtered;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-8" data-testid="crm-components-preview">
      <MetaTags 
        title="CRM Components Preview - GSC Dev"
        description="Development preview for CRM UI components"
      />
      
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            CRM Components Preview
          </h1>
          <p className="text-xl text-muted-foreground">
            Development preview for CRM system components
          </p>
        </div>

        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="accounts">الحسابات</TabsTrigger>
            <TabsTrigger value="contacts">جهات الاتصال</TabsTrigger>
            <TabsTrigger value="deals">الصفقات</TabsTrigger>
            <TabsTrigger value="kanban">لوحة كانبان</TabsTrigger>
            <TabsTrigger value="dashboard">لوحة التحكم</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      إدارة الحسابات
                    </CardTitle>
                    <CardDescription>عرض وإدارة حسابات العملاء</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" data-testid="button-filter-accounts">
                      <Filter className="h-4 w-4 mr-2" />
                      تصفية
                    </Button>
                    <Button size="sm" data-testid="button-add-account">
                      <Plus className="h-4 w-4 mr-2" />
                      إضافة حساب
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input 
                        placeholder="البحث في الحسابات..." 
                        className="w-full"
                        data-testid="input-search-accounts"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Table data-testid="table-accounts">
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم الشركة</TableHead>
                      <TableHead>القطاع</TableHead>
                      <TableHead>الإيرادات</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAccounts.map((account) => (
                      <TableRow key={account.id} data-testid={`account-row-${account.id}`}>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.industry}</TableCell>
                        <TableCell>{formatCurrency(account.revenue)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={account.status === 'Active' ? 'default' : 'secondary'}
                            data-testid={`badge-status-${account.id}`}
                          >
                            {account.status === 'Active' ? 'نشط' : 'محتمل'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" data-testid={`button-view-${account.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" data-testid={`button-edit-${account.id}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" data-testid={`button-delete-${account.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      إدارة جهات الاتصال
                    </CardTitle>
                    <CardDescription>عرض وإدارة جهات الاتصال</CardDescription>
                  </div>
                  <Button size="sm" data-testid="button-add-contact">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة جهة اتصال
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table data-testid="table-contacts">
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>الهاتف</TableHead>
                      <TableHead>الشركة</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockContacts.map((contact) => (
                      <TableRow key={contact.id} data-testid={`contact-row-${contact.id}`}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {contact.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {contact.phone}
                          </div>
                        </TableCell>
                        <TableCell>{contact.company}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" data-testid={`button-contact-actions-${contact.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      إدارة الصفقات
                    </CardTitle>
                    <CardDescription>عرض وإدارة الصفقات التجارية</CardDescription>
                  </div>
                  <Button size="sm" data-testid="button-add-deal">
                    <Plus className="h-4 w-4 mr-2" />
                    إضافة صفقة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table data-testid="table-deals">
                  <TableHeader>
                    <TableRow>
                      <TableHead>عنوان الصفقة</TableHead>
                      <TableHead>القيمة</TableHead>
                      <TableHead>المرحلة</TableHead>
                      <TableHead>احتمالية النجاح</TableHead>
                      <TableHead>الحساب</TableHead>
                      <TableHead>إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDeals.map((deal) => (
                      <TableRow key={deal.id} data-testid={`deal-row-${deal.id}`}>
                        <TableCell className="font-medium">{deal.title}</TableCell>
                        <TableCell>{formatCurrency(deal.value)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" data-testid={`badge-stage-${deal.id}`}>
                            {deal.stage === 'Negotiation' ? 'تفاوض' : 
                             deal.stage === 'Proposal' ? 'عرض مقدم' : 'مؤهل'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={deal.probability} className="w-16" />
                            <span className="text-sm">{deal.probability}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{deal.account}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" data-testid={`button-deal-actions-${deal.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  لوحة كانبان للصفقات
                </CardTitle>
                <CardDescription>
                  إدارة الصفقات بالسحب والإفلات - API Calls: {apiCalls.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4" data-testid="kanban-board">
                  {kanbanStages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`min-h-[400px] rounded-lg border-2 border-dashed p-4 ${stage.color}`}
                      onDrop={() => handleDrop(stage.id)}
                      onDragOver={(e) => e.preventDefault()}
                      data-testid={`kanban-stage-${stage.id}`}
                    >
                      <div className="mb-4">
                        <h3 className="font-semibold">{stage.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stage.deals.length} صفقة
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        {stage.deals.map((deal) => (
                          <Card
                            key={deal.id}
                            className="cursor-move hover:shadow-md transition-shadow"
                            draggable
                            onDragStart={() => handleDragStart(deal)}
                            data-testid={`kanban-deal-${deal.id}`}
                          >
                            <CardContent className="p-3">
                              <h4 className="font-medium text-sm mb-2">{deal.title}</h4>
                              <div className="space-y-1 text-xs text-muted-foreground">
                                <p>{formatCurrency(deal.value)}</p>
                                <p>{deal.account}</p>
                                <div className="flex items-center gap-1">
                                  <Progress value={deal.probability} className="h-1 flex-1" />
                                  <span>{deal.probability}%</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card data-testid="kpi-total-accounts">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي الحسابات</p>
                      <p className="text-2xl font-bold">1,234</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +12% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="kpi-active-deals">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">الصفقات النشطة</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +5% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="kpi-revenue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">الإيرادات المتوقعة</p>
                      <p className="text-2xl font-bold">{formatCurrency(2450000)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +18% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="kpi-contacts">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">جهات الاتصال</p>
                      <p className="text-2xl font-bold">3,456</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    +7% من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>أداء المبيعات الشهري</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو'].map((month, index) => (
                      <div key={month} className="flex items-center gap-4">
                        <div className="w-16 text-sm">{month}</div>
                        <Progress value={(index + 1) * 20} className="flex-1" />
                        <div className="w-16 text-sm text-right">{(index + 1) * 20}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>أحدث الأنشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'إضافة عميل جديد', time: 'منذ 5 دقائق', user: 'أحمد علي' },
                      { action: 'تحديث صفقة', time: 'منذ 15 دقيقة', user: 'فاطمة سعد' },
                      { action: 'إرسال عرض سعر', time: 'منذ 30 دقيقة', user: 'خالد محمد' },
                      { action: 'مكالمة عميل', time: 'منذ ساعة', user: 'سارة أحمد' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}