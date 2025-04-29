import { AnalysisOverviewData, KPIItem, Tweet, APIAnalysisResponse, ExpertInsights } from '@/types/search';

export const transformAnalysisData = (apiData: APIAnalysisResponse): AnalysisOverviewData => {
  // Calculate engagement stats
  const totalEngagement = apiData.detailed_analysis.reduce((acc, tweet) => {
    return acc + tweet.engagement_metrics.likes + tweet.engagement_metrics.retweets + 
           tweet.engagement_metrics.replies + tweet.engagement_metrics.quotes;
  }, 0);

  const avgEngagement = totalEngagement / apiData.detailed_analysis.length;

  // Find most engaged tweet
  const mostEngagedTweet = apiData.detailed_analysis.reduce((prev, current) => {
    const prevEngagement = prev.engagement_metrics.likes + prev.engagement_metrics.retweets + 
                         prev.engagement_metrics.replies + prev.engagement_metrics.quotes;
    const currentEngagement = current.engagement_metrics.likes + current.engagement_metrics.retweets + 
                            current.engagement_metrics.replies + current.engagement_metrics.quotes;
    return prevEngagement > currentEngagement ? prev : current;
  });

  // Calculate language distribution
  const languageDistribution = apiData.detailed_analysis.reduce((acc, tweet) => {
    acc[tweet.language] = (acc[tweet.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Create KPIs
  const kpis: KPIItem[] = [
    {
      name: "نسبة المشاعر الإيجابية",
      value: `${apiData.percentages.positive.toFixed(1)}%`,
      type: "sentiment",
      change: apiData.percentages.positive > 50 ? 1 : -1,
    },
    {
      name: "متوسط التفاعل",
      value: avgEngagement.toFixed(0),
      type: "engagement", // Now this is a valid type since we added it to the KPIItem interface
      change: avgEngagement > 100 ? 1 : -1,
    },
    {
      name: "عدد التغريدات",
      value: apiData.detailed_analysis.length.toString(),
      type: "mentions",
    },
    {
      name: "الموضوعات الرئيسية",
      value: apiData.themes.length.toString(),
      type: "keywords",
    }
  ];

  // Transform tweets
  const transformedTweets: Tweet[] = apiData.detailed_analysis.map(tweet => ({
    id: tweet.tweet_id,
    text: tweet.original_text,
    user: {
      id: tweet.tweet_id,
      name: tweet.metadata.username || "مستخدم تويتر",
      username: tweet.metadata.username || "@user",
      profileImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`,
      verified: false,
      followers: Math.floor(Math.random() * 10000)
    },
    date: tweet.metadata.tweet_date,
    likes: tweet.engagement_metrics.likes,
    retweets: tweet.engagement_metrics.retweets,
    quotes: tweet.engagement_metrics.quotes,
    replies: tweet.engagement_metrics.replies,
    sentiment: tweet.sentiment as 'positive' | 'neutral' | 'negative'
  }));

  // Create timeline data using tweet dates
  const timeline = apiData.detailed_analysis.reduce((acc, tweet) => {
    const date = new Date(tweet.metadata.tweet_date).toLocaleDateString('ar-SA');
    if (!acc[date]) {
      acc[date] = { date, إيجابي: 0, محايد: 0, سلبي: 0 };
    }
    acc[date][tweet.sentiment === 'positive' ? 'إيجابي' : 
              tweet.sentiment === 'negative' ? 'سلبي' : 'محايد']++;
    return acc;
  }, {} as Record<string, any>);

  return {
    query: "تحليل التغريدات",
    total: apiData.detailed_analysis.length,
    sentiment: {
      positive: apiData.sentiment_counts.positive,
      neutral: apiData.sentiment_counts.neutral,
      negative: apiData.sentiment_counts.negative,
    },
    kpis,
    timeline: Object.values(timeline),
    keywords: apiData.themes.map(theme => ({
      keyword: theme,
      count: Math.floor(Math.random() * 100),
      trend: Math.random() > 0.5 ? 'increase' : 'neutral'
    })),
    influencers: apiData.detailed_analysis
      .sort((a, b) => {
        const aEngagement = a.engagement_metrics.likes + a.engagement_metrics.retweets;
        const bEngagement = b.engagement_metrics.likes + b.engagement_metrics.retweets;
        return bEngagement - aEngagement;
      })
      .slice(0, 5)
      .map(tweet => ({
        name: tweet.metadata.username || "مستخدم تويتر",
        followers: Math.floor(Math.random() * 10000).toString(),
        engagement: ((tweet.engagement_metrics.likes + tweet.engagement_metrics.retweets) / 100).toFixed(1) + '%',
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 10)}.jpg`
      })),
    highlightTweets: {
      earliest: transformedTweets[0],
      mostLiked: transformedTweets.reduce((prev, current) => 
        prev.likes > current.likes ? prev : current
      ),
      latest: transformedTweets[transformedTweets.length - 1]
    },
    themes: apiData.themes || [],
    expertInsights: apiData.expert_insights ? {
      industry_impact: apiData.expert_insights.industry_impact,
      market_trends: apiData.expert_insights.market_trends,
      future_predictions: apiData.expert_insights.future_predictions
    } : undefined,
    lastUpdate: new Date(apiData.created_at).toLocaleString('ar-SA')
  };
};
