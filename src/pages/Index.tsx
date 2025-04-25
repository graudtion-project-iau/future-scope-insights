
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SearchBar from '@/components/SearchBar';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="relative bg-gradient-to-b from-white to-gray-50 pt-32 pb-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 heading-gradient">
              تحليل المشاعر على تويتر
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              احصل على تحليل عميق للمشاعر والتوجهات في تويتر عبر محرك ذكاء اصطناعي متقدم
            </p>
            
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                {
                  title: "السعودية الأرجنتين",
                  desc: "تحليل تفاعلات كأس العالم",
                  color: "bg-green-50 hover:bg-green-100 text-green-700"
                },
                {
                  title: "انفجار الخبر",
                  desc: "تحليل حدث أمني",
                  color: "bg-blue-50 hover:bg-blue-100 text-blue-700"
                },
                {
                  title: "موسم الرياض",
                  desc: "تحليل فعالية ترفيهية",
                  color: "bg-purple-50 hover:bg-purple-100 text-purple-700"
                }
              ].map((sample, index) => (
                <button 
                  key={index}
                  onClick={() => handleSearch(sample.title)}
                  className={`p-4 rounded-xl ${sample.color} transition-all duration-300 shadow-sm hover:shadow-md`}
                >
                  <h3 className="font-semibold mb-1">{sample.title}</h3>
                  <p className="text-sm opacity-75">{sample.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(5,162,80,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(5,162,80,0.05),transparent_50%)]"></div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
