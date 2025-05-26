import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MessageInput from "@/components/conversations/MessageInput";

describe("MessageInput", () => {
  const mockOnSendMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the input field and send button", () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={false} />);
    expect(
      screen.getByPlaceholderText("Type a message..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("disables input and button when disabled prop is true", () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={true} />);
    const input = screen.getByPlaceholderText("Type a message...");
    const button = screen.getByRole("button");
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  it("calls onSendMessage when send button is clicked", async () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={false} />);
    const input = screen.getByPlaceholderText("Type a message...");
    const button = screen.getByRole("button");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
    });
  });

  it("calls onSendMessage when Enter key is pressed", async () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={false} />);
    const input = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => {
      expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
    });
  });

  it("clears input after sending message", async () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={false} />);
    const input = screen.getByPlaceholderText("Type a message...");
    const button = screen.getByRole("button");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("does not send empty messages", async () => {
    render(<MessageInput onSendMessage={mockOnSendMessage} disabled={false} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSendMessage).not.toHaveBeenCalled();
    });
  });

  it("handles send message error", async () => {
    const mockError = new Error("Failed to send message");
    const mockOnSendMessageWithError = jest
      .fn()
      .mockRejectedValueOnce(mockError);
    render(
      <MessageInput
        onSendMessage={mockOnSendMessageWithError}
        disabled={false}
      />,
    );
    const input = screen.getByPlaceholderText("Type a message...");
    const button = screen.getByRole("button");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockOnSendMessageWithError).toHaveBeenCalledWith("Hello");
    });
  });
});
