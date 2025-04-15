
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Define the proper types for our case study
interface CaseStudyDetailProps {
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
    influencers?: Array<{ 
      name: string; 
      followers: string; 
      engagementRate: number; 
      avatar: string; 
    }>;
  };
}

const CaseStudyDetails = () => {
  const location = useLocation();
  const [caseStudy, setCaseStudy] = useState<CaseStudyDetailProps | null>(null);

  useEffect(() => {
    if (location.state?.caseStudy) {
      setCaseStudy(location.state.caseStudy as CaseStudyDetailProps);
    }
  }, [location]);

  if (!caseStudy) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          رجوع
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{caseStudy.title}</h1>
          <p className="text-gray-600 mb-6">{caseStudy.description}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {Object.entries(caseStudy.metrics).map(([key, value]) => (
              <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-saudi-green">{value}</div>
                <div className="text-sm text-gray-500">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {caseStudy.detailedReport && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="sentiment">تحليل المشاعر</TabsTrigger>
              <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
              <TabsTrigger value="influencers">المؤثرين</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {caseStudy.detailedReport.timeSeriesData && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">تفاعل على مدار الوقت</h4>
                  <LineChart
                    data={caseStudy.detailedReport.timeSeriesData}
                    lines={[{ dataKey: 'mentions', color: '#2196F3', name: 'عدد التفاعلات' }]}
                    xAxisDataKey="time"
                  />
                </div>
              )}

              {caseStudy.detailedReport.timeline && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">التسلسل الزمني للأحداث</h4>
                  <div className="space-y-4">
                    {caseStudy.detailedReport.timeline.map((item, index) => (
                      <div key={index} className="border-r-2 border-saudi-green pr-4">
                        <div className="text-saudi-green font-semibold">{item.time}</div>
                        <div className="text-gray-600">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-6">
              {caseStudy.detailedReport.sentimentData && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">توزيع المشاعر</h4>
                  <PieChart data={caseStudy.detailedReport.sentimentData} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {caseStudy.detailedReport.languageBreakdown && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">توزيع اللغات</h4>
                  <PieChart data={caseStudy.detailedReport.languageBreakdown} />
                </div>
              )}

              {caseStudy.detailedReport.topKeywords && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">الكلمات الأكثر تداولاً</h4>
                  <div className="flex flex-wrap gap-2">
                    {caseStudy.detailedReport.topKeywords.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="influencers" className="space-y-6">
              {caseStudy.detailedReport.influencers && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-semibold mb-4">أبرز المؤثرين في النقاش</h4>
                  <div className="space-y-4">
                    {caseStudy.detailedReport.influencers.map((influencer, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
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
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default CaseStudyDetails;
