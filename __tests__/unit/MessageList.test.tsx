import { render, screen } from "@testing-library/react";
import MessageList from "@/components/conversations/MessageList";

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock the ScrollArea component
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("MessageList", () => {
  const mockConversation = {
    id: "conv1",
    createdAt: new Date(),
    updatedAt: new Date(),
    messages: [
      {
        id: "msg1",
        conversationId: "conv1",
        senderId: "user1",
        content: "Hello",
        createdAt: new Date("2024-01-01T10:00:00"),
        updatedAt: new Date("2024-01-01T10:00:00"),
        sender: {
          id: "user1",
          name: "User 1",
          image: "https://example.com/user1.jpg",
        },
      },
      {
        id: "msg2",
        conversationId: "conv1",
        senderId: "user2",
        content: "Hi there",
        createdAt: new Date("2024-01-01T10:01:00"),
        updatedAt: new Date("2024-01-01T10:01:00"),
        sender: {
          id: "user2",
          name: "User 2",
          image: "https://example.com/user2.jpg",
        },
      },
    ],
    members: [
      {
        id: "mem1",
        conversationId: "conv1",
        userId: "user1",
        user: {
          id: "user1",
          name: "User 1",
          image: "https://example.com/user1.jpg",
        },
      },
      {
        id: "mem2",
        conversationId: "conv1",
        userId: "user2",
        user: {
          id: "user2",
          name: "User 2",
          image: "https://example.com/user2.jpg",
        },
      },
    ],
  };

  it("renders a message when no conversation is selected", () => {
    render(<MessageList conversation={null} userId="user1" />);
    expect(screen.getByText("Select a conversation")).toBeInTheDocument();
  });

  it("renders all messages in chronological order", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    const messages = screen.getAllByText(/Hello|Hi there/);
    expect(messages[0]).toHaveTextContent("Hello");
    expect(messages[1]).toHaveTextContent("Hi there");
  });

  it("displays sender name for messages from other users", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    expect(screen.getByText("User 2")).toBeInTheDocument();
  });

  it("does not display sender name for current user's messages", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    const user1Messages = screen.getAllByText("Hello");
    const messageContainer = user1Messages[0].closest("div");
    expect(messageContainer).not.toContainElement(screen.queryByText("User 1"));
  });

  it("applies correct styling for current user's messages", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    const user1Message = screen.getByText("Hello").closest("div");
    expect(user1Message).toHaveClass("bg-primary");
  });

  it("applies correct styling for other users' messages", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    const user2Message = screen.getByText("Hi there").closest("div");
    expect(user2Message).toHaveClass("bg-secondary");
  });

  it("displays message timestamps", () => {
    render(<MessageList conversation={mockConversation} userId="user1" />);
    const timestamps = screen.getAllByText(/10:00|10:01/);
    expect(timestamps).toHaveLength(2);
  });
});
