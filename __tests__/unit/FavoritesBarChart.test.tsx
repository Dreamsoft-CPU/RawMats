import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { FavoritesBarChart } from "@/components/supplier/dashboard/FavoritesBarChart";
import "@testing-library/jest-dom";
import { UserDataProps } from '@/lib/interfaces/ProductListProps';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockUserData: UserDataProps['userData'] = {
  displayName: 'Lois',
  id: 'user-1',
  role: 'USER',
  email: 'lois@example.com',
  profilePicture: '',
  phoneNumber: '1234567890',
  createdAt: new Date(),
  updatedAt: new Date(),
  Supplier: [
    {
      id: "supplier-1",
      userId: "user-1",
      businessPicture: "business-pic.png",
      businessName: "Business Name",
      businessLocation: "Location",
      businessPhone: "123-456-7890",
      businessDocuments: ["document1.pdf"],
      bio: "This is the bio.",
      verified: true,
      verifiedDate: new Date(),
      Product: [
        {
          id: 'prod-1',
          name: 'Rice',
          description: 'Premium white rice',
          price: 55,
          image: '/rice.png',
          supplierId: 'supplier-1',
          verified: true,
          verifiedDate: new Date(),
          dateAdded: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          favorites: [
            {
              id: 'fav-1',
              userId: 'user-1',
              productId: 'prod-1',
              createdAt: new Date(),
            },
            {
              id: 'fav-2',
              userId: 'user-1',
              productId: 'prod-1',
              createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            },
          ],
        },
      ],
    },
  ],
  Notification: [],
};

describe("FavoritesBarChart", () => {

  afterEach(() => {
    cleanup();
  });

  it("renders correctly with mock userData", () => {
    render(<FavoritesBarChart userData={mockUserData} />);
    expect(screen.getByText("Favorites Overview")).toBeInTheDocument();
    expect(
      screen.getByText("Showing favorite counts across time periods")
    ).toBeInTheDocument();
  });

  it("displays trend information", () => {
    render(<FavoritesBarChart userData={mockUserData} />);
    expect(screen.getByText(/Trending/i)).toBeInTheDocument();
  });

  it("renders the correct number of favorite entries", () => {
    render(<FavoritesBarChart userData={mockUserData} />);
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });
});