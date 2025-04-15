
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CaseStudyProps {
  title: string;
  description: string;
  metrics: {
    [key: string]: string;
  };
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, metrics }) => {
  return (
    <div className="glass-card p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-4 text-saudi-green">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xl font-bold text-saudi-green">{value}</div>
            <div className="text-sm text-gray-500">{key}</div>
          </div>
        ))}
      </div>
      <Button className="w-full btn-saudi">
        عرض التفاصيل
        <ArrowRight className="w-4 h-4 mr-2" />
      </Button>
    </div>
  );
};

export default CaseStudy;
