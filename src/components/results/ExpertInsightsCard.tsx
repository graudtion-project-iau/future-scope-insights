
import React from 'react';
import { Card } from '@/components/ui/card';
import { ExpertInsights } from '@/types/search';
import { Lightbulb, TrendingUp, LineChart } from 'lucide-react';

interface ExpertInsightsCardProps {
  insights: ExpertInsights;
}

const ExpertInsightsCard: React.FC<ExpertInsightsCardProps> = ({ insights }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">تحليلات الخبراء</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 mt-1" />
          <div>
            <h4 className="font-medium text-sm mb-1">التأثير على القطاع</h4>
            <p className="text-gray-600 text-sm">{insights.industry_impact}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h4 className="font-medium text-sm mb-1">اتجاهات السوق</h4>
            <p className="text-gray-600 text-sm">{insights.market_trends}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <LineChart className="w-5 h-5 text-green-500 mt-1" />
          <div>
            <h4 className="font-medium text-sm mb-1">التوقعات المستقبلية</h4>
            <p className="text-gray-600 text-sm">{insights.future_predictions}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpertInsightsCard;
