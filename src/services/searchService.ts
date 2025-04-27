
import { get, post } from "@/api/apiClient";
import API_ENDPOINTS from "@/api/apiUrls";
import { SearchProgress } from "@/utils/searchStages";
import { AnalysisOverviewData, TweetSearchResults, APIAnalysisResponse } from "@/types/search";
import { transformAnalysisData } from "@/utils/analysisTransformers";

/**
 * Function to execute a search in three phases:
 * 1. Initial search to get a search ID
 * 2. Analysis phase
 * 3. Dashboard preparation
 * 
 * @param query The search query
 * @param onProgress Callback to receive progress updates
 */
export const executeSearch = async (
  query: string,
  onProgress: (progress: SearchProgress) => void
): Promise<{
  searchId: string;
  analysisData: AnalysisOverviewData | null;
  tweetsData: TweetSearchResults | null;
}> => {
  try {
    // Phase 1: Initial search - create search query
    onProgress({
      stage: 'searching',
      progress: 10,
      message: 'بدء البحث وجمع التغريدات'
    });
    
    // Call the create search query endpoint
    const searchQueryParams = {
      query: query,
      search_type: "twitter",
      parameters: {
        maxItems: 100,
        sort: "Top"
      },
      status: "pending"
    };
    
    const searchResponse = await post<{
      id: number;
      query: string;
      status: string;
    }>(`${API_ENDPOINTS.search.query}`, searchQueryParams);
    
    if (!searchResponse?.id) {
      throw new Error('فشل في بدء عملية البحث');
    }
    
    const searchId = searchResponse.id.toString();
    
    onProgress({
      stage: 'searching',
      progress: 25,
      message: 'تم بدء البحث بنجاح',
      searchId
    });
    
    // Start collection
    await post(`${API_ENDPOINTS.search.status}${searchId}/start_collection/`, {});
    
    // Collect tweets
    await post(`${API_ENDPOINTS.search.status}${searchId}/collect_tweets/`, {});
    
    // Poll for search status until completed
    let searchCompleted = false;
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!searchCompleted && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await get<{
        status: string;
        progress: number;
      }>(`${API_ENDPOINTS.search.status}${searchId}/`);
      
      if (statusResponse?.status === "completed") {
        searchCompleted = true;
      } else {
        attempts++;
        onProgress({
          stage: 'searching',
          progress: 25 + Math.min((attempts / maxAttempts) * 10, 10),
          message: 'جاري جمع التغريدات...',
          searchId
        });
      }
    }
    
    // Phase 2: Analysis
    onProgress({
      stage: 'analyzing',
      progress: 40,
      message: 'بدء تحليل النتائج',
      searchId
    });
    
    // Start analysis
    await post(`${API_ENDPOINTS.search.status}${searchId}/analyze_tweets/`, {});
    
    // Poll for analysis status
    let analysisCompleted = false;
    attempts = 0;
    
    while (!analysisCompleted && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analysisStatusResponse = await get<{
        status: string;
      }>(`${API_ENDPOINTS.search.status}${searchId}/`);
      
      if (analysisStatusResponse?.status === "analysis_completed" || 
          analysisStatusResponse?.status === "completed") {
        analysisCompleted = true;
      } else {
        attempts++;
        onProgress({
          stage: 'analyzing',
          progress: 40 + Math.min((attempts / maxAttempts) * 25, 25),
          message: 'جاري تحليل المشاعر والمحتوى...',
          searchId
        });
      }
    }
    
    // Phase 3: Report preparation
    onProgress({
      stage: 'preparing',
      progress: 70,
      message: 'إعداد التقرير النهائي',
      searchId
    });
    
    // Simulate preparation time
    for (let progress = 75; progress <= 90; progress += 5) {
      await new Promise(resolve => setTimeout(resolve, 500));
      onProgress({
        stage: 'preparing',
        progress,
        message: 'جاري إعداد البيانات والرسوم البيانية',
        searchId
      });
    }
    
    // Get final results - tweets
    const tweetsResponse = await get<any[]>(`${API_ENDPOINTS.analysis.tweets}?search_query=${searchId}`);
    
    // Get final results - analysis
    const analysisResponse = await get<APIAnalysisResponse[]>(`${API_ENDPOINTS.analysis.overview}?search_query=${searchId}`);
    
    // Transform API response to our app's data format
    const tweetsData = transformTweetsResponse(tweetsResponse || []);
    
    let analysisData = null;
    if (analysisResponse && analysisResponse.length > 0) {
      analysisData = transformAnalysisData(analysisResponse[0]);
    }
    
    // Complete
    onProgress({
      stage: 'completed',
      progress: 100,
      message: 'اكتمل التحليل',
      searchId
    });
    
    return {
      searchId,
      analysisData,
      tweetsData
    };
  } catch (error) {
    console.error('Search error:', error);
    
    onProgress({
      stage: 'error',
      progress: 0,
      message: 'حدث خطأ في عملية البحث',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    });
    
    throw error;
  }
};

/**
 * Transform tweets API response to our app's format
 */
const transformTweetsResponse = (tweets: any): TweetSearchResults => {
  // Handle various response formats
  let tweetsList: any[] = [];
  
  if (Array.isArray(tweets)) {
    tweetsList = tweets;
  } else if (tweets && typeof tweets === 'object' && 'results' in tweets) {
    // Type narrowing to ensure TypeScript recognizes 'results' property
    const tweetsWithResults = tweets as { results: any[] };
    tweetsList = tweetsWithResults.results || [];
  }
  
  return {
    total: tweetsList.length,
    page: 1,
    pages: Math.ceil(tweetsList.length / 20),
    tweets: tweetsList.map(tweet => ({
      id: tweet.tweet_id || tweet.id || `tweet-${Math.random().toString(36).substring(2, 9)}`,
      text: tweet.original_text || tweet.text || '',
      user: {
        id: tweet.user_id || `user-${Math.random().toString(36).substring(2, 9)}`,
        name: tweet.user_name || tweet.username || 'Anonymous',
        username: tweet.username || 'user',
        profileImage: tweet.profile_image || "https://randomuser.me/api/portraits/men/1.jpg",
        verified: tweet.verified || false,
        followers: tweet.followers_count || tweet.followers || 0
      },
      date: tweet.tweet_date || tweet.date || tweet.metadata?.tweet_date || new Date().toISOString(),
      likes: tweet.likes || (tweet.engagement_metrics?.likes || 0),
      retweets: tweet.retweets || (tweet.engagement_metrics?.retweets || 0),
      quotes: tweet.quotes || (tweet.engagement_metrics?.quotes || 0),
      replies: tweet.replies || (tweet.engagement_metrics?.replies || 0),
      sentiment: (tweet.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative',
      media: tweet.media ? tweet.media.map((m: any) => ({
        type: (m.type === 'photo' ? 'image' : 'video') as 'image' | 'video',
        url: m.url || m.media_url_https || ''
      })) : undefined
    }))
  };
};

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
      { name: "عدد ال��شارات", value: "35,842", change: 25, type: "mentions", lastUpdate: "تحديث مستمر" },
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
        text: "الأسعار في موسم الري��ض مرتفعة بشكل مبالغ فيه. يجب إعادة النظر في تسعير الفعاليات لتكون في متناول الجميع. #موسم_الرياض",
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
        text: "مواقف السيارات غير ك��فية في منطقة الفعاليات. قضيت أكثر من ساعة للحصول على موقف. نأمل معالجة هذه المشكلة في المواسم القادمة.",
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
