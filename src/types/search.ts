
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
    type: string;
    url: string;
  }[];
}

export interface TweetSearchResults {
  total: number;
  page: number;
  pages: number;
  tweets: Tweet[];
}

export interface AnalysisOverviewData {
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

export interface ExampleSearch {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
}
