export const scoreResponse = (userMessage, aiMessage) => {
  // This is a placeholder scoring logic. In a real-world scenario,
  // you might want to use more sophisticated NLP techniques.
  const scoreChange = [10, 5, 0, -5, -10][Math.floor(Math.random() * 5)];
  let feedback = '';
  if (scoreChange > 0) {
    feedback = '素晴らしい回答です！';
  } else if (scoreChange < 0) {
    feedback = 'もう少し考えてみましょう。';
  } else {
    feedback = '普通の回答です。';
  }
  return { scoreChange, feedback };
};