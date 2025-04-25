
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchBarProps {
  large?: boolean;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ large = false, onSearch }) => {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      
      if (onSearch) {
        onSearch(query);
      } else {
        // Add loading animation before navigation
        setTimeout(() => {
          navigate(`/results?q=${encodeURIComponent(query)}`);
          setIsLoading(false);
        }, 800); // Simulate loading for better UX
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-3xl mx-auto transition-all duration-300 ${large ? 'scale-100' : 'scale-90'}`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className={`text-gray-400 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} />
        </div>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`
            block w-full pr-10 pl-4 border-gray-300 rounded-full
            bg-white shadow-lg
            focus:ring-saudi-green focus:border-saudi-green border-2 
            transition-all duration-300
            ${large ? 'py-4 text-lg' : 'py-2 text-base'}
          `}
          dir="rtl"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Button 
            type="submit" 
            className={`rounded-full ${large ? 'py-2 px-6' : 'py-1 px-3'} bg-saudi-green hover:bg-saudi-green/90`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-2" />
              </div>
            ) : (
              t('search.button')
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
