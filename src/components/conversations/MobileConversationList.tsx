"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { MenuIcon } from "lucide-react";
import { ConversationListProps } from "@/lib/interfaces/ConversationProps";
import {
  getConversationName,
  getLastMessage,
  sortConversationsByRecent,
} from "@/utils/conversation";

const MobileConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  userId,
  onSelectConversation,
}) => {
  const [open, setOpen] = React.useState(false);
  const sortedConversations = sortConversationsByRecent(conversations);

  const handleSelectConversation = (
    conversation: (typeof conversations)[0],
  ) => {
    onSelectConversation(conversation);
    setOpen(false); // Close the sheet after selection
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle conversation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-4/5 max-w-xs bg-gray-50">
        <div className="p-4 bg-white border-b border-border">
          <h3 className="font-bold text-xl">Conversations</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-61px)]">
          {sortedConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center space-x-3 p-4 cursor-pointer border-b border-border last:border-b-0 hover:bg-gray-100 transition-colors duration-200 ${
                activeConversationId === conversation.id
                  ? "bg-blue-100 hover:bg-blue-200"
                  : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-500 text-white font-semibold text-lg">
                  {getConversationName(conversation, userId).charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold truncate text-gray-800">
                    {getConversationName(conversation, userId)}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {getLastMessage(conversation)}
                </p>
              </div>
            </div>
          ))}
          {sortedConversations.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found.
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileConversationList;
