import { UiConversation } from "@/lib/types/conversations.type";

// Get conversation name from members excluding current user
export function getConversationName(
  conversation: UiConversation,
  userId: string,
): string {
  const otherMembers = conversation.members.filter(
    (member) => member.userId !== userId,
  );

  if (otherMembers.length === 0) return "No participants";
  if (otherMembers.length === 1) return otherMembers[0].user.name;

  return `${otherMembers[0].user.name} + ${otherMembers.length - 1} others`;
}

// Get last message content or a placeholder
export function getLastMessage(conversation: UiConversation): string {
  if (conversation.messages.length === 0) return "No messages yet";
  return conversation.messages[0].content; // Using the first message because they're sorted desc
}

// Format timestamps for display
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Check if a message is from the current user
export function isCurrentUserMessage(
  senderId: string,
  userId: string,
): boolean {
  return senderId === userId;
}

// Sort conversations by most recent update
export function sortConversationsByRecent(
  conversations: UiConversation[],
): UiConversation[] {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
