import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import "@testing-library/jest-dom";

// Mock the LoginForm component
jest.mock("@/components/auth/LoginForm", () => ({
  LoginForm: () => <div data-testid="login-form">Mocked Login Form</div>,
}));

describe("Login Page", () => {
  it("renders the login page with the LoginForm component", () => {
    render(<LoginPage />);

    // Check if the page renders correctly
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders with correct layout classes", () => {
    render(<LoginPage />);

    // Check if the page has the correct layout/styling classes
    const mainContainer =
      screen.getByTestId("login-form").parentElement?.parentElement;
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("w-full");
    expect(mainContainer).toHaveClass("min-h-svh");
    expect(mainContainer).toHaveClass("bg-[#F8FBFF]");
  });
});
