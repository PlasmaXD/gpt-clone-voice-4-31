import React from 'react';

const Avatar = ({ score }) => {
  let avatarSrc;
  let altText;

  if (score >= 80) {
    avatarSrc = "/happy-avatar.png";
    altText = "Happy face";
  } else if (score >= 60) {
    avatarSrc = "/content-avatar.png";
    altText = "Content face";
  } else if (score >= 40) {
    avatarSrc = "/neutral-avatar.png";
    altText = "Neutral face";
  } else if (score >= 20) {
    avatarSrc = "/concerned-avatar.png";
    altText = "Concerned face";
  } else {
    avatarSrc = "/sad-avatar.png";
    altText = "Sad face";
  }

  return (
    <div className="flex justify-center items-center mb-4">
      <img 
        src={avatarSrc} 
        alt={altText} 
        className="w-16 h-16 rounded-full mx-auto object-cover"
      />
    </div>
  );
};

export default Avatar;