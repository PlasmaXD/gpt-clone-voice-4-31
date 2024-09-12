export const scoreResponse = (userMessage, aiMessage) => {
  // This is a placeholder scoring logic. In a real-world scenario,
  // you might want to use more sophisticated NLP techniques.
  const scoreChange = Math.floor(Math.random() * 21) - 10; // Random number between -10 and 10
  let feedback = '';

  if (scoreChange > 5) {
    feedback = '素晴らしい回答です！';
  } else if (scoreChange > 0) {
    feedback = 'よく考えられた回答ですね。';
  } else if (scoreChange === 0) {
    feedback = '普通の回答です。';
  } else if (scoreChange > -5) {
    feedback = 'もう少し考えてみましょう。';
  } else {
    feedback = '回答を見直す必要があります。';
  }

  return { scoreChange, feedback };
};