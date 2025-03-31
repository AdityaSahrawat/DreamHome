// components/ProfileSection.tsx
import React from 'react';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow mb-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 border-b pb-2 text-gray-800">
        {title}
      </h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default ProfileSection;