
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart3, Globe2, Users, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  const handleExampleClick = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute right-0 top-20 w-72 h-72 rounded-full bg-saudi-green opacity-20 blur-3xl animate-pulse-soft"></div>
          <div className="absolute left-0 bottom-20 w-72 h-72 rounded-full bg-saudi-gold opacity-20 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient animate-slide-up font-cairo">
              راقب الحياة الواقعية، وحول البيانات إلى رؤى 🚀
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              استخدم منصة FutureVision لتحليل محتوى وسائل التواصل الاجتماعي والحصول على رؤى قيمة بأكثر من 50 لغة
            </p>
            
            <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <SearchBar large={true} />
            </div>
            
            <div className="text-sm text-gray-500 animate-slide-up" style={{ animationDelay: '0.6s' }}>
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
      
      {/* Features Section */}
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
      
      {/* CTA Section */}
      <section className="py-16 bg-saudi-green text-white px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع FutureVision اليوم</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            انضم إلى آلاف العملاء الذين يستخدمون منصتنا للحصول على رؤى قيمة من بيانات وسائل التواصل الاجتماعي
          </p>
          <Button className="bg-white text-saudi-green hover:bg-saudi-gold hover:text-white transition-all px-8 py-6 text-lg rounded-full shadow-lg">
            سجل الآن مجاناً
          </Button>
        </div>
      </section>
      
      {/* FAQ Section */}
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
