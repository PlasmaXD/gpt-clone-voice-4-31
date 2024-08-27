import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

const ChatPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
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
          messages: [...messages, userMessage],
          stream: true
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

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
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { ...assistantMessage }
            ]);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'system', content: 'Error: Unable to fetch response' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">ChatGPT Clone</h1>
      <Input
        type="password"
        placeholder="Enter your OpenAI API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-4"
      />
      <Card className="mb-4">
        <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.content}
              </span>
            </div>
          ))}
          {isStreaming && (
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-200">
                Thinking...
              </span>
            </div>
          )}
        </ScrollArea>
      </Card>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow"
          disabled={isStreaming}
        />
        <Button type="submit" disabled={isStreaming}>
          {isStreaming ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;