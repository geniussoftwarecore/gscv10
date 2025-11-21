import React, { useState, useEffect } from 'react';
import { Card } from './base/Card';
import { Button } from './base/Button';
import { Badge } from './base/Badge';

interface DealStage {
  id: string;
  name: string;
  position: number;
  probability: number;
  color: string;
  isClosed: boolean;
  isWon: boolean;
}

interface Deal {
  id: string;
  name: string;
  value?: number;
  currency: string;
  probability: number;
  expectedCloseDate?: Date;
  stageId: string;
  stageName?: string;
  stageColor?: string;
  companyName?: string;
  contactName?: string;
  ownerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KanbanData {
  stages: DealStage[];
  deals: Deal[];
  statistics: {
    totalDeals: number;
    totalValue: number;
    winRate: number;
    avgDealSize: number;
  };
}

interface DealsKanbanProps {
  onDealSelect?: (deal: Deal) => void;
  onCreateDeal?: () => void;
}

export const DealsKanban: React.FC<DealsKanbanProps> = ({
  onDealSelect,
  onCreateDeal
}) => {
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    stages: [],
    deals: [],
    statistics: { totalDeals: 0, totalValue: 0, winRate: 0, avgDealSize: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    fetchKanbanData();
  }, []);

  const fetchKanbanData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/crm/deals/kanban');
      if (response.ok) {
        const data = await response.json();
        setKanbanData(data);
      }
    } catch (error) {
      console.error('Error fetching kanban data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    
    if (!draggedDeal || draggedDeal.stageId === targetStageId) {
      setDraggedDeal(null);
      return;
    }

    try {
      const response = await fetch(`/api/crm/deals/${draggedDeal.id}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stageId: targetStageId }),
      });

      if (response.ok) {
        // Update local state
        setKanbanData(prev => ({
          ...prev,
          deals: prev.deals.map(deal =>
            deal.id === draggedDeal.id
              ? { ...deal, stageId: targetStageId }
              : deal
          )
        }));
      }
    } catch (error) {
      console.error('Error updating deal stage:', error);
    }
    
    setDraggedDeal(null);
  };

  const formatCurrency = (value?: number, currency = 'USD') => {
    if (!value) return '—';
    
    return new Intl.NumberFormat('ar-YE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date?: Date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ar-YE', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDealsByStage = (stageId: string) => {
    return kanbanData.deals.filter(deal => deal.stageId === stageId);
  };

  const getStageStats = (stageId: string) => {
    const deals = getDealsByStage(stageId);
    const value = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return { count: deals.length, value };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Dashboard */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">لوحة الصفقات</h2>
          <Button 
            onClick={onCreateDeal}
            className="btn-primary"
            data-testid="button-create-deal"
          >
            <i className="fas fa-plus ml-2"></i>
            إضافة صفقة
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي الصفقات</p>
                <p className="text-3xl font-bold">{kanbanData.statistics.totalDeals}</p>
              </div>
              <i className="fas fa-handshake text-2xl text-blue-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">القيمة الإجمالية</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(kanbanData.statistics.totalValue)}
                </p>
              </div>
              <i className="fas fa-dollar-sign text-2xl text-green-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">معدل النجاح</p>
                <p className="text-3xl font-bold">{kanbanData.statistics.winRate.toFixed(1)}%</p>
              </div>
              <i className="fas fa-chart-line text-2xl text-purple-200"></i>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">متوسط حجم الصفقة</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(kanbanData.statistics.avgDealSize)}
                </p>
              </div>
              <i className="fas fa-chart-bar text-2xl text-orange-200"></i>
            </div>
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <div className="flex space-x-4 rtl:space-x-reverse min-w-max">
            {kanbanData.stages.map((stage) => {
              const stageDeals = getDealsByStage(stage.id);
              const stageStats = getStageStats(stage.id);
              
              return (
                <div
                  key={stage.id}
                  className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  data-testid={`stage-column-${stage.id}`}
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stage.color }}
                      ></div>
                      <h3 className="font-semibold text-secondary">{stage.name}</h3>
                    </div>
                    <Badge 
                      variant="secondary"
                      data-testid={`badge-count-${stage.id}`}
                    >
                      {stageStats.count}
                    </Badge>
                  </div>

                  {/* Stage Stats */}
                  <div className="mb-4 text-sm text-muted-foreground">
                    <div>القيمة: {formatCurrency(stageStats.value)}</div>
                    <div>الاحتمالية: {stage.probability}%</div>
                  </div>

                  {/* Deals */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-move hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        onClick={() => onDealSelect?.(deal)}
                        data-testid={`deal-card-${deal.id}`}
                      >
                        <div className="mb-2">
                          <h4 className="font-medium text-secondary text-sm line-clamp-2">
                            {deal.name}
                          </h4>
                        </div>

                        {deal.value && (
                          <div className="mb-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(deal.value, deal.currency)}
                            </span>
                          </div>
                        )}

                        {deal.companyName && (
                          <div className="mb-2 text-sm text-muted-foreground">
                            <i className="fas fa-building ml-1"></i>
                            {deal.companyName}
                          </div>
                        )}

                        {deal.contactName && (
                          <div className="mb-2 text-sm text-muted-foreground">
                            <i className="fas fa-user ml-1"></i>
                            {deal.contactName}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(deal.expectedCloseDate)}
                          </div>
                          <div className="text-xs">
                            <Badge 
                              className="bg-gray-100 text-gray-600"
                              data-testid={`badge-probability-${deal.id}`}
                            >
                              {deal.probability}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Deal Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 border-dashed"
                    onClick={onCreateDeal}
                    data-testid={`button-add-deal-${stage.id}`}
                  >
                    <i className="fas fa-plus ml-2"></i>
                    إضافة صفقة
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};