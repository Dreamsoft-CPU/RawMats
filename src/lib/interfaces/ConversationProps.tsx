import { UiConversation } from "../types/conversations.type";

export interface ConversationCardProps {
  userId: string;
  initialConversations?: UiConversation[];
}

export interface ConversationListProps {
  conversations: UiConversation[];
  activeConversationId: string | null;
  userId: string;
  onSelectConversation: (conversation: UiConversation) => void;
}

export interface MessageListProps {
  conversation: UiConversation | null;
  userId: string;
}

export interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled: boolean;
}
