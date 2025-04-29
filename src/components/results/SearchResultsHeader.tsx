import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Filter } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

interface SearchResultsHeaderProps {
  query: string;
  total?: number;
  lastUpdate?: string;
  isRealtime?: boolean;
  onSearch: (query: string) => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  query,
  total,
  lastUpdate,
  isRealtime,
  onSearch
}) => {
  return (
    <section className="pt-24 pb-6 px-4 bg-white border-b">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">نتائج البحث</h1>
          <p className="text-gray-600">{query ? `استعلام: "${query}"` : 'استخدم شريط البحث للحصول على تحليلات'}</p>
        </div>
        <SearchBar onSearch={onSearch} tweetCount={total} />
        
        {query && total && (
          <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{query}</h2>
                <Badge variant="outline" className="bg-saudi-green/10 text-saudi-green">
                  {total.toLocaleString()} نتيجة
                </Badge>
              </div>
              {lastUpdate && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>آخر تحديث: {lastUpdate}</span>
                  {isRealtime && (
                    <Badge className="bg-green-500 text-white ml-2">تحديث مباشر</Badge>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex gap-1 items-center">
                <Filter className="h-3 w-3" />
                <span>فلترة</span>
              </Badge>
              <Badge variant="outline" className="flex gap-1 items-center">
                <Clock className="h-3 w-3" />
                <span>24 ساعة الماضية</span>
              </Badge>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResultsHeader;
