import React from 'react';
import { EnterpriseTableController, TableColumn } from '../EnterpriseTableController';
import { Badge } from '../base/Badge';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Target, DollarSign, Calendar, TrendingUp, User, Building } from 'lucide-react';

export interface OpportunitiesTableProps {
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  className?: string;
}

export const EnterpriseOpportunitiesTable: React.FC<OpportunitiesTableProps> = ({
  onRowClick,
  onRowSelect,
  className = ''
}) => {
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'اسم الفرصة',
      sortable: true,
      visible: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            {row.stage && (
              <div className="text-sm text-gray-500">
                {getStageLabel(row.stage)}
              </div>
            )}
          </div>
        </div>
      ),
      exportRender: (value) => value
    },
    {
      key: 'stage',
      label: 'المرحلة',
      sortable: true,
      visible: true,
      render: (value) => {
        const stageConfig = getStageConfig(value);
        return <Badge variant={stageConfig.variant}>{stageConfig.label}</Badge>;
      },
      exportRender: (value) => getStageLabel(value)
    },
    {
      key: 'expectedValue',
      label: 'القيمة المتوقعة',
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
      key: 'winProbability',
      label: 'احتمالية النجاح',
      sortable: true,
      visible: true,
      type: 'number',
      render: (value) => value !== null && value !== undefined ? (
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <div className="flex flex-col">
            <span className="font-medium">{value}%</span>
            <div className={`w-16 h-2 rounded-full ${getProbabilityColor(value)}`}>
              <div 
                className="h-full rounded-full bg-current transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        </div>
      ) : <span className="text-gray-400">غير محدد</span>,
      exportRender: (value) => value !== null && value !== undefined ? `${value}%` : ''
    },
    {
      key: 'closeDate',
      label: 'تاريخ الإغلاق المتوقع',
      sortable: true,
      visible: true,
      type: 'date',
      render: (value) => {
        if (!value) return <span className="text-gray-400">غير محدد</span>;
        
        const date = new Date(value);
        const isOverdue = date < new Date() && !value.isClosed;
        
        return (
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
            <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
              {format(date, 'dd/MM/yyyy', { locale: ar })}
            </span>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">متأخر</Badge>
            )}
          </div>
        );
      },
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : ''
    },
    {
      key: 'accountId',
      label: 'الشركة',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ) : <span className="text-gray-400">غير مرتبط</span>
    },
    {
      key: 'ownerId',
      label: 'المسؤول',
      sortable: true,
      visible: true,
      render: (value) => value ? (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900">{value}</span>
        </div>
      ) : <span className="text-gray-400">غير مُعيَّن</span>
    },
    {
      key: 'leadSource',
      label: 'مصدر العميل المحتمل',
      sortable: true,
      visible: true,
      render: (value) => {
        const sourceMap = {
          website: 'الموقع الإلكتروني',
          referral: 'إحالة',
          social_media: 'وسائل التواصل الاجتماعي',
          cold_calling: 'مكالمات باردة',
          email_campaign: 'حملة بريد إلكتروني',
          event: 'فعالية',
          partner: 'شريك',
          advertisement: 'إعلان'
        };
        return sourceMap[value as keyof typeof sourceMap] || value || 
               <span className="text-gray-400">غير محدد</span>;
      },
      exportRender: (value) => {
        const sourceMap = {
          website: 'الموقع الإلكتروني',
          referral: 'إحالة',
          social_media: 'وسائل التواصل الاجتماعي',
          cold_calling: 'مكالمات باردة',
          email_campaign: 'حملة بريد إلكتروني',
          event: 'فعالية',
          partner: 'شريك',
          advertisement: 'إعلان'
        };
        return sourceMap[value as keyof typeof sourceMap] || value || '';
      }
    },
    {
      key: 'nextStepDate',
      label: 'تاريخ الخطوة التالية',
      sortable: true,
      visible: false,
      type: 'date',
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
      exportRender: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : ''
    },
    {
      key: 'isClosed',
      label: 'مغلقة',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value) => (
        <Badge variant={value ? 'outline' : 'default'}>
          {value ? 'مغلقة' : 'نشطة'}
        </Badge>
      ),
      exportRender: (value) => value ? 'مغلقة' : 'نشطة'
    },
    {
      key: 'isWon',
      label: 'النتيجة',
      sortable: true,
      visible: true,
      type: 'boolean',
      render: (value, row) => {
        if (!row.isClosed) return <span className="text-gray-400">جارية</span>;
        return (
          <Badge variant={value ? 'default' : 'destructive'}>
            {value ? 'فوز' : 'خسارة'}
          </Badge>
        );
      },
      exportRender: (value, row) => {
        if (!row.isClosed) return 'جارية';
        return value ? 'فوز' : 'خسارة';
      }
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
      endpoint="/api/tables/opportunities"
      tableName="opportunities"
      queryKey={['enterprise-opportunities']}
      columns={columns}
      defaultPageSize={25}
      defaultSort={[{ field: 'expectedValue', direction: 'desc' }]}
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

// Helper functions
function getStageLabel(stage: string): string {
  const stageMap = {
    prospecting: 'استطلاع',
    qualification: 'تأهيل',
    needs_analysis: 'تحليل الاحتياجات',
    proposal: 'عرض',
    negotiation: 'تفاوض',
    closed_won: 'مغلقة - فوز',
    closed_lost: 'مغلقة - خسارة'
  };
  return stageMap[stage as keyof typeof stageMap] || stage;
}

function getStageConfig(stage: string) {
  const stageConfigs = {
    prospecting: { label: 'استطلاع', variant: 'secondary' as const },
    qualification: { label: 'تأهيل', variant: 'outline' as const },
    needs_analysis: { label: 'تحليل الاحتياجات', variant: 'outline' as const },
    proposal: { label: 'عرض', variant: 'default' as const },
    negotiation: { label: 'تفاوض', variant: 'default' as const },
    closed_won: { label: 'مغلقة - فوز', variant: 'default' as const },
    closed_lost: { label: 'مغلقة - خسارة', variant: 'destructive' as const }
  };
  return stageConfigs[stage as keyof typeof stageConfigs] || 
         { label: stage, variant: 'outline' as const };
}

function getProbabilityColor(probability: number): string {
  if (probability >= 75) return 'bg-green-100 text-green-600';
  if (probability >= 50) return 'bg-blue-100 text-blue-600';
  if (probability >= 25) return 'bg-yellow-100 text-yellow-600';
  return 'bg-red-100 text-red-600';
}