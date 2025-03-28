"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import ConversationList from "./ConversationList";
import MobileConversationList from "./MobileConversationList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { ConversationCardProps } from "@/lib/interfaces/ConversationProps";
import { UiConversation } from "@/lib/types/conversations.type";
import { getConversationName } from "@/utils/conversation";

const ConversationCard: React.FC<ConversationCardProps> = ({
  userId,
  initialConversations = [],
}) => {
  const [conversations, setConversations] =
    useState<UiConversation[]>(initialConversations);
  const [activeConversation, setActiveConversation] =
    useState<UiConversation | null>(
      initialConversations.length > 0 ? initialConversations[0] : null,
    );

  // Set up Supabase Realtime subscription for new messages
  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel("message-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          const newMessage = payload.new as any;

          // Fetch additional data for the new message
          const fetchMessageData = async () => {
            try {
              const response = await fetch(`/api/messages/${newMessage.id}`);
              if (response.ok) {
                const messageData = await response.json();

                // Update conversations state with the new message
                setConversations((prevConversations) => {
                  return prevConversations.map((conv) => {
                    if (conv.id === messageData.conversationId) {
                      // Add the new message to the conversation
                      const updatedMessages = [
                        ...conv.messages.filter((m) => m.id !== messageData.id),
                        messageData,
                      ];

                      // Update the active conversation if it's the current one
                      if (activeConversation?.id === conv.id) {
                        setActiveConversation({
                          ...conv,
                          messages: updatedMessages,
                          updatedAt: new Date(messageData.createdAt),
                        });
                      }

                      return {
                        ...conv,
                        messages: updatedMessages,
                        updatedAt: new Date(messageData.createdAt),
                      };
                    }
                    return conv;
                  });
                });
              }
            } catch (error) {
              console.error("Error fetching message data:", error);
            }
          };

          fetchMessageData();
        },
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeConversation]);

  // Handle sending a new message
  const handleSendMessage = async (message: string) => {
    if (!activeConversation) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          message,
          conversationId: activeConversation.id,
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // The realtime subscription will handle UI updates
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  };

  if (conversations.length === 0) {
    return (
      <Card className="w-full max-w-6xl mx-auto overflow-hidden">
        <div className="flex items-center justify-center h-[600px]">
          <p className="text-muted-foreground">No conversations yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto overflow-hidden">
      <div className="flex h-[600px]">
        {/* Left sidebar - Conversation list (20% width on desktop, hidden on mobile) */}
        <div className="hidden md:block md:w-1/5">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation?.id || null}
            userId={userId}
            onSelectConversation={setActiveConversation}
          />
        </div>

        {/* Right content - Conversation messages (80% width on desktop, full width on mobile) */}
        <div className="w-full md:w-4/5 flex flex-col">
          {/* Conversation header with Sheet Menu for mobile */}
          {activeConversation && (
            <>
              <div className="p-4 border-b border-border bg-card flex items-center">
                <MobileConversationList
                  conversations={conversations}
                  activeConversationId={activeConversation?.id || null}
                  userId={userId}
                  onSelectConversation={setActiveConversation}
                />
                <div className="ml-2 md:ml-0">
                  <h2 className="font-semibold text-xl">
                    {getConversationName(activeConversation, userId)}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeConversation.members.length} participants
                  </p>
                </div>
              </div>

              {/* Messages area */}
              <MessageList conversation={activeConversation} userId={userId} />

              {/* Message input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!activeConversation}
              />
            </>
          )}

          {!activeConversation && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">Select a conversation</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConversationCard;
