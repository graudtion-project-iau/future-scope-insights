
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const SECTORS = [
  { value: "retail", label: "التجزئة" },
  { value: "technology", label: "التقنية" },
  { value: "healthcare", label: "الرعاية الصحية" },
  { value: "education", label: "التعليم" },
  { value: "entertainment", label: "الترفيه" },
  { value: "tourism", label: "السياحة" },
  { value: "sports", label: "الرياضة" },
  { value: "finance", label: "القطاع المالي" },
  { value: "energy", label: "الطاقة" }
];

const CITIES = [
  { value: "riyadh", label: "الرياض" },
  { value: "jeddah", label: "جدة" },
  { value: "makkah", label: "مكة المكرمة" },
  { value: "madinah", label: "المدينة المنورة" },
  { value: "dammam", label: "الدمام" },
  { value: "taif", label: "الطائف" },
  { value: "tabuk", label: "تبوك" },
  { value: "abha", label: "أبها" }
];

interface UserInterests {
  monitorType: string;
  businessName?: string;
  city?: string;
  sector?: string;
  socialMediaMonitoring: {
    accountAnalysis: boolean;
    tweetSearch: boolean;
    accountSummary: boolean;
  }
}

const InterestsSelection: React.FC = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<UserInterests>({
    monitorType: "business",
    businessName: "",
    city: "",
    sector: "",
    socialMediaMonitoring: {
      accountAnalysis: false,
      tweetSearch: false,
      accountSummary: false,
    }
  });

  const handleMonitorTypeChange = (value: string) => {
    setInterests({
      ...interests,
      monitorType: value,
    });
  };

  const handleSocialMediaOptionChange = (option: keyof typeof interests.socialMediaMonitoring) => {
    setInterests({
      ...interests,
      socialMediaMonitoring: {
        ...interests.socialMediaMonitoring,
        [option]: !interests.socialMediaMonitoring[option],
      },
    });
  };

  const handleSaveInterests = () => {
    // Get existing user info
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : {};
    
    // Save interests to localStorage
    localStorage.setItem("userInterests", JSON.stringify(interests));
    
    // Update user info with interests
    localStorage.setItem("userInfo", JSON.stringify({
      ...userInfo,
      interests
    }));
    
    // Redirect to dashboard
    navigate("/");
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">اختر اهتماماتك</h1>
          <p className="text-gray-600 mt-2">
            ساعدنا في تخصيص تجربتك من خلال اختيار المجالات التي تهتم بمتابعتها
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">ما الذي ترغب في مراقبته؟</h2>
            <RadioGroup 
              defaultValue={interests.monitorType}
              onChange={(e) => handleMonitorTypeChange(e.target.value)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business">مشروعي / علامتي التجارية</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="city" id="city" />
                  <Label htmlFor="city">مدينتي</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="sector" id="sector" />
                  <Label htmlFor="sector">قطاع محدد</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {interests.monitorType === "business" && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">اسم المشروع أو العلامة التجارية</h2>
              <Input 
                placeholder="أدخل اسم مشروعك أو علامتك التجارية" 
                value={interests.businessName || ""}
                onChange={(e) => setInterests({...interests, businessName: e.target.value})}
              />
            </div>
          )}

          {interests.monitorType === "city" && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">اختر المدينة</h2>
              <Select 
                value={interests.city || ""} 
                onValueChange={(value) => setInterests({...interests, city: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر المدينة" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {interests.monitorType === "sector" && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-700">اختر القطاع</h2>
              <Select 
                value={interests.sector || ""} 
                onValueChange={(value) => setInterests({...interests, sector: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القطاع" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">خيارات المراقبة على وسائل التواصل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="accountAnalysis" 
                  checked={interests.socialMediaMonitoring.accountAnalysis}
                  onCheckedChange={() => handleSocialMediaOptionChange("accountAnalysis")}
                />
                <Label htmlFor="accountAnalysis">تحليل الحسابات المؤثرة</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="tweetSearch" 
                  checked={interests.socialMediaMonitoring.tweetSearch}
                  onCheckedChange={() => handleSocialMediaOptionChange("tweetSearch")}
                />
                <Label htmlFor="tweetSearch">البحث في التغريدات</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="accountSummary" 
                  checked={interests.socialMediaMonitoring.accountSummary}
                  onCheckedChange={() => handleSocialMediaOptionChange("accountSummary")}
                />
                <Label htmlFor="accountSummary">ملخص لمحتوى الحسابات</Label>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSaveInterests} 
            className="w-full bg-green-600 hover:bg-green-700 mt-6"
          >
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterestsSelection;
