
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Minus, Clock } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  lastUpdate?: string;
  className?: string;
  tag?: string;
}

const DataCard: React.FC<DataCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  lastUpdate,
  className = "",
  tag
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
    <Card className={`overflow-hidden transition-all hover:shadow-md ${className} ${value === 'نشط' ? 'animate-pulse-soft' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium text-gray-500">{title}</CardTitle>
            {tag && (
              <span className="inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full bg-saudi-green/10 text-saudi-green">
                {tag}
              </span>
            )}
          </div>
          <div className="p-2 rounded-full bg-saudi-green/10 text-saudi-green">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'string' && value === 'نشط' ? (
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></span>
              {value}
            </span>
          ) : (
            value
          )}
        </div>
        {change && (
          <div className="flex items-center mt-1 space-x-1 rtl:space-x-reverse">
            {renderChangeIcon()}
            <span className={`text-sm ${getChangeColor()}`}>{Math.abs(change.value)}%</span>
            <span className="text-sm text-gray-500">من الأسبوع الماضي</span>
          </div>
        )}
      </CardContent>
      {lastUpdate && (
        <CardFooter className="pt-0 pb-2 text-xs text-gray-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{lastUpdate}</span>
        </CardFooter>
      )}
    </Card>
  );
};

export default DataCard;
