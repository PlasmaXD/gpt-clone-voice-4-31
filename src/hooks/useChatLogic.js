import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"

const useApiKey = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);
  return [apiKey, setApiKey];
};

const useSystemMessage = () => {
  const [systemMessage, setSystemMessage] = useState(() => localStorage.getItem('system_message') || 'You are a helpful assistant.');
  useEffect(() => {
    localStorage.setItem('system_message', systemMessage);
  }, [systemMessage]);
  return [systemMessage, setSystemMessage];
};

const useConversations = () => {
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  return [conversations, setConversations];
};

const useChatState = () => {
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSelectingRole, setIsSelectingRole] = useState(false);
  return {
    currentConversationIndex, setCurrentConversationIndex,
    input, setInput,
    isStreaming, setIsStreaming,
    isSidebarOpen, setIsSidebarOpen,
    searchQuery, setSearchQuery,
    selectedRole, setSelectedRole,
    isSelectingRole, setIsSelectingRole
  };
};

const useChat = (apiKey, systemMessage, conversations, setConversations, currentConversationIndex, setIsStreaming) => {
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
  const [apiKey, setApiKey] = useApiKey();
  const [systemMessage, setSystemMessage] = useSystemMessage();
  const [conversations, setConversations] = useConversations();
  const {
    currentConversationIndex, setCurrentConversationIndex,
    input, setInput,
    isStreaming, setIsStreaming,
    isSidebarOpen, setIsSidebarOpen,
    searchQuery, setSearchQuery,
    selectedRole, setSelectedRole,
    isSelectingRole, setIsSelectingRole
  } = useChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    }
  }, [apiKey, navigate]);

  const { startNewConversation, switchConversation, handleSubmit: submitChat } = useChat(
    apiKey, systemMessage, conversations, setConversations, currentConversationIndex, setIsStreaming
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSubmit = (e) => submitChat(e, input);

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