
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import SearchBar from '@/components/SearchBar';
import KPICards from '@/components/results/KPICards';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Future Scope Insights - تحليل وسائل التواصل الاجتماعي" 
        description="منصة متقدمة لتحليل وسائل التواصل الاجتماعي باستخدام الذكاء الاصطناعي"
      />
      
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">التقارير</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              اكتشف رؤى قيمة من خلال تحليل البيانات الاجتماعية
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <KPICards />
            
            <div className="text-center mt-12">
              <Button onClick={() => handleSearch("موسم الرياض")}>
                ابدأ التحليل
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
