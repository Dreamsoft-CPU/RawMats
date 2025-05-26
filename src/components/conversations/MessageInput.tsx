import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MessageInputProps } from "@/lib/interfaces/ConversationProps";

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
}) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (!newMessage.trim() || disabled) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex space-x-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1"
          disabled={disabled}
        />
        <Button
          onClick={handleSendMessage}
          size="icon"
          type="submit"
          disabled={disabled}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
