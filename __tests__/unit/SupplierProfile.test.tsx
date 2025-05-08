import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SupplierProfileCard from "@/components/supplier/profile/SupplierProfile";
import { SupplierInfoProps } from "@/lib/interfaces/SupplierInfoProps";
import { toast } from "sonner";
import { Role } from "@prisma/client";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockData: SupplierInfoProps = {
  data: {
    id: "supplier1",
    userId: "user1",
    businessName: "Test Business",
    businessLocation: "Test Location",
    businessPicture: "/test-image.jpg",
    bio: "A great business",
    businessPhone: "123-456-7890",
    businessDocuments: ["/doc1.pdf"],
    verified: true,
    verifiedDate: new Date(),
    Product: [
      {
        id: "prod1",
        name: "Product 1",
        verified: true,
        verifiedDate: new Date(),
        description: "Test product",
        image: "/product1.jpg",
        price: 100,
        supplierId: "supplier1",
        dateAdded: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    user: {
      id: "user1",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "lois@example.com",
      displayName: "Lowes",
      profilePicture: "/profile.jpg",
      phoneNumber: "987-654-3210",
      role: Role.USER,
    },
  },
};

describe("SupplierProfileCard", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  afterEach(() => {
    cleanup(); 
  });

  it("renders the supplier profile card correctly", () => {
    render(<SupplierProfileCard {...mockData} />);

    expect(screen.getByText("Test Business")).toBeInTheDocument();
    expect(screen.getByText("RawMats Supplier")).toBeInTheDocument();
    expect(screen.getByText("A great business")).toBeInTheDocument();
    expect(screen.getByText("Test Location")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("Lowes")).toBeInTheDocument();
    expect(screen.getByText("lois@example.com")).toBeInTheDocument();
    expect(screen.getByAltText("Test Business")).toBeInTheDocument();
  });

  it("copies the link to the clipboard and shows toast", () => {
    render(<SupplierProfileCard {...mockData} />);

    fireEvent.click(screen.getByText("Copy link"));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    expect(toast.success).toHaveBeenCalledWith("Link copied to clipboard");
  });

  it("displays the correct product count and review text", () => {
    render(<SupplierProfileCard {...mockData} />);

    expect(
      screen.getByText(/\(1 product.*1,432 reviews\)/)
    ).toBeInTheDocument();
  });
});
