import React from 'react';

const ModelAnswer = ({ content }) => {
  return (
    <div className="mt-2 p-3 bg-green-100 rounded-lg shadow-md">
      <h4 className="font-bold text-green-800 mb-1">模範解答:</h4>
      <div className="text-green-700">{content}</div>
    </div>
  );
};

export default ModelAnswer;