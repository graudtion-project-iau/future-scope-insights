
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import SearchBar from '@/components/SearchBar';
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Future Vision - تحليل وسائل التواصل الاجتماعي" 
        description="منصة متقدمة لتحليل وسائل التواصل الاجتماعي باستخدام الذكاء الاصطناعي"
      />
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-saudi-green/10 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-saudi-green to-saudi-gold bg-clip-text text-transparent">
                مراقبة ذكية لكل ما يهمك
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                نظام متكامل لمراقبة وتحليل المحتوى من أكثر من 5 مصادر رئيسية. تحليل فوري للأحداث مع تنبيهات مباشرة.
              </p>
              <div className="max-w-2xl mx-auto">
                <SearchBar large />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">مميزات المنصة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-saudi-green/10 flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-saudi-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">تحليل فوري</h3>
                  <p className="text-gray-600">
                    تحليل مباشر للمحتوى باستخدام الذكاء الاصطناعي مع تقارير تفصيلية
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-saudi-green/10 flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-saudi-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">تنبيهات مخصصة</h3>
                  <p className="text-gray-600">
                    إعداد تنبيهات مخصصة لمتابعة الأحداث والمواضيع التي تهمك
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-saudi-green/10 flex items-center justify-center mb-4">
                    <ArrowRight className="h-6 w-6 text-saudi-green" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">تحليل المشاعر</h3>
                  <p className="text-gray-600">
                    تحليل مشاعر المجتمع تجاه المواضيع المختلفة بدقة عالية
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-saudi-green to-saudi-green/80 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">ابدأ الآن مع Future Vision</h2>
            <p className="text-xl mb-8 text-white/90">
              اكتشف قوة التحليل الذكي للمحتوى وخذ قرارات مدروسة
            </p>
            <Button 
              size="lg"
              className="bg-white text-saudi-green hover:bg-white/90"
              onClick={() => window.location.href = '/register'}
            >
              سجل الآن مجاناً
              <ArrowRight className="mr-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
