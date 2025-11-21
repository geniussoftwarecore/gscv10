import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Clock } from "lucide-react";

interface KPICardsProps {
  data: {
    totalDeals: number;
    pipelineValue: number;
    conversionRate: number;
    avgResolutionTime: number;
  };
  isLoading?: boolean;
}

export function KPICards({ data, isLoading }: KPICardsProps) {
  const cards = [
    {
      title: "إجمالي الصفقات",
      value: data.totalDeals,
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      format: (val: number) => val.toString()
    },
    {
      title: "قيمة خط الأنابيب",
      value: data.pipelineValue,
      icon: TrendingUp,
      color: "text-green-600", 
      bgColor: "bg-green-100",
      format: (val: number) => new Intl.NumberFormat('ar-SA').format(val) + ' ر.س'
    },
    {
      title: "معدل التحويل",
      value: data.conversionRate,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100", 
      format: (val: number) => val.toFixed(1) + '%'
    },
    {
      title: "متوسط وقت حل التذاكر",
      value: data.avgResolutionTime,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      format: (val: number) => val.toFixed(1) + ' يوم'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.format(card.value)}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}