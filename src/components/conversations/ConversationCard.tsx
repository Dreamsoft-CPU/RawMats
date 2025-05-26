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
    useState<UiConversation | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const conversationId = params.get("conversationId");

    if (conversations.length > 0) {
      const currentActive = activeConversation
        ? conversations.find((c) => c.id === activeConversation.id)
        : null;

      if (currentActive) {
        setActiveConversation(currentActive);
      } else if (conversationId) {
        const urlConversation = conversations.find(
          (c) => c.id === conversationId,
        );
        setActiveConversation(urlConversation || conversations[0]);
      } else {
        setActiveConversation(conversations[0]);
      }
    } else {
      setActiveConversation(null);
    }
  }, [conversations, activeConversation]);

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
        (payload: any) => {
          const newMessage = payload.new as any;

          const fetchMessageData = async () => {
            try {
              const response = await fetch(`/api/messages/${newMessage.id}`);
              if (response.ok) {
                const messageData = await response.json();

                setConversations((prevConversations) => {
                  return prevConversations.map((conv) => {
                    if (conv.id === messageData.conversationId) {
                      const updatedMessages = [
                        ...conv.messages.filter((m) => m.id !== messageData.id),
                        messageData,
                      ];

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

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [activeConversation]);

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
    <Card className="w-full max-w-6xl mx-auto overflow-hidden md:h-[calc(100vh-120px)]">
      <div className="flex h-full">
        <div className="hidden md:block md:w-1/4 border-r border-border bg-gray-50">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversation?.id || null}
            userId={userId}
            onSelectConversation={setActiveConversation}
          />
        </div>

        <div className="w-full md:w-3/4 flex flex-col h-full">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-border bg-card flex items-center">
                <MobileConversationList
                  conversations={conversations}
                  activeConversationId={activeConversation?.id || null}
                  userId={userId}
                  onSelectConversation={setActiveConversation}
                />
                <div className="ml-2 md:ml-0">
                  <h2 className="font-semibold text-xl text-gray-800">
                    {getConversationName(activeConversation, userId)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {activeConversation.members.length} participants
                  </p>
                </div>
              </div>

              <MessageList conversation={activeConversation} userId={userId} />

              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!activeConversation}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <p className="text-lg text-muted-foreground/80">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConversationCard;
