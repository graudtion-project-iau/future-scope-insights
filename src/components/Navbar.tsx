
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, Globe, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, searchesRemaining } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 fixed w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-saudi-green text-2xl font-bold tracking-tight">Future</span>
            </Link>
            <div className="hidden md:block">
              <div className="mr-10 flex items-baseline space-x-4 space-x-reverse">
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">الرئيسية</Link>
                <Link to="/results" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">التقارير</Link>
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">المميزات</Link>
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">التسعير</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3 space-x-reverse">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              
              {isAuthenticated ? (
                <>
                  <div className="mx-3 text-sm text-gray-600">
                    البحوث المتبقية: <span className="font-bold text-saudi-green">{searchesRemaining}</span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>{user?.fullName || "المستخدم"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الحساب</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/interests")}>
                        تحديث الاهتمامات
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button className="btn-saudi" onClick={() => navigate("/login")}>
                  تسجيل الدخول
                </Button>
              )}
            </div>
          </div>
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
