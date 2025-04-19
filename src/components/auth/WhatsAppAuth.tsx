
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Phone } from "lucide-react";

// Step tracking enum
enum AuthStep {
  PHONE_NUMBER,
  VERIFICATION_CODE,
  USER_INFO,
  INTERESTS
}

// Phone number validation schema (Saudi numbers)
const phoneSchema = z.object({
  phone: z
    .string()
    .startsWith("05", { message: "يجب أن يبدأ الرقم بـ 05" })
    .length(10, { message: "يجب أن يتكون الرقم من 10 أرقام" })
});

// OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, { message: "يجب إدخال جميع الأرقام الستة" })
});

// User info validation schema
const userInfoSchema = z.object({
  fullName: z.string().min(3, { message: "يجب أن يتكون الاسم من 3 أحرف على الأقل" })
});

const WhatsAppAuth: React.FC = () => {
  const [step, setStep] = useState<AuthStep>(AuthStep.PHONE_NUMBER);
  const navigate = useNavigate();
  
  // Phone number form
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: ""
    }
  });

  // OTP form
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  // User info form
  const userInfoForm = useForm<z.infer<typeof userInfoSchema>>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      fullName: ""
    }
  });

  // Handle phone number submission
  const onPhoneSubmit = (values: z.infer<typeof phoneSchema>) => {
    console.log("Phone submitted:", values);
    
    // In a real implementation, this would call an API to request OTP
    // For demo purposes, we'll just move to the next step
    
    // Simulating WhatsApp OTP request
    localStorage.setItem("userPhone", values.phone);
    
    // Move to verification step
    setStep(AuthStep.VERIFICATION_CODE);
  };

  // Handle OTP verification
  const onOTPSubmit = (values: z.infer<typeof otpSchema>) => {
    console.log("OTP submitted:", values);
    
    // In a real implementation, this would verify the OTP with an API
    // For demo purposes, we'll just accept any 6-digit code
    
    // Move to user info step
    setStep(AuthStep.USER_INFO);
  };

  // Handle user info submission
  const onUserInfoSubmit = (values: z.infer<typeof userInfoSchema>) => {
    console.log("User info submitted:", values);
    
    // Save user info in session/localStorage
    const userInfo = {
      phone: localStorage.getItem("userPhone"),
      fullName: values.fullName,
      authenticated: true,
      searchQuota: 5, // Daily search quota
      lastSearchDate: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    
    // Move to interests page
    navigate("/interests");
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 md:p-10">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === AuthStep.PHONE_NUMBER && "تسجيل الدخول باستخدام واتساب"}
            {step === AuthStep.VERIFICATION_CODE && "رمز التحقق"}
            {step === AuthStep.USER_INFO && "أكمل معلوماتك"}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === AuthStep.PHONE_NUMBER && "أدخل رقم هاتفك السعودي لتلقي رمز التحقق"}
            {step === AuthStep.VERIFICATION_CODE && "أدخل الرمز الذي تم إرساله إلى واتساب الخاص بك"}
            {step === AuthStep.USER_INFO && "أدخل اسمك الكامل باللغة العربية"}
          </p>
        </div>

        {step === AuthStep.PHONE_NUMBER && (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
              <FormField
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الهاتف</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-700 border border-input rounded-l-md px-3 py-2">
                          +966
                        </span>
                        <Input 
                          placeholder="05XXXXXXXX" 
                          className="rounded-l-none" 
                          maxLength={10}
                          type="tel"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                إرسال رمز التحقق
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  بالضغط على "إرسال رمز التحقق"، أنت توافق على شروط الخدمة وسياسة الخصوصية
                </p>
              </div>
            </form>
          </Form>
        )}

        {step === AuthStep.VERIFICATION_CODE && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOTPSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-center block">رمز التحقق</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col space-y-2">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  تحقق
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="text-sm"
                  onClick={() => setStep(AuthStep.PHONE_NUMBER)}
                >
                  تغيير رقم الهاتف
                </Button>
              </div>
              
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500">
                  لم تستلم الرمز؟{" "}
                  <button type="button" className="text-green-600 font-medium">
                    إعادة الإرسال
                  </button>
                </p>
              </div>
            </form>
          </Form>
        )}

        {step === AuthStep.USER_INFO && (
          <Form {...userInfoForm}>
            <form onSubmit={userInfoForm.handleSubmit(onUserInfoSubmit)} className="space-y-4">
              <FormField
                control={userInfoForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسمك الكامل باللغة العربية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                إكمال التسجيل
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAuth;
