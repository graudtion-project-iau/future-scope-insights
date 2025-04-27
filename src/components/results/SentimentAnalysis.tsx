
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PieChart from '@/components/charts/PieChart';
import LineChart from '@/components/charts/LineChart';
import { Tweet } from '@/types/search';

interface SentimentAnalysisProps {
  sentimentData: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timelineData: any[];
  tweets?: Tweet[];
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ 
  sentimentData,
  timelineData,
  tweets = []
}) => {
  return (
    <div className="dashboard-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
          <PieChart 
            data={[
              { name: "إيجابي", value: sentimentData.positive },
              { name: "محايد", value: sentimentData.neutral },
              { name: "سلبي", value: sentimentData.negative },
            ]} 
            innerRadius={60} 
            outerRadius={90} 
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">تتبع المشاعر عبر الوقت</h3>
          <LineChart 
            data={timelineData} 
            lines={[
              { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
              { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
              { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
            ]}
            xAxisDataKey="date"
          />
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">أبرز التغريدات حسب المشاعر</h3>
        <Tabs defaultValue="positive">
          <TabsList className="mb-4">
            <TabsTrigger value="positive">إيجابي</TabsTrigger>
            <TabsTrigger value="neutral">محايد</TabsTrigger>
            <TabsTrigger value="negative">سلبي</TabsTrigger>
          </TabsList>
          
          <TabsContent value="positive">
            <div className="space-y-4">
              {tweets
                .filter(t => t.sentiment === 'positive')
                .slice(0, 2)
                .map(tweet => (
                  <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={tweet.user.profileImage} 
                          alt={tweet.user.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold">{tweet.user.name}</p>
                          {tweet.user.verified && (
                            <span className="text-blue-500">
                              <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{tweet.user.username}</p>
                        <p className="mt-2">{tweet.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="neutral">
            <div className="space-y-4">
              {tweets
                .filter(t => t.sentiment === 'neutral')
                .slice(0, 2)
                .map(tweet => (
                  <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={tweet.user.profileImage} 
                          alt={tweet.user.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold">{tweet.user.name}</p>
                          {tweet.user.verified && (
                            <span className="text-blue-500">
                              <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{tweet.user.username}</p>
                        <p className="mt-2">{tweet.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="negative">
            <div className="space-y-4">
              {tweets
                .filter(t => t.sentiment === 'negative')
                .slice(0, 2)
                .map(tweet => (
                  <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={tweet.user.profileImage} 
                          alt={tweet.user.name} 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-bold">{tweet.user.name}</p>
                          {tweet.user.verified && (
                            <span className="text-blue-500">
                              <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">{tweet.user.username}</p>
                        <p className="mt-2">{tweet.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
