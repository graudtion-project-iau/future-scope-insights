
import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Linkedin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-saudi-green/95 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Future<span className="text-saudi-gold">Vision</span></h3>
            <p className="text-white/80 mb-4">
              منصة مبتكرة لمراقبة الحياة الواقعية عبر محتوى وسائل التواصل الاجتماعي، تقدم رؤى ذكية وتحليل دلالي ومؤشرات أداء رئيسية
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-white hover:text-saudi-gold transition-colors">
                <Twitter size={20} />
              </Link>
              <Link to="#" className="text-white hover:text-saudi-gold transition-colors">
                <Facebook size={20} />
              </Link>
              <Link to="#" className="text-white hover:text-saudi-gold transition-colors">
                <Instagram size={20} />
              </Link>
              <Link to="#" className="text-white hover:text-saudi-gold transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/results" className="text-white/80 hover:text-white transition-colors">التحليلات</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">المميزات</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">التسعير</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">المصادر</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">مركز المساعدة</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">التوثيق</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">API</Link></li>
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors">الشركاء</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe size={18} />
                <span className="text-white/80">support@futurevision.sa</span>
              </li>
              <li className="text-white/80">الرياض، المملكة العربية السعودية</li>
              <li className="text-white/80">+966 123 456789</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} FutureVision. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
