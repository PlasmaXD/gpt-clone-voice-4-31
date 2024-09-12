import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export const useChatLogic = () => {
  const [apiKey, setApiKey] = useLocalStorage('openai_api_key', '');
  const [systemMessage, setSystemMessage] = useLocalStorage('system_message', 'You are a helpful assistant.');
  const [conversations, setConversations] = useLocalStorage('conversations', []);
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSelectingRole, setIsSelectingRole] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    }
  }, [apiKey, navigate]);

  const startNewConversation = useCallback(() => {
    const newConversation = { id: Date.now(), title: 'New Chat', messages: [] };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setCurrentConversationIndex(conversations.length);
  }, [conversations.length, setConversations]);

  const switchConversation = useCallback((index) => {
    setCurrentConversationIndex(index);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: input };
    setConversations(prevConversations => {
      const updatedConversations = [...prevConversations];
      updatedConversations[currentConversationIndex].messages.push(userMessage);
      return updatedConversations;
    });
    setInput('');
    setIsStreaming(true);

    try {
      // Implement the API call and response handling here
      // This is a placeholder for the actual implementation
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

      // Process the streamed response here
      // This is a simplified placeholder
      const assistantMessage = { role: 'assistant', content: 'This is a placeholder response.' };
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        updatedConversations[currentConversationIndex].messages.push(assistantMessage);
        return updatedConversations;
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsStreaming(false);
    }
  }, [apiKey, conversations, currentConversationIndex, input, systemMessage, setConversations]);

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
    selectedRole,
    setSelectedRole,
    isSelectingRole,
    setIsSelectingRole,
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  };
};