
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  className = ""
}) => {
  const renderChangeIcon = () => {
    if (!change) return null;
    
    if (change.type === 'increase') {
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    } else if (change.type === 'decrease') {
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getChangeColor = () => {
    if (!change) return 'text-gray-500';
    
    if (change.type === 'increase') {
      return 'text-green-500';
    } else if (change.type === 'decrease') {
      return 'text-red-500';
    } else {
      return 'text-gray-500';
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
          <div className="p-2 rounded-full bg-saudi-green/10 text-saudi-green">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-1 space-x-1 rtl:space-x-reverse">
            {renderChangeIcon()}
            <span className={`text-sm ${getChangeColor()}`}>{Math.abs(change.value)}%</span>
            <span className="text-sm text-gray-500">من الأسبوع الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataCard;
