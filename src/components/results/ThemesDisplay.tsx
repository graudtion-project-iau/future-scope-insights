
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';

interface ThemesDisplayProps {
  themes: string[];
}

const ThemesDisplay: React.FC<ThemesDisplayProps> = ({ themes }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold">المواضيع الرئيسية</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map((theme, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="px-3 py-1 bg-purple-100 text-purple-800 hover:bg-purple-200"
          >
            {theme}
          </Badge>
        ))}
      </div>
    </Card>
  );
};

export default ThemesDisplay;
