
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
import InfluencersList from '@/components/results/InfluencersList';
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
    name: "آراء السياحة في السعودية",
    description: "تحليل تجربة السياح في المملكة",
    icon: <MapPin className="h-5 w-5" />,
    color: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200"
  },
  {
    name: "ملاحظات عن تجربة العلا",
    description: "آراء الزوار وتقييم السياحة",
    icon: <Activity className="h-5 w-5" />,
    color: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200"
  },
  {
    name: "تأثير موسم الرياض",
    description: "تحليل التأثير الاقتصادي والثقافي",
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200"
  },
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
    name: "رالي داكار",
    description: "تحليل المسابقة الرياضية",
    icon: <BarChart2 className="h-5 w-5" />,
    color: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-200"
  }
];

const worldCupSampleTweets = getSampleTweets("السعودية الأرجنتين");
const khobzSampleTweets = getSampleTweets("انفجار الخبر");

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
          setLoading(false);
          return;
        }
      }

      // Fetch analysis data - Try to use the most recent report for simplicity
      const endpoint = `${API_ENDPOINTS.analysis.overview}`;
      console.log("Fetching analysis data from:", endpoint);
      
      // First try to get a list of reports
      const reportsResponse = await get<APIAnalysisResponse[]>(endpoint);
      
      if (reportsResponse && reportsResponse.length > 0) {
        console.log("Analysis data received:", reportsResponse);
        
        // Get the most recent report
        const mostRecentReport = reportsResponse[0];
        
        const transformedData = transformAnalysisData(mostRecentReport);
        setOverview(transformedData);
        
        // If we have detailed_analysis, use it for tweets
        if (mostRecentReport.detailed_analysis && mostRecentReport.detailed_analysis.length > 0) {
          const tweets = mostRecentReport.detailed_analysis.map(tweet => ({
            id: tweet.tweet_id,
            text: tweet.original_text || '',
            user: {
              id: tweet.tweet_id,
              name: tweet.metadata?.username || "مستخدم تويتر",
              username: tweet.metadata?.username || "@user",
              profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
              verified: false,
              followers: Math.floor(Math.random() * 10000)
            },
            date: tweet.metadata?.tweet_date || new Date().toISOString(),
            likes: tweet.engagement_metrics?.likes || 0,
            retweets: tweet.engagement_metrics?.retweets || 0,
            quotes: tweet.engagement_metrics?.quotes || 0,
            replies: tweet.engagement_metrics?.replies || 0,
            sentiment: (tweet.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative'
          }));
          
          setTweetResults({
            total: tweets.length,
            page: 1,
            pages: 1,
            tweets
          });
        } else if (transformedData.highlightTweets) {
          // Fall back to highlight tweets if detailed analysis is missing
          setTweetResults({
            total: transformedData.highlightTweets ? Object.keys(transformedData.highlightTweets).length : 0,
            page: 1,
            pages: 1,
            tweets: transformedData.highlightTweets ? [
              transformedData.highlightTweets.earliest,
              transformedData.highlightTweets.mostLiked,
              transformedData.highlightTweets.latest
            ].filter(Boolean) as Tweet[] : []
          });
        }
      } else {
        // Try to get a specific report
        const specificReportResponse = await get<APIAnalysisResponse>(`${endpoint}1/`);
        if (specificReportResponse) {
          console.log("Specific report data received:", specificReportResponse);
          const transformedData = transformAnalysisData(specificReportResponse);
          setOverview(transformedData);
          
          // Process tweets from the detailed analysis
          if (specificReportResponse.detailed_analysis && specificReportResponse.detailed_analysis.length > 0) {
            const tweets = specificReportResponse.detailed_analysis.map(tweet => ({
              id: tweet.tweet_id,
              text: tweet.original_text || '',
              user: {
                id: tweet.tweet_id,
                name: tweet.metadata?.username || "مستخدم تويتر",
                username: tweet.metadata?.username || "@user",
                profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
                verified: false,
                followers: Math.floor(Math.random() * 10000)
              },
              date: tweet.metadata?.tweet_date || new Date().toISOString(),
              likes: tweet.engagement_metrics?.likes || 0,
              retweets: tweet.engagement_metrics?.retweets || 0,
              quotes: tweet.engagement_metrics?.quotes || 0,
              replies: tweet.engagement_metrics?.replies || 0,
              sentiment: (tweet.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative'
            }));
            
            setTweetResults({
              total: tweets.length,
              page: 1,
              pages: 1,
              tweets
            });
          }
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
      
      if (isSampleQuery(searchQuery)) {
        const sampleTweets = getSampleTweets(searchQuery);
        setTweetResults(sampleTweets);
        setLoading(false);
        return;
      }

      // Get tweets from the API
      const filterParams = [
        `page=${page}`,
      ].filter(Boolean).join('&');
      
      const endpoint = `${API_ENDPOINTS.analysis.tweets}${filterParams ? '?' + filterParams : ''}`;
      console.log("Fetching tweets from:", endpoint);
      
      const response = await get<any>(endpoint);
      
      if (response) {
        console.log("Tweets data received:", response);
        
        // Handle both formats: array of tweets or object with results array
        let tweets: any[] = [];
        if (Array.isArray(response)) {
          tweets = response;
        } else if (response.results && Array.isArray(response.results)) {
          tweets = response.results;
        }
        
        const transformedTweets = tweets.map(tweet => ({
          id: tweet.tweet_id || tweet.id || `tweet-${Math.random().toString(36).substring(2, 9)}`,
          text: tweet.original_text || tweet.text || '',
          user: {
            id: tweet.user_id || `user-${Math.random().toString(36).substring(2, 9)}`,
            name: tweet.username || tweet.user_name || "مستخدم تويتر",
            username: tweet.username || "@user",
            profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
            verified: false,
            followers: Math.floor(Math.random() * 10000)
          },
          date: tweet.tweet_date || tweet.date || tweet.metadata?.tweet_date || new Date().toISOString(),
          likes: tweet.likes || (tweet.engagement_metrics?.likes || 0),
          retweets: tweet.retweets || (tweet.engagement_metrics?.retweets || 0),
          quotes: tweet.quotes || (tweet.engagement_metrics?.quotes || 0),
          replies: tweet.replies || (tweet.engagement_metrics?.replies || 0),
          sentiment: (tweet.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative'
        }));
        
        setTweetResults({
          total: transformedTweets.length,
          page,
          pages: Math.ceil(transformedTweets.length / 20),
          tweets: transformedTweets
        });
      } else {
        toast({
          title: "خطأ في تحميل التغريدات",
          description: "لم نتمكن من تحميل التغريدات. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
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
