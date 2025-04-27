
import { AnalysisOverviewData, KPIItem, Tweet, APIAnalysisResponse, ExpertInsights } from '@/types/search';

// Define a type for engagement metrics to help TypeScript understand the structure
interface EngagementMetrics {
  likes?: number;
  retweets?: number;
  replies?: number;
  quotes?: number;
}

export const transformAnalysisData = (apiData: APIAnalysisResponse): AnalysisOverviewData => {
  // Safety check for undefined input
  if (!apiData) {
    console.error("Invalid API data received:", apiData);
    return createEmptyAnalysisData();
  }

  try {
    console.log("API data received:", apiData);
    
    // Extract sentiment counts
    const sentimentCounts = apiData.sentiment_counts || {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    // Extract percentages
    const percentages = apiData.percentages || {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    // Extract detailed analysis
    const detailedAnalysis = apiData.detailed_analysis || [];
    
    // Calculate engagement stats if detailed_analysis exists
    let totalEngagement = 0;
    let avgEngagement = 0;
    
    if (detailedAnalysis && detailedAnalysis.length > 0) {
      totalEngagement = detailedAnalysis.reduce((acc, tweet) => {
        // Use optional chaining and type assertion to handle metrics
        const metrics = tweet.engagement_metrics as EngagementMetrics || {};
        return acc + (metrics?.likes || 0) + 
              (metrics?.retweets || 0) + 
              (metrics?.replies || 0) + 
              (metrics?.quotes || 0);
      }, 0);
      
      avgEngagement = totalEngagement / detailedAnalysis.length;
    }

    // Find most engaged tweet if detailed_analysis exists
    let mostEngagedTweet = null;
    if (detailedAnalysis && detailedAnalysis.length > 0) {
      mostEngagedTweet = detailedAnalysis.reduce((prev, current) => {
        // Use optional chaining and type assertion to handle metrics
        const prevMetrics = prev.engagement_metrics as EngagementMetrics || {};
        const currentMetrics = current.engagement_metrics as EngagementMetrics || {};
        
        const prevEngagement = (prevMetrics?.likes || 0) + 
                            (prevMetrics?.retweets || 0) + 
                            (prevMetrics?.replies || 0) + 
                            (prevMetrics?.quotes || 0);
        const currentEngagement = (currentMetrics?.likes || 0) + 
                                (currentMetrics?.retweets || 0) + 
                                (currentMetrics?.replies || 0) + 
                                (currentMetrics?.quotes || 0);
        return prevEngagement > currentEngagement ? prev : current;
      }, detailedAnalysis[0]);
    }

    // Create KPIs
    const kpis: KPIItem[] = [
      {
        name: "نسبة المشاعر الإيجابية",
        value: `${percentages.positive?.toFixed(1) || 0}%`,
        type: "sentiment",
        change: (percentages.positive || 0) > 50 ? 1 : -1,
        color: (percentages.positive || 0) > 50 ? 'green' : 'red'
      },
      {
        name: "متوسط التفاعل",
        value: avgEngagement.toFixed(0),
        type: "engagement",
        change: avgEngagement > 100 ? 1 : -1,
        color: avgEngagement > 100 ? 'green' : 'yellow'
      },
      {
        name: "عدد التغريدات",
        value: detailedAnalysis.length.toString(),
        type: "mentions",
        color: 'blue'
      },
      {
        name: "الموضوعات الرئيسية",
        value: (apiData.themes?.length || 0).toString(),
        type: "keywords",
        color: 'purple'
      }
    ];

    // Transform tweets
    const transformedTweets: Tweet[] = detailedAnalysis.map(tweet => {
      // Use type assertion to safely handle engagement metrics
      const metrics = tweet.engagement_metrics as EngagementMetrics || {};
      
      return {
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
        likes: metrics?.likes || 0,
        retweets: metrics?.retweets || 0,
        quotes: metrics?.quotes || 0,
        replies: metrics?.replies || 0,
        sentiment: (tweet.sentiment || 'neutral') as 'positive' | 'neutral' | 'negative'
      };
    });

    // Create timeline data using mock data for now
    // In a real implementation, we would parse tweet dates
    const timeline = [
      { date: "اليوم 1", إيجابي: sentimentCounts.positive * 0.3, محايد: sentimentCounts.neutral * 0.3, سلبي: sentimentCounts.negative * 0.3 },
      { date: "اليوم 2", إيجابي: sentimentCounts.positive * 0.4, محايد: sentimentCounts.neutral * 0.4, سلبي: sentimentCounts.negative * 0.4 },
      { date: "اليوم 3", إيجابي: sentimentCounts.positive * 0.6, محايد: sentimentCounts.neutral * 0.6, سلبي: sentimentCounts.negative * 0.6 },
      { date: "اليوم 4", إيجابي: sentimentCounts.positive * 0.8, محايد: sentimentCounts.neutral * 0.8, سلبي: sentimentCounts.negative * 0.8 },
      { date: "اليوم 5", إيجابي: sentimentCounts.positive, محايد: sentimentCounts.neutral, سلبي: sentimentCounts.negative }
    ];

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
      total: detailedAnalysis.length,
      sentiment: {
        positive: sentimentCounts.positive || 0,
        neutral: sentimentCounts.neutral || 0,
        negative: sentimentCounts.negative || 0,
      },
      kpis,
      timeline,
      keywords: (apiData.themes || []).map(theme => ({
        keyword: theme,
        count: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'increase' : 'neutral'
      })),
      influencers: detailedAnalysis
        .filter(tweet => {
          const metrics = tweet.engagement_metrics as EngagementMetrics || {};
          return metrics && (metrics?.likes || 0) > 0;
        })
        .sort((a, b) => {
          const aMetrics = a.engagement_metrics as EngagementMetrics || {};
          const bMetrics = b.engagement_metrics as EngagementMetrics || {};
          const aEngagement = (aMetrics?.likes || 0) + (aMetrics?.retweets || 0);
          const bEngagement = (bMetrics?.likes || 0) + (bMetrics?.retweets || 0);
          return bEngagement - aEngagement;
        })
        .slice(0, 5)
        .map(tweet => ({
          name: tweet.metadata?.username || "مستخدم تويتر",
          followers: Math.floor(Math.random() * 10000).toString(),
          engagement: (((tweet.engagement_metrics as EngagementMetrics)?.likes || 0) + 
                      ((tweet.engagement_metrics as EngagementMetrics)?.retweets || 0)) / 100).toFixed(1) + '%',
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
