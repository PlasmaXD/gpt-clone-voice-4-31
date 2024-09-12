import React from 'react';

const ScoreDisplay = ({ score, lastScoreChange, lastFeedback }) => {
  return (
    <div className="text-center">
      <div className="text-lg font-semibold">総合スコア: {score}</div>
      {lastScoreChange !== 0 && (
        <div className={`text-sm ${lastScoreChange > 0 ? 'text-green-500' : lastScoreChange < 0 ? 'text-red-500' : 'text-gray-500'}`}>
          {lastScoreChange > 0 ? '+' : ''}{lastScoreChange} ポイント
        </div>
      )}
      {lastFeedback && <div className="text-sm text-gray-600">{lastFeedback}</div>}
    </div>
  );
};

export default ScoreDisplay;