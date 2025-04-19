
import React from 'react';

interface KeywordItem {
  keyword: string;
  count: number;
  trend: 'increase' | 'decrease' | 'neutral';
}

interface KeywordsTableProps {
  data: KeywordItem[];
}

const KeywordsTable: React.FC<KeywordsTableProps> = ({ data }) => {
  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الكلمة</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">التكرار</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">الاتجاه</th>
          </tr>
        </thead>
        <tbody>
          {data.map((keyword, index) => (
            <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 text-right whitespace-nowrap text-sm font-medium text-gray-900">{keyword.keyword}</td>
              <td className="px-4 py-3 text-center whitespace-nowrap text-sm text-gray-500">{keyword.count}</td>
              <td className="px-4 py-3 text-left whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  keyword.trend === 'increase' 
                    ? 'bg-green-100 text-green-800' 
                    : keyword.trend === 'decrease' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {keyword.trend === 'increase' 
                    ? '↑ متزايد' 
                    : keyword.trend === 'decrease' 
                      ? '↓ متناقص' 
                      : '− ثابت'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordsTable;
