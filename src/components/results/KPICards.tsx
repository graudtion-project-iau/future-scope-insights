
import React from 'react';
import { Activity, Users, MapPin, BarChart2 } from 'lucide-react';
import DataCard from '@/components/DataCard';

const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <DataCard 
        title="متوسط المشاعر" 
        value="+0.67" 
        icon={<Activity className="h-5 w-5" />} 
        change={{ value: 12, type: 'increase' }}
      />
      <DataCard 
        title="عدد الإشارات" 
        value="1,200" 
        icon={<BarChart2 className="h-5 w-5" />} 
        change={{ value: 5, type: 'increase' }}
      />
      <DataCard 
        title="الموقع الرئيسي" 
        value="الرياض" 
        icon={<MapPin className="h-5 w-5" />} 
      />
      <DataCard 
        title="عدد المؤثرين" 
        value="24" 
        icon={<Users className="h-5 w-5" />} 
        change={{ value: 3, type: 'decrease' }}
      />
    </div>
  );
};

export default KPICards;
