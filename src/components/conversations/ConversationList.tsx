import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { ConversationListProps } from "@/lib/interfaces/ConversationProps";
import {
  getConversationName,
  getLastMessage,
  sortConversationsByRecent,
} from "@/utils/conversation";

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  userId,
  onSelectConversation,
}) => {
  const sortedConversations = sortConversationsByRecent(conversations);

  return (
    <div className="w-full border-r border-border">
      <div className="p-3 bg-secondary/30">
        <h3 className="font-medium text-lg">Conversations</h3>
      </div>
      <ScrollArea className="h-[calc(600px-48px)]">
        {sortedConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 cursor-pointer hover:bg-muted transition-colors duration-200 ${
              activeConversationId === conversation.id ? "bg-muted" : ""
            }`}
            onClick={() => onSelectConversation(conversation)}
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
    </div>
  );
};

export default ConversationList;
