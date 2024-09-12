export const handleChatSubmit = async (apiKey, systemMessage, messages, setConversations, currentConversationIndex) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          ...messages
        ],
        stream: true
      })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = { role: 'assistant', content: '' };

    setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations];
      updatedConversations[currentConversationIndex].messages.push(assistantMessage);
      return updatedConversations;
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, '').trim())
        .filter((line) => line !== '' && line !== '[DONE]')
        .map((line) => JSON.parse(line));

      for (const parsedLine of parsedLines) {
        const { choices } = parsedLine;
        const { delta } = choices[0];
        const { content } = delta;
        if (content) {
          assistantMessage.content += content;
          setConversations((prevConversations) => {
            const updatedConversations = [...prevConversations];
            const currentMessages = updatedConversations[currentConversationIndex].messages;
            currentMessages[currentMessages.length - 1] = { ...assistantMessage };
            return updatedConversations;
          });
        }
      }
    }

    const audioUrl = await generateSpeech(assistantMessage.content, apiKey);
    setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations];
      const currentMessages = updatedConversations[currentConversationIndex].messages;
      currentMessages[currentMessages.length - 1] = { ...assistantMessage, audioUrl };
      return updatedConversations;
    });

    return { assistantMessage, audioUrl };
  } catch (error) {
    console.error('Error in handleChatSubmit:', error);
    throw error;
  }
};

export const generateTitle = async (messages, apiKey) => {
  try {
    const concatenatedMessages = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Generate a short, concise title (3-5 words) for this conversation based on its main topic.' },
          { role: 'user', content: concatenatedMessages }
        ],
        max_tokens: 15
      })
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating title:', error);
    return 'New Chat';
  }
};

export const generateSpeech = async (text, apiKey) => {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};