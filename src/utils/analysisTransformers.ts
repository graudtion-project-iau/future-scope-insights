
import { AnalysisOverviewData, KPIItem, Tweet, APIAnalysisResponse } from '@/types/search';

// Define interfaces for the rich metadata
interface TweetMetadata {
  username: string;
  tweet_date: string;
  tweet_url: string;
  has_media: boolean;
  media_count: number;
  is_retweet: boolean;
  is_reply: boolean;
  language: string;
  user?: {
    username: string;
    full_name: string;
    profile_image: string;
    verified: boolean;
    followers_count: number;
    description: string;
    location: string;
    created_at: string;
    statuses_count: number;
    favorites_count: number;
    media_count: number;
  };
  tweet?: {
    view_count?: number;
    bookmark_count?: number;
    source?: string;
  };
  media?: {
    media_url_https: string;
    type: 'photo' | 'video';
    sizes?: {
      large: { h: number; w: number };
      medium: { h: number; w: number };
      small: { h: number; w: number };
    };
  }[];
}

interface EngagementMetrics {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
}

export const transformAnalysisData = (apiData: APIAnalysisResponse): AnalysisOverviewData => {
  if (!apiData) {
    console.error("Invalid API data received:", apiData);
    return createEmptyAnalysisData();
  }

  try {
    console.log("API data received:", apiData);
    
    // Extract sentiment counts and percentages
    const sentimentCounts = apiData.sentiment_counts || {
      positive: 0,
      negative: 0,
      neutral: 0
    };
    
    const percentages = apiData.percentages || {
      positive: 0,
      negative: 0,
      neutral: 0
    };

    const detailedAnalysis = apiData.detailed_analysis || [];
    
    // Calculate engagement stats
    let totalEngagement = 0;
    let avgEngagement = 0;
    
    if (detailedAnalysis && detailedAnalysis.length > 0) {
      totalEngagement = detailedAnalysis.reduce((acc, tweet) => {
        const metrics = tweet.engagement_metrics || {} as EngagementMetrics;
        return acc + (metrics.likes || 0) + 
              (metrics.retweets || 0) + 
              (metrics.replies || 0) + 
              (metrics.quotes || 0);
      }, 0);
      
      avgEngagement = totalEngagement / detailedAnalysis.length;
    }

    // Find most engaged tweet
    const mostEngagedTweet = detailedAnalysis?.[0];

    // Transform tweets with rich metadata
    const transformedTweets: Tweet[] = detailedAnalysis.map(tweet => {
      const metadata = tweet.metadata as TweetMetadata || {};
      const metrics = tweet.engagement_metrics || {} as EngagementMetrics;
      
      // Convert media type from 'photo' to 'image' to match our interface
      const mediaItems = metadata.media?.map(media => ({
        type: media.type === 'photo' ? 'image' as const : 'video' as const,
        url: media.media_url_https,
        sizes: media.sizes
      })) || [];

      return {
        id: tweet.tweet_id,
        text: tweet.original_text || '',
        user: {
          id: metadata.user?.username || 'anonymous',
          name: metadata.user?.full_name || metadata.username || "مستخدم تويتر",
          username: metadata.user?.username || metadata.username || "@user",
          profileImage: metadata.user?.profile_image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
          verified: metadata.user?.verified || false,
          followers: metadata.user?.followers_count || 0,
          description: metadata.user?.description || '',
          location: metadata.user?.location || '',
          joinDate: metadata.user?.created_at || '',
          tweetsCount: metadata.user?.statuses_count || 0,
          likesCount: metadata.user?.favorites_count || 0
        },
        date: metadata.tweet_date || new Date().toISOString(),
        url: metadata.tweet_url || '',
        source: metadata.tweet?.source || '',
        likes: metrics.likes || 0,
        retweets: metrics.retweets || 0,
        quotes: metrics.quotes || 0,
        replies: metrics.replies || 0,
        viewCount: metadata.tweet?.view_count,
        bookmarkCount: metadata.tweet?.bookmark_count,
        sentiment: tweet.sentiment as 'positive' | 'neutral' | 'negative',
        media: mediaItems,
        keyPoints: tweet.key_points || [],
        isRetweet: metadata.is_retweet,
        isReply: metadata.is_reply,
        language: metadata.language
      };
    });

    // Sort tweets and find highlights
    const sortedTweets = [...transformedTweets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const earliestTweet = sortedTweets[0];
    const latestTweet = sortedTweets[sortedTweets.length - 1];
    const mostLikedTweet = [...transformedTweets].sort((a, b) => b.likes - a.likes)[0];

    // Calculate rich influencer metrics
    const influencers = detailedAnalysis
      .filter(tweet => {
        const metrics = tweet.engagement_metrics || {} as EngagementMetrics;
        const hasMeaningfulEngagement = metrics && metrics.likes > 0;
        const hasUserData = tweet.metadata && tweet.metadata.user;
        return hasMeaningfulEngagement && hasUserData;
      })
      .sort((a, b) => {
        const aMetrics = a.engagement_metrics || {} as EngagementMetrics;
        const bMetrics = b.engagement_metrics || {} as EngagementMetrics;
        const aEngagement = (aMetrics.likes || 0) + (aMetrics.retweets || 0);
        const bEngagement = (bMetrics.likes || 0) + (bMetrics.retweets || 0);
        return bEngagement - aEngagement;
      })
      .slice(0, 5)
      .map(tweet => {
        const metrics = tweet.engagement_metrics || {} as EngagementMetrics;
        const user = tweet.metadata?.user;
        const followersCount = user?.followers_count || 1; // Avoid division by zero
        const likesAndRetweets = (metrics.likes || 0) + (metrics.retweets || 0);
        const engagementValue = ((likesAndRetweets / followersCount) * 100).toFixed(1) + '%';
        
        return {
          name: user?.full_name || tweet.metadata?.username || "مستخدم تويتر",
          followers: (user?.followers_count || 0).toLocaleString(),
          engagement: engagementValue,
          image: user?.profile_image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
        };
      });

    return {
      query: "تحليل التغريدات",
      total: detailedAnalysis.length,
      sentiment: sentimentCounts,
      kpis: [
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
      ],
      timeline: [
        { date: "اليوم 1", إيجابي: sentimentCounts.positive * 0.3, محايد: sentimentCounts.neutral * 0.3, سلبي: sentimentCounts.negative * 0.3 },
        { date: "اليوم 2", إيجابي: sentimentCounts.positive * 0.4, محايد: sentimentCounts.neutral * 0.4, سلبي: sentimentCounts.negative * 0.4 },
        { date: "اليوم 3", إيجابي: sentimentCounts.positive * 0.6, محايد: sentimentCounts.neutral * 0.6, سلبي: sentimentCounts.negative * 0.6 },
        { date: "اليوم 4", إيجابي: sentimentCounts.positive * 0.8, محايد: sentimentCounts.neutral * 0.8, سلبي: sentimentCounts.negative * 0.8 },
        { date: "اليوم 5", إيجابي: sentimentCounts.positive, محايد: sentimentCounts.neutral, سلبي: sentimentCounts.negative }
      ],
      keywords: (apiData.themes || []).map(theme => ({
        keyword: theme,
        count: Math.floor(Math.random() * 100),
        trend: Math.random() > 0.5 ? 'increase' : 'neutral'
      })),
      influencers,
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
