
// Mock data for API fallbacks
const mockData = {
  searchResults: {
    query: "Tourism opinions in Saudi Arabia",
    timestamp: new Date().toISOString(),
    results: [
      {
        id: "1",
        title: "Positive feedback on AlUla historical sites",
        source: "Twitter",
        sentiment: "positive",
        mentions: 234,
        topics: ["tourism", "history", "culture"],
        languages: ["en", "ar", "fr"]
      },
      {
        id: "2",
        title: "Review of Riyadh Season entertainment events",
        source: "Instagram",
        sentiment: "positive",
        mentions: 189,
        topics: ["entertainment", "events", "tourism"],
        languages: ["en", "ar"]
      },
      {
        id: "3",
        title: "Feedback on hotel services in Jeddah",
        source: "TripAdvisor",
        sentiment: "neutral",
        mentions: 67,
        topics: ["accommodation", "services"],
        languages: ["en", "ar", "de"]
      }
    ],
    summary: {
      total: 3,
      sentiments: {
        positive: 2,
        neutral: 1,
        negative: 0
      }
    }
  },
  
  userProfile: {
    id: "user123",
    name: "Mohammed Abdullah",
    email: "mohammed@example.com",
    phone: "05xxxxxxxx",
    interests: ["tourism", "sports", "culture"],
    preferences: {
      notifications: {
        email: true,
        sms: false,
        whatsapp: true
      },
      frequency: "daily"
    }
  },

  reportDetails: {
    id: "report123",
    title: "Tourism Sentiment Analysis Q2 2023",
    createdAt: "2023-06-30T10:00:00Z",
    summary: "Overall positive sentiment with notable increase in mentions of cultural tourism",
    metrics: {
      mentions: "15.3K",
      reach: "2.4M",
      sentiment: "78% positive"
    },
    sentimentData: [
      { name: 'Positive', value: 78, color: '#4CAF50' },
      { name: 'Neutral', value: 15, color: '#FFC107' },
      { name: 'Negative', value: 7, color: '#FF5722' }
    ],
    topKeywords: ["culture", "heritage", "experience", "authentic", "hospitality"],
    languageBreakdown: [
      { name: 'Arabic', value: 45, color: '#2196F3' },
      { name: 'English', value: 32, color: '#9C27B0' },
      { name: 'French', value: 10, color: '#FF9800' },
      { name: 'German', value: 8, color: '#607D8B' },
      { name: 'Other', value: 5, color: '#795548' }
    ],
    timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2023, 5, i + 1).toISOString().split('T')[0],
      mentions: Math.floor(300 + Math.random() * 700)
    }))
  },
  
  caseStudies: [
    {
      id: "case1",
      title: "مباراة السعودية والأرجنتين 🇸🇦 🇦🇷",
      description: "تحليل شامل لردود الفعل العالمية على مباراة كأس العالم التاريخية",
      metrics: {
        mentions: "2.5M+",
        languages: "20+",
        sentiment: "93% إيجابي"
      }
    },
    {
      id: "case2",
      title: "حادث الانفجار في الخبر 🚨",
      description: "نظام إنذار فوري عبر البريد الإلكتروني والواتساب للأحداث الطارئة",
      metrics: {
        responseTime: "< 2 دقيقة",
        accuracy: "99.9%",
        alerts: "متعددة القنوات"
      }
    },
    {
      id: "case3",
      title: "موسم الرياض 2023 🎭",
      description: "تحليل آراء الزوار والتفاعلات على وسائل التواصل الاجتماعي",
      metrics: {
        visitors: "1.2M+",
        posts: "450K+",
        engagement: "3.7M+"
      }
    }
  ],
  
  interests: [
    { id: "tourism", label: "السياحة والترفيه", icon: "map" },
    { id: "sports", label: "الرياضة", icon: "trophy" },
    { id: "economy", label: "الاقتصاد والأعمال", icon: "trending-up" },
    { id: "tech", label: "التقنية والابتكار", icon: "cpu" },
    { id: "culture", label: "الثقافة والفنون", icon: "palette" },
    { id: "education", label: "التعليم", icon: "book" },
    { id: "health", label: "الصحة", icon: "activity" },
    { id: "events", label: "الفعاليات والمناسبات", icon: "calendar" }
  ],
  
  registrationResponse: {
    success: true,
    message: "تم التسجيل بنجاح",
    userId: "user_123456",
    requiresVerification: true
  },
  
  verifyOtpResponse: {
    success: true,
    message: "تم التحقق بنجاح",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
};

export default mockData;
