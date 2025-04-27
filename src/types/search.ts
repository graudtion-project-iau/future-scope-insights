export interface Tweet {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
    verified: boolean;
    followers: number;
  };
  date: string;
  likes: number;
  retweets: number;
  quotes: number;
  replies: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  media?: {
    type: 'image' | 'video';
    url: string;
  }[];
}

export interface TweetSearchResults {
  total: number;
  page: number;
  pages: number;
  tweets: Tweet[];
}

export interface KPIItem {
  name: string;
  value: string;
  change?: number;
  type?: 'sentiment' | 'mentions' | 'location' | 'influencers' | 'hashtags' | 'keywords' | 'traffic' | 'realtime' | 'engagement';
  lastUpdate?: string;
}

export interface AnalysisOverviewData {
  query: string;
  total: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  kpis: KPIItem[];
  timeline: any[];
  locations?: {
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

export interface ExampleSearch {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
}

export type TrendType = 'increase' | 'decrease' | 'neutral';

export interface APIAnalysisResponse {
  id: number;
  search_query: number;
  sentiment_counts: {
    positive: number;
    negative: number;
    neutral: number;
  };
  themes: string[];
  expert_insights: {
    industry_impact: string;
    market_trends: string;
    future_predictions: string;
  };
  detailed_analysis: Array<{
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
    metadata: {
      username: string;
      tweet_date: string;
      tweet_url: string;
      has_media: boolean;
      media_count: number;
      is_retweet: boolean;
      is_reply: boolean;
      language: string;
    };
  }>;
  percentages: {
    positive: number;
    negative: number;
    neutral: number;
  };
  created_at: string;
  status: string;
}
