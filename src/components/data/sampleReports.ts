
interface SampleReport {
  title: string;
  description: string;
  metrics: {
    [key: string]: string;
  };
}

export const sampleReports: SampleReport[] = [
  {
    title: "السعودية الأرجنتين",
    description: "تحليل شامل لتفاعلات الجمهور حول مباراة السعودية والأرجنتين في كأس العالم",
    metrics: {
      "المشاعر": "+0.82",
      "الإشارات": "125K",
      "التفاعل": "93%",
      "المؤثرين": "1.2K"
    }
  },
  {
    title: "Superbowl LVIII",
    description: "Analysis of social media engagement during Super Bowl LVIII between Kansas City Chiefs and San Francisco 49ers",
    metrics: {
      "Sentiment": "+0.65",
      "Mentions": "2.1M",
      "Engagement": "87%",
      "Influencers": "3.5K"
    }
  },
  {
    title: "موسم الرياض 2024",
    description: "رصد وتحليل التفاعلات حول فعاليات وأنشطة موسم الرياض",
    metrics: {
      "المشاعر": "+0.75",
      "الإشارات": "89K",
      "التفاعل": "91%",
      "المؤثرين": "2.1K"
    }
  },
  {
    title: "US Elections 2024",
    description: "Comprehensive analysis of social media discussions around the 2024 US Presidential Elections",
    metrics: {
      "Sentiment": "-0.15",
      "Mentions": "4.2M",
      "Engagement": "89%",
      "Influencers": "5.7K"
    }
  },
  {
    title: "Saudi National Day 2024",
    description: "Analysis of social media celebrations and engagement during the Saudi National Day",
    metrics: {
      "Sentiment": "+0.88",
      "Mentions": "320K",
      "Engagement": "94%",
      "Influencers": "1.8K"
    }
  },
  {
    title: "COP28 Dubai",
    description: "Social media sentiment analysis of discussions around climate change during COP28 in Dubai",
    metrics: {
      "Sentiment": "+0.22",
      "Mentions": "890K",
      "Engagement": "76%",
      "Influencers": "2.4K"
    }
  },
  {
    title: "FIFA World Cup Qatar",
    description: "Social media analysis of fan reactions and engagement during the FIFA World Cup in Qatar",
    metrics: {
      "Sentiment": "+0.70",
      "Mentions": "3.1M",
      "Engagement": "92%",
      "Influencers": "4.6K"
    }
  },
  {
    title: "Tokyo Olympics 2021",
    description: "Analysis of global social media conversations during the Tokyo Olympic Games",
    metrics: {
      "Sentiment": "+0.53",
      "Mentions": "2.8M",
      "Engagement": "84%",
      "Influencers": "3.2K"
    }
  },
  {
    title: "NEOM Project",
    description: "تحليل المحادثات على مواقع التواصل الاجتماعي حول مشروع نيوم في المملكة العربية السعودية",
    metrics: {
      "المشاعر": "+0.68",
      "الإشارات": "450K",
      "التفاعل": "89%",
      "المؤثرين": "1.5K"
    }
  },
  {
    title: "قمة العشرين في الرياض",
    description: "تحليل التفاعلات العالمية حول استضافة المملكة لقمة مجموعة العشرين",
    metrics: {
      "المشاعر": "+0.54",
      "الإشارات": "780K",
      "التفاعل": "82%",
      "المؤثرين": "2.3K"
    }
  },
  {
    title: "Taylor Swift Eras Tour",
    description: "Analysis of fan engagement and sentiment during Taylor Swift's record-breaking Eras Tour",
    metrics: {
      "Sentiment": "+0.92",
      "Mentions": "1.6M",
      "Engagement": "96%",
      "Influencers": "2.8K"
    }
  },
  {
    title: "F1 Saudi Arabian Grand Prix",
    description: "Social media analysis of the Formula 1 Saudi Arabian Grand Prix in Jeddah",
    metrics: {
      "Sentiment": "+0.63",
      "Mentions": "520K",
      "Engagement": "90%",
      "Influencers": "1.4K"
    }
  },
  {
    title: "انفجار الخبر",
    description: "تحليل التفاعلات والأخبار حول حادثة انفجار الخبر وتداعياتها على وسائل التواصل",
    metrics: {
      "المشاعر": "-0.31",
      "الإشارات": "45K",
      "التفاعل": "87%",
      "المؤثرين": "820"
    }
  }
];
