import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, Globe2, Users, ChevronDown, Bell, Mail, Shield, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import TeamMember from '@/components/TeamMember';
import CaseStudy from '@/components/CaseStudy';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const handleExampleClick = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  const teamMembers = [
    {
      name: "حاتم العتيبي",
      role: "Full Stack & AI Engineer",
      description: "مطور متكامل مع خبرة في الذكاء الاصطناعي. ساهم في تطوير واجهة المستخدم والخلفية، مع تخصص في هندسة عكسية لـ Twitter API وتقنيات استخراج البيانات.",
      image: "/team/hatem.jpg"
    },
    {
      name: "عمر الصحفي",
      role: "AI Engineer",
      description: "مهندس ذكاء اصطناعي متخصص في تطوير خوارزميات التعلم الآلي ومعالجة اللغات الطبيعية لتحليل وفهم المحتوى عبر منصات التواصل الاجتماعي.",
      image: "/team/omar.jpg"
    },
    {
      name: "مشاري التميمي",
      role: "Data Engineer",
      description: "خبير في تحليل البيانات وتطوير خطوط معالجة البيانات. متخصص في بناء أنظمة معالجة البيانات الضخمة وتحويلها إلى رؤى قابلة للتنفيذ.",
      image: "/team/meshari.jpg"
    },
    {
      name: "عبدالرحمن",
      role: "Data Analyst",
      description: "متخصص في استخراج وتحليل البيانات، مع خبرة في تطوير حلول Web Scraping وتحليل البيانات المجمعة لاستخراج الرؤى القيمة.",
      image: "/team/abdulrahman.jpg"
    },
    {
      name: "نايف الصحفي",
      role: "Design Engineer",
      description: "مهندس تصميم وواجهة أمامية، متخصص في إنشاء تجارب مستخدم جذابة وسلسة مع التركيز على التصميم التفاعلي.",
      image: "/team/naif.jpg"
    }
  ];

  const caseStudies = [
    {
      title: "مباراة السعودية والأرجنتين 🇸🇦 🇦🇷",
      description: "تحليل شامل لردود الفعل العالمية على مباراة كأس العالم التاريخية، مع تغطية لأكثر من 20 لغة وتحليل المشاعر العالمية.",
      metrics: {
        mentions: "2.5M+",
        languages: "20+",
        sentiment: "93% إيجابي"
      },
      detailedReport: {
        sentimentData: [
          { name: 'إيجابي', value: 93, color: '#4CAF50' },
          { name: 'محايد', value: 5, color: '#FFC107' },
          { name: 'سلبي', value: 2, color: '#FF5722' }
        ],
        languageBreakdown: [
          { name: 'العربية', value: 45, color: '#2196F3' },
          { name: 'الإنجليزية', value: 30, color: '#9C27B0' },
          { name: 'الإسبانية', value: 15, color: '#FF9800' },
          { name: 'أخرى', value: 10, color: '#607D8B' }
        ],
        timeSeriesData: [
          { time: '0h', mentions: 100000 },
          { time: '6h', mentions: 500000 },
          { time: '12h', mentions: 1500000 },
          { time: '24h', mentions: 2500000 }
        ],
        topKeywords: ['تاريخي', 'إنجاز', 'فخر', 'أبطال', 'معجزة']
      }
    },
    {
      title: "حادث الانفجار في الخبر 🚨",
      description: "نظام إنذار فوري عبر البريد الإلكتروني والواتساب للأحداث الطارئة، مع تحليل مباشر للمعلومات وتأكيد مصادرها.",
      metrics: {
        responseTime: "< 2 دقيقة",
        accuracy: "99.9%",
        alerts: "متعددة القنوات"
      },
      detailedReport: {
        timeline: [
          { time: "18:30", event: "سماع صوت الانفجار" },
          { time: "18:32", event: "إرسال تنبيهات أولية" },
          { time: "18:45", event: "تأكيد: مناورة تدريبية" }
        ],
        locationData: [
          { name: 'الخبر', value: 60, color: '#2196F3' },
          { name: 'بقيق', value: 25, color: '#4CAF50' },
          { name: 'الظهران', value: 15, color: '#FF9800' }
        ],
        mentionsTimeline: [
          { time: '18:30', mentions: 50 },
          { time: '18:45', mentions: 300 },
          { time: '19:00', mentions: 150 },
          { time: '19:15', mentions: 75 }
        ],
        verificationStatus: "تم التأكد: مناورة تدريبية عسكرية"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute animate-float opacity-10 top-20 right-10 text-6xl">🔍</div>
          <div className="absolute animate-float opacity-10 bottom-20 left-10 text-6xl" style={{ animationDelay: "1s" }}>📊</div>
          <div className="absolute animate-float opacity-10 top-40 left-1/4 text-6xl" style={{ animationDelay: "1.5s" }}>📱</div>
          <div className="absolute animate-float opacity-10 bottom-40 right-1/4 text-6xl" style={{ animationDelay: "2s" }}>💡</div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient animate-slide-up font-cairo">
              نظام ذكي لمراقبة وتحليل<br />
              <span className="text-saudi-green">نبض مدينتك 🌟</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              اكتشف الأحداث المهمة فور وقوعها. إشعارات فورية عبر البريد والواتساب لكل ما يهم عملك ومدينتك.
              تحليل ذكي بأكثر من ٢٠ لغة لفهم ومراقبة كل ما يدور حولك.
            </p>
            
            <div className="flex gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button className="btn-saudi gap-2">
                <Bell className="w-4 h-4" />
                أعلمني فوراً
              </Button>
              <Button variant="outline" className="btn-saudi-outlined gap-2">
                <Search className="w-4 h-4" />
                جرب الآن
              </Button>
            </div>

            <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <SearchBar large={true} />
            </div>
            
            <div className="text-sm text-gray-500 animate-slide-up" style={{ animationDelay: "0.8s" }}>
              <p className="mb-2">جرب بعض الأمثلة:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button 
                  className="px-3 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-saudi-green hover:text-white hover:border-saudi-green transition-all shadow-sm"
                  onClick={() => handleExampleClick("آراء السياحة في السعودية")}
                >
                  آراء السياحة في السعودية
                </button>
                <button 
                  className="px-3 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-saudi-green hover:text-white hover:border-saudi-green transition-all shadow-sm"
                  onClick={() => handleExampleClick("ملاحظات عن تجربة العلا")}
                >
                  ملاحظات عن تجربة العلا
                </button>
                <button 
                  className="px-3 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-saudi-green hover:text-white hover:border-saudi-green transition-all shadow-sm"
                  onClick={() => handleExampleClick("تأثير موسم الرياض")}
                >
                  تأثير موسم الرياض
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center heading-gradient">أحداث حقيقية تم تحليلها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <CaseStudy key={index} {...study} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center heading-gradient">
            فريق التطوير - جامعة الإمام عبدالرحمن بن فيصل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-gradient">المميزات الرئيسية</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              توفر منصة FutureVision مجموعة واسعة من الأدوات التحليلية المبتكرة لمساعدتك على فهم العالم الرقمي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="dashboard-card animate-scale-in">
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-saudi-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تحليل المشاعر</h3>
              <p className="text-gray-600">تعرف على مشاعر الجمهور وآرائهم من خلال تحليل دقيق للمحتوى</p>
            </div>
            
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-saudi-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تحليل الاتجاهات</h3>
              <p className="text-gray-600">راقب الاتجاهات الناشئة والموضوعات الشائعة في الزمن الحقيقي</p>
            </div>
            
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6 text-saudi-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تغطية عالمية</h3>
              <p className="text-gray-600">استفد من تحليل البيانات بأكثر من 50 لغة من مختلف أنحاء العالم</p>
            </div>
            
            <div className="dashboard-card animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-saudi-green/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-saudi-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2">تحليل المؤثرين</h3>
              <p className="text-gray-600">تعرف على أهم المؤثرين وتأثيرهم على المحادثات والاتجاهات</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-saudi-green text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع FutureVision اليوم</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            انضم إلى آلاف العملاء الذين يستخدمون منصتنا للحصول على رؤى قيمة من بيانات و��ائل التواصل الاجتماعي
          </p>
          <Button className="bg-white text-saudi-green hover:bg-saudi-gold hover:text-white transition-all px-8 py-6 text-lg rounded-full shadow-lg">
            سجل الآن مجاناً
          </Button>
        </div>
      </section>
      
      <section className="py-16 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-gradient">الأسئلة الشائعة</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              إليك إجابات على بعض الأسئلة الأكثر شيوعاً حول منصة FutureVision
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="dashboard-card cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">كيف يمكنني البدء باستخدام المنصة؟</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
                <div className="mt-2 text-gray-600">
                  ببساطة قم بإنشاء حساب جديد، واختر الخطة المناسبة، ثم ابدأ البحث واستكشاف البيانات والرؤى التحليلية.
                </div>
              </div>
              
              <div className="dashboard-card cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">ما هي مصادر البيانات التي تعتمد عليها المنصة؟</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
                <div className="mt-2 text-gray-600">
                  تجمع منصتنا البيانات من مختلف منصات التواصل الاجتماعي مثل X، Reddit، Meta، وGoogle Search، مما يضمن تغطية شاملة.
                </div>
              </div>
              
              <div className="dashboard-card cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">كم عدد اللغات المدعومة في المنصة؟</h3>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
                <div className="mt-2 text-gray-600">
                  تدعم منصتنا أكثر من 50 لغة حول العالم، مما يتيح لك تحليل المحتوى والحصول على رؤى من مختلف الثقافات واللغات.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
