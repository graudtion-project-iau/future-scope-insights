
import React from 'react';

interface Influencer {
  name: string;
  followers: string;
  engagement: string;
  image: string;
}

interface InfluencersListProps {
  data: Influencer[];
}

const InfluencersList: React.FC<InfluencersListProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((influencer, index) => (
        <div key={index} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <img 
            src={influencer.image} 
            alt={influencer.name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-saudi-green"
          />
          <div className="ml-4 mr-auto">
            <div className="font-medium">{influencer.name}</div>
            <div className="text-sm text-gray-500">{influencer.followers} متابع</div>
          </div>
          <div className="text-sm font-medium text-saudi-green bg-saudi-green/10 px-3 py-1 rounded-full">
            {influencer.engagement} تفاعل
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfluencersList;
