
import { AnalysisOverviewData, KPIItem, Tweet, APIAnalysisResponse } from '@/types/search';

// Define interfaces for API response types
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
    id: string;
    text: string;
    date: string;
    url: string;
    source: string;
    language: string;
    is_reply: boolean;
    is_retweet: boolean;
    is_quote: boolean;
    is_pinned: boolean;
    possibly_sensitive: boolean;
    view_count: number;
    bookmark_count: number;
  };
  media?: {
    media_details: Array<{
      media_url_https: string;
      type: 'photo' | 'video';
      sizes?: {
        large: { h: number; w: number };
        medium: { h: number; w: number };
        small: { h: number; w: number };
      };
    }>;
  };
}

interface DetailedAnalysis {
  tweet_id: string;
  original_text: string;
  sentiment: string;
  key_points: string[];
  language: string;
  engagement_metrics: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
  };
  metadata: TweetMetadata;
}

export const transformAnalysisData = (apiData: APIAnalysisResponse): AnalysisOverviewData => {
  if (!apiData) {
    console.error("Invalid API data received:", apiData);
    return createEmptyAnalysisData();
  }

  try {
    console.log("API data received:", apiData);
    
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
    
    let totalEngagement = 0;
    let avgEngagement = 0;
    
    if (detailedAnalysis.length > 0) {
      totalEngagement = detailedAnalysis.reduce((acc, tweet) => {
        const metrics = tweet.engagement_metrics || { likes: 0, retweets: 0, replies: 0, quotes: 0 };
        return acc + metrics.likes + metrics.retweets + metrics.replies + metrics.quotes;
      }, 0);
      
      avgEngagement = totalEngagement / detailedAnalysis.length;
    }

    // Transform tweets with rich metadata
    const transformedTweets: Tweet[] = detailedAnalysis.map(tweet => {
      const metadata = tweet.metadata;
      const userInfo = metadata.user || {};
      
      // Transform media items
      const mediaItems = metadata.media?.media_details?.map(media => ({
        type: media.type === 'photo' ? 'image' : 'video',
        url: media.media_url_https,
        sizes: media.sizes
      })) || [];

      return {
        id: tweet.tweet_id,
        text: tweet.original_text,
        user: {
          id: userInfo.username || metadata.username,
          name: userInfo.full_name || metadata.username || "مستخدم تويتر",
          username: userInfo.username || metadata.username,
          profileImage: userInfo.profile_image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
          verified: userInfo.verified || false,
          followers: userInfo.followers_count || 0,
          description: userInfo.description,
          location: userInfo.location,
          joinDate: userInfo.created_at,
          tweetsCount: userInfo.statuses_count,
          likesCount: userInfo.favorites_count
        },
        date: metadata.tweet_date,
        url: metadata.tweet_url,
        source: metadata.tweet?.source,
        likes: tweet.engagement_metrics?.likes || 0,
        retweets: tweet.engagement_metrics?.retweets || 0,
        quotes: tweet.engagement_metrics?.quotes || 0,
        replies: tweet.engagement_metrics?.replies || 0,
        viewCount: metadata.tweet?.view_count,
        bookmarkCount: metadata.tweet?.bookmark_count,
        sentiment: tweet.sentiment as 'positive' | 'neutral' | 'negative',
        media: mediaItems,
        keyPoints: tweet.key_points,
        isRetweet: metadata.is_retweet,
        isReply: metadata.is_reply,
        language: metadata.language
      };
    });

    // Sort tweets for highlights
    const sortedTweets = [...transformedTweets].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Create analysis overview data
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
      influencers: transformedTweets
        .filter(tweet => tweet.likes > 0)
        .sort((a, b) => (b.likes + b.retweets) - (a.likes + a.retweets))
        .slice(0, 5)
        .map(tweet => ({
          name: tweet.user.name,
          followers: tweet.user.followers.toString(),
          engagement: ((tweet.likes + tweet.retweets) * 100 / (tweet.user.followers || 1)).toFixed(1) + '%',
          image: tweet.user.profileImage
        })),
      highlightTweets: {
        earliest: sortedTweets[0],
        mostLiked: [...transformedTweets].sort((a, b) => b.likes - a.likes)[0],
        latest: sortedTweets[sortedTweets.length - 1]
      },
      themes: apiData.themes || [],
      expertInsights: apiData.expert_insights,
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
