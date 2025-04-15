
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LineChart from './charts/LineChart';
import PieChart from './charts/PieChart';

interface CaseStudyProps {
  title: string;
  description: string;
  metrics: {
    [key: string]: string;
  };
  detailedReport?: {
    sentimentData?: Array<{ name: string; value: number; color: string; }>;
    languageBreakdown?: Array<{ name: string; value: number; color: string; }>;
    timeSeriesData?: Array<{ time: string; mentions: number; }>;
    locationData?: Array<{ name: string; value: number; color: string; }>;
    mentionsTimeline?: Array<{ time: string; mentions: number; }>;
    timeline?: Array<{ time: string; event: string; }>;
    topKeywords?: string[];
    verificationStatus?: string;
  };
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, metrics, detailedReport }) => {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-saudi-green">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xl font-bold text-saudi-green">{value}</div>
              <div className="text-sm text-gray-500">{key}</div>
            </div>
          ))}
        </div>

        {detailedReport && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="sentiment">تحليل المشاعر</TabsTrigger>
              <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
              <TabsTrigger value="influencers">المؤثرين</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {detailedReport.timeSeriesData && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">تفاعل على مدار الوقت</h4>
                  <LineChart
                    data={detailedReport.timeSeriesData}
                    lines={[{ dataKey: 'mentions', color: '#2196F3', name: 'عدد التفاعلات' }]}
                    xAxisDataKey="time"
                  />
                </div>
              )}

              {detailedReport.timeline && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">التسلسل الزمني للأحداث</h4>
                  <div className="space-y-3">
                    {detailedReport.timeline.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-saudi-green font-semibold mb-1">{item.time}</div>
                        <div>{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              {detailedReport.sentimentData && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">توزيع المشاعر</h4>
                  <PieChart data={detailedReport.sentimentData} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {detailedReport.languageBreakdown && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">توزيع اللغات</h4>
                  <PieChart data={detailedReport.languageBreakdown} />
                </div>
              )}

              {detailedReport.topKeywords && (
                <div>
                  <h4 className="text-lg font-semibold mb-3">الكلمات الأكثر تداولاً</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailedReport.topKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="influencers" className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">أبرز المؤثرين في النقاش</h4>
                <div className="grid gap-4">
                  {detailedReport.influencers?.map((influencer, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <img 
                        src={influencer.avatar} 
                        alt={influencer.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold">{influencer.name}</div>
                        <div className="text-sm text-gray-500">{influencer.followers} متابع</div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-saudi-green font-semibold">{influencer.engagementRate}%</div>
                        <div className="text-sm text-gray-500">نسبة التفاعل</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full btn-saudi">
          عرض التفاصيل
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseStudy;
