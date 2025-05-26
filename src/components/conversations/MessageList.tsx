import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageListProps } from "@/lib/interfaces/ConversationProps";
import { formatTime, isCurrentUserMessage } from "@/utils/conversation";

const MessageList: React.FC<MessageListProps> = ({ conversation, userId }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select a conversation</p>
      </div>
    );
  }

  // Sort messages chronologically (oldest to newest)
  const sortedMessages = [...conversation.messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {sortedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUserMessage(message.senderId, userId)
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-xl p-3 text-sm ${
                isCurrentUserMessage(message.senderId, userId)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {!isCurrentUserMessage(message.senderId, userId) && (
                <p className="text-xs font-medium mb-1 text-gray-600">
                  {message.sender.name}
                </p>
              )}
              <p>{message.content}</p>
              <p className="text-xs opacity-90 text-right mt-1 text-gray-100 dark:text-gray-700">
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
