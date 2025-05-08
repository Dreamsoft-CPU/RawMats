import React from "react";
import { render, screen } from "@testing-library/react";
import EditProductForm from "@/components/supplier/products/EditProductForm";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/components/images/ImageCropper", () => {
  const MockImageCropper = () => <div>ImageCropper</div>;
  MockImageCropper.displayName = "MockImageCropper";
  return MockImageCropper;
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  },
}));

const mockInitialData = {
  name: "Sample Product",
  price: 100,
  description: "A test product",
  imageUrl: "/image.jpg",
};

const mockProps = {
  productId: "prod-001",
  supplierId: "sup-001",
  initialData: mockInitialData,
};

describe("EditProductForm Component", () => {
  let mockRouter: { push: jest.Mock };

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    global.fetch = jest.fn();

    jest.spyOn(console, "warn").mockImplementation((message) => {
      if (
        message.includes(
          "Missing `Description` or `aria-describedby={undefined}`"
        )
      ) {
        return; 
      }
      console.warn(message); 
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders and opens the edit dialog", async () => {
    render(<EditProductForm {...mockProps} />);
    userEvent.click(screen.getByRole("button", { name: /edit product/i }));

    expect(await screen.findByText(/edit product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product name/i)).toHaveValue(
      mockInitialData.name
    );
    expect(screen.getByLabelText(/price/i)).toHaveValue(mockInitialData.price);
    expect(screen.getByLabelText(/description/i)).toHaveValue(
      mockInitialData.description
    );
  });
});
