import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/use-toast"
import { scoreResponse } from '@/utils/scoreUtils';

export const useChatLogic = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  const [systemMessage, setSystemMessage] = useState(() => localStorage.getItem('system_message') || 'You are a helpful assistant.');
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [currentConversationIndex, setCurrentConversationIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [score, setScore] = useState(50);
  const [lastScoreChange, setLastScoreChange] = useState(0);
  const [lastFeedback, setLastFeedback] = useState('');
  const navigate = useNavigate();

  // ... (keep other existing code)

  const handleSubmit = async (e) => {
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
      // ... (keep existing API call code)

      // Score the response
      const { scoreChange, feedback } = scoreResponse(userMessage.content, assistantMessage.content);
      setScore(prevScore => {
        const newScore = Math.max(0, Math.min(100, prevScore + scoreChange));
        return newScore;
      });
      setLastScoreChange(scoreChange);
      setLastFeedback(feedback);

      // ... (keep existing code for title generation)
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
    score,
    lastScoreChange,
    lastFeedback,
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  };
};