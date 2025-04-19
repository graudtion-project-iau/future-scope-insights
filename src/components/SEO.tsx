
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title = "نظرة المستقبل - تحليل وذكاء اصطناعي",
  description = "نظام متكامل للمراقبة والتحليل الذكي للمحتوى من أكثر من 5 مصادر رئيسية. تحليل فوري للأحداث مع تنبيهات مباشرة.",
  image = "https://future-scope-insights.com/og-image.png",
  url = "https://future-scope-insights.com",
  type = "website"
}: SEOProps) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://future-scope-insights.com";
  const fullUrl = `${siteUrl}${url}`;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="ar_SA" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
