import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, Users, MapPin, BarChart2, Clock, Flame, 
  Sparkles, Search, Filter, Hash, Database, Bell 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICards from '@/components/results/KPICards';
import ActionButtons from '@/components/results/ActionButtons';
import KeywordsTable from '@/components/results/KeywordsTable';
import InfluencersList from '@/components/results/InfluencersList';
import TweetFeed from '@/components/tweets/TweetFeed';
import { Tweet } from '@/components/tweets/TweetCard';
import HighlightedTweet from '@/components/analysis/HighlightedTweet';
import { get } from '@/api/apiClient';
import API_ENDPOINTS from '@/api/apiUrls';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const sentimentData = [
  { date: "1 يناير", إيجابي: 4000, محايد: 2400, سلبي: 1200 },
  { date: "2 يناير", إيجابي: 3000, محايد: 1398, سلبي: 2000 },
  { date: "3 يناير", إيجابي: 2000, محايد: 9800, سلبي: 1000 },
  { date: "4 يناير", إيجابي: 2780, محايد: 3908, سلبي: 800 },
  { date: "5 يناير", إيجابي: 1890, محايد: 4800, سلبي: 1500 },
  { date: "6 يناير", إيجابي: 2390, محايد: 3800, سلبي: 800 },
  { date: "7 يناير", إيجابي: 3490, محايد: 4300, سلبي: 700 },
];

const sentimentDistribution = [
  { name: "إيجابي", value: 67 },
  { name: "محايد", value: 23 },
  { name: "سلبي", value: 10 },
];

const locationData = [
  { name: "الرياض", value: 45 },
  { name: "العلا", value: 25 },
  { name: "جدة", value: 20 },
  { name: "أخرى", value: 10 },
];

const keywordData = [
  { keyword: "ضيافة", count: 240, trend: "increase" as const },
  { keyword: "تراث", count: 185, trend: "increase" as const },
  { keyword: "تحديث", count: 142, trend: "neutral" as const },
  { keyword: "فعاليات", count: 118, trend: "increase" as const },
  { keyword: "ترفيه", count: 96, trend: "decrease" as const },
];

const influencerData = [
  { name: "محمد السعيد", followers: "1.2M", engagement: "5.4%", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "سارة العتيبي", followers: "980K", engagement: "4.8%", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "أحمد الشمري", followers: "780K", engagement: "6.2%", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];

const sampleTweets: Tweet[] = [
  {
    id: "tweet-1",
    text: "مباراة تاريخية للمنتخب السعودي ضد الأرجنتين! فخورين بأداء اللاعبين وتحقيق هذا الإنجاز الكبير في كأس العالم. #السعودية_الأرجنتين",
    user: {
      id: "user-1",
      name: "محمد السعيد",
      username: "@msaeed",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: true,
      followers: 1200000
    },
    date: "2022-11-22T13:45:28Z",
    likes: 54200,
    retweets: 12300,
    quotes: 3420,
    replies: 2480,
    sentiment: "positive"
  },
  {
    id: "tweet-2",
    text: "الأداء الدفاعي للسعودية كان رائعاً في الشوط الثاني. استطاعوا صد هجمات ��لأرجنتين المتكررة والحفاظ على التقدم. #كأس_العالم",
    user: {
      id: "user-2",
      name: "أحمد الشمري",
      username: "@ahmed_shamri",
      profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
      verified: false,
      followers: 780000
    },
    date: "2022-11-22T14:30:12Z",
    likes: 32100,
    retweets: 8700,
    quotes: 1230,
    replies: 1540,
    sentiment: "positive"
  },
  {
    id: "tweet-3",
    text: "هجوم الأرجنتين لم يستطع اختراق دفاع المنتخب السعودي رغم وجود ميسي. هذا يدل على التنظيم التكتيكي العالي للفريق السعودي.",
    user: {
      id: "user-3",
      name: "سارة العتيبي",
      username: "@sarah_otaibi",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      verified: true,
      followers: 980000
    },
    date: "2022-11-22T15:10:45Z",
    likes: 28400,
    retweets: 7600,
    quotes: 980,
    replies: 1320,
    sentiment: "neutral"
  },
  {
    id: "tweet-4",
    text: "حظ سيء للأرجنتين اليوم. كان بإمكانهم تسجيل أكثر من هدف لولا التسلل. #ARG #KSA",
    user: {
      id: "user-4",
      name: "خالد الحربي",
      username: "@k_harbi",
      profileImage: "https://randomuser.me/api/portraits/men/4.jpg",
      verified: false,
      followers: 45000
    },
    date: "2022-11-22T13:55:20Z",
    likes: 12500,
    retweets: 3200,
    quotes: 540,
    replies: 780,
    sentiment: "negative"
  },
  {
    id: "tweet-5",
    text: "الهدف الثاني للسعودية من سالم الدوسري كان من أجمل أهداف البطولة حتى الآن! مراوغة رائعة وتسديدة قوية في الزاوية البعيدة. #السعودية_الأرجنتين",
    user: {
      id: "user-5",
      name: "فهد القحطاني",
      username: "@fahad_q",
      profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
      verified: true,
      followers: 320000
    },
    date: "2022-11-22T14:15:33Z",
    likes: 42300,
    retweets: 11200,
    quotes: 2100,
    replies: 1850,
    sentiment: "positive",
    media: [
      {
        type: "image",
        url: "https://via.placeholder.com/600x400.png?text=Goal+Celebration"
      }
    ]
  }
];

const khobzTweets: Tweet[] = [
  {
    id: "khobz-1",
    text: "سمعت صوت انفجار قوي في منطقة الخبر، هل هناك أي معلومات عن سبب الانفجار؟ #انفجار_الخبر",
    user: {
      id: "user-10",
      name: "فهد المطيري",
      username: "@fahad_m",
      profileImage: "https://randomuser.me/api/portraits/men/10.jpg",
      verified: false,
      followers: 15000
    },
    date: "2023-06-15T18:30:00Z",
    likes: 230,
    retweets: 180,
    quotes: 45,
    replies: 120,
    sentiment: "neutral"
  },
  {
    id: "khobz-2",
    text: "عاجل: مصادر تؤكد أن الصوت الذي سمع في الخبر هو لتمرين عسكري وليس لانفجار حقيقي. يرجى عدم نشر الشائعات. #انفجار_الخبر",
    user: {
      id: "user-11",
      name: "نورة السعد",
      username: "@noura_s",
      profileImage: "https://randomuser.me/api/portraits/women/11.jpg",
      verified: true,
      followers: 300000
    },
    date: "2023-06-15T18:45:00Z",
    likes: 1200,
    retweets: 950,
    quotes: 120,
    replies: 85,
    sentiment: "neutral",
    media: [
      {
        type: "image",
        url: "https://via.placeholder.com/600x400.png?text=Official+Statement"
      }
    ]
  },
  {
    id: "khobz-3",
    text: "الدفاع المدني يؤكد: الصوت الذي سمع في الخبر ناتج عن تمرين أمني مجدول سابقا، ولا داعي للقلق. #انفجار_الخبر",
    user: {
      id: "user-12",
      name: "حساب الدفاع المدني",
      username: "@SaudiDCD",
      profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
      verified: true,
      followers: 1500000
    },
    date: "2023-06-15T19:00:00Z",
    likes: 3500,
    retweets: 2700,
    quotes: 310,
    replies: 180,
    sentiment: "positive"
  }
];

interface AnalysisOverviewData {
  query: string;
  total: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  kpis: {
    name: string;
    value: string;
    change?: number;
    type?: 'sentiment' | 'mentions' | 'location' | 'influencers' | 'hashtags' | 'keywords' | 'traffic' | 'realtime';
    lastUpdate?: string;
  }[];
  timeline: any[];
  locations: {
    name: string;
    value: number;
  }[];
  keywords: {
    keyword: string;
    count: number;
    trend: 'increase' | 'decrease' | 'neutral';
  }[];
  influencers: {
    name: string;
    followers: string;
    engagement: string;
    image: string;
  }[];
  highlightTweets?: {
    earliest?: Tweet;
    mostLiked?: Tweet;
    latest?: Tweet;
  };
  hashtags?: {
    tag: string;
    count: number;
    trend: 'increase' | 'decrease' | 'neutral';
  }[];
  lastUpdate?: string;
}

interface TweetSearchResults {
  total: number;
  page: number;
  pages: number;
  tweets: Tweet[];
}

const exampleSearches = [
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

const trendingHashtags = [
  { tag: "#السعودية", count: 12500, trend: "increase" as const },
  { tag: "#الرياض_موسم", count: 8300, trend: "increase" as const },
  { tag: "#كأس_العالم", count: 7200, trend: "neutral" as const },
  { tag: "#رؤية_2030", count: 5400, trend: "increase" as const },
  { tag: "#العلا", count: 4100, trend: "increase" as const }
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
      if (isWorldCupMatch) {
        setOverview({
          query: searchQuery,
          total: 15423,
          sentiment: {
            positive: 67,
            neutral: 23,
            negative: 10,
          },
          kpis: [
            { name: "متوسط المشاعر", value: "+0.67", change: 12 },
            { name: "عدد الإشارات", value: "15,423", change: 5 },
            { name: "الموقع الرئيسي", value: "الرياض" },
            { name: "عدد المؤثرين", value: "24", change: -3 }
          ],
          timeline: sentimentData,
          locations: locationData,
          keywords: keywordData,
          influencers: influencerData,
          highlightTweets: {
            earliest: sampleTweets[4],
            mostLiked: sampleTweets[0]
          }
        });
        setTweetResults({
          total: sampleTweets.length,
          page: 1,
          pages: 1,
          tweets: sampleTweets
        });
      } else if (isKhobzEvent) {
        setOverview({
          query: searchQuery,
          total: 3250,
          sentiment: {
            positive: 20,
            neutral: 70,
            negative: 10,
          },
          kpis: [
            { name: "متوسط المشاعر", value: "+0.10", change: -5 },
            { name: "عدد الإشارات", value: "3,250", change: 58 },
            { name: "الموقع الرئيسي", value: "الخبر" },
            { name: "عدد المؤثرين", value: "12", change: 7 }
          ],
          timeline: [
            { date: "18:30", إيجابي: 200, محايد: 1200, سلبي: 600 },
            { date: "18:45", إيجابي: 300, محايد: 1800, سلبي: 400 },
            { date: "19:00", إيجابي: 500, محايد: 1500, سلبي: 250 }
          ],
          locations: [
            { name: "الخبر", value: 60 },
            { name: "بقيق", value: 25 },
            { name: "الظهران", value: 15 }
          ],
          keywords: [
            { keyword: "تمرين", count: 340, trend: "increase" },
            { keyword: "أمني", count: 285, trend: "increase" },
            { keyword: "اطمئنان", count: 142, trend: "neutral" },
            { keyword: "دفاع مدني", count: 118, trend: "increase" },
            { keyword: "شائعات", count: 96, trend: "decrease" }
          ],
          influencers: [
            { name: "فهد المطيري", followers: "500K", engagement: "5.5%", image: "https://randomuser.me/api/portraits/men/3.jpg" },
            { name: "نورة السعد", followers: "300K", engagement: "4.8%", image: "https://randomuser.me/api/portraits/women/2.jpg" }
          ],
          highlightTweets: {
            earliest: khobzTweets[0],
            mostLiked: khobzTweets[2]
          }
        });
        setTweetResults({
          total: khobzTweets.length,
          page: 1,
          pages: 1,
          tweets: khobzTweets
        });
      } else {
        const endpoint = `${API_ENDPOINTS.analysis.overview}?query=${encodeURIComponent(searchQuery)}`;
        const data = await get<{ data: AnalysisOverviewData }>(endpoint);
        
        if (data?.data) {
          setOverview(data.data);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-6 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">نتائج البحث</h1>
            <p className="text-gray-600">{query ? `استعلام: "${query}"` : 'استخدم شريط البحث للحصول على تحليلات'}</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {query ? (
            <>
              {loading || searchStarted ? (
                <div className="flex flex-col justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mb-4"></div>
                  <p className="text-saudi-green font-medium">جاري تحليل البيانات...</p>
                  <div className="mt-6 w-full max-w-md">
                    <div className="h-2 bg-gray-200 rounded">
                      <div className="h-full bg-saudi-green rounded animate-pulse" style={{width: '60%'}}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>جمع البيانات</span>
                      <span>تحليل المشاعر</span>
                      <span>إنشاء التقرير</span>
                    </div>
                  </div>
                </div>
              ) : overview ? (
                <>
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold">{overview.query}</h2>
                        <Badge variant="outline" className="bg-saudi-green/10 text-saudi-green">
                          {overview.total.toLocaleString()} نتيجة
                        </Badge>
                      </div>
                      {overview.lastUpdate && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>آخر تحديث: {overview.lastUpdate}</span>
                          {overview.kpis?.find(k => k.type === 'realtime')?.value === 'نشط' && (
                            <Badge className="bg-green-500 text-white ml-2">تحديث مباشر</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Filter className="h-3 w-3" />
                        <span>فلترة</span>
                      </Badge>
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Clock className="h-3 w-3" />
                        <span>24 ساعة الماضية</span>
                      </Badge>
                    </div>
                  </div>

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
                    
                    <TabsContent value="overview" className="space-y-6">
                      <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">تتبع المشاعر عبر الوقت</h3>
                        <LineChart 
                          data={overview.timeline} 
                          lines={[
                            { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
                            { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
                            { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
                          ]}
                          xAxisDataKey="date"
                        />
                      </div>
                      
                      {overview.highlightTweets && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {overview.highlightTweets.earliest && (
                            <HighlightedTweet 
                              tweet={overview.highlightTweets.earliest}
                              title="أول تغريدة"
                              icon={<Clock className="h-4 w-4 text-saudi-green" />}
                            />
                          )}
                          
                          {overview.highlightTweets.mostLiked && (
                            <HighlightedTweet 
                              tweet={overview.highlightTweets.mostLiked}
                              title="الأكثر إعجاباً"
                              icon={<Flame className="h-4 w-4 text-saudi-green" />}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="dashboard-card">
                          <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                          <PieChart 
                            data={[
                              { name: "إيجابي", value: overview.sentiment.positive },
                              { name: "محايد", value: overview.sentiment.neutral },
                              { name: "سلبي", value: overview.sentiment.negative },
                            ]} 
                            innerRadius={60} 
                            outerRadius={90} 
                          />
                        </div>
                        
                        <div className="dashboard-card">
                          <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي</h3>
                          <PieChart 
                            data={overview.locations} 
                            innerRadius={60} 
                            outerRadius={90} 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="dashboard-card">
                          <h3 className="text-lg font-semibold mb-4">الكلمات الرئيسية</h3>
                          <KeywordsTable data={overview.keywords} />
                        </div>
                        
                        <div className="dashboard-card">
                          <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
                          <InfluencersList data={overview.influencers} />
                        </div>
                      </div>
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
                      <div className="dashboard-card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                            <PieChart 
                              data={[
                                { name: "إيجابي", value: overview.sentiment.positive },
                                { name: "محايد", value: overview.sentiment.neutral },
                                { name: "سلبي", value: overview.sentiment.negative },
                              ]} 
                              innerRadius={60} 
                              outerRadius={90} 
                            />
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-semibold mb-4">تتبع المشاعر عبر الوقت</h3>
                            <LineChart 
                              data={overview.timeline} 
                              lines={[
                                { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
                                { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
                                { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
                              ]}
                              xAxisDataKey="date"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h3 className="text-lg font-semibold mb-4">أبرز التغريدات حسب المشاعر</h3>
                          <Tabs defaultValue="positive">
                            <TabsList className="mb-4">
                              <TabsTrigger value="positive">إيجابي</TabsTrigger>
                              <TabsTrigger value="neutral">محايد</TabsTrigger>
                              <TabsTrigger value="negative">سلبي</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="positive">
                              <div className="space-y-4">
                                {tweetResults?.tweets
                                  .filter(t => t.sentiment === 'positive')
                                  .slice(0, 2)
                                  .map(tweet => (
                                    <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                      <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                          <img 
                                            src={tweet.user.profileImage} 
                                            alt={tweet.user.name} 
                                            className="h-10 w-10 rounded-full"
                                          />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1">
                                            <p className="font-bold">{tweet.user.name}</p>
                                            {tweet.user.verified && (
                                              <span className="text-blue-500">
                                                <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-gray-500 text-sm">{tweet.user.username}</p>
                                          <p className="mt-2">{tweet.text}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="neutral">
                              <div className="space-y-4">
                                {tweetResults?.tweets
                                  .filter(t => t.sentiment === 'neutral')
                                  .slice(0, 2)
                                  .map(tweet => (
                                    <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                      <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                          <img 
                                            src={tweet.user.profileImage} 
                                            alt={tweet.user.name} 
                                            className="h-10 w-10 rounded-full"
                                          />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1">
                                            <p className="font-bold">{tweet.user.name}</p>
                                            {tweet.user.verified && (
                                              <span className="text-blue-500">
                                                <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-gray-500 text-sm">{tweet.user.username}</p>
                                          <p className="mt-2">{tweet.text}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="negative">
                              <div className="space-y-4">
                                {tweetResults?.tweets
                                  .filter(t => t.sentiment === 'negative')
                                  .slice(0, 2)
                                  .map(tweet => (
                                    <div key={tweet.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                      <div className="flex gap-3">
                                        <div className="flex-shrink-0">
                                          <img 
                                            src={tweet.user.profileImage} 
                                            alt={tweet.user.name} 
                                            className="h-10 w-10 rounded-full"
                                          />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1">
                                            <p className="font-bold">{tweet.user.name}</p>
                                            {tweet.user.verified && (
                                              <span className="text-blue-500">
                                                <svg className="h-4 w-4 inline" viewBox="0 0 24 24" fill="currentColor">
                                                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                                </svg>
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-gray-500 text-sm">{tweet.user.username}</p>
                                          <p className="mt-2">{tweet.text}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="influencers">
                      <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">المؤثرين</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {overview.influencers.map((influencer, index) => (
                            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={influencer.image || `https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${index + 1}.jpg`}
                                  alt={influencer.name}
                                  className="h-12 w-12 rounded-full object-cover border-2 border-saudi-green"
                                />
                                <div>
                                  <p className="font-semibold">{influencer.name}</p>
                                  <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span>{influencer.followers} متابع</span>
                                    <span>{influencer.engagement} تفاعل</span>
                                  </div>
                                </div>
                              </div>
                              
                              {tweetResults?.tweets
                                .filter(t => t.user.name === influencer.name)
                                .slice(0, 1)
                                .map(tweet => (
                                  <div key={tweet.id} className="mt-3 pt-3 border-t">
                                    <p className="text-sm line-clamp-2">{tweet.text}</p>
                                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                                      <span>{tweet.likes.toLocaleString()} إعجاب</span>
                                      <span>{tweet.retweets.toLocaleString()} إعادة تغريد</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hashtags">
                      <div className="dashboard-card">
                        <h3 className="text-lg font-semibold mb-4">الهاشتاقات الأكثر تداولاً</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                          {(overview.hashtags || trendingHashtags).map((tag, index) => (
                            <Card key={index} className="text-center hover:shadow-md transition-shadow">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold text-saudi-green">
                                  {tag.tag}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-2xl font-bold">{tag.count.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">إشارة</p>
                              </CardContent>
                              <CardFooter className="pt-0 flex justify-center">
                                <Badge className={
                                  tag.trend === 'increase' 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : tag.trend === 'decrease' 
                                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }>
                                  {tag.trend === 'increase' 
                                    ? '↑ متزايد' 
                                    : tag.trend === 'decrease' 
                                      ? '↓ متناقص' 
                                      : '− ثابت'}
                                </Badge>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">لم يتم العثور على نتائج</h2>
                  <p className="text-gray-500 mb-6">جرب استعلامًا آخر أو راجع صياغة البحث الخاص بك</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold text-saudi-green mb-4">ابدأ البحث للحصول على تحليلات</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                استخدم شريط البحث للحصول على تحليلات متعمقة حول أي موضوع، حدث أو هاشتاق. 
                يمكنك البحث عن أحداث رياضية، فعاليات عامة، أو مواضيع محددة.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
                {exampleSearches.map((example, index) => (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all hover:shadow-lg ${example.borderColor} border`}
                    onClick={() => handleSearch(example.name)}
                  >
                    <CardHeader className={`${example.color} ${example.textColor} pb-2`}>
                      <div className="flex items-center gap-2">
                        {example.icon}
                        <CardTitle>{example.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <p className="text-gray-600 text-sm">{example.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 pb-3">
                      <Badge variant="outline" className="bg-white flex gap-1 items-center">
                        <Search className="h-3 w-3" />
                        <span>بحث</span>
                      </Badge>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Hash className="h-5 w-5 text-saudi-green" />
                  <span>الهاشتاقات الأكثر بحثاً</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingHashtags.map((tag, index) => (
                    <div 
                      key={index}
                      className="px-3 py-2 rounded-full border flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleSearch(tag.tag)}
                    >
                      <span className="font-medium">{tag.tag}</span>
                      <Badge variant="outline" className="bg-gray-50 text-xs">
                        {tag.count.toLocaleString()}
                      </Badge>
                      <span className={
                        tag.trend === 'increase' 
                          ? 'text-green-500' 
                          : tag.trend === 'decrease' 
                            ? 'text-red-500' 
                            : 'text-gray-400'
                      }>
                        {tag.trend === 'increase' ? '↑' : tag.trend === 'decrease' ? '↓' : '−'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <div className="flex-grow"></div>
      
      <Footer />
    </div>
  );
};

export default Results;
