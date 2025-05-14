import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "../../src/components/home/SearchBar";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("SearchBar", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders search input and button", () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText("Search for an item..."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for an item...");
    fireEvent.change(input, { target: { value: "test query" } });
    expect(input).toHaveValue("test query");
  });

  it("handles form submission", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for an item...");
    const form = input.closest("form");
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.submit(form!);
    // URLSearchParams encodes spaces as +
    expect(mockRouter.push).toHaveBeenCalledWith("/?search=test+query&page=1");
  });

  it("shows suggestions after typing and fetching results", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Test Product",
        price: 100,
        image: "/test.jpg",
        supplier: {
          businessName: "Test Supplier",
        },
      },
    ];

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts }),
      }),
    );

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for an item...");
    fireEvent.change(input, { target: { value: "test" } });
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Test Supplier")).toBeInTheDocument();
      expect(screen.getByText("₱100.00")).toBeInTheDocument();
    });
  });

  it("navigates to product page when clicking a suggestion", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Test Product",
        price: 100,
        image: "/test.jpg",
        supplier: {
          businessName: "Test Supplier",
        },
      },
    ];

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts }),
      }),
    );

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for an item...");
    fireEvent.change(input, { target: { value: "test" } });
    jest.runAllTimers();
    await waitFor(() => {
      const suggestion = screen.getByText("Test Product");
      fireEvent.click(suggestion);
      expect(mockRouter.push).toHaveBeenCalledWith("/product/1");
    });
  });

  it("clears suggestions when clicking outside", async () => {
    const mockProducts = [
      {
        id: "1",
        name: "Test Product",
        price: 100,
        image: "/test.jpg",
        supplier: {
          businessName: "Test Supplier",
        },
      },
    ];

    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts }),
      }),
    );

    render(<SearchBar />);
    const input = screen.getByPlaceholderText("Search for an item...");
    fireEvent.change(input, { target: { value: "test" } });
    jest.runAllTimers();
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
    });
  });
});
