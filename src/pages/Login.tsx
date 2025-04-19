
import React from "react";
import WhatsAppAuth from "@/components/auth/WhatsAppAuth";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center justify-center md:justify-start mb-16">
          <span className="text-saudi-green text-3xl font-bold tracking-tight">Future</span>
        </Link>

        <div className="flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">مرحبًا بك في منصة التحليلات المتقدمة</h1>
            <p className="text-gray-600">
              ابق على اطلاع بكل ما يهمك من خلال تحليلات ذكية وفورية.
              سجل الدخول الآن للبدء.
            </p>
          </div>
          
          <WhatsAppAuth />
        </div>
      </div>
      
      <div className="mt-auto text-center py-6">
        <p className="text-gray-600 text-sm">
          بواسطة Future Scope Insights © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;
