import { get, post } from "@/api/apiClient";
import API_ENDPOINTS from "@/api/apiUrls";
import { SearchProgress } from "@/utils/searchStages";
import { AnalysisOverviewData, TweetSearchResults, APIAnalysisResponse, Tweet } from "@/types/search";
import axios from 'axios';
import { SearchQuery, AnalysisResult } from '@/types/search';

const logApi = async (label: string, fn: () => Promise<any>) => {
  console.log(`[API] ${label} - START`);
  const result = await fn();
  console.log(`[API] ${label} - RESULT:`, result);
  return result;
};

const sentimentToArabic = (sentiment: string) => {
  if (sentiment === 'positive') return 'إيجابي';
  if (sentiment === 'negative') return 'سلبي';
  return 'محايد';
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.futvi.com';

export const createSearchQuery = async (query: string, maxItems: number = 5): Promise<{ id: number }> => {
  const response = await axios.post(`${API_BASE_URL}/api/searchqueries/`, {
    query,
    search_type: "twitter",
    parameters: { maxItems, sort: "Top" },
    status: "pending"
  });
  return response.data;
};

export const startCollection = async (queryId: number): Promise<{ status: string; message: string; next_stage: string }> => {
  const response = await axios.post(`${API_BASE_URL}/api/searchqueries/${queryId}/start_collection/`);
  return response.data;
};

export const collectTweets = async (queryId: number): Promise<{ status: string; message: string; next_stage: string }> => {
  const response = await axios.post(`${API_BASE_URL}/api/searchqueries/${queryId}/collect_tweets/`);
  return response.data;
};

export const analyzeTweets = async (queryId: number): Promise<any> => {
  const response = await axios.post(`${API_BASE_URL}/api/searchqueries/${queryId}/analyze_tweets/`);
  return response.data;
};

export const getSearchResults = async (queryId: number): Promise<any> => {
  try {
    const [tweetsResponse, analysisResponse] = await Promise.all([
      axios.get(`${API_BASE_URL}/api/tweets/?search_query=${queryId}`),
      axios.get(`${API_BASE_URL}/api/analysis/?search_query=${queryId}`)
    ]);
    
    return {
      tweets: tweetsResponse.data,
      analysis: analysisResponse.data[0] || null
    };
  } catch (error) {
    console.error('Error getting search results:', error);
    throw error;
  }
};

export const processSearch = async (query: string, maxItems: number = 5): Promise<{ id: number; data: any }> => {
  try {
    // Create search query
    const searchQuery = await createSearchQuery(query, maxItems);
    
    // Start collection
    await startCollection(searchQuery.id);
    
    // Collect tweets
    await collectTweets(searchQuery.id);
    
    // Analyze tweets and return the result directly
    const analysisResult = await analyzeTweets(searchQuery.id);
    
    return {
      id: searchQuery.id,
      data: analysisResult
    };
  } catch (error) {
    console.error('Error processing search:', error);
    throw error;
  }
};

export const executeSearch = async (
  queryOrId: string,
  onProgress: (progress: SearchProgress) => void,
  maxItems: number = 5
): Promise<{
  searchId: string;
  analysisData: any;
  tweetsData: any;
}> => {
  let searchId = '';
  let isDirectId = false;
  if (/^\d+$/.test(queryOrId)) {
    searchId = queryOrId;
    isDirectId = true;
  }
  try {
    if (!isDirectId) {
      onProgress({ stage: 'searching', progress: 10, message: 'بدء البحث وجمع التغريدات' });
      const searchQueryParams = {
        query: queryOrId,
        search_type: "twitter",
        parameters: { maxItems, sort: "Top" },
        status: "pending"
      };
      const searchResponse = await logApi('Create Search', () => post<{ id: string }>(`/api/searchqueries/`, searchQueryParams));
      if (!searchResponse?.id) throw new Error('فشل في بدء عملية البحث');
      searchId = searchResponse.id;
      onProgress({ stage: 'searching', progress: 20, message: 'تم بدء البحث بنجاح', searchId });
      await logApi('Start Collection', () => post(`/api/searchqueries/${searchId}/start_collection/`, {}));
      onProgress({ stage: 'searching', progress: 30, message: 'بدء جمع التغريدات', searchId });
      await logApi('Collect Tweets', () => post(`/api/searchqueries/${searchId}/collect_tweets/`, {}));
      onProgress({ stage: 'searching', progress: 40, message: 'جاري جمع التغريدات...', searchId });
      let collectionCompleted = false;
      let attempts = 0;
      const maxAttempts = 30;
      while (!collectionCompleted && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await logApi('Check Collection Status', () => get<{ status: string }>(`/api/searchqueries/${searchId}/`));
        if (statusResponse?.status === "completed") {
          collectionCompleted = true;
        } else {
          attempts++;
          onProgress({ stage: 'searching', progress: 40 + Math.min((attempts / maxAttempts) * 10, 10), message: 'جاري جمع التغريدات...', searchId });
        }
      }
      if (!collectionCompleted) throw new Error('انتهت مهلة جمع التغريدات');
      onProgress({ stage: 'searching', progress: 50, message: 'تم جمع التغريدات بنجاح', searchId });
    }
    // Analyze tweets and use the result directly
    onProgress({ stage: 'analyzing', progress: 60, message: 'بدء تحليل النتائج', searchId });
    const analysisResult = await analyzeTweets(parseInt(searchId));
    onProgress({ stage: 'completed', progress: 100, message: 'اكتمل التحليل', searchId });
    // Map tweets from detailed_analysis if present
    let tweetsData = [];
    if (analysisResult && Array.isArray(analysisResult.detailed_analysis)) {
      tweetsData = analysisResult.detailed_analysis.map(mapDetailedTweetToTweet);
    }
    return { searchId, analysisData: analysisResult, tweetsData };
  } catch (error) {
    onProgress({ stage: 'error', progress: 0, message: 'حدث خطأ في عملية البحث', error: error instanceof Error ? error.message : 'خطأ غير معروف' });
    throw error;
  }
};

const transformTweetsResponse = (tweets: any[]): TweetSearchResults => {
  return {
    total: tweets.length,
    page: 1,
    pages: Math.ceil(tweets.length / 20),
    tweets: tweets.map(tweet => {
      let username = '';
      let name = '';
      let tweetUrl = '';
      if (tweet.raw_data && tweet.raw_data.url) {
        tweetUrl = tweet.raw_data.url;
        const match = tweetUrl.match(/x.com\/(.*?)\//) || tweetUrl.match(/twitter.com\/(.*?)\//);
        if (match && match[1]) {
          username = match[1];
          name = match[1];
        }
      }
      let media = [];
      if (tweet.raw_data && tweet.raw_data.extendedEntities && tweet.raw_data.extendedEntities.media) {
        media = tweet.raw_data.extendedEntities.media.map((m: any) => ({
          type: m.type || 'image',
          url: m.media_url_https || m.url || ''
        }));
      } else if (tweet.media) {
        media = tweet.media.map((m: any) => ({
          type: m.type || 'image',
          url: m.media_url_https || m.url || ''
        }));
      }
      return {
        id: tweet.tweet_id || tweet.id || `tweet-${Math.random().toString(36).substring(2, 9)}`,
        text: tweet.text || '',
        user: {
          id: tweet.user_id || username || `user-${Math.random().toString(36).substring(2, 9)}`,
          name,
          username,
          profileImage: '',
          verified: tweet.verified || false,
          followers: tweet.followers_count || 0
        },
        date: tweet.date || new Date().toISOString(),
        likes: tweet.likes || 0,
        retweets: tweet.retweets || 0,
        quotes: tweet.quotes || 0,
        replies: tweet.replies || 0,
        sentiment: sentimentToArabic(tweet.sentiment),
        media,
        tweetUrl
      };
    })
  };
};

const transformAnalysisResponse = (analysis: APIAnalysisResponse, searchId: string): AnalysisOverviewData => {
  // Build timeline from detailed_analysis
  let timelineMap: Record<string, { إيجابي: number; سلبي: number; محايد: number }> = {};
  let sentimentCounts = { إيجابي: 0, سلبي: 0, محايد: 0 };
  let influencersArr: { name: string; username: string; engagement: number; tweetUrl: string }[] = [];
  if (Array.isArray(analysis.detailed_analysis)) {
    for (const d of analysis.detailed_analysis) {
      const date = d.metadata?.tweet_date ? d.metadata.tweet_date.split('T')[0] : 'unknown';
      const sentiment = sentimentToArabic(d.sentiment);
      if (!timelineMap[date]) timelineMap[date] = { إيجابي: 0, سلبي: 0, محايد: 0 };
      timelineMap[date][sentiment]++;
      sentimentCounts[sentiment]++;
      // Influencer calculation
      const engagement = (d.engagement_metrics?.likes || 0) + (d.engagement_metrics?.retweets || 0) + (d.engagement_metrics?.replies || 0) + (d.engagement_metrics?.quotes || 0);
      let username = '';
      let name = '';
      let tweetUrl = d.metadata?.tweet_url || '';
      if (tweetUrl) {
        const match = tweetUrl.match(/x.com\/(.*?)\//) || tweetUrl.match(/twitter.com\/(.*?)\//);
        if (match && match[1]) {
          username = match[1];
          name = match[1];
        }
      }
      influencersArr.push({ name, username, engagement, tweetUrl });
    }
  }
  // Sort influencers by engagement
  influencersArr = influencersArr.sort((a, b) => b.engagement - a.engagement).slice(0, 5);
  // Timeline array
  const timeline = Object.entries(timelineMap).map(([date, counts]) => ({
    date,
    إيجابي: counts.إيجابي,
    سلبي: counts.سلبي,
    محايد: counts.محايد
  }));
  // Pie chart data
  const sentiment = {
    positive: sentimentCounts.إيجابي,
    negative: sentimentCounts.سلبي,
    neutral: sentimentCounts.محايد
  };
  // KPIs (optional, can be extended)
  const kpis = [
    { name: "إجمالي التغريدات", value: (analysis.detailed_analysis?.length || 0).toString(), type: "tweets" },
    { name: "إيجابي", value: sentimentCounts.إيجابي.toString(), type: "sentiment" },
    { name: "سلبي", value: sentimentCounts.سلبي.toString(), type: "sentiment" },
    { name: "محايد", value: sentimentCounts.محايد.toString(), type: "sentiment" },
    { name: "معرف البحث", value: searchId, type: "id" }
  ];
  // Highlighted tweets
  let highlightTweets: any = {};
  if (Array.isArray(analysis.detailed_analysis) && analysis.detailed_analysis.length > 0) {
    highlightTweets.earliest = mapDetailedTweetToTweet(analysis.detailed_analysis[0]);
    highlightTweets.latest = mapDetailedTweetToTweet(analysis.detailed_analysis[analysis.detailed_analysis.length - 1]);
    highlightTweets.mostLiked = mapDetailedTweetToTweet(
      analysis.detailed_analysis.reduce((max, curr) => (curr.engagement_metrics?.likes > (max.engagement_metrics?.likes || 0) ? curr : max), analysis.detailed_analysis[0])
    );
  }
  return {
    query: analysis?.search_query?.toString() || '',
    total: analysis?.detailed_analysis?.length || 0,
    sentiment,
    kpis,
    timeline,
    locations: [],
    keywords: [], // removed from UI
    influencers: influencersArr.map(i => ({ name: i.name, followers: '', engagement: i.engagement.toString(), image: '', username: i.username, tweetUrl: i.tweetUrl })),
    hashtags: [],
    themes: analysis?.themes || [],
    expertInsights: analysis?.expert_insights || undefined,
    lastUpdate: analysis?.created_at || '',
    highlightTweets,
  };
};

function mapDetailedTweetToTweet(d: any): Tweet {
  let username = '';
  let name = '';
  let tweetUrl = d.metadata?.tweet_url || '';
  if (tweetUrl) {
    const match = tweetUrl.match(/x.com\/(.*?)\//) || tweetUrl.match(/twitter.com\/(.*?)\//);
    if (match && match[1]) {
      username = match[1];
      name = match[1];
    }
  }
  let media = [];
  if (d.media && Array.isArray(d.media)) {
    media = d.media.map((m: any) => ({
      type: m.type || 'image',
      url: m.media_url_https || m.url || ''
    }));
  }
  return {
    id: d.tweet_id,
    text: d.original_text,
    user: {
      id: username,
      name,
      username,
      profileImage: '',
      verified: false,
      followers: 0
    },
    date: d.metadata?.tweet_date || '',
    likes: d.engagement_metrics?.likes || 0,
    retweets: d.engagement_metrics?.retweets || 0,
    quotes: d.engagement_metrics?.quotes || 0,
    replies: d.engagement_metrics?.replies || 0,
    sentiment: sentimentToArabic(d.sentiment),
    media,
    tweetUrl
  };
}

/**
 * Function to handle predefined search for Riyadh Season
 * This will simulate the search process but return predefined data
 */
export const executeRiyadhSeasonSearch = async (
  onProgress: (progress: SearchProgress) => void
): Promise<{
  searchId: string;
  analysisData: AnalysisOverviewData;
  tweetsData: TweetSearchResults;
}> => {
  // Simulate the search process for Riyadh Season
  const searchId = `rs-${Math.floor(Math.random() * 1000000)}`;
  
  // Start the process
  onProgress({
    stage: 'searching',
    progress: 10,
    message: 'بدء البحث عن موسم الرياض',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  onProgress({
    stage: 'searching',
    progress: 25,
    message: 'جمع التغريدات عن موسم الرياض',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  onProgress({
    stage: 'analyzing',
    progress: 40,
    message: 'تحليل المشاعر والرأي العام',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  onProgress({
    stage: 'analyzing',
    progress: 60,
    message: 'تحديد المؤثرين والهاشتاقات',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  onProgress({
    stage: 'preparing',
    progress: 75,
    message: 'إعداد لوحة المعلومات والإحصائيات',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  onProgress({
    stage: 'preparing',
    progress: 90,
    message: 'تحضير التقرير النهائي بواسطة وكيل Future Vision',
    searchId
  });
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return predefined data for Riyadh Season
  const riyadhSeasonData: AnalysisOverviewData = {
    query: "موسم الرياض",
    total: 35842,
    sentiment: {
      positive: 72,
      neutral: 21,
      negative: 7,
    },
    kpis: [
      { name: "متوسط المشاعر", value: "+0.78", change: 15, type: "sentiment", lastUpdate: "قبل 10 دقائق" },
      { name: "عدد الإشارات", value: "35,842", change: 25, type: "mentions", lastUpdate: "تحديث مستمر" },
      { name: "الموقع الرئيسي", value: "الرياض", type: "location", lastUpdate: "آخر 24 ساعة" },
      { name: "عدد المؤثرين", value: "47", change: 12, type: "influencers", lastUpdate: "آخر 12 ساعة" },
      { name: "الهاشتاقات", value: "64", change: 18, type: "hashtags", lastUpdate: "قبل 4 ساعات" },
      { name: "الكلمات المفتاحية", value: "156", change: 9, type: "keywords", lastUpdate: "قبل 3 ساعات" },
      { name: "حركة المرور", value: "12.4K", change: 32, type: "traffic", lastUpdate: "آخر 24 ساعة" },
      { name: "تحديثات فورية", value: "نشط", type: "realtime", lastUpdate: "الآن" }
    ],
    timeline: [
      { date: "أسبوع 1", إيجابي: 5200, محايد: 1800, سلبي: 700 },
      { date: "أسبوع 2", إيجابي: 6300, محايد: 2100, سلبي: 600 },
      { date: "أسبوع 3", إيجابي: 7800, محايد: 1900, سلبي: 550 },
      { date: "أسبوع 4", إيجابي: 9200, محايد: 2000, سلبي: 500 },
      { date: "أسبوع 5", إيجابي: 12400, محايد: 2300, سلبي: 480 },
      { date: "أسبوع 6", إيجابي: 14500, محايد: 2100, سلبي: 420 },
    ],
    locations: [
      { name: "الرياض", value: 68 },
      { name: "جدة", value: 12 },
      { name: "الدمام", value: 8 },
      { name: "أخرى", value: 12 },
    ],
    keywords: [
      { keyword: "فعاليات", count: 4280, trend: "increase" },
      { keyword: "حفلات", count: 3750, trend: "increase" },
      { keyword: "مهرجان", count: 2830, trend: "increase" },
      { keyword: "بوليفارد", count: 2540, trend: "neutral" },
      { keyword: "تذاكر", count: 2100, trend: "increase" },
    ],
    influencers: [
      { name: "هيئة الترفيه", followers: "2.4M", engagement: "6.7%", image: "https://randomuser.me/api/portraits/men/1.jpg" },
      { name: "موسم الرياض", followers: "1.8M", engagement: "5.9%", image: "https://randomuser.me/api/portraits/men/2.jpg" },
      { name: "أحمد الشقيري", followers: "3.2M", engagement: "7.1%", image: "https://randomuser.me/api/portraits/men/3.jpg" },
    ],
    hashtags: [
      { tag: "#موسم_الرياض", count: 18500, trend: "increase" },
      { tag: "#RiyadhSeason", count: 12300, trend: "increase" },
      { tag: "#بوليفارد_رياض", count: 8700, trend: "neutral" },
      { tag: "#حفلات_موسم_الرياض", count: 6400, trend: "increase" },
      { tag: "#هيئة_الترفيه", count: 4900, trend: "neutral" },
    ],
    lastUpdate: "15:30 - 26 أبريل 2025",
  };

  // Simulated tweets for Riyadh Season
  const riyadhSeasonTweets: TweetSearchResults = {
    total: 35842,
    page: 1,
    pages: 1793,
    tweets: [
      {
        id: "riyadh-1",
        text: "استمتعنا كثيراً بفعاليات موسم الرياض هذا العام! تنظيم رائع وفعاليات متنوعة تناسب جميع الأعمار #موسم_الرياض",
        user: {
          id: "user-201",
          name: "سارة المطيري",
          username: "@sara_m",
          profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
          verified: true,
          followers: 245000
        },
        date: "2025-04-25T18:30:00Z",
        likes: 3450,
        retweets: 890,
        quotes: 120,
        replies: 210,
        sentiment: "positive",
        media: [
          {
            type: "image",
            url: "https://via.placeholder.com/600x400.png?text=Riyadh+Season+Event"
          }
        ]
      },
      {
        id: "riyadh-2",
        text: "الأسعار في موسم الرياض مرتفعة بشكل مبالغ فيه. يجب إعادة النظر في تسعير الفعاليات لتكون في متناول الجميع. #موسم_الرياض",
        user: {
          id: "user-202",
          name: "خالد السعيد",
          username: "@k_saeed",
          profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
          verified: false,
          followers: 34000
        },
        date: "2025-04-26T09:15:00Z",
        likes: 2100,
        retweets: 780,
        quotes: 95,
        replies: 310,
        sentiment: "negative"
      },
      {
        id: "riyadh-3",
        text: "العروض الحية في بوليفارد رياض تستحق المشاهدة. تنظيم رائع وإبداع في التنفيذ. #بوليفارد_رياض #موسم_الرياض",
        user: {
          id: "user-203",
          name: "أحمد الشقيري",
          username: "@shugairi",
          profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
          verified: true,
          followers: 3200000
        },
        date: "2025-04-24T20:45:00Z",
        likes: 12500,
        retweets: 3200,
        quotes: 430,
        replies: 280,
        sentiment: "positive",
        media: [
          {
            type: "image",
            url: "https://via.placeholder.com/600x400.png?text=Boulevard+Riyadh+Show"
          }
        ]
      },
      {
        id: "riyadh-4",
        text: "مواقف السيارات غير كفية في منطقة الفعاليات. قضيت أكثر من ساعة للحصول على موقف. نأمل معالجة هذه المشكلة في المواسم القادمة.",
        user: {
          id: "user-204",
          name: "فهد العتيبي",
          username: "@fahad_otaibi",
          profileImage: "https://randomuser.me/api/portraits/men/55.jpg",
          verified: false,
          followers: 18500
        },
        date: "2025-04-26T12:10:00Z",
        likes: 980,
        retweets: 320,
        quotes: 45,
        replies: 85,
        sentiment: "negative"
      },
      {
        id: "riyadh-5",
        text: "الحفل الغنائي لفنان الجيل كان الأفضل في موسم الرياض! تذاكر بيعت بالكامل وأجواء رائعة. شكراً هيئة الترفيه على التنظيم المميز. #حفلات_موسم_الرياض",
        user: {
          id: "user-205",
          name: "نورة الدوسري",
          username: "@noura_d",
          profileImage: "https://randomuser.me/api/portraits/women/28.jpg",
          verified: true,
          followers: 124000
        },
        date: "2025-04-23T23:30:00Z",
        likes: 5600,
        retweets: 1300,
        quotes: 210,
        replies: 175,
        sentiment: "positive",
        media: [
          {
            type: "image",
            url: "https://via.placeholder.com/600x400.png?text=Riyadh+Season+Concert"
          }
        ]
      }
    ]
  };
  
  // Complete the process
  onProgress({
    stage: 'completed',
    progress: 100,
    message: 'اكتمل التحليل',
    searchId
  });
  
  return {
    searchId,
    analysisData: riyadhSeasonData,
    tweetsData: riyadhSeasonTweets
  };
};

export const searchTweets = async (query: string): Promise<Tweet[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tweets/search`, {
      params: { query }
    });
    return response.data as Tweet[];
  } catch (error) {
    console.error('Error searching tweets:', error);
    throw error;
  }
};
