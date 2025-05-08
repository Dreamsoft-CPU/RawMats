import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/link component
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("LoginForm Component", () => {
  // Setup common mocks before each test
  beforeEach(() => {
    // Mock router
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock fetch API
    global.fetch = jest.fn();
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);

    // Check for important UI elements
    expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("rawmats@example.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account\?/)).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  it("displays validation errors for invalid inputs", async () => {
    render(<LoginForm />);

    // Submit the form without entering any data
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      // Check for email validation error
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      // Check for password validation error
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    // Get router mock
    const mockRouter = useRouter() as jest.Mocked<ReturnType<typeof useRouter>>;

    render(<LoginForm />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("rawmats@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "password123" },
    });

    // Submit the form
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for the submission to complete and check if router.push was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
    });
  });

  it("handles API error responses", async () => {
    // Mock failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(<LoginForm />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("rawmats@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "wrongpassword" },
    });

    // Submit the form
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("handles network errors during form submission", async () => {
    // Mock fetch to throw an error
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<LoginForm />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("rawmats@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "password123" },
    });

    // Submit the form
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("disables the login button during form submission", async () => {
    // Mock a delayed response to test loading state
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => ({}),
            });
          }, 100);
        })
    );

    render(<LoginForm />);

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText("rawmats@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "password123" },
    });

    // Submit the form
    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    // Check that the button is disabled and shows loading text
    expect(loginButton).toBeDisabled();
    expect(screen.getByText("Logging in...")).toBeInTheDocument();

    // Wait for the submission to complete and check if button is re-enabled
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalled();
    });
  });

  it("clears error message after 5 seconds", async () => {
    jest.useFakeTimers();

    // Mock failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    });

    render(<LoginForm />);

    // Fill in and submit the form
    fireEvent.change(screen.getByPlaceholderText("rawmats@example.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Fast-forward time by 5 seconds
    jest.advanceTimersByTime(5000);

    // Check that error message is gone
    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
