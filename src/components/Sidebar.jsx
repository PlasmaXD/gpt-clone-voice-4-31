import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, ChevronLeft, ChevronRight, Search } from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar, startNewConversation, searchQuery, setSearchQuery, filteredConversations, currentConversationIndex, switchConversation }) => (
  <div className={`bg-white border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
    <div className="flex justify-between items-center p-4">
      <Button onClick={startNewConversation} variant="ghost" size="icon">
        <PlusCircle className="h-5 w-5" />
      </Button>
      <Button onClick={toggleSidebar} variant="ghost" size="icon">
        {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>
    </div>
    <div className="p-4">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
    <ScrollArea className="h-[calc(100vh-8rem)]">
      {filteredConversations.map((conversation, index) => (
        <Button
          key={index}
          onClick={() => switchConversation(index)}
          variant={index === currentConversationIndex ? "secondary" : "ghost"}
          className="w-full justify-start"
        >
          {conversation.title || `Conversation ${index + 1}`}
        </Button>
      ))}
    </ScrollArea>
  </div>
);

export default Sidebar;