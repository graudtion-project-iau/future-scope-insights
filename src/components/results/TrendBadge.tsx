
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendType } from '@/types/search';

interface TrendBadgeProps {
  trend: TrendType;
}

const TrendBadge: React.FC<TrendBadgeProps> = ({ trend }) => {
  const getBadgeClassName = () => {
    switch (trend) {
      case 'increase':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'decrease':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'increase':
        return '↑ متزايد';
      case 'decrease':
        return '↓ متناقص';
      case 'neutral':
      default:
        return '− ثابت';
    }
  };

  return (
    <Badge className={getBadgeClassName()}>
      {getTrendText()}
    </Badge>
  );
};

export default TrendBadge;
