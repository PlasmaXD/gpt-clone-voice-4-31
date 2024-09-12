import React from 'react';
import { User, UserCheck, UserMinus, UserX } from 'lucide-react';

const Avatar = ({ score }) => {
  let AvatarIcon;
  let color;

  if (score >= 70) {
    AvatarIcon = UserCheck;
    color = 'text-green-500';
  } else if (score >= 40) {
    AvatarIcon = User;
    color = 'text-blue-500';
  } else if (score >= 20) {
    AvatarIcon = UserMinus;
    color = 'text-yellow-500';
  } else {
    AvatarIcon = UserX;
    color = 'text-red-500';
  }

  return (
    <div className="flex justify-center items-center mb-4">
      <AvatarIcon className={`h-16 w-16 ${color}`} />
    </div>
  );
};

export default Avatar;