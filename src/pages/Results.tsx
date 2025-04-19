import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KPICards from '@/components/results/KPICards';
import ActionButtons from '@/components/results/ActionButtons';
import KeywordsTable from '@/components/results/KeywordsTable';
import InfluencersList from '@/components/results/InfluencersList';

// Sample data
const sentimentData = [
  { date: "1 يناير", إيجابي: 4000, محايد: 2400, سلبي: 1200 },
  { date: "2 يناير", إيجابي: 3000, محايد: 1398, سلبي: 2000 },
  { date: "3 يناير", إيجابي: 2000, محايد: 9800, سلبي: 1000 },
  { date: "4 يناير", إيجابي: 2780, محايد: 3908, سلبي: 800 },
  { date: "5 يناير", إيجابي: 1890, محايد: 4800, سلبي: 1500 },
  { date: "6 يناير", إيجابي: 2390, محايد: 3800, سلبي: 800 },
  { date: "7 يناير", إيجابي: 3490, محايد: 4300, سلبي: 700 },
];

const sentimentDistribution = [
  { name: "إيجابي", value: 67, color: "#4CAF50" },
  { name: "محايد", value: 23, color: "#FFC107" },
  { name: "سلبي", value: 10, color: "#F44336" },
];

const locationData = [
  { name: "الرياض", value: 45, color: "#2196F3" },
  { name: "العلا", value: 25, color: "#9C27B0" },
  { name: "جدة", value: 20, color: "#3F51B5" },
  { name: "أخرى", value: 10, color: "#607D8B" },
];

const keywordData = [
  { keyword: "ضيافة", count: 240, trend: "increase" },
  { keyword: "تراث", count: 185, trend: "increase" },
  { keyword: "تحديث", count: 142, trend: "neutral" },
  { keyword: "فعاليات", count: 118, trend: "increase" },
  { keyword: "ترفيه", count: 96, trend: "decrease" },
];

const influencerData = [
  { name: "محمد السعيد", followers: "1.2M", engagement: "5.4%", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { name: "سارة العتيبي", followers: "980K", engagement: "4.8%", image: "https://randomuser.me/api/portraits/women/2.jpg" },
  { name: "أحمد الشمري", followers: "780K", engagement: "6.2%", image: "https://randomuser.me/api/portraits/men/3.jpg" },
];

const Results = () => {
  const location = useLocation();
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [location.search]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    console.log("Searching for:", newQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <section className="pt-24 pb-6 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">نتائج البحث</h1>
            <p className="text-gray-600">{query ? `استعلام: "${query}"` : 'استخدم شريط البحث للحصول على تحليلات'}</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {query ? (
            <>
              <KPICards />
              <ActionButtons />
              
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="sentiment">تحليل المشاعر</TabsTrigger>
                  <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
                  <TabsTrigger value="influencers">المؤثرين</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="dashboard-card">
                    <h3 className="text-lg font-semibold mb-4">تتبع المشاعر عبر الوقت</h3>
                    <LineChart 
                      data={sentimentData} 
                      lines={[
                        { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
                        { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
                        { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
                      ]}
                      xAxisDataKey="date"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                      <PieChart data={sentimentDistribution} innerRadius={60} outerRadius={90} />
                    </div>
                    
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي</h3>
                      <PieChart data={locationData} innerRadius={60} outerRadius={90} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">الكلمات الرئيسية</h3>
                      <KeywordsTable data={keywordData} />
                    </div>
                    
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
                      <InfluencersList data={influencerData} />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sentiment">
                  <div className="text-center py-12">
                    <p className="text-gray-500">محتوى تحليل المشاعر التفصيلي سيظهر هنا</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="trends">
                  <div className="text-center py-12">
                    <p className="text-gray-500">محتوى تحليل الاتجاهات سيظهر هنا</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="influencers">
                  <div className="text-center py-12">
                    <p className="text-gray-500">محتوى تحليل المؤثرين سيظهر هنا</p>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">ابدأ البحث للحصول على تحليلات</h2>
              <p className="text-gray-500 mb-6">استخدم شريط البحث في الأعلى لإدخال استعلامك</p>
              <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                <button 
                  className="text-saudi-green border-saudi-green hover:bg-saudi-green hover:text-white"
                  onClick={() => handleSearch("آراء السياحة في السعودية")}
                >
                  جرب: آراء السياحة في السعودية
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <div className="flex-grow"></div>
      
      <Footer />
    </div>
  );
};

export default Results;
