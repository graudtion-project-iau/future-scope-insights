
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, Users, MapPin, BarChart2, Filter, Download, Share2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import DataCard from '@/components/DataCard';
import LineChart from '@/components/charts/LineChart';
import PieChart from '@/components/charts/PieChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    // Here you would typically make an API call with the new query
    // and update the page data based on the response
    console.log("Searching for:", newQuery);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Search Section */}
      <section className="pt-24 pb-6 px-4 bg-white border-b">
        <div className="container mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">نتائج البحث</h1>
            <p className="text-gray-600">{query ? `استعلام: "${query}"` : 'استخدم شريط البحث للحصول على تحليلات'}</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      
      {/* Results Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          {query ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DataCard 
                  title="متوسط المشاعر" 
                  value="+0.67" 
                  icon={<Activity className="h-5 w-5" />} 
                  change={{ value: 12, type: 'increase' }}
                />
                <DataCard 
                  title="عدد الإشارات" 
                  value="1,200" 
                  icon={<BarChart2 className="h-5 w-5" />} 
                  change={{ value: 5, type: 'increase' }}
                />
                <DataCard 
                  title="الموقع الرئيسي" 
                  value="الرياض" 
                  icon={<MapPin className="h-5 w-5" />} 
                />
                <DataCard 
                  title="عدد المؤثرين" 
                  value="24" 
                  icon={<Users className="h-5 w-5" />} 
                  change={{ value: 3, type: 'decrease' }}
                />
              </div>
              
              {/* Filters & Actions */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex space-x-2 rtl:space-x-reverse mb-4 sm:mb-0">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    تصفية النتائج
                  </Button>
                  <Button variant="outline" className="hidden sm:flex items-center gap-2">
                    آخر 24 ساعة
                  </Button>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    تحميل التقرير
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
                  <TabsTrigger value="sentiment">تحليل المشاعر</TabsTrigger>
                  <TabsTrigger value="trends">الاتجاهات</TabsTrigger>
                  <TabsTrigger value="influencers">المؤثرين</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  {/* Sentiment Over Time Chart */}
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
                  
                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sentiment Distribution */}
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">توزيع المشاعر</h3>
                      <PieChart data={sentimentDistribution} innerRadius={60} outerRadius={90} />
                    </div>
                    
                    {/* Location Distribution */}
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">التوزيع الجغرافي</h3>
                      <PieChart data={locationData} innerRadius={60} outerRadius={90} />
                    </div>
                  </div>
                  
                  {/* Key Insights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Keywords */}
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">الكلمات الرئيسية</h3>
                      <div className="overflow-hidden">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الكلمة</th>
                              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">التكرار</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">الاتجاه</th>
                            </tr>
                          </thead>
                          <tbody>
                            {keywordData.map((keyword, index) => (
                              <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
                                <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">{keyword.count}</td>
                                <td className="px-4 py-3 text-left whitespace-nowrap text-sm">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    keyword.trend === 'increase' 
                                    ? 'bg-green-100 text-green-800' 
                                    : keyword.trend === 'decrease' 
                                      ? 'bg-red-100 text-red-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {keyword.trend === 'increase' 
                                      ? '↑ متزايد' 
                                      : keyword.trend === 'decrease' 
                                        ? '↓ متناقص' 
                                        : '− ثابت'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {/* Top Influencers */}
                    <div className="dashboard-card">
                      <h3 className="text-lg font-semibold mb-4">أبرز المؤثرين</h3>
                      <div className="space-y-4">
                        {influencerData.map((influencer, index) => (
                          <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <img 
                              src={influencer.image} 
                              alt={influencer.name} 
                              className="w-12 h-12 rounded-full object-cover border-2 border-saudi-green"
                            />
                            <div className="ml-4 mr-auto">
                              <div className="font-medium">{influencer.name}</div>
                              <div className="text-sm text-gray-500">{influencer.followers} متابع</div>
                            </div>
                            <div className="text-sm font-medium text-saudi-green bg-saudi-green/10 px-3 py-1 rounded-full">
                              {influencer.engagement} تفاعل
                            </div>
                          </div>
                        ))}
                      </div>
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
                <Button 
                  variant="outline"
                  className="text-saudi-green border-saudi-green hover:bg-saudi-green hover:text-white"
                  onClick={() => handleSearch("آراء السياحة في السعودية")}
                >
                  جرب: آراء السياحة في السعودية
                </Button>
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
