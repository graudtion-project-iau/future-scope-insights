
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { SearchProgress, SearchStage, getProgressColor, searchStageLabels } from '@/utils/searchStages';
import { Loader, CheckCircle, AlertTriangle } from 'lucide-react';

interface SearchProgressBarProps {
  searchProgress: SearchProgress;
  className?: string;
}

const SearchProgressBar: React.FC<SearchProgressBarProps> = ({ searchProgress, className = "" }) => {
  const [quotes, setQuotes] = useState<string[]>([
    "جمع التغريدات ذات الصلة...",
    "تحليل المشاعر للمحتوى...",
    "تحديد المؤثرين الرئيسيين...",
    "استخراج الهاشتاقات المهمة...",
    "فحص التوزيع الجغرافي...",
    "تحليل التغير في الزمن...",
  ]);
  const [currentQuote, setCurrentQuote] = useState<string>(quotes[0]);
  
  const progressColor = getProgressColor(searchProgress.stage);

  useEffect(() => {
    if (searchProgress.stage === 'idle' || searchProgress.stage === 'completed' || searchProgress.stage === 'error') {
      return;
    }

    // Rotate quotes during analysis
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = quotes.indexOf(prev);
        const nextIndex = (currentIndex + 1) % quotes.length;
        return quotes[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [searchProgress.stage, quotes]);

  const getStageIcon = (stage: SearchStage) => {
    if (stage === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stage === 'error') {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    } else if (stage !== 'idle') {
      return <Loader className="h-5 w-5 text-saudi-green animate-spin" />;
    }
    return null;
  };

  if (searchProgress.stage === 'idle') {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getStageIcon(searchProgress.stage)}
          <span className="mr-2 font-medium">{searchStageLabels[searchProgress.stage]}</span>
        </div>
        <span className="text-sm text-gray-500">{searchProgress.progress}%</span>
      </div>
      
      <Progress 
        value={searchProgress.progress} 
        className="h-2 mb-2"
        indicatorClassName={progressColor}
      />
      
      {(searchProgress.stage === 'searching' || searchProgress.stage === 'analyzing' || searchProgress.stage === 'preparing') && (
        <div className="text-sm text-gray-600 italic text-center animate-fade-in mt-2">
          "{currentQuote}"
        </div>
      )}
      
      {searchProgress.searchId && (
        <div className="text-xs text-gray-500 mt-1">
          معرف البحث: {searchProgress.searchId}
        </div>
      )}
      
      {searchProgress.error && (
        <div className="text-sm text-red-500 mt-1">
          {searchProgress.error}
        </div>
      )}
    </div>
  );
};

export default SearchProgressBar;
