
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  large?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ large = false, onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/results?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-3xl mx-auto transition-all duration-300 ${large ? 'scale-100' : 'scale-90'}`}
    >
      <div className="relative w-full">
        <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
          <Search className={`text-gray-400 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </div>
        <input
          type="text"
          placeholder="Enter your query... e.g., Tourism opinions in Saudi Arabia"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`
            block w-full ${isRTL ? 'pr-10 pl-16' : 'pl-10 pr-16'} border-gray-300 rounded-full
            bg-white bg-opacity-90 backdrop-blur-sm shadow-lg
            focus:ring-saudi-green focus:border-saudi-green border-2 
            transition-all duration-300
            ${large ? 'py-4 text-lg' : 'py-2 text-base'}
          `}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <div className={`absolute inset-y-0 ${isRTL ? 'left-0' : 'right-0'} flex items-center ${isRTL ? 'pl-2' : 'pr-2'}`}>
          <Button 
            type="submit" 
            className={`btn-saudi rounded-full ${large ? 'py-2 px-6' : 'py-1 px-3'} flex items-center justify-center gap-2`}
          >
            {isRTL ? 'بحث' : 'Search'}
            <ArrowIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
