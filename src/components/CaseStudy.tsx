
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
          <div className="space-y-6">
            {detailedReport.sentimentData && (
              <div>
                <h4 className="text-lg font-semibold mb-3">تحليل المشاعر</h4>
                <PieChart data={detailedReport.sentimentData} />
              </div>
            )}

            {detailedReport.languageBreakdown && (
              <div>
                <h4 className="text-lg font-semibold mb-3">توزيع اللغات</h4>
                <PieChart data={detailedReport.languageBreakdown} />
              </div>
            )}

            {(detailedReport.timeSeriesData || detailedReport.mentionsTimeline) && (
              <div>
                <h4 className="text-lg font-semibold mb-3">تحليل زمني للتفاعل</h4>
                <LineChart
                  data={detailedReport.timeSeriesData || detailedReport.mentionsTimeline || []}
                  lines={[{ dataKey: 'mentions', color: '#2196F3', name: 'عدد التفاعلات' }]}
                  xAxisDataKey="time"
                />
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

            {detailedReport.timeline && (
              <div>
                <h4 className="text-lg font-semibold mb-3">التسلسل الزمني</h4>
                <div className="space-y-3">
                  {detailedReport.timeline.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="text-saudi-green font-semibold">{item.time}</div>
                      <div>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailedReport.verificationStatus && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 font-semibold">{detailedReport.verificationStatus}</p>
              </div>
            )}
          </div>
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
