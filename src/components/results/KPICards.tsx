
import React from 'react';
import { Activity, Users, MapPin, BarChart2, Clock, Bell, Database } from 'lucide-react';
import DataCard from '@/components/DataCard';

interface KPIItem {
  name: string;
  value: string | number;
  change?: number;
  lastUpdate?: string;
  type?: 'sentiment' | 'mentions' | 'location' | 'influencers' | 'hashtags' | 'keywords' | 'traffic' | 'realtime';
  color?: string;
}

interface KPICardsProps {
  kpis?: KPIItem[];
  className?: string;
}

const KPICards: React.FC<KPICardsProps> = ({ 
  kpis = [
    { name: "متوسط المشاعر", value: "+0.67", change: 12, type: "sentiment", lastUpdate: "قبل 5 دقائق" },
    { name: "عدد الإشارات", value: "1,200", change: 5, type: "mentions", lastUpdate: "تحديث مستمر" },
    { name: "الموقع الرئيسي", value: "الرياض", type: "location", lastUpdate: "قبل ساعة" },
    { name: "عدد المؤثرين", value: "24", change: -3, type: "influencers", lastUpdate: "قبل 3 ساعات" },
    { name: "الهاشتاقات", value: "32", change: 8, type: "hashtags", lastUpdate: "قبل ساعتين" },
    { name: "الكلمات المفتاحية", value: "128", change: 4, type: "keywords", lastUpdate: "قبل 30 دقيقة" },
    { name: "حركة المرور", value: "5.2K", change: 15, type: "traffic", lastUpdate: "آخر 24 ساعة" },
    { name: "تحديثات فورية", value: "نشط", type: "realtime", lastUpdate: "الآن" }
  ],
  className = ""
}) => {
  // Map KPI names to icons and colors
  const getIconForKPI = (kpi: KPIItem) => {
    const type = kpi.type?.toLowerCase() || '';
    
    if (type === 'sentiment') {
      return <Activity className="h-5 w-5" />;
    }
    if (type === 'mentions') {
      return <BarChart2 className="h-5 w-5" />;
    }
    if (type === 'location') {
      return <MapPin className="h-5 w-5" />;
    }
    if (type === 'influencers') {
      return <Users className="h-5 w-5" />;
    }
    if (type === 'hashtags') {
      return <Database className="h-5 w-5" />;
    }
    if (type === 'keywords') {
      return <Activity className="h-5 w-5" />;
    }
    if (type === 'traffic') {
      return <BarChart2 className="h-5 w-5" />;
    }
    if (type === 'realtime') {
      return <Bell className="h-5 w-5" />;
    }
    return <BarChart2 className="h-5 w-5" />;
  };

  const getCardColor = (kpi: KPIItem) => {
    if (kpi.color) return kpi.color;
    
    const type = kpi.type?.toLowerCase() || '';
    
    if (type === 'sentiment') return 'border-l-4 border-l-green-500';
    if (type === 'mentions') return 'border-l-4 border-l-blue-500';
    if (type === 'location') return 'border-l-4 border-l-amber-500';
    if (type === 'influencers') return 'border-l-4 border-l-purple-500';
    if (type === 'hashtags') return 'border-l-4 border-l-red-500';
    if (type === 'keywords') return 'border-l-4 border-l-indigo-500';
    if (type === 'traffic') return 'border-l-4 border-l-cyan-500';
    if (type === 'realtime') return 'border-l-4 border-l-saudi-green';
    
    return '';
  };

  // Get subset of cards to show
  const visibleKpis = kpis.slice(0, 8);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${className}`}>
      {visibleKpis.map((kpi, index) => (
        <DataCard 
          key={index}
          title={kpi.name} 
          value={kpi.value} 
          icon={getIconForKPI(kpi)} 
          change={kpi.change !== undefined ? { 
            value: Math.abs(kpi.change), 
            type: kpi.change > 0 ? 'increase' : kpi.change < 0 ? 'decrease' : 'neutral' 
          } : undefined}
          lastUpdate={kpi.lastUpdate}
          className={getCardColor(kpi)}
        />
      ))}
    </div>
  );
};

export default KPICards;
