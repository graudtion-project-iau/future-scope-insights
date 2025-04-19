
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const { updateSearchQuota, searchesRemaining } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keyword.trim()) {
      toast({
        title: "خطأ في البحث",
        description: "الرجاء إدخال كلمة للبحث",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has searches remaining
    if (searchesRemaining <= 0) {
      toast({
        title: "تم استنفاذ حد البحث اليومي",
        description: "لقد استخدمت الحد الأقصى من عمليات البحث اليومية (5). يرجى المحاولة غدًا.",
        variant: "destructive",
      });
      return;
    }
    
    // Update search quota
    const success = updateSearchQuota();
    
    if (success) {
      // Simulate search by navigating to results
      navigate('/results', { 
        state: { 
          keyword,
          timestamp: new Date().toISOString() 
        } 
      });
      
      toast({
        title: "جاري البحث",
        description: `البحث عن "${keyword}"`,
      });
    } else {
      toast({
        title: "فشل البحث",
        description: "حدث خطأ أثناء تحديث حصة البحث. يرجى تسجيل الدخول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl">
      <div className="flex w-full max-w-4xl items-center space-x-2 space-x-reverse">
        <Input
          type="text"
          placeholder="ابحث عن أي موضوع، علامة تجارية، حدث..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="text-right h-12 w-full text-base md:text-lg bg-white border-gray-300 focus-visible:ring-saudi-green"
        />
        <Button 
          type="submit" 
          className="btn-saudi h-12 px-6"
          disabled={searchesRemaining <= 0}
        >
          <Search className="ml-2 h-5 w-5" />
          بحث
        </Button>
      </div>
      <div className="mt-2 text-sm text-gray-500 text-right">
        البحوث المتبقية اليوم: <span className="font-medium text-saudi-green">{searchesRemaining}</span> من <span>5</span>
      </div>
    </form>
  );
};

export default SearchBar;
