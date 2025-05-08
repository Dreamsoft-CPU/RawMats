import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import RatingsInfo from '@/components/ratings/RatingsInfo';
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

const mockRatings = [
  {
    id: "r1",
    userId: "u1",
    productId: "p1",
    rating: 4,
    comment: "Great product!",
    createdAt: new Date(),
    user: {
      displayName: "Lois",
      profilePicture: "/lois.jpg",
    },
  },
  {
    id: "r2",
    userId: "u2",
    productId: "p1",
    rating: 5,
    comment: null,
    createdAt: new Date(),
    user: {
      displayName: "Lowes",
      profilePicture: "/lowes.jpg",
    },
  },
];

describe("RatingsInfo Component", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
    cleanup(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup(); 
  });

  it("renders product name and average rating", () => {
    render(
      <RatingsInfo
        productId="p1"
        productName="Test Product"
        initialRatings={mockRatings}
        averageRating={4.5}
        totalReviews={2}
        currentUserId="u3"
      />
    );

    expect(screen.getByText("Reviews for Test Product")).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(2 reviews)")).toBeInTheDocument();
  });

  it("filters ratings when a star filter is selected", async () => {
    render(
      <RatingsInfo
        productId="p1"
        initialRatings={mockRatings}
        averageRating={4.5}
        totalReviews={2}
        currentUserId="u3"
      />
    );

    const star4Button = screen.getByText("4 Star");
    fireEvent.click(star4Button);

    await waitFor(() => {
      expect(screen.getByText("Lois")).toBeInTheDocument();
      expect(screen.queryByText("Lowes")).not.toBeInTheDocument();
    });
  });

  it("shows feedback modal when 'Write a Review' is clicked", () => {
    render(
      <RatingsInfo
        productId="p1"
        initialRatings={mockRatings}
        averageRating={4.5}
        totalReviews={2}
        currentUserId="u3"
      />
    );

    const button = screen.getByText("Write a Review");
    fireEvent.click(button);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows message when no ratings exist", () => {
    render(
      <RatingsInfo
        productId="p2"
        initialRatings={[]}
        averageRating={0}
        totalReviews={0}
        currentUserId="u1"
      />
    );

    expect(screen.getByText("No ratings yet")).toBeInTheDocument();
    expect(
      screen.getByText("No reviews found for this product with the selected filter.")
    ).toBeInTheDocument();
  });
});
