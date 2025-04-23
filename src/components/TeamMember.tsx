
import React from 'react';
import { Github, Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, description, image }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center absolute inset-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=صورة+الملف+الشخصي';
          }}
        />
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
