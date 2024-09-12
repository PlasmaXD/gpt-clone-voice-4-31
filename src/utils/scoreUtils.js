export const scoreResponse = (userMessage, aiMessage) => {
  // This is a placeholder scoring logic. In a real-world scenario,
  // you might want to use more sophisticated NLP techniques.
  const relevanceScore = Math.floor(Math.random() * 5) - 2; // -2 to 2
  return relevanceScore * 5; // -10, -5, 0, 5, or 10
};