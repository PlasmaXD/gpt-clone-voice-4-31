import React from 'react';
import { User, UserCheck, UserMinus, UserX } from 'lucide-react';

const Avatar = ({ score }) => {
  let AvatarIcon;
  let color;

  if (score >= 70) {
    AvatarIcon = "./pic/VerySmile.png";
  } else if (score >= 40) {
    AvatarIcon = "./pic/Smile.png";
  } else if (score >= 20) {
    AvatarIcon = "./pic/Sad.png";
  } else {
    AvatarIcon = "./pic/Straight.png";
  }

  return (
    <div className="flex justify-center items-center mb-4">
    <img src={AvatarIcon} alt="My Image" style={{ width: '200px', height: '200px' }} />
    </div>
  );
};

export default Avatar;