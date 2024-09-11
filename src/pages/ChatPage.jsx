import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from 'react-markdown'
import SettingsModal from '@/components/SettingsModal';
import { Loader2, PlusCircle, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useChatLogic } from '@/hooks/useChatLogic';

const ChatPage = () => {
  const {
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
    startNewConversation,
    switchConversation,
    toggleSidebar,
    handleSubmit
  } = useChatLogic();

  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversations]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.title && conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-chatbg">
      <div className="relative">
        <Collapsible open={isSidebarOpen} onOpenChange={toggleSidebar} className="bg-white border-r">
          <CollapsibleContent className="w-64 p-4">
            <Button onClick={startNewConversation} className="w-full mb-4">
              <PlusCircle className="mr-2 h-4 w-4" /> New Chat
            </Button>
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <ScrollArea className="h-[calc(100vh-180px)]">
              {filteredConversations.map((conversation, index) => (
                <Button
                  key={conversation.id}
                  onClick={() => switchConversation(index)}
                  variant={currentConversationIndex === index ? "secondary" : "ghost"}
                  className="w-full justify-start mb-2 truncate"
                >
                  {conversation.title}
                </Button>
              ))}
            </ScrollArea>
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`absolute top-4 ${isSidebarOpen ? 'left-64' : 'left-0'} transition-all duration-300`}
            >
              {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-end p-4">
          <SettingsModal
            apiKey={apiKey}
            setApiKey={setApiKey}
            systemMessage={systemMessage}
            setSystemMessage={setSystemMessage}
          />
        </div>
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {conversations[currentConversationIndex].messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg shadow-md ${
                message.role === 'user' ? 'bg-usermsg text-white' : 'bg-assistantmsg text-gray-800'
              }`}>
                <ReactMarkdown
                  className="prose max-w-none dark:prose-invert"
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                {isStreaming && index === conversations[currentConversationIndex].messages.length - 1 && message.content === '' && (
                  <Loader2 className="h-4 w-4 animate-spin inline-block ml-2" />
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 bg-white border-t shadow-md">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
              disabled={isStreaming}
            />
            <Button type="submit" disabled={isStreaming} className="bg-usermsg hover:bg-blue-600">
              {isStreaming ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;