
import React from 'react';

const SearchLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mb-4"></div>
      <p className="text-saudi-green font-medium">جاري تحليل البيانات...</p>
      <div className="mt-6 w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded">
          <div className="h-full bg-saudi-green rounded animate-pulse" style={{width: '60%'}}></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>جمع البيانات</span>
          <span>تحليل المشاعر</span>
          <span>إنشاء التقرير</span>
        </div>
      </div>
    </div>
  );
};

export default SearchLoadingState;
