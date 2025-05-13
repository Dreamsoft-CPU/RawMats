import { render, screen, fireEvent } from "@testing-library/react";
import ConversationList from "@/components/conversations/ConversationList";

// Mock the ScrollArea component
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ConversationList", () => {
  const mockConversations = [
    {
      id: "conv1",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: "msg1",
          conversationId: "conv1",
          senderId: "user1",
          content: "Hello",
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: {
            id: "user1",
            name: "User 1",
            image: "https://example.com/user1.jpg",
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
    },
    {
      id: "conv2",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: "msg2",
          conversationId: "conv2",
          senderId: "user3",
          content: "Hi there",
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: {
            id: "user3",
            name: "User 3",
            image: "https://example.com/user3.jpg",
          },
        },
      ],
      members: [
        {
          id: "mem3",
          conversationId: "conv2",
          userId: "user1",
          user: {
            id: "user1",
            name: "User 1",
            image: "https://example.com/user1.jpg",
          },
        },
        {
          id: "mem4",
          conversationId: "conv2",
          userId: "user3",
          user: {
            id: "user3",
            name: "User 3",
            image: "https://example.com/user3.jpg",
          },
        },
      ],
    },
  ];

  const mockProps = {
    conversations: mockConversations,
    activeConversationId: "conv1",
    userId: "user1",
    onSelectConversation: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the conversation list header", () => {
    render(<ConversationList {...mockProps} />);
    expect(screen.getByText("Conversations")).toBeInTheDocument();
  });

  it("renders all conversations", () => {
    render(<ConversationList {...mockProps} />);
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 3")).toBeInTheDocument();
  });

  it("displays the last message for each conversation", () => {
    render(<ConversationList {...mockProps} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("highlights the active conversation", () => {
    render(<ConversationList {...mockProps} />);
    // Find the conversation container for the active conversation
    const allConversations = screen.getAllByText("User 2");
    // Traverse up to the container with the class
    const activeContainer = allConversations.find((el) => {
      let node = el.parentElement;
      while (node) {
        if (node.className && node.className.includes("bg-muted")) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    });
    expect(activeContainer).toBeDefined();
  });

  it("calls onSelectConversation when a conversation is clicked", () => {
    render(<ConversationList {...mockProps} />);
    fireEvent.click(screen.getByText("User 3"));
    expect(mockProps.onSelectConversation).toHaveBeenCalledWith(
      mockConversations[1],
    );
  });

  it("displays at least one avatar for each conversation", () => {
    render(<ConversationList {...mockProps} />);
    // Look for avatar spans with text content
    const avatars = screen.getAllByText((content, element) => {
      if (!element) return false;
      return (
        element.tagName.toLowerCase() === "span" &&
        element.className.includes("rounded-full") &&
        /[A-Z]/.test(content)
      );
    });
    expect(avatars.length).toBeGreaterThanOrEqual(mockConversations.length);
  });

  it("handles empty conversations list", () => {
    render(<ConversationList {...mockProps} conversations={[]} />);
    // Should not render any conversation names
    expect(screen.queryByText("User 2")).not.toBeInTheDocument();
    expect(screen.queryByText("User 3")).not.toBeInTheDocument();
  });
});
