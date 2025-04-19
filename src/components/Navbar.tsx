
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
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
              <div className={`ml-10 flex items-baseline space-x-4 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">
                  {t('nav.home')}
                </Link>
                <Link to="/results" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">
                  {t('nav.reports')}
                </Link>
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">
                  {t('nav.features')}
                </Link>
                <Link to="/" className="text-gray-700 hover:text-saudi-green px-3 py-2 rounded-md text-sm font-medium">
                  {t('nav.pricing')}
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className={`ml-4 flex items-center md:ml-6 space-x-3 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={toggleLanguage}
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Button className="btn-saudi">
                {t('nav.startNow')}
              </Button>
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
