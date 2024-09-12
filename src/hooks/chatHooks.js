import { useState, useEffect } from 'react';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
  useEffect(() => {
    localStorage.setItem('openai_api_key', apiKey);
  }, [apiKey]);
  return [apiKey, setApiKey];
};

export const useSystemMessage = () => {
  const [systemMessage, setSystemMessage] = useState(() => localStorage.getItem('system_message') || 'You are a helpful assistant.');
  useEffect(() => {
    localStorage.setItem('system_message', systemMessage);
  }, [systemMessage]);
  return [systemMessage, setSystemMessage];
};

export const useConversations = () => {
  const [conversations, setConversations] = useState(() => {
    const savedConversations = localStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [{ id: Date.now(), title: 'New Chat', messages: [] }];
  });
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  return [conversations, setConversations];
};