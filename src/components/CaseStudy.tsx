
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import KeywordsTable from '@/components/results/KeywordsTable';
import InfluencersList from '@/components/results/InfluencersList';
import TweetFeed from '@/components/tweets/TweetFeed';

interface CaseStudyProps {
  title: string;
  description: string;
  metrics: {
    [key: string]: string;
  };
  detailedReport?: {
    sentimentData?: Array<{ name: string; value: number; }>;
    timeSeriesData?: Array<{ time: string; mentions: number; }>;
    locationData?: Array<{ name: string; value: number; }>;
    mentionsTimeline?: Array<{ time: string; mentions: number; }>;
    timeline?: Array<{ time: string; event: string; }>;
    keywords?: Array<{ keyword: string; count: number; trend: 'increase' | 'decrease' | 'neutral' }>;
    influencers?: Array<{ 
      name: string; 
      followers: string; 
      engagement?: string;
      engagementRate?: number;
      image?: string;
      avatar?: string;
    }>;
    tweets?: Array<any>;
    verificationStatus?: string;
  };
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, metrics, detailedReport }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/case-study/${encodeURIComponent(title)}`, {
      state: { caseStudy: { title, description, metrics, detailedReport } }
    });
  };

  // Map influencer data to standardized format
  const normalizeInfluencers = (influencers: any[]) => {
    return influencers.map(influencer => ({
      name: influencer.name,
      followers: influencer.followers,
      engagement: influencer.engagement || 
                 (influencer.engagementRate ? `${influencer.engagementRate}%` : '0%'),
      image: influencer.image || influencer.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
    }));
  };

  return (
    <Card className="overflow-hidden bg-white shadow-lg rounded-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-saudi-green">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-saudi-green">{value}</div>
              <div className="text-sm text-gray-500">{key}</div>
            </div>
          ))}
        </div>

        {detailedReport && (
          <div className="space-y-6">
            {detailedReport.timeSeriesData && (
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold mb-4">تتبع الإشارات عبر الوقت</h3>
                <LineChart 
                  data={detailedReport.timeSeriesData.map(item => ({
                    date: item.time,
                    mentions: item.mentions
                  }))}
                  lines={[
                    { dataKey: 'mentions', color: '#4CAF50', name: 'عدد الإشارات' }
                  ]}
                  xAxisDataKey="date"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailedReport.sentimentData && (
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                  <PieChart 
                    data={detailedReport.sentimentData} 
                    innerRadius={60} 
                    outerRadius={90}
                  />
                </div>
              )}
              
              {detailedReport.locationData && (
                <div className="dashboard-card">
                  <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي</h3>
                  <PieChart 
                    data={detailedReport.locationData} 
                    innerRadius={60} 
                    outerRadius={90}
                  />
                </div>
              )}
            </div>

            {detailedReport.keywords && (
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold mb-4">الكلمات الرئيسية</h3>
                <KeywordsTable data={detailedReport.keywords} />
              </div>
            )}

            {detailedReport.influencers && (
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
                <InfluencersList data={normalizeInfluencers(detailedReport.influencers)} />
              </div>
            )}

            {detailedReport.tweets && (
              <div className="dashboard-card">
                <h3 className="text-lg font-semibold mb-4">أبرز التغريدات</h3>
                <TweetFeed 
                  tweets={detailedReport.tweets.slice(0, 3)}
                  totalTweets={detailedReport.tweets.length}
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                  onFilterChange={() => {}}
                  preview={true}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleViewDetails}>
          عرض التفاصيل الكاملة
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseStudy;
