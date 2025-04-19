
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserInfo {
  phone?: string;
  fullName?: string;
  authenticated: boolean;
  searchQuota: number;
  lastSearchDate: string;
  interests?: {
    monitorType: string;
    businessName?: string;
    city?: string;
    sector?: string;
    socialMediaMonitoring: {
      accountAnalysis: boolean;
      tweetSearch: boolean;
      accountSummary: boolean;
    }
  };
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  login: (userData: UserInfo) => void;
  logout: () => void;
  updateSearchQuota: () => boolean;
  searchesRemaining: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [searchesRemaining, setSearchesRemaining] = useState<number>(5);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as UserInfo;
      setUser(parsedUser);
      
      // Check if we need to reset the search quota (new day)
      if (parsedUser.lastSearchDate !== new Date().toISOString().split('T')[0]) {
        const updatedUser = {
          ...parsedUser,
          searchQuota: 5,
          lastSearchDate: new Date().toISOString().split('T')[0]
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSearchesRemaining(5);
      } else {
        setSearchesRemaining(parsedUser.searchQuota);
      }
    }
  }, []);

  const login = (userData: UserInfo) => {
    setUser(userData);
    setSearchesRemaining(userData.searchQuota);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setSearchesRemaining(0);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userInterests");
  };

  // Update search quota after each search
  const updateSearchQuota = (): boolean => {
    if (!user) return false;
    
    // If no searches remaining, return false
    if (user.searchQuota <= 0) return false;
    
    // Update search quota
    const newQuota = user.searchQuota - 1;
    const updatedUser = {
      ...user,
      searchQuota: newQuota,
    };
    
    setUser(updatedUser);
    setSearchesRemaining(newQuota);
    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    
    return true;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user?.authenticated,
        login, 
        logout, 
        updateSearchQuota,
        searchesRemaining
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
