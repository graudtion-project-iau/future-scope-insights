
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import SearchBar from '@/components/SearchBar';
import KPICards from '@/components/results/KPICards';
import { sampleReports } from '@/components/data/sampleReports';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  // Get 3 random reports from the sample data
  const randomReports = React.useMemo(() => {
    const shuffled = [...sampleReports].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

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
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
                <span>جرب: </span>
                <button onClick={() => handleSearch("السعودية الأرجنتين")} className="hover:text-saudi-green">السعودية الأرجنتين</button>
                <span>•</span>
                <button onClick={() => handleSearch("انفجار الخبر")} className="hover:text-saudi-green">انفجار الخبر</button>
                <span>•</span>
                <button onClick={() => handleSearch("موسم الرياض")} className="hover:text-saudi-green">موسم الرياض</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <KPICards />
            
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">أحداث حقيقية تم تحليلها</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {randomReports.map((report, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{report.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{report.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {Object.entries(report.metrics).slice(0, 4).map(([key, value], idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-lg font-semibold text-saudi-green">{value}</div>
                            <div className="text-sm text-gray-500">{key}</div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        onClick={() => navigate(`/results?q=${encodeURIComponent(report.title)}`)}
                        className="w-full bg-saudi-green hover:bg-saudi-green/90"
                      >
                        عرض التقرير الكامل
                        <ArrowRight className="mr-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
