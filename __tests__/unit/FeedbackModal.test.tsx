import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackModal from "@/components/ratings/FeedbackModal";
import { act } from "@testing-library/react";

describe("FeedbackModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onRatingSubmit: jest.fn(),
    productName: "Test Product",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with product name", () => {
    render(<FeedbackModal {...defaultProps} />);

    expect(screen.getByText(/rate test product/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your feedback helps us improve/i),
    ).toBeInTheDocument();
  });

  it("renders modal without product name", () => {
    render(<FeedbackModal {...defaultProps} productName={undefined} />);

    expect(screen.getByText(/rate this product/i)).toBeInTheDocument();
  });

  it("shows initial ratings and comments", () => {
    render(<FeedbackModal {...defaultProps} />);

    const stars = screen.getAllByTestId("star-icon");
    expect(stars).toHaveLength(5);
    stars.forEach((star) => {
      expect(star).toHaveAttribute("fill", "none");
      expect(star).toHaveAttribute("stroke", "gray");
    });

    expect(
      screen.getByPlaceholderText(/write your feedback here/i),
    ).toBeInTheDocument();
  });

  it("allows rating selection", async () => {
    render(<FeedbackModal {...defaultProps} />);

    const stars = screen.getAllByTestId("star-icon");
    await act(async () => {
      fireEvent.click(stars[2]);
    });

    stars.forEach((star, index) => {
      if (index <= 2) {
        expect(star).toHaveAttribute("fill", "#FACC15");
        expect(star).toHaveAttribute("stroke", "#FACC15");
      } else {
        expect(star).toHaveAttribute("fill", "none");
        expect(star).toHaveAttribute("stroke", "gray");
      }
    });
  });

  it("allows comment input", () => {
    render(<FeedbackModal {...defaultProps} />);

    const commentInput = screen.getByPlaceholderText(
      /write your feedback here/i,
    );
    fireEvent.change(commentInput, { target: { value: "Great product!" } });

    expect(commentInput).toHaveValue("Great product!");
  });

  it("calls onRatingSubmit with correct values", async () => {
    render(<FeedbackModal {...defaultProps} />);

    const stars = screen.getAllByTestId("star-icon");
    const commentInput = screen.getByPlaceholderText(
      /write your feedback here/i,
    );
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await act(async () => {
      fireEvent.click(stars[3]);
      fireEvent.change(commentInput, { target: { value: "Great product!" } });
      fireEvent.click(submitButton);
    });

    expect(defaultProps.onRatingSubmit).toHaveBeenCalledWith(
      4,
      "Great product!",
    );
  });

  it("calls onClose when cancel is clicked", () => {
    render(<FeedbackModal {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("enables submit button when rating is selected", async () => {
    render(<FeedbackModal {...defaultProps} />);

    const stars = screen.getAllByTestId("star-icon");
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(submitButton).toBeDisabled();

    await act(async () => {
      fireEvent.click(stars[2]);
    });

    expect(submitButton).not.toBeDisabled();
  });
});
