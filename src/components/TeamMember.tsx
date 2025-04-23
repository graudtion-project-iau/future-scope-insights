
import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, description, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-64 overflow-hidden">
        <AspectRatio ratio={4/3} className="bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=صورة+الملف+الشخصي';
            }}
          />
        </AspectRatio>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-saudi-green">{name}</h3>
        <p className="text-gray-600 mb-3">{role}</p>
        <p className="text-gray-700 text-sm mb-4">{description}</p>
        <div className="flex gap-3">
          <a href="#" className="text-gray-600 hover:text-saudi-green">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-gray-600 hover:text-saudi-green">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
