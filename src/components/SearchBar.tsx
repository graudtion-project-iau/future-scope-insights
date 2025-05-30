import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { apiUrl } from '@/api/apiUrls';
import API_ENDPOINTS from '@/api/apiUrls';
import { get } from '@/api/apiClient';

interface SearchBarProps {
  large?: boolean;
  onSearch?: (query: string, maxItems: number) => void;
  tweetCount?: number;
}

interface SearchSuggestion {
  text: string;
  score: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ large = false, onSearch, tweetCount }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const [maxItems, setMaxItems] = useState(10);

  // Fetch suggestions as user types
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const suggestionsUrl = apiUrl(`${API_ENDPOINTS.search.suggestions}?q=${encodeURIComponent(searchQuery)}`);
      const data = await get<{ suggestions: SearchSuggestion[] }>(
        API_ENDPOINTS.search.suggestions + `?q=${encodeURIComponent(searchQuery)}`,
        'searchResults'
      );
      
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query, maxItems);
      } else {
        navigate(`/results?q=${encodeURIComponent(query)}`);
      }
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Debounce API calls to avoid too many requests
    const handler = setTimeout(() => {
      fetchSuggestions(newQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center w-full transition-all duration-300 ${large ? 'scale-100' : 'scale-90'}`}
      >
        <div className="relative w-full">
          <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Search className={`text-gray-400 ${large ? 'h-6 w-6' : 'h-5 w-5'}`} />
          </div>
          <input
            type="text"
            placeholder={isRTL ? "اكتب استعلامك... مثال: آراء السياحة في السعودية" : "Enter your search query... Example: Saudi tourism opinions"}
            value={query}
            onChange={handleQueryChange}
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
              disabled={isLoading}
            >
              {isRTL ? 'بحث' : 'Search'}
              <ArrowIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <select
          className="border rounded px-2 py-2 text-sm"
          value={maxItems}
          onChange={e => setMaxItems(Number(e.target.value))}
          style={{ minWidth: 80 }}
        >
          {Array.from({ length: 50 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{n} تغريدة</option>
          ))}
        </select>
      </form>
      
      {tweetCount !== undefined && (
        <div className={`mt-2 text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {isRTL 
            ? `تم العثور على ${tweetCount.toLocaleString()} تغريدة` 
            : `Found ${tweetCount.toLocaleString()} tweets`}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
