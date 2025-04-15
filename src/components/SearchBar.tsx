
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  large?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ large = false, onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

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

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-3xl mx-auto transition-all duration-300 ${large ? 'scale-100' : 'scale-90'}`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`text-gray-400 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </div>
        <input
          type="text"
          placeholder="اكتب استعلامك... مثال: آراء السياحة في السعودية"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`
            block w-full pl-10 pr-16 border-gray-300 rounded-full
            bg-white bg-opacity-90 backdrop-blur-sm shadow-lg
            focus:ring-saudi-green focus:border-saudi-green border-2 
            transition-all duration-300
            ${large ? 'py-4 text-lg' : 'py-2 text-base'}
          `}
          dir="rtl"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button 
            type="submit" 
            className={`btn-saudi rounded-full ${large ? 'py-2 px-6' : 'py-1 px-3'} flex items-center justify-center gap-2`}
          >
            بحث
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
