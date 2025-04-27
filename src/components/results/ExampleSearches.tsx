
import React from 'react';
import { ExampleSearch } from '@/types/search';

interface ExampleSearchesProps {
  searches: ExampleSearch[];
  onSearchSelect: (query: string) => void;
}

const ExampleSearches: React.FC<ExampleSearchesProps> = ({ searches, onSearchSelect }) => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">جرب بعض الأمثلة:</h2>
        <p className="text-gray-600 mb-6">اكتشف تحليلات المشاعر لبعض الموضوعات الشائعة</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {searches.map((search, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg border ${search.borderColor} ${search.color} cursor-pointer transition-all hover:shadow-md`}
            onClick={() => onSearchSelect(search.name)}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white p-2">{search.icon}</div>
              <div>
                <h3 className={`font-medium ${search.textColor}`}>{search.name}</h3>
                <p className="text-sm text-gray-600">{search.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSearches;
