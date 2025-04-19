
import React from 'react';
import { Filter, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionButtons = () => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div className="flex space-x-2 rtl:space-x-reverse mb-4 sm:mb-0">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          تصفية النتائج
        </Button>
        <Button variant="outline" className="hidden sm:flex items-center gap-2">
          آخر 24 ساعة
        </Button>
      </div>
      <div className="flex space-x-2 rtl:space-x-reverse">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          تحميل التقرير
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          مشاركة
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
