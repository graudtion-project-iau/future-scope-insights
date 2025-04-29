import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processSearch } from '@/services/searchService';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [maxItems, setMaxItems] = useState('5');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const result = await processSearch(query, parseInt(maxItems));
      navigate(`/results/${result.id}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Future Scope Insights</h1>
          <p className="text-lg text-muted-foreground">
            Analyze social media trends and gain valuable insights
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your search query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={maxItems} onValueChange={setMaxItems}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Max items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 item</SelectItem>
                <SelectItem value="5">5 items</SelectItem>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="25">25 items</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : <><Search className="w-4 h-4 mr-2" /> Search</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home; 