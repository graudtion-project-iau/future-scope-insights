
import React from 'react';
import { Activity, Users, MapPin, BarChart2 } from 'lucide-react';
import DataCard from '@/components/DataCard';

interface KPIItem {
  name: string;
  value: string | number;
  change?: number;
}

interface KPICardsProps {
  kpis?: KPIItem[];
}

const KPICards: React.FC<KPICardsProps> = ({ 
  kpis = [
    { name: "متوسط المشاعر", value: "+0.67", change: 12 },
    { name: "عدد الإشارات", value: "1,200", change: 5 },
    { name: "الموقع الرئيسي", value: "الرياض" },
    { name: "عدد المؤثرين", value: "24", change: -3 }
  ]
}) => {
  // Map KPI names to icons
  const getIconForKPI = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('مشاعر') || lowerName.includes('sentiment')) {
      return <Activity className="h-5 w-5" />;
    }
    if (lowerName.includes('إشارات') || lowerName.includes('mentions')) {
      return <BarChart2 className="h-5 w-5" />;
    }
    if (lowerName.includes('موقع') || lowerName.includes('location')) {
      return <MapPin className="h-5 w-5" />;
    }
    if (lowerName.includes('مؤثر') || lowerName.includes('influencer')) {
      return <Users className="h-5 w-5" />;
    }
    return <BarChart2 className="h-5 w-5" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, index) => (
        <DataCard 
          key={index}
          title={kpi.name} 
          value={kpi.value} 
          icon={getIconForKPI(kpi.name)} 
          change={kpi.change !== undefined ? { 
            value: Math.abs(kpi.change), 
            type: kpi.change > 0 ? 'increase' : kpi.change < 0 ? 'decrease' : 'neutral' 
          } : undefined}
        />
      ))}
    </div>
  );
};

export default KPICards;
