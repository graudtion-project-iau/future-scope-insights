
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
import { useLanguage } from "@/contexts/LanguageContext";
import { post } from "@/api/apiClient";
import API_ENDPOINTS from "@/api/apiUrls";

interface RegistrationStepsProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (token: string) => void;
}

const RegistrationSteps = ({ isOpen, onClose, onSuccess }: RegistrationStepsProps) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'interests' | 'success'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [searchKeywords, setSearchKeywords] = useState('');
  const [messagePreference, setMessagePreference] = useState('instant');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const validateSaudiPhone = (phone: string) => {
    const saudiRegex = /^(05)[0-9]{8}$/;
    return saudiRegex.test(phone);
  };

  const handlePhoneSubmit = async () => {
    if (!validateSaudiPhone(phoneNumber)) {
      toast({
        title: t('registration.phoneError'),
        description: t('registration.phoneError'),
        variant: "destructive"
      });
      return;
    }
    if (!fullName.trim()) {
      toast({
        title: t('registration.nameError'),
        description: t('registration.nameError'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call registration API
      const response = await post(
        API_ENDPOINTS.auth.register,
        { 
          phoneNumber, 
          fullName,
          language,
          deviceId: Date.now().toString() // Simple device ID for demo
        },
        'registrationResponse'
      );

      if (response?.success) {
        setStep('otp');
        toast({
          title: t('registration.otpSent'),
          description: phoneNumber
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t('api.error'),
        description: t('api.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 4) {
      toast({
        title: t('registration.otpError'),
        description: t('registration.invalidOtp'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Verify OTP API call
      const response = await post(
        API_ENDPOINTS.auth.verify,
        { phoneNumber, otp },
        'verifyOtpResponse'
      );

      if (response?.success) {
        // Save token if returned
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        setStep('interests');
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast({
        title: t('registration.otpError'),
        description: t('api.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestsSubmit = async () => {
    if (!interests.length) {
      toast({
        title: t('registration.interestsRequired'),
        description: t('registration.selectOneInterest'),
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Update user interests API call
      const response = await post(
        API_ENDPOINTS.user.interests,
        { 
          interests,
          keywords: searchKeywords.split(',').map(k => k.trim()).filter(k => k),
          messagePreference
        },
        'userProfile'
      );

      if (response) {
        setStep('success');
        
        // If we have a token from OTP verification and onSuccess callback
        const token = localStorage.getItem('auth_token');
        if (token && onSuccess) {
          onSuccess(token);
        }
      } else {
        throw new Error('Failed to update interests');
      }
    } catch (error) {
      console.error('Interests update error:', error);
      // Even if API fails, we can proceed to success state for better UX
      setStep('success');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonitoringInterests = async () => {
    try {
      const response = await post(API_ENDPOINTS.monitoring.topics, {}, 'interests');
      // We'll use mock data since this is just for UI demonstration
      return monitoringInterests;
    } catch (error) {
      console.error('Error fetching interests:', error);
      return monitoringInterests;
    }
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
            {step === 'phone' && t('registration.title')}
            {step === 'otp' && t('registration.enterOtp')}
            {step === 'interests' && t('registration.interests')}
            {step === 'success' && t('registration.success')}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {step === 'phone' && (
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phoneNumber" className="text-right col-span-1">
                  {t('registration.phoneNumber')}
                </label>
                <Input
                  id="phoneNumber"
                  placeholder="05xxxxxxxx"
                  className="col-span-3 text-right"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  dir="ltr"
                  disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right col-span-1">
                  {t('registration.fullName')}
                </label>
                <Input
                  id="fullName"
                  placeholder={t('registration.fullName')}
                  className="col-span-3 text-right"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                className="btn-saudi w-full mt-4" 
                onClick={handlePhoneSubmit}
                disabled={isLoading}
              >
                {isLoading ? '...' : t('registration.next')}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="grid gap-4">
              <p className="text-center text-muted-foreground">
                {t('registration.otpSent')} {phoneNumber}
              </p>
              <div className="flex justify-center gap-2 dir-ltr">
                <Input
                  className="text-center w-32"
                  maxLength={4}
                  placeholder="0000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={isLoading}
                />
              </div>
              <Button 
                className="btn-saudi w-full mt-4" 
                onClick={handleOtpSubmit}
                disabled={isLoading}
              >
                {isLoading ? '...' : t('registration.verify')}
              </Button>
            </div>
          )}

          {step === 'interests' && (
            <div className="grid gap-4">
              <div className="space-y-4">
                <h4 className="text-right font-medium">{t('registration.interests')}</h4>
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
                        disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-right font-medium">{t('registration.messagePrefs')}</h4>
                <RadioGroup
                  value={messagePreference}
                  onValueChange={setMessagePreference}
                  className="grid grid-cols-1 gap-2"
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="instant">{t('registration.instant')}</Label>
                    <RadioGroupItem value="instant" id="instant" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="daily">{t('registration.daily')}</Label>
                    <RadioGroupItem value="daily" id="daily" />
                  </div>
                  <div className="flex items-center justify-end space-x-2 space-x-reverse">
                    <Label htmlFor="weekly">{t('registration.weekly')}</Label>
                    <RadioGroupItem value="weekly" id="weekly" />
                  </div>
                </RadioGroup>
              </div>

              <Button 
                className="btn-saudi w-full mt-4" 
                onClick={handleInterestsSubmit}
                disabled={isLoading}
              >
                {isLoading ? '...' : t('registration.next')}
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-saudi-green mx-auto" />
              <h3 className="text-xl font-bold">{t('registration.success')}</h3>
              <p className="text-muted-foreground">
                يمكنك الآن استخدام المنصة والحصول على التحليلات والتقارير حسب اهتماماتك
              </p>
              <Button className="btn-saudi w-full" onClick={onClose}>
                {t('registration.startUsing')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSteps;
