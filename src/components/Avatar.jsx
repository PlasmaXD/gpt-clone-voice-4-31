import React, { useState, useEffect } from 'react';

const Avatar = ({ score }) => {
  const [avatarSrc, setAvatarSrc] = useState('');
  const [altText, setAltText] = useState('');

  useEffect(() => {
    let src = '';
    let alt = '';

    if (score >= 80) {
      src = "/avatars/very-happy.png";
      alt = "Very happy face";
    } else if (score >= 60) {
      src = "/avatars/happy.png";
      alt = "Happy face";
    } else if (score >= 40) {
      src = "/avatars/neutral.png";
      alt = "Neutral face";
    } else if (score >= 20) {
      src = "/avatars/sad.png";
      alt = "Sad face";
    } else {
      src = "/avatars/very-sad.png";
      alt = "Very sad face";
    }

    setAvatarSrc(src);
    setAltText(alt);
  }, [score]);

  return (
    <div className="flex justify-center items-center mb-4">
      {avatarSrc ? (
        <img 
          src={avatarSrc} 
          alt={altText} 
          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-200"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.svg';
            console.error(`Failed to load avatar image: ${avatarSrc}`);
          }}
        />
      ) : (
        <div className="w-24 h-24 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Avatar</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;