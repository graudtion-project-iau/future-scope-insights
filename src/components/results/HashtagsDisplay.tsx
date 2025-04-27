
import React from 'react';
import TrendBadge from '@/components/results/TrendBadge';
import { TrendType } from '@/types/search';

interface Hashtag {
  tag: string;
  count: number;
  trend: TrendType;
}

interface HashtagsDisplayProps {
  hashtags: Hashtag[];
}

const HashtagsDisplay: React.FC<HashtagsDisplayProps> = ({ hashtags }) => {
  return (
    <div className="dashboard-card">
      <h3 className="text-lg font-semibold mb-4">أبرز الهاشتاقات</h3>
      <div className="flex flex-wrap gap-2 mt-4">
        {hashtags.map((hashtag, index) => (
          <div key={index} className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
            <span className="font-medium">{hashtag.tag}</span>
            <span className="text-gray-500 text-xs">{hashtag.count.toLocaleString()}</span>
            <TrendBadge trend={hashtag.trend} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashtagsDisplay;
