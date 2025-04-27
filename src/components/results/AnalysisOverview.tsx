
import React from 'react';
import { AnalysisOverviewData, KPIItem, Tweet } from '@/types/search';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import HighlightedTweet from '@/components/analysis/HighlightedTweet';
import KeywordsTable from '@/components/results/KeywordsTable';
import InfluencersList from '@/components/results/InfluencersList';
import { Clock, Flame } from 'lucide-react';

interface AnalysisOverviewProps {
  data: AnalysisOverviewData;
}

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold mb-4">تتبع المشاعر عبر الوقت</h3>
        <LineChart 
          data={data.timeline} 
          lines={[
            { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
            { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
            { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
          ]}
          xAxisDataKey="date"
        />
      </div>
      
      {data.highlightTweets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.highlightTweets.earliest && (
            <HighlightedTweet 
              tweet={data.highlightTweets.earliest}
              title="أول تغريدة"
              icon={<Clock className="h-4 w-4 text-saudi-green" />}
            />
          )}
          
          {data.highlightTweets.mostLiked && (
            <HighlightedTweet 
              tweet={data.highlightTweets.mostLiked}
              title="الأكثر إعجاباً"
              icon={<Flame className="h-4 w-4 text-saudi-green" />}
            />
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
          <PieChart 
            data={[
              { name: "إيجابي", value: data.sentiment.positive },
              { name: "محايد", value: data.sentiment.neutral },
              { name: "سلبي", value: data.sentiment.negative },
            ]} 
            innerRadius={60} 
            outerRadius={90} 
          />
        </div>
        
        {data.locations && data.locations.length > 0 && (
          <div className="dashboard-card">
            <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي</h3>
            <PieChart 
              data={data.locations} 
              innerRadius={60} 
              outerRadius={90} 
            />
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">الكلمات الرئيسية</h3>
          <KeywordsTable data={data.keywords} />
        </div>
        
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
          <InfluencersList data={data.influencers} />
        </div>
      </div>
    </div>
  );
};

export default AnalysisOverview;
