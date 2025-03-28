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
      <SheetContent side="left" className="p-0 w-4/5 max-w-xs">
        <div className="p-3 bg-secondary/30">
          <h3 className="font-medium text-lg">Conversations</h3>
        </div>
        <ScrollArea className="h-[calc(100vh-48px)]">
          {sortedConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-muted transition-colors duration-200 ${
                activeConversationId === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getConversationName(conversation, userId).charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium truncate">
                      {getConversationName(conversation, userId)}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {getLastMessage(conversation)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileConversationList;
