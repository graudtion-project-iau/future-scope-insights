
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RegistrationStepsProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationSteps = ({ isOpen, onClose }: RegistrationStepsProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'interests' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [messagePreference, setMessagePreference] = useState('instant');
  const { toast } = useToast();

  const validateSaudiPhone = (phone: string) => {
    const saudiRegex = /^(05)[0-9]{8}$/;
    return saudiRegex.test(phone);
  };

  const handlePhoneSubmit = () => {
    if (!validateSaudiPhone(phoneNumber)) {
      toast({
        title: "خطأ في رقم الجوال",
        description: "الرجاء إدخال رقم جوال سعودي صحيح يبدأ بـ 05",
        variant: "destructive"
      });
      return;
    }
    if (!fullName.trim()) {
      toast({
        title: "الاسم مطلوب",
        description: "الرجاء إدخال اسمك الكامل",
        variant: "destructive"
      });
      return;
    }
    // Here you would typically send OTP to the phone number
    setStep('otp');
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 4) {
      toast({
        title: "رمز التحقق غير صحيح",
        description: "الرجاء إدخال رمز التحقق المكون من 4 أرقام",
        variant: "destructive"
      });
      return;
    }
    setStep('interests');
  };

  const handleInterestsSubmit = () => {
    if (!interests.length) {
      toast({
        title: "اختر اهتماماتك",
        description: "الرجاء اختيار اهتمام واحد على الأقل",
        variant: "destructive"
      });
      return;
    }
    setStep('success');
  };

  const monitoringInterests = [
    { id: "tourism", label: "السياحة والترفيه" },
    { id: "sports", label: "الرياضة" },
    { id: "economy", label: "الاقتصاد والأعمال" },
    { id: "tech", label: "التقنية والابتكار" },
    { id: "culture", label: "الثقافة والفنون" },
    { id: "education", label: "التعليم" },
    { id: "health", label: "الصحة" },
    { id: "events", label: "الفعاليات والمناسبات" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-saudi-green">
            {step === 'phone' && 'التسجيل في المنصة'}
            {step === 'otp' && 'رمز التحقق'}
            {step === 'interests' && 'اختر اهتماماتك'}
            {step === 'success' && 'تم التسجيل بنجاح'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 'phone' && (
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phoneNumber" className="text-right col-span-1">
                  رقم الجوال
                </label>
                <Input
                  id="phoneNumber"
                  placeholder="05xxxxxxxx"
                  className="col-span-3 text-right"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right col-span-1">
                  الاسم الكامل
                </label>
                <Input
                  id="fullName"
                  placeholder="اسمك الكامل"
                  className="col-span-3 text-right"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <Button className="btn-saudi w-full mt-4" onClick={handlePhoneSubmit}>
                التالي
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="grid gap-4">
              <p className="text-center text-muted-foreground">
                تم إرسال رمز التحقق إلى رقم الجوال {phoneNumber}
              </p>
              <div className="flex justify-center gap-2 dir-ltr">
                <Input
                  className="text-center w-32"
                  maxLength={4}
                  placeholder="0000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <Button className="btn-saudi w-full mt-4" onClick={handleOtpSubmit}>
                تحقق
              </Button>
            </div>
          )}

          {step === 'interests' && (
            <div className="grid gap-4">
              <div className="space-y-4">
                <h4 className="text-right font-medium">اختر مجالات المراقبة</h4>
                <div className="grid grid-cols-2 gap-4">
                  {monitoringInterests.map((interest) => (
                    <label
                      key={interest.id}
                      className="flex items-center space-x-2 space-x-reverse cursor-pointer p-2 rounded border hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox text-saudi-green"
                        checked={interests.includes(interest.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, interest.id]);
                          } else {
                            setInterests(interests.filter(i => i !== interest.id));
                          }
                        }}
                      />
                      <span className="text-sm">{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-right font-medium">كلمات البحث (حد أقصى 4)</h4>
                <Input
                  placeholder="أدخل كلمات البحث مفصولة بفواصل"
                  className="text-right"
                  value={searchKeywords}
                  onChange={(e) => {
                    const words = e.target.value.split(',');
                    if (words.length <= 4) {
                      setSearchKeywords(e.target.value);
                    }
                  }}
                />
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-right font-medium">تفضيلات الرسائل</h4>
                <RadioGroup
                  value={messagePreference}
                  onValueChange={setMessagePreference}
                  className="grid grid-cols-1 gap-2"
                >
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="instant">فوري</Label>
                    <RadioGroupItem value="instant" id="instant" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="daily">ملخص يومي</Label>
                    <RadioGroupItem value="daily" id="daily" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="weekly">ملخص أسبوعي</Label>
                    <RadioGroupItem value="weekly" id="weekly" />
                  </div>
                </RadioGroup>
              </div>

              <Button className="btn-saudi w-full mt-4" onClick={handleInterestsSubmit}>
                إتمام التسجيل
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-saudi-green mx-auto" />
              <h3 className="text-xl font-bold">تم التسجيل بنجاح!</h3>
              <p className="text-muted-foreground">
                يمكنك الآن استخدام المنصة والحصول على التحليلات والتقارير حسب اهتماماتك
              </p>
              <Button className="btn-saudi w-full" onClick={onClose}>
                ابدأ الآن
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSteps;
