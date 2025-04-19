
import React, { useEffect } from "react";
import InterestsSelection from "@/components/auth/InterestsSelection";
import { useNavigate } from "react-router-dom";

const Interests = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 to-blue-50 flex flex-col">
      <div className="container mx-auto pt-10 pb-16">
        <InterestsSelection />
      </div>
      
      <div className="mt-auto text-center py-6">
        <p className="text-gray-600 text-sm">
          بواسطة Future Scope Insights © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Interests;
