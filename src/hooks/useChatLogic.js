import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"

export const useChatLogic = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [systemMessage, setSystemMessage] = useState(() => localStorage.getItem('system_message') || 'You are a helpful assistant.');
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [{ id: Date.now(), title: 'New Chat', messages: [] }];
  });
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    }
  }, [apiKey, navigate]);

  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('system_message', systemMessage);
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [apiKey, systemMessage, conversations]);

  const generateTitle = async (messages) => {
    try {
      const concatenatedMessages = messages
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

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

  const startNewConversation = async () => {
    if (conversations[currentConversationIndex].messages.length > 0 && conversations[currentConversationIndex].title === 'New Chat') {
      const newTitle = await generateTitle(conversations[currentConversationIndex].messages);
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[currentConversationIndex].title = newTitle;
        return [...updatedConversations, { id: Date.now(), title: 'New Chat', messages: [] }];
      });
    } else {
      setConversations(prevConversations => [...prevConversations, { id: Date.now(), title: 'New Chat', messages: [] }]);
    }
    setCurrentConversationIndex(conversations.length);
  };

  const switchConversation = (index) => {
    setCurrentConversationIndex(index);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generateSpeech = async (text) => {
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
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Error generating speech:', error);
      toast({
        title: "Speech Generation Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key in the settings.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: 'user', content: input };
    setConversations((prevConversations) => {
      const updatedConversations = [...prevConversations];
      updatedConversations[currentConversationIndex].messages.push(userMessage);
      return updatedConversations;
    });
    setInput('');
    setIsStreaming(true);

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
            ...conversations[currentConversationIndex].messages,
            userMessage
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

      // Generate speech for the assistant's response
      await generateSpeech(assistantMessage.content);

      // Generate title after the first message exchange
      if (conversations[currentConversationIndex].title === 'New Chat') {
        const newTitle = await generateTitle([userMessage, assistantMessage]);
        setConversations((prevConversations) => {
          const updatedConversations = [...prevConversations];
          updatedConversations[currentConversationIndex].title = newTitle;
          return updatedConversations;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setConversations((prevConversations) => {
        const updatedConversations = [...prevConversations];
        updatedConversations[currentConversationIndex].messages.push({ role: 'assistant', content: 'Error: Unable to fetch response' });
        return updatedConversations;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    apiKey,
    setApiKey,
    systemMessage,
    setSystemMessage,
    conversations,
    currentConversationIndex,
    input,
    setInput,
    isStreaming,
    isSidebarOpen,
    searchQuery,
    setSearchQuery,
    audioUrl,
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  };
};