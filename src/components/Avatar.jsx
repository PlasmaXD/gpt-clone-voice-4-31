import React from 'react';

const Avatar = ({ score }) => {
  let avatarSrc;
  let altText;

  if (score >= 80) {
    avatarSrc = "/avatars/very-happy.png";
    altText = "Very happy face";
  } else if (score >= 60) {
    avatarSrc = "/avatars/happy.png";
    altText = "Happy face";
  } else if (score >= 40) {
    avatarSrc = "/avatars/neutral.png";
    altText = "Neutral face";
  } else if (score >= 20) {
    avatarSrc = "/avatars/sad.png";
    altText = "Sad face";
  } else {
    avatarSrc = "/avatars/very-sad.png";
    altText = "Very sad face";
  }

  return (
    <div className="flex justify-center items-center mb-4">
      <img 
        src={avatarSrc} 
        alt={altText} 
        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200"
      />
    </div>
  );
};

export default Avatar;