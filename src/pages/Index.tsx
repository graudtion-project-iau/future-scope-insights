import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Bell, Search, Lightbulb } from 'lucide-react';
import { executeSearch } from '@/services/searchService';
import SentimentAnalysis from '@/components/results/SentimentAnalysis';
import HashtagsDisplay from '@/components/results/HashtagsDisplay';
import TweetFeed from '@/components/tweets/TweetFeed';
import AnalysisOverview from '@/components/results/AnalysisOverview';
import RegistrationSteps from '@/components/registration/RegistrationSteps';
import InfluencersList from '@/components/results/InfluencersList';

// Helper: Build timeline data from detailed_analysis
function buildTimeline(detailed_analysis) {
  const timeline = {};
  detailed_analysis.forEach((tweet) => {
    const date = tweet.metadata.tweet_date.slice(0, 10); // YYYY-MM-DD
    if (!timeline[date]) timeline[date] = { date, إيجابي: 0, محايد: 0, سلبي: 0 };
    if (tweet.sentiment === 'positive') timeline[date]['إيجابي'] += 1;
    else if (tweet.sentiment === 'neutral') timeline[date]['محايد'] += 1;
    else if (tweet.sentiment === 'negative') timeline[date]['سلبي'] += 1;
  });
  return Object.values(timeline);
}

// Helper: Map detailed_analysis to tweets array for TweetFeed
function mapTweets(detailed_analysis) {
  return detailed_analysis.map((item) => {
    const user = item.metadata.user;
    const media = (item.metadata.media && item.metadata.media.media_details) || [];
    return {
      id: item.tweet_id,
      text: item.original_text,
      user: {
        id: user.username,
        name: user.full_name,
        username: user.username,
        profileImage: user.profile_image,
        verified: user.verified,
        followers: user.followers_count,
      },
      date: item.metadata.tweet_date,
      likes: item.engagement_metrics.likes,
      retweets: item.engagement_metrics.retweets,
      quotes: item.engagement_metrics.quotes,
      replies: item.engagement_metrics.replies,
      sentiment: item.sentiment,
      media: media.map((m) => ({
        type: m.type === 'photo' ? 'image' : m.type,
        url: m.type === 'video' && m.video_info && m.video_info.variants ?
          (m.video_info.variants.find(v => v.content_type === 'video/mp4')?.url || m.media_url_https)
          : m.media_url_https,
      })),
      tweetUrl: item.metadata.tweet_url,
    };
  });
}

// Helper: Map influencers from detailed_analysis (top users by followers or engagement)
function mapInfluencers(detailed_analysis): Array<{ name: string; username: string; image: string; followers: string; engagement: string }> {
  const usersMap: Record<string, { name: string; username: string; image: string; followers: string; engagement: number }> = {};
  detailed_analysis.forEach((item) => {
    const user = item.metadata.user;
    if (!usersMap[user.username]) {
      usersMap[user.username] = {
        name: user.full_name,
        username: user.username,
        image: user.profile_image,
        followers: String(user.followers_count),
        engagement: item.engagement_metrics.likes + item.engagement_metrics.retweets + item.engagement_metrics.replies + item.engagement_metrics.quotes,
      };
    } else {
      usersMap[user.username].engagement += item.engagement_metrics.likes + item.engagement_metrics.retweets + item.engagement_metrics.replies + item.engagement_metrics.quotes;
    }
  });
  // Convert engagement to string for type compatibility
  return Object.values(usersMap).map(u => ({ ...u, engagement: String(u.engagement) }));
}

// Helper: Map hashtags from detailed_analysis
function mapHashtags(detailed_analysis): Array<{ tag: string; count: number; trend: 'increase' | 'decrease' | 'neutral' }> {
  const tagMap: Record<string, { tag: string; count: number; trend: 'increase' | 'decrease' | 'neutral' }> = {};
  detailed_analysis.forEach((item) => {
    const hashtags = (item.metadata.entities && item.metadata.entities.hashtags) || [];
    hashtags.forEach((h) => {
      const tag = h.text;
      if (!tagMap[tag]) tagMap[tag] = { tag, count: 0, trend: 'neutral' };
      tagMap[tag].count += 1;
    });
  });
  return Object.values(tagMap);
}

// --- Sentiment Mapping Helper ---
const sentimentToArabic = (sentiment) => {
  if (sentiment === 'positive') return 'إيجابي';
  if (sentiment === 'negative') return 'سلبي';
  if (sentiment === 'neutral') return 'محايد';
  return sentiment;
};

// --- Sentiment Badge Color Helper ---
const sentimentBadgeClass = (sentiment) => {
  if (sentiment === 'positive') return 'bg-green-200 text-green-800 border border-green-400';
  if (sentiment === 'negative') return 'bg-red-200 text-red-800 border border-red-400';
  if (sentiment === 'neutral') return 'bg-yellow-200 text-yellow-800 border border-yellow-400';
  return 'bg-gray-200 text-gray-800';
};

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [maxItems, setMaxItems] = React.useState(10);

  const handleSearch = async (query, max = maxItems) => {
    setLoading(true);
    setError(null);
    setProgress({ stage: 'searching', progress: 0, message: 'بدء البحث...' });
    setAnalysisResult(null);
    try {
      const { searchId, analysisData, tweetsData } = await executeSearch(query, setProgress, max);
      setAnalysisResult({ searchId, analysisData, tweetsData });
    } catch (err: any) {
      setError('حدث خطأ أثناء البحث. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const teamMembers = [
    {
      name: "حاتم العتيبي",
      role: "Full Stack & AI Engineer",
      description: "مطور متكامل مع خبرة في الذكاء الاصطناعي. ساهم في تطوير واجهة المستخدم والخلفية، مع تخصص في هندسة عكسية لـ Twitter API وتقنيات استخراج البيانات.",
      image: "https://i.ibb.co/NdzGD42J/hatim.jpg"
    },
    {
      name: "عمر الصحفي",
      role: "AI Engineer",
      description: "مهندس ذكاء اصطناعي متخصص في تطوير خوارزميات التعلم الآلي ومعالجة اللغات الطبيعية لتحليل وفهم المحتوى عبر منصات التواصل الاجتماعي.",
      image: "https://i.ibb.co/Xrj0TS30/omar.jpg"
    },
    {
      name: "مشاري التميمي",
      role: "Data Engineer",
      description: "خبير في تحليل البيانات وتطوير خطوط معالجة البيانات. متخصص في بناء أنظمة معالجة البيانات الضخمة وتحويلها إلى رؤى قابلة للتنفيذ.",
      image: "https://i.ibb.co/7Jgn6PD1/image.png"
    },
    {
      name: "عبدالرحمن",
      role: "Data Analyst",
      description: "متخصص في استخراج وتحليل البيانات، مع خبرة في تطوير حلول Web Scraping وتحليل البيانات المجمعة لاستخراج الرؤى القيمة.",
      image: "https://i.ibb.co/rGCWjNjj/abdulharman.jpg"
    },
    {
      name: "نايف الصحفي",
      role: "Design Engineer",
      description: "مهندس تصميم وواجهة أمامية، متخصص في إنشاء تجارب مستخدم جذابة وسلسة مع التركيز على التصميم التفاعلي.",
      image: "https://i.ibb.co/G4VDqz3L/Naif.jpg"
    }
  ];

  const showLanding = !analysisResult;

  // Prepare mapped data for result components
  const analysisData = analysisResult?.analysisData || {};
  const sentimentData = analysisData.sentiment_counts ? {
    positive: analysisData.sentiment_counts.positive ?? 0,
    neutral: analysisData.sentiment_counts.neutral ?? 0,
    negative: analysisData.sentiment_counts.negative ?? 0,
  } : { positive: 0, neutral: 0, negative: 0 };

  const detailedAnalysis = Array.isArray(analysisData.detailed_analysis) ? analysisData.detailed_analysis : [];
  const timelineData = buildTimeline(detailedAnalysis);
  const tweets = Array.isArray(analysisResult?.tweetsData) ? analysisResult.tweetsData : [];
  const hashtags = mapHashtags(detailedAnalysis);
  const influencers = mapInfluencers(detailedAnalysis);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute animate-float opacity-10 top-20 right-10 text-6xl">🔍</div>
          <div className="absolute animate-float opacity-10 bottom-20 left-10 text-6xl" style={{ animationDelay: "1s" }}>📊</div>
          <div className="absolute animate-float opacity-10 top-40 left-1/4 text-6xl" style={{ animationDelay: "1.5s" }}>⚡</div>
          <div className="absolute animate-float opacity-10 bottom-40 right-1/4 text-6xl" style={{ animationDelay: "2s" }}>🔔</div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient animate-slide-up font-cairo">
              مراقبة ذكية لكل ما يهمك<br />
              <span className="text-saudi-green">في الوقت الحقيقي 🌟</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              نظام متكامل لمراقبة وتحليل المحتوى من أكثر من 5 مصادر رئيسية.
              تحليل فوري للأحداث الرياضية، السياحية، والفعاليات العامة.
              تنبيهات مباشرة عبر البريد والواتساب مع تحليل ذكي بأكثر من 20 لغة.
            </p>
            <div className="flex gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button className="btn-saudi gap-2" onClick={() => setShowRegistration(true)}>
                <Bell className="w-4 h-4" /> سجل الآن
              </Button>
              <Button variant="outline" className="btn-saudi-outlined gap-2">
                <Search className="w-4 h-4" /> جرب الآن
              </Button>
            </div>
            <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <SearchBar onSearch={(query, max) => { setMaxItems(max); handleSearch(query, max); }} />
              {loading && (
                <div className="mt-4 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                    <span className="text-lg">{progress?.message || 'جاري البحث...'}</span>
                  </div>
                </div>
              )}
              {error && <div className="mt-4 text-red-500">{error}</div>}
            </div>
          </div>
        </div>
      </section>
      {/* Landing sections only visible before search */}
      {showLanding && (
        <>
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-gradient">المميزات الرئيسية</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الأدوات التحليلية المبتكرة لمراقبة وتحليل المحتوى بذكاء وفعالية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="dashboard-card animate-scale-in">
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span role="img" aria-label="sentiment">💡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">تحليل المشاعر</h3>
              <p className="text-gray-600">تحليل ذكي للمشاعر في أكثر من 50 لغة مع دقة عالية</p>
            </div>
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span role="img" aria-label="alerts">📧</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">تنبيهات فورية</h3>
              <p className="text-gray-600">إشعارات فورية عبر البريد الإلكتروني والواتساب للأحداث المهمة</p>
            </div>
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span role="img" aria-label="news">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">تحقق من الأخبار</h3>
              <p className="text-gray-600">التحقق السريع من صحة الأخبار ومصادرها</p>
            </div>
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span role="img" aria-label="influencers">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">تحليل المؤثرين</h3>
              <p className="text-gray-600">تحديد وتحليل تأثير الشخصيات المؤثرة</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-gradient">الأسئلة الشائعة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                {
                  q: "كيف يمكنني البدء باستخدام المنصة؟",
                  a: "ببساطة قم بإنشاء حساب جديد مجاني، وابدأ في استكشاف البيانات والتحليلات المتاحة."
                },
                {
                  q: "ما هي مصادر البيانات التي تعتمد عليها المنصة؟",
                  a: "نجمع البيانات من مختلف منصات التواصل الاجتماعي مثل X، Reddit، Meta، وGoogle Search."
                },
                {
                  q: "كم عدد اللغات المدعومة في المنصة؟",
                  a: "تدعم منصتنا أكثر من 50 لغة عالمية، مما يتيح تحليل المحتوى من مختلف الثقافات."
                },
                {
                  q: "كيف يتم إرسال التنبيهات؟",
                  a: "نرسل تنبيهات فورية عبر البريد الإلكتروني والواتساب للأحداث المهمة التي تهمك."
                },
                {
                  q: "ما مدى دقة التحليلات؟",
                  a: "نستخدم خوارزميات متقدمة للذكاء الاصطناعي تحقق دقة تصل إلى 95% في تحليل المشاعر والمحتوى."
                }
              ].map((faq, index) => (
                <div key={index} className="dashboard-card transition-all hover:shadow-md">
                      <button className="w-full text-right">
                    <h3 className="text-lg font-semibold">{faq.q}</h3>
                    <p className="mt-2 text-gray-600">{faq.a}</p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">فريق التطوير - جامعة الإمام عبدالرحمن بن فيصل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
                  <div key={index} className="dashboard-card flex flex-col items-center p-6">
                    <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-saudi-green" />
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-saudi-green font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
            ))}
          </div>
        </div>
      </section>
        </>
      )}
      {/* Results Section */}
      {!showLanding && (
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto space-y-8">
            {/* --- Timeline Card Above All --- */}
            <div className="dashboard-card p-6 mb-8">
              <h3 className="text-lg font-bold mb-4 text-saudi-green">الخط الزمني للتغريدات</h3>
              <TweetTimelineChart detailedAnalysis={detailedAnalysis} />
            </div>
            {/* KPIs Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {/* إجمالي التغريدات */}
              <div className="dashboard-card flex flex-col items-center p-6">
                <span className="text-3xl mb-2">📝</span>
                <div className="text-2xl font-bold">{tweets.length}</div>
                <div className="text-gray-600">إجمالي التغريدات</div>
              </div>
              {/* إجمالي التفاعل */}
              <div className="dashboard-card flex flex-col items-center p-6">
                <span className="text-3xl mb-2">📊</span>
                <div className="text-2xl font-bold">{tweets.reduce((acc, t) => acc + (t.likes + t.retweets + t.replies + t.quotes), 0)}</div>
                <div className="text-gray-600">إجمالي التفاعل</div>
              </div>
              {/* متوسط التفاعل/تغريدة */}
              <div className="dashboard-card flex flex-col items-center p-6">
                <span className="text-3xl mb-2">📈</span>
                <div className="text-2xl font-bold">{tweets.length > 0 ? Math.round(tweets.reduce((acc, t) => acc + (t.likes + t.retweets + t.replies + t.quotes), 0) / tweets.length) : 0}</div>
                <div className="text-gray-600">متوسط التفاعل/تغريدة</div>
              </div>
              {/* عدد المستخدمين الفريدين */}
              <div className="dashboard-card flex flex-col items-center p-6">
                <span className="text-3xl mb-2">👥</span>
                <div className="text-2xl font-bold">{new Set(tweets.map(t => t.user?.username)).size}</div>
                <div className="text-gray-600">عدد المستخدمين الفريدين</div>
              </div>
              {/* أكثر هاشتاق */}
              <div className="dashboard-card flex flex-col items-center p-6">
                <span className="text-3xl mb-2">#️⃣</span>
                <div className="text-2xl font-bold">{hashtags.length > 0 ? `#${hashtags.sort((a, b) => b.count - a.count)[0].tag}` : '-'}</div>
                <div className="text-gray-600">أكثر هاشتاق</div>
              </div>
            </div>
            {/* Themes as Badges */}
            {analysisData.themes && analysisData.themes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {analysisData.themes.map((theme, idx) => (
                  <span key={idx} className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            )}
            {/* Expert Insights */}
            {analysisData.expert_insights && (
              <div className="dashboard-card p-6 mb-8 bg-white border border-saudi-green/20 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-saudi-green flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  رأي الخبراء (تعليق الذكاء الاصطناعي)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysisData.expert_insights.industry_impact && (
                    <div className="bg-amber-50 p-4 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-semibold mb-2 text-amber-700"><span>🏭</span> تأثير الصناعة:</div>
                      <div className="text-gray-700 text-sm">{analysisData.expert_insights.industry_impact}</div>
                    </div>
                  )}
                  {analysisData.expert_insights.market_trends && (
                    <div className="bg-blue-50 p-4 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-semibold mb-2 text-blue-700"><span>📈</span> اتجاهات السوق:</div>
                      <div className="text-gray-700 text-sm">{analysisData.expert_insights.market_trends}</div>
                    </div>
                  )}
                  {analysisData.expert_insights.future_predictions && (
                    <div className="bg-green-50 p-4 rounded-lg flex flex-col gap-2">
                      <div className="flex items-center gap-2 font-semibold mb-2 text-green-700"><span>🔮</span> توقعات المستقبل:</div>
                      <div className="text-gray-700 text-sm">{analysisData.expert_insights.future_predictions}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Sentiment & Engagement Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Sentiment Pie Chart */}
              <div className="dashboard-card p-6">
                <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                {(() => {
                  // Count sentiments from detailedAnalysis
                  const sentimentCounts = detailedAnalysis.reduce((acc, t) => {
                    acc[t.sentiment] = (acc[t.sentiment] || 0) + 1;
                    return acc;
                  }, { positive: 0, negative: 0, neutral: 0 });
                  const pos = sentimentCounts.positive || 0;
                  const neu = sentimentCounts.neutral || 0;
                  const neg = sentimentCounts.negative || 0;
                  const total = pos + neu + neg;
                  // Pie chart logic: always show a full circle if only one sentiment
                  let paths = [];
                  if (total > 0) {
                    if (pos === total) {
                      // All positive
                      paths.push(<circle key="pos" cx="70" cy="70" r="60" fill="#22c55e" />);
                    } else if (neu === total) {
                      paths.push(<circle key="neu" cx="70" cy="70" r="60" fill="#eab308" />);
                    } else if (neg === total) {
                      paths.push(<circle key="neg" cx="70" cy="70" r="60" fill="#ef4444" />);
                    } else {
                      // Mixed: draw arcs
                      let start = 0;
                      const addArc = (count, color) => {
                        if (count === 0) return;
                        const angle = (count / total) * 360;
                        const end = start + angle;
                        const largeArc = angle > 180 ? 1 : 0;
                        const r = 60;
                        const cx = 70, cy = 70;
                        const startRad = (Math.PI / 180) * start;
                        const endRad = (Math.PI / 180) * end;
                        const x1 = cx + r * Math.cos(startRad);
                        const y1 = cy + r * Math.sin(startRad);
                        const x2 = cx + r * Math.cos(endRad);
                        const y2 = cy + r * Math.sin(endRad);
                        paths.push(
                          <path
                            key={color + start}
                            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
                            fill={color}
                          />
                        );
                        start = end;
                      };
                      addArc(pos, '#22c55e');
                      addArc(neu, '#eab308');
                      addArc(neg, '#ef4444');
                    }
                  }
                  return (
                    <div className="flex flex-col items-center">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {paths}
                      </svg>
                      <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span> إيجابي ({pos})</div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-yellow-500 inline-block"></span> محايد ({neu})</div>
                        <div className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-red-500 inline-block"></span> سلبي ({neg})</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* Top Engagement Tweet & Most Famous Profile */}
              <div className="flex flex-col gap-4">
                {/* Top Engagement Tweet */}
                {(() => {
                  if (!tweets.length || !detailedAnalysis.length) return null;
                  const topTweetIdx = tweets.reduce((topIdx, t, idx, arr) => {
                    const currEng = t.likes + t.retweets + t.replies + t.quotes;
                    const topEng = arr[topIdx].likes + arr[topIdx].retweets + arr[topIdx].replies + arr[topIdx].quotes;
                    return currEng > topEng ? idx : topIdx;
                  }, 0);
                  const topTweet = tweets[topTweetIdx];
                  const topDetailed = detailedAnalysis[topTweetIdx];
                  const user = topDetailed?.metadata?.user;
                  return (
                    <div className="dashboard-card p-4 flex flex-col gap-2">
                      <div className="font-bold text-saudi-green mb-1">أكثر تغريدة تفاعلًا</div>
                      <div className="flex items-center gap-2 mb-1">
                        <img src={user?.profile_image} alt={user?.full_name} className="w-8 h-8 rounded-full border object-cover" onError={e => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = '/default-profile.png'; }} />
                        <span className="font-semibold">{user?.full_name}</span>
                        <span className="text-xs text-gray-500">@{user?.username}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sentimentBadgeClass(topTweet.sentiment)}`}>{sentimentToArabic(topTweet.sentiment)}</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-1">{topTweet.text}</div>
                      <div className="flex gap-2 text-xs text-gray-500 mb-1">
                        <span>❤️ {topTweet.likes}</span>
                        <span>🔁 {topTweet.retweets}</span>
                        <span>💬 {topTweet.replies}</span>
                        <span>🔗 <a href={topTweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="underline">رابط</a></span>
                      </div>
                    </div>
                  );
                })()}
                {/* Most Famous Profile (use first tweet's user from API) */}
                {(() => {
                  if (!detailedAnalysis.length) return null;
                  const user = detailedAnalysis[0]?.metadata?.user;
                  return (
                    <div className="dashboard-card p-4 flex flex-col gap-2">
                      <div className="font-bold text-saudi-green mb-1">أشهر حساب</div>
                      <div className="flex items-center gap-2 mb-1">
                        <img src={user?.profile_image} alt={user?.full_name} className="w-8 h-8 rounded-full border object-cover" onError={e => { const target = e.target as HTMLImageElement; target.onerror = null; target.src = '/default-profile.png'; }} />
                        <span className="font-semibold">{user?.full_name}</span>
                        <span className="text-xs text-gray-500">@{user?.username}</span>
                      </div>
                      <div className="text-gray-700 text-sm mb-1">عدد المتابعين: {user?.followers_count}</div>
                      <div className="text-xs text-gray-500"><a href={`https://x.com/${user?.username}`} target="_blank" rel="noopener noreferrer" className="underline">زيارة الحساب</a></div>
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* Tweets Reel */}
            <div className="space-y-6">
              {tweets.map((tweet, idx) => {
                const detailedTweet = detailedAnalysis[idx];
                return (
                  <div key={tweet.id} className="dashboard-card flex flex-col md:flex-row gap-4 p-6 items-start">
                    <img 
                      src={detailedTweet?.metadata?.user?.profile_image} 
                      alt={detailedTweet?.metadata?.user?.full_name} 
                      className="w-14 h-14 rounded-full border-2 border-saudi-green object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-profile.png';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-saudi-green">{detailedTweet?.metadata?.user?.full_name}</span>
                        <span className="text-gray-500 text-xs">@{detailedTweet?.metadata?.user?.username}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sentimentBadgeClass(tweet.sentiment)}`}>{sentimentToArabic(tweet.sentiment)}</span>
                        <span className="text-gray-400 text-xs">
                          {detailedTweet?.metadata?.tweet?.date
                            ? new Date(detailedTweet.metadata.tweet.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                            : detailedTweet?.metadata?.tweet_date
                              ? new Date(detailedTweet.metadata.tweet_date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
                              : ''}
                        </span>
                      </div>
                      <div className="mb-2 text-lg whitespace-pre-line">{tweet.text}</div>
                      {/* Key Points as badges */}
                      {detailedTweet?.key_points && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {detailedTweet.key_points.map((point, i) => (
                            <span key={i} className="inline-block px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                              {point}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Media */}
                      {detailedTweet?.metadata?.media?.media_details && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {detailedTweet.metadata.media.media_details.map((m, i) => (
                            m.type === 'photo' ? (
                              <img 
                                key={i} 
                                src={m.media_url_https} 
                                alt={m.ext_alt_text || 'tweet media'} 
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            ) : m.type === 'video' ? (
                              <video 
                                key={i} 
                                controls 
                                className="w-48 h-32 rounded-lg border"
                                poster={m.media_url_https}
                              >
                                {m.video_info?.variants?.map((v, vi) => (
                                  v.content_type === 'video/mp4' && (
                                    <source key={vi} src={v.url} type="video/mp4" />
                                  )
                                ))}
                                متصفحك لا يدعم تشغيل الفيديو
                              </video>
                            ) : null
                          ))}
                        </div>
                      )}
                      {/* Engagement */}
                      <div className="flex gap-4 text-gray-500 text-sm mt-2">
                        <span>❤️ {detailedTweet?.engagement_metrics?.likes || 0}</span>
                        <span>🔁 {detailedTweet?.engagement_metrics?.retweets || 0}</span>
                        <span>💬 {detailedTweet?.engagement_metrics?.replies || 0}</span>
                        <span>🔗 <a href={detailedTweet?.metadata?.tweet_url} target="_blank" rel="noopener noreferrer" className="underline">رابط التغريدة</a></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <Footer />
      <RegistrationSteps 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)} 
      />
    </div>
  );
};

// --- TweetTimelineChart component ---
function TweetTimelineChart({ detailedAnalysis }) {
  const [mode, setMode] = React.useState<'day' | 'week' | 'month'>('day');
  // Prepare data
  const dates = detailedAnalysis.map(t => new Date(t.metadata.tweet?.date || t.metadata.tweet_date));
  if (!dates.length) return <div className="text-center text-gray-400">No data</div>;
  // Find min/max
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  // Data grouping
  let data = [];
  if (mode === 'day') {
    // Group by hour of the latest day
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const dayStr = latest.toISOString().slice(0, 10);
    const hours = Array(24).fill(0);
    detailedAnalysis.forEach(t => {
      const d = new Date(t.metadata.tweet?.date || t.metadata.tweet_date);
      if (d.toISOString().slice(0, 10) === dayStr) {
        hours[d.getHours()]++;
      }
    });
    data = hours.map((count, hour) => ({ label: `${hour}:00`, count, hour }));
  } else if (mode === 'week') {
    // Group by day for the latest 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(maxDate);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    data = days.map(dayStr => {
      const count = detailedAnalysis.filter(t => (t.metadata.tweet?.date || t.metadata.tweet_date).slice(0, 10) === dayStr).length;
      return { label: new Date(dayStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), count };
    });
  } else if (mode === 'month') {
    // Group by week for the latest 4 weeks
    const weeks = [];
    let start = new Date(maxDate);
    start.setDate(start.getDate() - 27);
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
    }
    data = weeks.map(({ start, end }) => {
      const count = detailedAnalysis.filter(t => {
        const d = new Date(t.metadata.tweet?.date || t.metadata.tweet_date);
        return d >= start && d <= end;
      }).length;
      return { label: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, count };
    });
  }
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const minCount = Math.min(...data.map(d => d.count));
  // SVG line chart dimensions
  const width = Math.max(data.length * 60, 320);
  const height = 120;
  const padding = 30;
  // Points for the line
  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - (d.count / maxCount) * (height - 2 * padding);
    return { ...d, x, y };
  });
  // Polyline points string
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  // Find high/low
  const maxIdx = points.findIndex(p => p.count === maxCount);
  const minIdx = points.findIndex(p => p.count === minCount);
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button className={`px-3 py-1 rounded ${mode === 'day' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`} onClick={() => setMode('day')}>Day (hourly)</button>
        <button className={`px-3 py-1 rounded ${mode === 'week' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`} onClick={() => setMode('week')}>Week (daily)</button>
        <button className={`px-3 py-1 rounded ${mode === 'month' ? 'bg-saudi-green text-white' : 'bg-gray-200'}`} onClick={() => setMode('month')}>Month (weekly)</button>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#ccc" strokeWidth="1" />
        {/* Line connecting points */}
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={polylinePoints} />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill="#3b82f6" />
        ))}
        {/* High/Low arrows */}
        {maxIdx !== -1 && (
          <g>
            <polygon points={`${points[maxIdx].x - 6},${points[maxIdx].y - 14} ${points[maxIdx].x + 6},${points[maxIdx].y - 14} ${points[maxIdx].x},${points[maxIdx].y - 2}`} fill="#16a34a" />
            <text x={points[maxIdx].x} y={points[maxIdx].y - 18} fontSize="11" textAnchor="middle" fill="#16a34a">Peak</text>
          </g>
        )}
        {minIdx !== -1 && (
          <g>
            <polygon points={`${points[minIdx].x - 6},${points[minIdx].y + 14} ${points[minIdx].x + 6},${points[minIdx].y + 14} ${points[minIdx].x},${points[minIdx].y + 2}`} fill="#ef4444" />
            <text x={points[minIdx].x} y={points[minIdx].y + 28} fontSize="11" textAnchor="middle" fill="#ef4444">Low</text>
          </g>
        )}
        {/* X labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - padding + 18} fontSize="11" textAnchor="middle" fill="#888">{p.label}</text>
        ))}
        {/* Y labels (max and min) */}
        <text x={padding - 8} y={padding + 4} fontSize="10" textAnchor="end" fill="#888">{maxCount}</text>
        <text x={padding - 8} y={height - padding + 4} fontSize="10" textAnchor="end" fill="#888">0</text>
      </svg>
    </div>
  );
}

export default Index;
