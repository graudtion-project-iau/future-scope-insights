import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, Users, MapPin, BarChart2, Clock, Flame, 
  Sparkles, Search, Filter, Hash, Database, Bell 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICards from '@/components/results/KPICards';
import ActionButtons from '@/components/results/ActionButtons';
import TweetFeed from '@/components/tweets/TweetFeed';
import { APIAnalysisResponse, AnalysisOverviewData, Tweet, TweetSearchResults, TrendType, ExampleSearch } from '@/types/search';
import { get } from '@/api/apiClient';
import API_ENDPOINTS from '@/api/apiUrls';
import { useToast } from '@/hooks/use-toast';
import SearchResultsHeader from '@/components/results/SearchResultsHeader';
import SearchLoadingState from '@/components/results/SearchLoadingState';
import ExampleSearches from '@/components/results/ExampleSearches';
import SentimentAnalysis from '@/components/results/SentimentAnalysis';
import AnalysisOverview from '@/components/results/AnalysisOverview';
import HashtagsDisplay from '@/components/results/HashtagsDisplay';
import { isSampleQuery, getSampleData, getSampleTweets } from '@/utils/sampleSearchData';
import { transformAnalysisData } from '@/utils/analysisTransformers';

const trendingHashtags = [
  { tag: "#السعودية", count: 12500, trend: "increase" as TrendType },
  { tag: "#الرياض_موسم", count: 8300, trend: "increase" as TrendType },
  { tag: "#كأس_العالم", count: 7200, trend: "neutral" as TrendType },
  { tag: "#رؤية_2030", count: 5400, trend: "increase" as TrendType },
  { tag: "#العلا", count: 4100, trend: "increase" as TrendType }
];

const exampleSearches: ExampleSearch[] = [
  {
    name: "السعودية الأرجنتين",
    description: "مباراة كأس العالم التاريخية",
    icon: <Activity className="h-5 w-5" />,
    color: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200"
  },
  {
    name: "انفجار الخبر",
    description: "تحليل الأحداث الفورية",
    icon: <Bell className="h-5 w-5" />,
    color: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-200"
  },
  {
    name: "موسم الرياض",
    description: "تحليل المهرجان السنوي",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200"
  },
  {
    name: "رالي داكار",
    description: "تحليل المسابقة الرياضية",
    icon: <BarChart2 className="h-5 w-5" />,
    color: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-200"
  },
  {
    name: "السياحة في العلا",
    description: "آراء الزوار والمعالم",
    icon: <MapPin className="h-5 w-5" />,
    color: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200"
  },
  {
    name: "معرض الرياض للكتاب",
    description: "تغطية وتفاعلات الحدث",
    icon: <Users className="h-5 w-5" />,
    color: "bg-cyan-100",
    textColor: "text-cyan-800",
    borderColor: "border-cyan-200"
  }
];

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<AnalysisOverviewData | null>(null);
  const [tweetResults, setTweetResults] = useState<TweetSearchResults | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'recent' as 'recent' | 'popular' | 'relevant',
    timeRange: '24h',
    hasMedia: false,
    verifiedOnly: false,
    sentiment: ['positive', 'neutral', 'negative']
  });
  
  const isWorldCupMatch = query.toLowerCase().includes("السعودية") && query.toLowerCase().includes("الأرجنتين");
  const isKhobzEvent = query.toLowerCase().includes("انفجار") && query.toLowerCase().includes("الخبر");
  
  const [searchStarted, setSearchStarted] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      fetchAnalysisData(searchQuery);
      fetchTweets(searchQuery, 1);
    }
  }, [location.search]);

  const fetchAnalysisData = async (searchQuery: string) => {
    setLoading(true);
    try {
      if (isSampleQuery(searchQuery)) {
        const sampleData = getSampleData(searchQuery);
        if (sampleData) {
          setOverview(sampleData);
          setTweetResults(getSampleTweets(searchQuery));
          return;
        }
      }

      else {
        const endpoint = `${API_ENDPOINTS.analysis.overview}?query=${encodeURIComponent(searchQuery)}`;
        const response = await get<APIAnalysisResponse>(endpoint);
        
        if (response) {
          const transformedData = transformAnalysisData(response);
          setOverview(transformedData);
          setTweetResults({
            total: response.detailed_analysis.length,
            page: 1,
            pages: 1,
            tweets: transformedData.highlightTweets ? [
              transformedData.highlightTweets.earliest,
              transformedData.highlightTweets.mostLiked,
              transformedData.highlightTweets.latest
            ].filter(Boolean) as Tweet[] : []
          });
        } else {
          toast({
            title: "خطأ في تحميل البيانات",
            description: "لم نتمكن من تحميل بيانات التحليل. الرجاء المحاولة مرة أخرى.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء محاولة تحميل البيانات. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTweets = async (searchQuery: string, page: number, newFilters?: typeof filters) => {
    setLoading(true);
    try {
      const currentFilters = newFilters || filters;
      
      if (isWorldCupMatch) {
        setTweetResults({
          total: sampleTweets.length,
          page: 1,
          pages: 1,
          tweets: sampleTweets
        });
      } else if (isKhobzEvent) {
        setTweetResults({
          total: khobzTweets.length,
          page: 1,
          pages: 1,
          tweets: khobzTweets
        });
      } else {
        const filterParams = [
          `query=${encodeURIComponent(searchQuery)}`,
          `page=${page}`,
          `sort=${currentFilters.sortBy}`,
          `timeRange=${currentFilters.timeRange}`,
          currentFilters.hasMedia ? 'hasMedia=true' : '',
          currentFilters.verifiedOnly ? 'verifiedOnly=true' : '',
          `sentiment=${currentFilters.sentiment.join(',')}`
        ].filter(Boolean).join('&');
        
        const endpoint = `${API_ENDPOINTS.analysis.tweets}?${filterParams}`;
        const data = await get<{ data: TweetSearchResults }>(endpoint);
        
        if (data?.data) {
          setTweetResults(data.data);
        } else {
          toast({
            title: "خطأ في تحميل التغريدات",
            description: "لم نتمكن من تحميل التغريدات. الرجاء المحاولة مرة أخرى.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearchStarted(true);
    
    setTimeout(() => {
      navigate(`/results?q=${encodeURIComponent(newQuery)}`);
    }, 800);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    fetchTweets(query, 1, newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTweets(query, page);
  };

  const isRealtime = overview?.kpis?.find(k => k.type === 'realtime')?.value === 'نشط';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <SearchResultsHeader 
        query={query}
        total={overview?.total}
        lastUpdate={overview?.lastUpdate}
        isRealtime={isRealtime}
        onSearch={handleSearch}
      />
      
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {query ? (
            <>
              {loading || searchStarted ? (
                <SearchLoadingState />
              ) : overview ? (
                <>
                  <KPICards kpis={overview.kpis} />
                  <ActionButtons />
                  
                  <Tabs defaultValue="overview" className="mb-8">
                    <TabsList className="mb-6">
                      <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                      <TabsTrigger value="tweets">التغريدات</TabsTrigger>
                      <TabsTrigger value="sentiment">تحليل المشاعر</TabsTrigger>
                      <TabsTrigger value="influencers">المؤثرين</TabsTrigger>
                      <TabsTrigger value="hashtags">الهاشتاقات</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview">
                      <AnalysisOverview data={overview} />
                    </TabsContent>
                    
                    <TabsContent value="tweets">
                      <div className="dashboard-card">
                        {tweetResults && (
                          <TweetFeed 
                            tweets={tweetResults.tweets}
                            totalTweets={tweetResults.total}
                            currentPage={tweetResults.page}
                            totalPages={tweetResults.pages}
                            onPageChange={handlePageChange}
                            onFilterChange={handleFilterChange}
                          />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sentiment">
                      <SentimentAnalysis 
                        sentimentData={overview.sentiment}
                        timelineData={overview.timeline}
                        tweets={tweetResults?.tweets}
                      />
                    </TabsContent>
                    
                    <TabsContent value="influencers">
                      <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
                        <InfluencersList data={overview.influencers} />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hashtags">
                      <HashtagsDisplay hashtags={trendingHashtags} />
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">لم يتم العثور على نتائج</h3>
                    <p className="text-gray-500">لم نتمكن من العثور على نتائج لهذا الاستعلام. الرجاء تجربة كلمات بحث أخرى.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <ExampleSearches searches={exampleSearches} onSearchSelect={handleSearch} />
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Results;
