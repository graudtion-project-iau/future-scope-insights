
import React, { useState } from 'react';
import { Filter, ChevronDown, Check, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface TweetFiltersProps {
  onFilterChange: (filters: {
    sortBy: 'recent' | 'popular' | 'relevant';
    timeRange: string;
    hasMedia: boolean;
    verifiedOnly: boolean;
    sentiment: string[];
  }) => void;
}

const TweetFilters: React.FC<TweetFiltersProps> = ({ onFilterChange }) => {
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'relevant'>('recent');
  const [timeRange, setTimeRange] = useState('24h');
  const [hasMedia, setHasMedia] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sentiment, setSentiment] = useState<string[]>(['positive', 'neutral', 'negative']);
  
  const handleSortChange = (value: 'recent' | 'popular' | 'relevant') => {
    setSortBy(value);
    updateFilters(value, timeRange, hasMedia, verifiedOnly, sentiment);
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    updateFilters(sortBy, value, hasMedia, verifiedOnly, sentiment);
  };
  
  const handleMediaChange = (checked: boolean) => {
    setHasMedia(checked);
    updateFilters(sortBy, timeRange, checked, verifiedOnly, sentiment);
  };
  
  const handleVerifiedChange = (checked: boolean) => {
    setVerifiedOnly(checked);
    updateFilters(sortBy, timeRange, hasMedia, checked, sentiment);
  };
  
  const handleSentimentChange = (value: string) => {
    const currentSentiment = [...sentiment];
    
    if (currentSentiment.includes(value)) {
      setSentiment(currentSentiment.filter(s => s !== value));
      updateFilters(sortBy, timeRange, hasMedia, verifiedOnly, currentSentiment.filter(s => s !== value));
    } else {
      setSentiment([...currentSentiment, value]);
      updateFilters(sortBy, timeRange, hasMedia, verifiedOnly, [...currentSentiment, value]);
    }
  };
  
  const updateFilters = (
    sortBy: 'recent' | 'popular' | 'relevant',
    timeRange: string,
    hasMedia: boolean,
    verifiedOnly: boolean,
    sentiment: string[]
  ) => {
    onFilterChange({
      sortBy,
      timeRange,
      hasMedia,
      verifiedOnly,
      sentiment
    });
  };
  
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (timeRange !== '24h') count++;
    if (hasMedia) count++;
    if (verifiedOnly) count++;
    if (sentiment.length !== 3) count++;
    return count;
  };
  
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            فلترة
            {getActiveFiltersCount() > 0 && (
              <span className="bg-saudi-green text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">ترتيب حسب</h3>
              <RadioGroup value={sortBy} onValueChange={value => handleSortChange(value as any)}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="recent" id="recent" />
                  <Label htmlFor="recent">الأحدث</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="popular" id="popular" />
                  <Label htmlFor="popular">الأكثر شعبية</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="relevant" id="relevant" />
                  <Label htmlFor="relevant">الأكثر صلة</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">الفترة الزمنية</h3>
              <RadioGroup value={timeRange} onValueChange={handleTimeRangeChange}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">آخر 24 ساعة</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="7d" id="7d" />
                  <Label htmlFor="7d">آخر 7 أيام</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="30d" id="30d" />
                  <Label htmlFor="30d">آخر 30 يوم</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">مخصص</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-medium mb-2">مرشحات إضافية</h3>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id="has-media" 
                  checked={hasMedia}
                  onCheckedChange={handleMediaChange}
                />
                <Label htmlFor="has-media">تحتوي على وسائط</Label>
              </div>
              
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox 
                  id="verified-only"
                  checked={verifiedOnly}
                  onCheckedChange={handleVerifiedChange}
                />
                <Label htmlFor="verified-only">الحسابات الموثقة فقط</Label>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-medium mb-2">المشاعر</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="positive"
                    checked={sentiment.includes('positive')}
                    onCheckedChange={() => handleSentimentChange('positive')}
                  />
                  <Label htmlFor="positive">
                    <span className="inline-block bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs">إيجابي</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="neutral"
                    checked={sentiment.includes('neutral')}
                    onCheckedChange={() => handleSentimentChange('neutral')}
                  />
                  <Label htmlFor="neutral">
                    <span className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 text-xs">محايد</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="negative"
                    checked={sentiment.includes('negative')}
                    onCheckedChange={() => handleSentimentChange('negative')}
                  />
                  <Label htmlFor="negative">
                    <span className="inline-block bg-red-100 text-red-800 rounded-full px-2 py-0.5 text-xs">سلبي</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            {sortBy === 'recent' ? 'الأحدث' : sortBy === 'popular' ? 'الأكثر شعبية' : 'الأكثر صلة'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            <Button 
              variant={sortBy === 'recent' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleSortChange('recent')}
            >
              الأحدث
              {sortBy === 'recent' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
            <Button 
              variant={sortBy === 'popular' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleSortChange('popular')}
            >
              الأكثر شعبية
              {sortBy === 'popular' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
            <Button 
              variant={sortBy === 'relevant' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleSortChange('relevant')}
            >
              الأكثر صلة
              {sortBy === 'relevant' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {timeRange === '24h' ? 'آخر 24 ساعة' : 
             timeRange === '7d' ? 'آخر 7 أيام' : 
             timeRange === '30d' ? 'آخر 30 يوم' : 'مخصص'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            <Button 
              variant={timeRange === '24h' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTimeRangeChange('24h')}
            >
              آخر 24 ساعة
              {timeRange === '24h' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
            <Button 
              variant={timeRange === '7d' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTimeRangeChange('7d')}
            >
              آخر 7 أيام
              {timeRange === '7d' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTimeRangeChange('30d')}
            >
              آخر 30 يوم
              {timeRange === '30d' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
            <Button 
              variant={timeRange === 'custom' ? 'secondary' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => handleTimeRangeChange('custom')}
            >
              مخصص
              {timeRange === 'custom' && <Check className="h-4 w-4 ml-auto" />}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TweetFilters;
