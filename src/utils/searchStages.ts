
export type SearchStage = 'idle' | 'searching' | 'analyzing' | 'preparing' | 'completed' | 'error';

export interface SearchProgress {
  stage: SearchStage;
  progress: number; // 0-100
  message: string;
  searchId?: string;
  error?: string;
}

export const searchStageLabels = {
  idle: 'في انتظار البحث',
  searching: 'جمع البيانات والتغريدات',
  analyzing: 'تحليل المشاعر والمحتوى',
  preparing: 'إعداد لوحة المعلومات',
  completed: 'اكتمل التحليل',
  error: 'حدث خطأ'
};

export const getSearchStagePercentage = (stage: SearchStage): number => {
  switch (stage) {
    case 'idle': return 0;
    case 'searching': return 25;
    case 'analyzing': return 50;
    case 'preparing': return 75;
    case 'completed': return 100;
    case 'error': return 0;
    default: return 0;
  }
};

export const getProgressColor = (stage: SearchStage): string => {
  switch (stage) {
    case 'searching': return 'bg-blue-500';
    case 'analyzing': return 'bg-amber-500';
    case 'preparing': return 'bg-purple-500';
    case 'completed': return 'bg-green-500';
    case 'error': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
};
