import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    influencers?: Array<{ 
      name: string; 
      followers: string; 
      engagementRate: number; 
      avatar: string; 
    }>;
  };
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, metrics, detailedReport }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/case-study/${encodeURIComponent(title)}`, {
      state: { caseStudy: { title, description, metrics, detailedReport } }
    });
  };

  return (
    <Card className="hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-saudi-green">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="text-xl font-bold text-saudi-green">{value}</div>
              <div className="text-sm text-gray-500">{key}</div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full btn-saudi" onClick={handleViewDetails}>
          عرض التفاصيل الكاملة
          <ArrowRight className="w-4 h-4 mr-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CaseStudy;
