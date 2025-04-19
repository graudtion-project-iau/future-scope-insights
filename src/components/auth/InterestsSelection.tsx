
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

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

interface UserInterests {
  monitorType: string;
  businessName?: string;
  city?: string;
  sector?: string;
  keywords: string[];
  accountsToMonitor: string[];
  socialMediaMonitoring: {
    accountAnalysis: boolean;
    tweetSearch: boolean;
    accountSummary: boolean;
  }
}

const InterestsSelection = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<UserInterests>({
    monitorType: "business",
    keywords: [],
    accountsToMonitor: [],
    socialMediaMonitoring: {
      accountAnalysis: false,
      tweetSearch: false,
      accountSummary: false,
    }
  });
  
  const [newKeyword, setNewKeyword] = useState("");
  const [newAccount, setNewAccount] = useState("");

  const handleAddKeyword = () => {
    if (newKeyword && interests.keywords.length < 5) {
      setInterests(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword]
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setInterests(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const handleAddAccount = () => {
    if (newAccount) {
      setInterests(prev => ({
        ...prev,
        accountsToMonitor: [...prev.accountsToMonitor, newAccount]
      }));
      setNewAccount("");
    }
  };

  const handleRemoveAccount = (index: number) => {
    setInterests(prev => ({
      ...prev,
      accountsToMonitor: prev.accountsToMonitor.filter((_, i) => i !== index)
    }));
  };

  const handleSocialMediaOptionChange = (option: keyof typeof interests.socialMediaMonitoring) => {
    setInterests(prev => ({
      ...prev,
      socialMediaMonitoring: {
        ...prev.socialMediaMonitoring,
        [option]: !prev.socialMediaMonitoring[option],
      },
    }));
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">اختر اهتماماتك</h1>
          <p className="text-gray-600">
            ساعدنا في تخصيص تجربتك من خلال اختيار المجالات التي تهتم بمتابعتها
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">الكلمات المفتاحية للمراقبة</h2>
            <div className="flex gap-2">
              <Input 
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="أضف كلمة مفتاحية"
                className="flex-1"
              />
              <Button 
                onClick={handleAddKeyword}
                disabled={interests.keywords.length >= 5}
                className="bg-green-600 hover:bg-green-700"
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.keywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(index)}
                    className="hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {interests.keywords.length >= 5 && (
              <p className="text-amber-600 text-sm">يمكنك إضافة 5 كلمات مفتاحية كحد أقصى</p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">حسابات للمراقبة والتحليل</h2>
            <div className="flex gap-2">
              <Input 
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                placeholder="@username"
                className="flex-1"
              />
              <Button 
                onClick={handleAddAccount}
                className="bg-green-600 hover:bg-green-700"
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {interests.accountsToMonitor.map((account, index) => (
                <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <span>{account}</span>
                  <button
                    onClick={() => handleRemoveAccount(index)}
                    className="hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">خيارات المراقبة والتحليل</h2>
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
