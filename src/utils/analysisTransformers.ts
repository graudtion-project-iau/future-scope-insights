
import { AnalysisOverviewData, KPIItem, Tweet, APIAnalysisResponse, ExpertInsights } from '@/types/search';

export const transformAnalysisData = (apiData: APIAnalysisResponse): AnalysisOverviewData => {
  // Safety check for undefined input
  if (!apiData || !apiData.detailed_analysis) {
    console.error("Invalid API data received:", apiData);
    return createEmptyAnalysisData();
  }

  try {
    // Calculate engagement stats
    const totalEngagement = apiData.detailed_analysis.reduce((acc, tweet) => {
      return acc + (tweet.engagement_metrics?.likes || 0) + 
             (tweet.engagement_metrics?.retweets || 0) + 
             (tweet.engagement_metrics?.replies || 0) + 
             (tweet.engagement_metrics?.quotes || 0);
    }, 0);

    const avgEngagement = totalEngagement / (apiData.detailed_analysis.length || 1);

    // Find most engaged tweet
    const mostEngagedTweet = apiData.detailed_analysis.reduce((prev, current) => {
      const prevEngagement = (prev.engagement_metrics?.likes || 0) + 
                           (prev.engagement_metrics?.retweets || 0) + 
                           (prev.engagement_metrics?.replies || 0) + 
                           (prev.engagement_metrics?.quotes || 0);
      const currentEngagement = (current.engagement_metrics?.likes || 0) + 
                              (current.engagement_metrics?.retweets || 0) + 
                              (current.engagement_metrics?.replies || 0) + 
                              (current.engagement_metrics?.quotes || 0);
      return prevEngagement > currentEngagement ? prev : current;
    }, apiData.detailed_analysis[0]);

    // Calculate language distribution
    const languageDistribution = apiData.detailed_analysis.reduce((acc, tweet) => {
      const lang = tweet.language || 'unknown';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create KPIs
    const kpis: KPIItem[] = [
      {
        name: "نسبة المشاعر الإيجابية",
        value: `${apiData.percentages?.positive?.toFixed(1) || 0}%`,
        type: "sentiment",
        change: (apiData.percentages?.positive || 0) > 50 ? 1 : -1,
      },
      {
        name: "متوسط التفاعل",
        value: avgEngagement.toFixed(0),
        type: "engagement",
        change: avgEngagement > 100 ? 1 : -1,
      },
      {
        name: "عدد التغريدات",
        value: apiData.detailed_analysis.length.toString(),
        type: "mentions",
      },
      {
        name: "الموضوعات الرئيسية",
        value: (apiData.themes?.length || 0).toString(),
        type: "keywords",
      }
    ];

    // Transform tweets
    const transformedTweets: Tweet[] = apiData.detailed_analysis.map(tweet => ({
      id: tweet.tweet_id || `tweet-${Math.random().toString(36).substring(2, 9)}`,
      text: tweet.original_text || '',
      user: {
        id: tweet.tweet_id || `user-${Math.random().toString(36).substring(2, 9)}`,
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

    // Create timeline data using tweet dates
    const timeline = apiData.detailed_analysis.reduce((acc, tweet) => {
      const tweetDate = tweet.metadata?.tweet_date;
      if (!tweetDate) return acc;
      
      const date = new Date(tweetDate).toLocaleDateString('ar-SA');
      if (!acc[date]) {
        acc[date] = { date, إيجابي: 0, محايد: 0, سلبي: 0 };
      }
      
      const sentimentType = tweet.sentiment === 'positive' ? 'إيجابي' : 
                          tweet.sentiment === 'negative' ? 'سلبي' : 'محايد';
      
      acc[date][sentimentType]++;
      return acc;
    }, {} as Record<string, any>);

    // Sort tweets by date to find earliest and latest
    const sortedTweets = [...transformedTweets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const earliestTweet = sortedTweets[0];
    const latestTweet = sortedTweets[sortedTweets.length - 1];

    // Sort tweets by likes to find the most liked
    const mostLikedTweet = [...transformedTweets].sort((a, b) => b.likes - a.likes)[0];

    return {
      query: "تحليل التغريدات",
      total: apiData.detailed_analysis.length,
      sentiment: {
        positive: apiData.sentiment_counts?.positive || 0,
        neutral: apiData.sentiment_counts?.neutral || 0,
        negative: apiData.sentiment_counts?.negative || 0,
      },
      kpis,
      timeline: Object.values(timeline),
      keywords: (apiData.themes || []).map(theme => ({
        keyword: theme,
        count: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'increase' : 'neutral'
      })),
      influencers: apiData.detailed_analysis
        .sort((a, b) => {
          const aEngagement = (a.engagement_metrics?.likes || 0) + (a.engagement_metrics?.retweets || 0);
          const bEngagement = (b.engagement_metrics?.likes || 0) + (b.engagement_metrics?.retweets || 0);
          return bEngagement - aEngagement;
        })
        .slice(0, 5)
        .map(tweet => ({
          name: tweet.metadata?.username || "مستخدم تويتر",
          followers: Math.floor(Math.random() * 10000).toString(),
          engagement: (((tweet.engagement_metrics?.likes || 0) + (tweet.engagement_metrics?.retweets || 0)) / 100).toFixed(1) + '%',
          image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`
        })),
      highlightTweets: {
        earliest: earliestTweet,
        mostLiked: mostLikedTweet,
        latest: latestTweet
      },
      themes: apiData.themes || [],
      expertInsights: apiData.expert_insights ? {
        industry_impact: apiData.expert_insights.industry_impact || '',
        market_trends: apiData.expert_insights.market_trends || '',
        future_predictions: apiData.expert_insights.future_predictions || ''
      } : undefined,
      lastUpdate: new Date(apiData.created_at || new Date()).toLocaleString('ar-SA')
    };
  } catch (error) {
    console.error("Error transforming analysis data:", error);
    return createEmptyAnalysisData();
  }
};

// Helper function to create empty analysis data when API response is invalid
function createEmptyAnalysisData(): AnalysisOverviewData {
  return {
    query: "تحليل التغريدات",
    total: 0,
    sentiment: {
      positive: 0,
      neutral: 0,
      negative: 0,
    },
    kpis: [],
    timeline: [],
    keywords: [],
    influencers: [],
    highlightTweets: {},
    themes: [],
    lastUpdate: new Date().toLocaleString('ar-SA')
  };
}
