import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"

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

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const useChatState = () => {
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

  return {
    apiKey, setApiKey,
    systemMessage, setSystemMessage,
    conversations, setConversations,
    currentConversationIndex, setCurrentConversationIndex,
    input, setInput,
    isStreaming, setIsStreaming,
    isSidebarOpen, setIsSidebarOpen,
    searchQuery, setSearchQuery,
    selectedRole, setSelectedRole,
    isSelectingRole, setIsSelectingRole
  };
};

const useChat = (state) => {
  const {
    apiKey,
    systemMessage,
    conversations,
    setConversations,
    currentConversationIndex,
    setCurrentConversationIndex,
    setIsStreaming
  } = state;

  const generateTitle = async (messages) => {
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

  const startNewConversation = () => {
    const newConversation = { id: Date.now(), title: 'New Chat', messages: [] };
    setConversations(prevConversations => [...prevConversations, newConversation]);
    setCurrentConversationIndex(conversations.length);
  };

  const switchConversation = (index) => {
    setCurrentConversationIndex(index);
  };

  const handleSubmit = async (e, input) => {
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

  return { startNewConversation, switchConversation, handleSubmit };
};

export const useChatLogic = () => {
  const state = useChatState();
  const { startNewConversation, switchConversation, handleSubmit: submitChat } = useChat(state);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.apiKey) {
      navigate('/');
    }
  }, [state.apiKey, navigate]);

  const toggleSidebar = () => state.setIsSidebarOpen(!state.isSidebarOpen);

  const handleSubmit = (e) => submitChat(e, state.input);

  return {
    ...state,
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  };
};