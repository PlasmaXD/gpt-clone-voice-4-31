import React, { useRef, useEffect, Suspense, lazy } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import SettingsModal from '@/components/SettingsModal';
import VoiceInput from '@/components/VoiceInput';
import AudioPlayer from '@/components/AudioPlayer';
import Sidebar from '@/components/Sidebar';
import { Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useChatLogic } from '@/hooks/useChatLogic';
import ScoreDisplay from '@/components/ScoreDisplay';
import Avatar from '@/components/Avatar';
import RoleSelector from '@/components/RoleSelector';
import ModelAnswer from '@/components/ModelAnswer';

const ReactLive2d = lazy(() => import('react-live2d'));
const ChatPage = () => {
  const {
    apiKey, setApiKey, systemMessage, setSystemMessage, conversations, currentConversationIndex,
    input, setInput, isStreaming, isSidebarOpen, searchQuery, setSearchQuery, startNewConversation,
    switchConversation, toggleSidebar, handleSubmit, score, lastScoreChange, lastFeedback,
    selectedRole, setSelectedRole
  } = useChatLogic();

  const scrollAreaRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversations]);

  useEffect(() => {
    const lastMessage = conversations[currentConversationIndex]?.messages[conversations[currentConversationIndex]?.messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.audioUrl) {
      audioRef.current = new Audio(lastMessage.audioUrl);
      audioRef.current.play();
    }
  }, [conversations, currentConversationIndex]);

  const filteredConversations = conversations.filter(conversation =>
    conversation.title && conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVoiceInput = (transcript) => {
    setInput(transcript);
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    startNewConversation(role);
  };

  if (!selectedRole) {
    return <RoleSelector onSelectRole={handleRoleSelection} />;
  }

  return (
    <div className="flex h-screen bg-chatbg">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        startNewConversation={startNewConversation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredConversations={filteredConversations}
        currentConversationIndex={currentConversationIndex}
        switchConversation={switchConversation}
      />
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <div className="text-lg font-semibold">Chat</div>
          <ScoreDisplay score={score} lastScoreChange={lastScoreChange} lastFeedback={lastFeedback} />
          <SettingsModal
            apiKey={apiKey}
            setApiKey={setApiKey}
            systemMessage={systemMessage}
            setSystemMessage={setSystemMessage}
          />
        </div>
        <Avatar score={score} />
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {conversations[currentConversationIndex]?.messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg shadow-md ${
                message.role === 'user' ? 'bg-usermsg text-white' : 'bg-assistantmsg text-gray-800'
              }`}>
                <div className="font-bold mb-1">
                  {message.role === 'user' ? selectedRole.userRole : selectedRole.assistantRole}
                </div>
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
              {message.role === 'assistant' && message.audioUrl && (
                <div className="mt-2">
                  <AudioPlayer audioUrl={message.audioUrl} />
                </div>
              )}
              {message.role === 'assistant' && selectedRole.userRole === '先生' && message.modelAnswer && (
                <ModelAnswer content={message.modelAnswer} />
              )}
            </div>
          ))}
              <Suspense fallback={<div>Loading Live2D...</div>}>
            <ReactLive2d
              width={500}
              height={750}
              botton="5px"
              left="470px"
              ModelList={['Haru']}
              TouchDefault={['']}
              TouchBody={['','']}
              TouchHead={['']}
              PathFull='http://publicjs.supmiao.com/Resources/'
              />
              </Suspense>
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
            <VoiceInput onTranscript={handleVoiceInput} />
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