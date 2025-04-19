
import React, { createContext, useContext, useState, useCallback } from 'react';
import enTranslations from '../i18n/en.json';
import arTranslations from '../i18n/ar.json';

type Language = 'en' | 'ar';
type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  translations: Translations;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value?.[k] === undefined) return key;
      value = value[k];
    }
    
    return value;
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{
        language,
        translations: translations[language],
        setLanguage,
        t
      }}
    >
      <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
