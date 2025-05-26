import { z } from "zod";
import {
  Conversation,
  Message,
  User,
  ConversationMembers,
} from "@prisma/client";

// User schema with renamed fields for UI consistency
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().optional(),
});

// Message schema with sender information
export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sender: UserSchema,
});

// ConversationMember schema with user information
export const ConversationMemberSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  userId: z.string(),
  user: UserSchema,
});

// Main Conversation schema
export const ConversationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  messages: z.array(MessageSchema),
  members: z.array(ConversationMemberSchema),
});

// Type definitions based on zod schemas
export type UiUser = z.infer<typeof UserSchema>;
export type UiMessage = z.infer<typeof MessageSchema>;
export type UiConversationMember = z.infer<typeof ConversationMemberSchema>;
export type UiConversation = z.infer<typeof ConversationSchema>;

// Define the Prisma return type for better type safety
export type PrismaConversationWithRelations = Conversation & {
  messages: (Message & { sender: User })[];
  members: (ConversationMembers & { user: User })[];
};

// Function to map prisma types to UI types
export function mapPrismaConversationToUi(
  conversation: PrismaConversationWithRelations,
): UiConversation {
  return {
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
      sender: {
        id: message.sender.id,
        name: message.sender.displayName,
        image: message.sender.profilePicture,
      },
    })),
    members: conversation.members.map((member) => ({
      id: member.id,
      conversationId: member.conversationId,
      userId: member.userId,
      user: {
        id: member.user.id,
        name: member.user.displayName,
        image: member.user.profilePicture,
      },
    })),
  };
}
