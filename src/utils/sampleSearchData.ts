
import { AnalysisOverviewData, Tweet } from '@/types/search';

// Sample tweets for tourism-related queries
const tourismTweets: Tweet[] = [
  {
    id: "t1",
    text: "تجربة رائعة في موسم الرياض! المرافق والخدمات تفوق التوقعات 🌟 #موسم_الرياض",
    user: {
      id: "u1",
      name: "محمد العتيبي",
      username: "@m_alotaibi",
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: true,
      followers: 52000
    },
    date: new Date().toISOString(),
    likes: 1200,
    retweets: 450,
    quotes: 50,
    replies: 80,
    sentiment: "positive",
    media: [
      {
        type: "image",
        url: "https://picsum.photos/800/600"
      }
    ]
  },
  {
    id: "t2",
    text: "العلا تستحق الزيارة! المواقع التاريخية والمناظر الطبيعية خلابة 🏺🌄 #السياحة_السعودية #العلا",
    user: {
      id: "u2",
      name: "سارة الشمري",
      username: "@sara_sh",
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      verified: false,
      followers: 15000
    },
    date: new Date().toISOString(),
    likes: 800,
    retweets: 320,
    quotes: 30,
    replies: 45,
    sentiment: "positive"
  },
  {
    id: "t3",
    text: "الخدمات السياحية في المملكة تتطور بشكل ملحوظ. نأمل المزيد من التحسينات في المواصلات 🚗 #السياحة_السعودية",
    user: {
      id: "u3",
      name: "فهد القحطاني",
      username: "@fahad_q",
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      verified: true,
      followers: 28000
    },
    date: new Date().toISOString(),
    likes: 600,
    retweets: 180,
    quotes: 25,
    replies: 40,
    sentiment: "neutral"
  }
];

const sampleData: Record<string, AnalysisOverviewData> = {
  "آراء السياحة في السعودية": {
    query: "آراء السياحة في السعودية",
    total: 15423,
    sentiment: {
      positive: 67,
      neutral: 23,
      negative: 10,
    },
    kpis: [
      { name: "متوسط المشاعر", value: "+0.67", change: 12, type: "sentiment" },
      { name: "عدد الإشارات", value: "15,423", change: 5, type: "mentions" },
      { name: "الموقع الرئيسي", value: "الرياض", type: "location" },
      { name: "عدد المؤثرين", value: "24", change: -3, type: "influencers" }
    ],
    timeline: [
      { date: "1 يناير", إيجابي: 4000, محايد: 2400, سلبي: 1200 },
      { date: "2 يناير", إيجابي: 3000, محايد: 1398, سلبي: 2000 },
      { date: "3 يناير", إيجابي: 2000, محايد: 9800, سلبي: 1000 }
    ],
    locations: [
      { name: "الرياض", value: 45 },
      { name: "جدة", value: 30 },
      { name: "الدمام", value: 25 }
    ],
    keywords: [
      { keyword: "سياحة", count: 2500, trend: "increase" },
      { keyword: "فنادق", count: 1800, trend: "increase" },
      { keyword: "مطاعم", count: 1200, trend: "neutral" }
    ],
    influencers: [
      { name: "محمد السياحي", followers: "1.2M", engagement: "5.4%", image: "https://randomuser.me/api/portraits/men/1.jpg" },
      { name: "سارة المسافرة", followers: "800K", engagement: "4.8%", image: "https://randomuser.me/api/portraits/women/2.jpg" }
    ],
    hashtags: [
      { tag: "#السياحة_السعودية", count: 5400, trend: "increase" },
      { tag: "#اكتشف_السعودية", count: 3200, trend: "increase" },
      { tag: "#وجهات_سياحية", count: 2800, trend: "neutral" }
    ]
  },
  "ملاحظات عن تجربة العلا": {
    query: "ملاحظات عن تجربة العلا",
    total: 8562,
    sentiment: {
      positive: 75,
      neutral: 20,
      negative: 5,
    },
    kpis: [
      { name: "متوسط المشاعر", value: "+0.85", change: 15, type: "sentiment" },
      { name: "عدد الإشارات", value: "8,562", change: 8, type: "mentions" },
      { name: "الموقع الرئيسي", value: "العلا", type: "location" },
      { name: "عدد المؤثرين", value: "18", change: 5, type: "influencers" }
    ],
    timeline: [
      { date: "1 يناير", إيجابي: 3000, محايد: 1200, سلبي: 300 },
      { date: "2 يناير", إيجابي: 3500, محايد: 1000, سلبي: 200 },
      { date: "3 يناير", إيجابي: 4000, محايد: 800, سلبي: 100 }
    ],
    locations: [
      { name: "العلا", value: 70 },
      { name: "المدينة", value: 20 },
      { name: "تبوك", value: 10 }
    ],
    keywords: [
      { keyword: "تراث", count: 1800, trend: "increase" },
      { keyword: "سياحة", count: 1500, trend: "increase" },
      { keyword: "تجربة", count: 1200, trend: "neutral" }
    ],
    influencers: [
      { name: "أحمد السياحي", followers: "950K", engagement: "6.2%", image: "https://randomuser.me/api/portraits/men/4.jpg" },
      { name: "نورة المسافرة", followers: "720K", engagement: "5.1%", image: "https://randomuser.me/api/portraits/women/5.jpg" }
    ],
    hashtags: [
      { tag: "#العلا", count: 4200, trend: "increase" },
      { tag: "#اكتشف_العلا", count: 2800, trend: "increase" },
      { tag: "#تراث_العلا", count: 2100, trend: "neutral" }
    ]
  },
  "تأثير موسم الرياض": {
    query: "تأثير موسم الرياض",
    total: 12845,
    sentiment: {
      positive: 72,
      neutral: 18,
      negative: 10,
    },
    kpis: [
      { name: "متوسط المشاعر", value: "+0.72", change: 10, type: "sentiment" },
      { name: "عدد الإشارات", value: "12,845", change: 15, type: "mentions" },
      { name: "الموقع الرئيسي", value: "الرياض", type: "location" },
      { name: "عدد المؤثرين", value: "32", change: 8, type: "influencers" }
    ],
    timeline: [
      { date: "1 يناير", إيجابي: 5000, محايد: 1500, سلبي: 500 },
      { date: "2 يناير", إيجابي: 5500, محايد: 1200, سلبي: 400 },
      { date: "3 يناير", إيجابي: 6000, محايد: 1000, سلبي: 300 }
    ],
    locations: [
      { name: "الرياض", value: 80 },
      { name: "القصيم", value: 12 },
      { name: "الخرج", value: 8 }
    ],
    keywords: [
      { keyword: "ترفيه", count: 3200, trend: "increase" },
      { keyword: "فعاليات", count: 2800, trend: "increase" },
      { keyword: "حفلات", count: 2200, trend: "neutral" }
    ],
    influencers: [
      { name: "خالد الترفيهي", followers: "1.5M", engagement: "7.2%", image: "https://randomuser.me/api/portraits/men/7.jpg" },
      { name: "ريم المطيري", followers: "980K", engagement: "6.5%", image: "https://randomuser.me/api/portraits/women/8.jpg" }
    ],
    hashtags: [
      { tag: "#موسم_الرياض", count: 8500, trend: "increase" },
      { tag: "#روح_الرياض", count: 5200, trend: "increase" },
      { tag: "#فعاليات_الرياض", count: 4100, trend: "neutral" }
    ]
  }
};

export const isSampleQuery = (query: string): boolean => {
  return query in sampleData;
};

export const getSampleData = (query: string): AnalysisOverviewData | null => {
  return sampleData[query] || null;
};

export const getSampleTweets = (query: string) => {
  return {
    total: tourismTweets.length,
    page: 1,
    pages: 1,
    tweets: tourismTweets
  };
};
