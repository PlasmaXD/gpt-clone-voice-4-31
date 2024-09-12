import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { useApiKey, useSystemMessage, useConversations } from './chatHooks';
import { handleChatSubmit, generateTitle, generateSpeech } from '../utils/chatUtils';

export const useChatLogic = () => {
  const [apiKey, setApiKey] = useApiKey();
  const [systemMessage, setSystemMessage] = useSystemMessage();
  const [conversations, setConversations] = useConversations();
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!apiKey) {
      navigate('/');
    }
  }, [apiKey, navigate]);

  const startNewConversation = async () => {
    if (conversations[currentConversationIndex].messages.length > 0 && conversations[currentConversationIndex].title === 'New Chat') {
      const newTitle = await generateTitle(conversations[currentConversationIndex].messages, apiKey);
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

    setIsStreaming(true);
    const userMessage = { role: 'user', content: input };
    setConversations(prevConversations => {
      const updatedConversations = [...prevConversations];
      updatedConversations[currentConversationIndex].messages.push(userMessage);
      return updatedConversations;
    });
    setInput('');

    try {
      const { assistantMessage, audioUrl } = await handleChatSubmit(
        apiKey,
        systemMessage,
        [...conversations[currentConversationIndex].messages, userMessage],
        setConversations,
        currentConversationIndex
      );

      if (conversations[currentConversationIndex].title === 'New Chat') {
        const newTitle = await generateTitle([userMessage, assistantMessage], apiKey);
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          updatedConversations[currentConversationIndex].title = newTitle;
          return updatedConversations;
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setConversations(prevConversations => {
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
    selectedRole,
    setSelectedRole,
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  };
};