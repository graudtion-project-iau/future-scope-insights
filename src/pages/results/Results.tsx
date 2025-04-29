import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSearchResults } from '@/services/searchService';
import TweetCard from '@/components/tweets/TweetCard';
import { AnalysisOverviewData, TweetSearchResults } from '@/types/search';

const Results: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysisData, setAnalysisData] = useState<AnalysisOverviewData | null>(null);
  const [tweetsData, setTweetsData] = useState<TweetSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!id) return;
      
      try {
        const results = await getSearchResults(parseInt(id));
        setAnalysisData(results.analysis);
        setTweetsData(results.tweets);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!analysisData || !tweetsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-500">No results found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground">Analysis of tweets for: {analysisData.query}</p>
      </div>

      <Tabs defaultValue="tweets" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tweets">Tweets</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="insights">Expert Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="tweets" className="space-y-4">
          {tweetsData.tweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
              <div className="space-y-2">
                <p>Positive: {analysisData.sentiment.positive}</p>
                <p>Neutral: {analysisData.sentiment.neutral}</p>
                <p>Negative: {analysisData.sentiment.negative}</p>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
              <div className="space-y-2">
                {analysisData.kpis.map((kpi, index) => (
                  <p key={index}>{kpi.name}: {kpi.value}</p>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="themes">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Identified Themes</h3>
            <div className="space-y-2">
              {analysisData.themes.map((theme, index) => (
                <p key={index}>{theme}</p>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Expert Insights</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Industry Impact</h4>
                <p>{analysisData.expertInsights?.industry_impact}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Market Trends</h4>
                <p>{analysisData.expertInsights?.market_trends}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Future Predictions</h4>
                <p>{analysisData.expertInsights?.future_predictions}</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Results; 