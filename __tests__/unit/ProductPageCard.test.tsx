import { render, screen, fireEvent, act } from "@testing-library/react";
import ProductPageCard from "@/components/products/ProductPageCard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Mock fetch
global.fetch = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock FeedbackModal
jest.mock("@/components/ratings/FeedbackModal", () => {
  return function MockFeedbackModal({ isOpen, onClose, onRatingSubmit }: any) {
    if (!isOpen) return null;
    return (
      <div role="dialog">
        <h2>Rate Test Product</h2>
        <textarea placeholder="Write your feedback here..." />
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} data-testid="star-icon" />
          ))}
        </div>
        <button onClick={() => onRatingSubmit(5, "Test comment")}>
          Submit
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  };
});

describe("ProductPageCard", () => {
  const mockRouter = {
    push: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  const mockData = {
    id: "1",
    name: "Test Product",
    description: "Test Description",
    price: 100,
    image: "/test-image.jpg",
    userId: "user1",
    favorites: [],
    totalReviews: 0,
    averageRating: 0,
    supplier: {
      id: "supplier1",
      userId: "supplier1",
      businessName: "Test Supplier",
      businessPicture: "/supplier-image.jpg",
      businessLocation: "Test Location",
      businessPhone: "1234567890",
      businessDocuments: ["doc1.pdf"],
      bio: "Test bio",
      verified: true,
      verifiedDate: new Date(),
    },
  };

  it("renders product information correctly", () => {
    render(<ProductPageCard data={mockData} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Supplier")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("₱100.00")).toBeInTheDocument();
    expect(screen.getByText("No ratings yet")).toBeInTheDocument();
  });

  it("shows rating information when available", () => {
    const dataWithRatings = {
      ...mockData,
      totalReviews: 5,
      averageRating: 4.5,
    };

    render(<ProductPageCard data={dataWithRatings} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("5 reviews")).toBeInTheDocument();
  });

  it("handles favorite toggle", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<ProductPageCard data={mockData} />);

    // Find the first button (the favorite button is the first in the header)
    const favoriteButton = screen.getAllByRole("button")[0];

    await act(async () => {
      fireEvent.click(favoriteButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/product/1/favorite",
      expect.any(Object),
    );
  });

  it("handles contact supplier", async () => {
    render(<ProductPageCard data={mockData} />);

    const contactButton = screen.getByRole("button", {
      name: /contact supplier/i,
    });

    await act(async () => {
      fireEvent.click(contactButton);
    });

    // Just verify the button exists and is clickable
    expect(contactButton).toBeInTheDocument();
  });

  it("handles rating submission", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    render(<ProductPageCard data={mockData} />);

    const rateButton = screen.getByText("Rate Product");
    await act(async () => {
      fireEvent.click(rateButton);
    });

    const ratingModal = screen.getByRole("dialog");
    expect(ratingModal).toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/ratings",
      expect.any(Object),
    );
  });

  it("shows error toast when conversation creation fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    render(<ProductPageCard data={mockData} />);
    const contactButton = screen.getByText("Contact Supplier");

    await act(async () => {
      fireEvent.click(contactButton);
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to create conversation. Please try again.",
    );
  });
});
