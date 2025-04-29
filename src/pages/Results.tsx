import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { executeSearch, getSearchResults } from '@/services/searchService';
import TweetList from '@/components/tweets/TweetList';
import TweetCard from '@/components/tweets/TweetCard';

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

const worldCupSampleTweets: Tweet[] = [
  {
    id: "wc1",
    text: "مباراة تاريخية! السعودية تهزم الأرجنتين! 🎉🎉🎉 #السعودية_الأرجنتين",
    user: {
      id: "u1",
      name: "فهد العنزي",
      username: "@fahad_sport",
      profileImage: "https://randomuser.me/api/portraits/men/11.jpg",
      verified: true,
      followers: 120000
    },
    date: "2022-11-22T14:23:00Z",
    likes: 45000,
    retweets: 15000,
    quotes: 2000,
    replies: 3000,
    sentiment: "positive",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/800/500"
      }
    ]
  },
  {
    id: "wc2",
    text: "تاريخ جديد يكتب اليوم! المنتخب السعودي يقدم مباراة استثنائية #كأس_العالم",
    user: {
      id: "u2",
      name: "سارة الشهري",
      username: "@sara_sports",
      profileImage: "https://randomuser.me/api/portraits/women/12.jpg",
      verified: false,
      followers: 50000
    },
    date: "2022-11-22T14:30:00Z",
    likes: 32000,
    retweets: 8500,
    quotes: 1200,
    replies: 2100,
    sentiment: "positive"
  }
];

const khobzSampleTweets: Tweet[] = [
  {
    id: "k1",
    text: "عاجل: انفجار في الخبر، والسلطات تؤكد أنه حادث عرضي وتدعو للهدوء",
    user: {
      id: "u3",
      name: "أخبار السعودية",
      username: "@ksa_news",
      profileImage: "https://randomuser.me/api/portraits/men/21.jpg",
      verified: true,
      followers: 250000
    },
    date: new Date().toISOString(),
    likes: 1200,
    retweets: 3000,
    quotes: 420,
    replies: 750,
    sentiment: "neutral",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/800/450"
      }
    ]
  },
  {
    id: "k2",
    text: "الدفاع المدني يسيطر على الحادث في الخبر، ولا إصابات بشرية #انفجار_الخبر",
    user: {
      id: "u4",
      name: "محمد الدوسري",
      username: "@m_dosari",
      profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
      verified: false,
      followers: 35000
    },
    date: new Date().toISOString(),
    likes: 850,
    retweets: 1200,
    quotes: 210,
    replies: 320,
    sentiment: "positive"
  }
];

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
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
  const [searchId, setSearchId] = useState<string | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisOverviewData | null>(null);
  const [tweetsData, setTweetsData] = useState<TweetSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      runFullSearch(searchQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) return;
      
      try {
        const results = await getSearchResults(parseInt(id));
        setAnalysisData(results.analysis);
        setTweetsData(results.tweets);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const runFullSearch = async (searchQuery: string) => {
    setLoading(true);
    setProgress({ stage: 'searching', progress: 0, message: 'بدء البحث...' });
    setOverview(null);
    setTweetResults(null);
    setSearchId(null);
    try {
      const { searchId, analysisData, tweetsData } = await executeSearch(searchQuery, setProgress);
      setOverview(analysisData);
      setTweetResults(tweetsData);
      setSearchId(searchId);
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء تنفيذ البحث. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!analysisData || !tweetsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-500">No results found</p>
        </div>
      </div>
    );
  }

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
          {loading || progress?.stage === 'searching' || progress?.stage === 'analyzing' || progress?.stage === 'preparing' ? (
            <SearchLoadingState />
          ) : overview && tweetResults ? (
            <>
              <KPICards kpis={overview.kpis} />
              <AnalysisOverview data={overview} />
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
                        onPageChange={() => {}}
                        onFilterChange={() => {}}
                        preview={true}
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
            <ExampleSearches searches={[]} onSearchSelect={handleSearch} />
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Results;
